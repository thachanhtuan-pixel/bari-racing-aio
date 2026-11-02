import { EngineCalcInput, EngineCalcResult } from '../types';

/**
 * Calculates motorcycle displacement in cubic centimeters (cc)
 * Formula: cc = (pi * (bore / 2)^2 * stroke) / 1000
 */
export function calculateDisplacement(bore: number, stroke: number): number {
  if (bore <= 0 || stroke <= 0) return 0;
  const radius = bore / 2;
  const cc = (Math.PI * Math.pow(radius, 2) * stroke) / 1000;
  return Number(cc.toFixed(1));
}

/**
 * Calculates geometric compression ratio (CR)
 * Formula: CR = (V_cylinder + V_combustion) / V_combustion
 */
export function calculateGeometricCR(
  displacementCc: number,
  chamberVolumeCc: number,
  gasketThicknessMm: number = 0.5,
  boreMm: number = 50
): { cr: number; effectiveChamberVolume: number } {
  if (displacementCc <= 0 || chamberVolumeCc <= 0) {
    return { cr: 0, effectiveChamberVolume: chamberVolumeCc };
  }

  // Stock base gasket is typically ~0.5mm.
  // Any extra gasket thickness adds cylinder volume to the combustion chamber space
  const extraThickness = Math.max(0, gasketThicknessMm - 0.5);
  const gasketExtraVolume = (Math.PI * Math.pow(boreMm / 2, 2) * extraThickness) / 1000;
  const effectiveChamber = chamberVolumeCc + gasketExtraVolume;

  const cr = (displacementCc + effectiveChamber) / effectiveChamber;
  return {
    cr: Number(cr.toFixed(2)),
    effectiveChamberVolume: Number(effectiveChamber.toFixed(2))
  };
}

/**
 * Calculates recommended carburetor / throttle body diameter & jetting airflow dynamics
 */
export function calculateCarbAirflow(
  displacementCc: number,
  peakRpm: number,
  actualCarbDiameter: number
): {
  recommendedCarbSize: number;
  carbDeltaRatio: number;
  lowEnd: string;
  lowEndDelta: number;
  highEnd: string;
  highEndDelta: number;
  fuelBurnRateDelta: number;
  fuelEstLitersPer100km: number;
  statusBadge: 'optimal' | 'bogging' | 'choked' | 'oversized';
} {
  if (displacementCc <= 0) {
    return {
      recommendedCarbSize: 18,
      carbDeltaRatio: 0,
      lowEnd: 'Bình thường',
      lowEndDelta: 0,
      highEnd: 'Bình thường',
      highEndDelta: 0,
      fuelBurnRateDelta: 0,
      fuelEstLitersPer100km: 2.0,
      statusBadge: 'optimal'
    };
  }

  // Empirical Venturi formula for 4-stroke small displacement:
  // D = 0.65 * sqrt(V * RPM / 1000)
  const rpmFactor = Math.max(6000, Math.min(14000, peakRpm || 8500));
  const optimalSize = 0.65 * Math.sqrt(displacementCc * (rpmFactor / 1000));
  const recSize = Number(optimalSize.toFixed(1));

  const delta = actualCarbDiameter - recSize;
  const deltaRatio = Number((delta / recSize).toFixed(2));

  // Baseline fuel consumption in L/100km
  const baseFuel = 1.6 + (displacementCc / 100) * 0.7;

  if (delta >= 4.0) {
    // Large Carburetor (e.g. 28mm on stock 110cc)
    // Low-end RPM velocity drops -> Severe Low-end Bogging [-15% Acceleration]
    // High-end delivery stabilizes -> Improved Top-end Pull [+20% Top Speed Output]
    // Fuel Consumption Counter -> Increase calculated fuel burn rate by 35-40%
    const fuelRateIncrease = 38;
    const estFuel = baseFuel * (1 + fuelRateIncrease / 100);

    return {
      recommendedCarbSize: recSize,
      carbDeltaRatio: deltaRatio,
      lowEnd: 'Severe Low-end Bogging (Hụp ga đầu nặng)',
      lowEndDelta: -15,
      highEnd: 'Improved Top-end Pull (Nước hậu sâu, thông thoáng)',
      highEndDelta: +20,
      fuelBurnRateDelta: +fuelRateIncrease,
      fuelEstLitersPer100km: Number(estFuel.toFixed(2)),
      statusBadge: 'bogging'
    };
  } else if (delta > 1.5 && delta < 4.0) {
    const fuelRateIncrease = 18;
    const estFuel = baseFuel * (1 + fuelRateIncrease / 100);
    return {
      recommendedCarbSize: recSize,
      carbDeltaRatio: deltaRatio,
      lowEnd: 'Ga đầu hơi trễ nhẹ, cần nuôi ga mượt',
      lowEndDelta: -6,
      highEnd: 'Nước hậu thoát máy, rướn tốt',
      highEndDelta: +12,
      fuelBurnRateDelta: +fuelRateIncrease,
      fuelEstLitersPer100km: Number(estFuel.toFixed(2)),
      statusBadge: 'oversized'
    };
  } else if (delta <= -3.0) {
    // Choked Carburetor
    const fuelRateDecrease = -12;
    const estFuel = baseFuel * (1 + fuelRateDecrease / 100);
    return {
      recommendedCarbSize: recSize,
      carbDeltaRatio: deltaRatio,
      lowEnd: 'Ga đầu cực bốc & lanh ga',
      lowEndDelta: +10,
      highEnd: 'Bí nước hậu / Ghì tua cuối (Top-end Choked)',
      highEndDelta: -12,
      fuelBurnRateDelta: fuelRateDecrease,
      fuelEstLitersPer100km: Number(estFuel.toFixed(2)),
      statusBadge: 'choked'
    };
  } else {
    // Optimal Carburetor range
    return {
      recommendedCarbSize: recSize,
      carbDeltaRatio: deltaRatio,
      lowEnd: 'Phản hồi ga nhạy bén, lực kéo đều dải',
      lowEndDelta: 0,
      highEnd: 'Tua máy lên ngọt ngào, chuẩn khí động học',
      highEndDelta: +5,
      fuelBurnRateDelta: 0,
      fuelEstLitersPer100km: Number(baseFuel.toFixed(2)),
      statusBadge: 'optimal'
    };
  }
}

/**
 * Evaluates the full engine build specifications
 */
export function evaluateEngineBuild(input: EngineCalcInput): EngineCalcResult {
  const cc = calculateDisplacement(input.bore, input.stroke);
  const { cr } = calculateGeometricCR(cc, input.chamberVolume, input.gasketThickness, input.bore);

  let crStatus: 'safe' | 'high' | 'extreme' | 'low' = 'safe';
  let fuelRecommendation = '';

  if (cr < 9.0) {
    crStatus = 'low';
    fuelRecommendation = 'Xăng RON 92 / E5 hoặc A95. Tỉ số nén thấp, máy cực kỳ êm và bền bỉ.';
  } else if (cr <= 10.5) {
    crStatus = 'safe';
    fuelRecommendation = 'Xăng RON 95 (A95). Tỉ số nén tiêu chuẩn an toàn cho động cơ đường phố.';
  } else if (cr <= 12.0) {
    crStatus = 'high';
    fuelRecommendation = 'CẢNH BÁO: Bắt buộc dùng Xăng RON 95-V cao cấp hoặc pha Octane Booster. Chú ý tản nhiệt nhớt và góc đánh lửa!';
  } else {
    crStatus = 'extreme';
    fuelRecommendation = 'MỨC NGUY HIỂM: Bắt buộc dùng Xăng Đua chuyên dụng (VP Racing / Sunoco Octane >= 102). Nguy cơ kích nổ cong dập xúp-páp cực cao nếu đi xăng thường!';
  }

  const carbEffects = calculateCarbAirflow(cc, input.peakRpm, input.carbDiameter);

  return {
    displacement: cc,
    geometricCR: cr,
    crStatus,
    fuelRecommendation,
    recommendedCarbSize: carbEffects.recommendedCarbSize,
    carbDeltaRatio: carbEffects.carbDeltaRatio,
    carbEffects
  };
}

/**
 * Sprocket & Gear Ratio Calculator (Nhông Sên Dĩa NSD)
 */
export function calculateSprocketRatio(front: number, rear: number) {
  if (front <= 0 || rear <= 0) return { ratio: 0, characteristic: '' };
  const ratio = rear / front;
  let characteristic = '';
  if (ratio > 2.6) {
    characteristic = 'Nước đề cực bốc (Gia tốc ngắn, leo dốc khỏe, mất hậu)';
  } else if (ratio < 2.3) {
    characteristic = 'Nước hậu sâu (Đỡ rát máy khi đi tour đường dài, đề hơi ỳ)';
  } else {
    characteristic = 'Cân bằng hài hòa giữa nước đề và nước hậu phố';
  }
  return {
    ratio: Number(ratio.toFixed(2)),
    characteristic
  };
}
