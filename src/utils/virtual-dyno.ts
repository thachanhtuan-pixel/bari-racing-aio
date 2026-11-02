import { DynoCurvePoint, DynoResult } from '../types';

export interface TuningConfig {
  name: string;
  camType: 'stock' | 'mild_5.5mm' | 'racing_6.2mm' | 'touring_cnc';
  exhaustType: 'stock' | 'slip_on' | 'free_flow_titan' | 'racing_megaphone';
  ecuMapping: 'stock' | 'reflash_pxl' | 'stand_alone_race';
  displacementCc: number;
  cr: number;
  carbDiameterMm: number;
}

export function generateDynoCurve(config: TuningConfig): DynoResult {
  const points: DynoCurvePoint[] = [];
  const cc = Math.max(45, config.displacementCc);

  // Base horsepower scaling based on cc and compression ratio
  // A stock 4-stroke 2-valve engine produces ~0.075 - 0.085 HP per cc
  let baseHpPerCc = 0.078;

  // Compression bonus
  if (config.cr > 10.0) {
    baseHpPerCc += (config.cr - 10.0) * 0.005;
  }

  // Camshaft influence on RPM powerband shift
  let peakRpm = 8200;
  let camPowerMultiplier = 1.0;
  let lowRpmEfficiency = 0.70;

  switch (config.camType) {
    case 'mild_5.5mm':
      peakRpm = 8800;
      camPowerMultiplier = 1.12;
      lowRpmEfficiency = 0.67;
      break;
    case 'racing_6.2mm':
      peakRpm = 9800;
      camPowerMultiplier = 1.25;
      lowRpmEfficiency = 0.58; // Sacrifices low-end
      break;
    case 'touring_cnc':
      peakRpm = 9200;
      camPowerMultiplier = 1.18;
      lowRpmEfficiency = 0.68;
      break;
    default:
      peakRpm = 8000;
      camPowerMultiplier = 1.0;
      lowRpmEfficiency = 0.72;
      break;
  }

  // Exhaust influence
  let exhaustMultiplier = 1.0;
  switch (config.exhaustType) {
    case 'slip_on':
      exhaustMultiplier = 1.04;
      break;
    case 'free_flow_titan':
      exhaustMultiplier = 1.09;
      break;
    case 'racing_megaphone':
      exhaustMultiplier = 1.14;
      break;
    default:
      exhaustMultiplier = 1.0;
      break;
  }

  // ECU & Ignition map
  let ecuMultiplier = 1.0;
  let redline = 10500;
  switch (config.ecuMapping) {
    case 'reflash_pxl':
      ecuMultiplier = 1.06;
      redline = 11500;
      break;
    case 'stand_alone_race':
      ecuMultiplier = 1.12;
      redline = 12500;
      break;
    default:
      ecuMultiplier = 1.0;
      redline = 9800;
      break;
  }

  // Carburetor sizing airflow effect
  const optimalCarb = 0.65 * Math.sqrt(cc * (peakRpm / 1000));
  const carbDelta = config.carbDiameterMm - optimalCarb;
  let carbHpMultiplier = 1.0;
  if (carbDelta >= 3.0) {
    carbHpMultiplier += 0.08; // High-end gains
  } else if (carbDelta <= -3.0) {
    carbHpMultiplier -= 0.07; // Choked high-end
  }

  const theoreticalPeakHp = cc * baseHpPerCc * camPowerMultiplier * exhaustMultiplier * ecuMultiplier * carbHpMultiplier;

  let maxHp = 0;
  let maxHpRpm = peakRpm;
  let maxTorque = 0;
  let maxTorqueRpm = peakRpm * 0.72;

  // Generate 2000 to 12000 RPM in 500 RPM increments
  for (let rpm = 2000; rpm <= 12000; rpm += 500) {
    // Volumetric efficiency curve: Bell shape skewed towards peak RPM
    const normalized = rpm / peakRpm;
    let ve: number;

    if (normalized <= 1.0) {
      // Rise from lowRpmEfficiency to 1.0
      const t = (normalized - 0.25) / 0.75;
      const smooth = Math.sin((Math.max(0, t) * Math.PI) / 2);
      ve = lowRpmEfficiency + (1.0 - lowRpmEfficiency) * Math.pow(smooth, 1.2);
    } else {
      // Falloff after peak RPM towards redline
      const overRev = (rpm - peakRpm) / 3000;
      ve = 1.0 - Math.pow(overRev, 1.5) * 0.55;
      if (rpm > redline) {
        ve *= Math.max(0.1, 1 - (rpm - redline) / 1000);
      }
    }

    ve = Math.max(0.15, ve);

    // HP calculation at this RPM
    const hpAtRpm = theoreticalPeakHp * (rpm / peakRpm) * ve;
    const roundedHp = Number(Math.max(0.5, hpAtRpm).toFixed(2));

    // Torque in Nm: Torque = (HP * 7120.8) / RPM
    const torqueAtRpm = (roundedHp * 7120.8) / rpm;
    const roundedTorque = Number(Math.max(0.5, torqueAtRpm).toFixed(2));

    if (roundedHp > maxHp) {
      maxHp = roundedHp;
      maxHpRpm = rpm;
    }
    if (roundedTorque > maxTorque) {
      maxTorque = roundedTorque;
      maxTorqueRpm = rpm;
    }

    points.push({
      rpm,
      hp: roundedHp,
      torque: roundedTorque
    });
  }

  // Estimated top speed in km/h based on HP and aerodynamics
  // Standard street underbone aerodynamic drag ~ 0.25-0.3 m^2
  const estimatedTopSpeed = Math.round(Math.pow(maxHp * 2000, 1 / 3) * 3.4);

  return {
    curve: points,
    peakHp: maxHp,
    peakHpRpm: maxHpRpm,
    maxTorque: maxTorque,
    maxTorqueRpm: maxTorqueRpm,
    estimatedTopSpeed,
    powerBand: `${Math.round(maxTorqueRpm)} - ${Math.round(maxHpRpm)} RPM`
  };
}
