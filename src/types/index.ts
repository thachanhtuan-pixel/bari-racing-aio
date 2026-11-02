export interface MotorcycleSpec {
  id: string;
  name: string;
  manufacturer: 'Honda' | 'Yamaha' | 'Suzuki' | 'Custom';
  category: string;
  bore: number; // mm
  stroke: number; // mm
  displacement: number; // cc
  pin: number; // mm (ắc piston)
  cr: number; // compression ratio
  carbZin: number; // mm
  nsd: string; // e.g. "15-35"
  sprocketFront: number;
  sprocketRear: number;
  gearRatios?: number[];
  primaryReduction?: number;
  secondaryReduction?: number;
  peakHp: number;
  peakHpRpm: number;
  maxTorque: number;
  maxTorqueRpm: number;
  valveClearanceIn: string; // mm
  valveClearanceEx: string; // mm
  description?: string;
}

export interface EngineCalcInput {
  bore: number;
  stroke: number;
  chamberVolume: number; // cc
  gasketThickness: number; // mm (ron chân lòng + ron quy-lát)
  carbDiameter: number; // mm
  peakRpm: number; // RPM
}

export interface EngineCalcResult {
  displacement: number; // cc
  geometricCR: number;
  crStatus: 'safe' | 'high' | 'extreme' | 'low';
  fuelRecommendation: string;
  recommendedCarbSize: number;
  carbDeltaRatio: number;
  carbEffects: {
    lowEnd: string;
    lowEndDelta: number;
    highEnd: string;
    highEndDelta: number;
    fuelBurnRateDelta: number;
    fuelEstLitersPer100km: number;
    statusBadge: 'optimal' | 'bogging' | 'choked' | 'oversized';
  };
}

export interface DiagnosticItem {
  id: string;
  location: string; // Vị trí: Đầu bò, Lốc nồi, Cốt dên / Bụng máy, Bình xăng con / Họng gió, Dàn chân / Khung sườn
  timing: string;   // Thời điểm: Máy nguội, Máy nóng, Ép ga lớn / Tải nặng, Thòng ga / Giảm tốc, Chạy tua cao, Nổ cầm chừng (Garanti)
  symptom: string;  // Triệu chứng: Tiếng gõ "tách tách", Tiếng "cọc cọc" đanh, Tiếng "húuuu" lớn dần, v.v.
  soundKey: 'ticking' | 'knocking' | 'whining' | 'rodknock' | 'bogging' | 'healthy';
  diagnosis: string;// Chẩn đoán bệnh
  dangerLevel: 'mild' | 'moderate' | 'critical';
  fix: string;      // Hướng dẫn khắc phục chi tiết của thợ
  specs: {
    label: string;
    value: string;
  }[];
}

export interface DynoCurvePoint {
  rpm: number;
  hp: number;
  torque: number; // Nm
}

export interface DynoResult {
  curve: DynoCurvePoint[];
  stockCurve?: DynoCurvePoint[];
  peakHp: number;
  peakHpRpm: number;
  maxTorque: number;
  maxTorqueRpm: number;
  estimatedTopSpeed: number; // km/h
  powerBand: string;
}

export interface GPSTestRun {
  id: string;
  date: string;
  mode: '25-80' | '0-50' | '0-80' | '40-80';
  elapsedSeconds: number;
  maxSpeedKmh: number;
  avgAccelerationG: number;
  vehicleName: string;
  notes?: string;
}
