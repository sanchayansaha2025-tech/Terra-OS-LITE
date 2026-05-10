export enum CropDiseaseSeverity {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
}

export interface DiseaseDetectionResult {
  diseaseName: string;
  severity: CropDiseaseSeverity;
  treatment: string;
  confidence: number;
}

export interface SoilHealthResult {
  soilType: string;
  nutrientStatus: {
    nitrogen: string;
    phosphorus: string;
    potassium: string;
  };
  healthScore: number;
  recommendations: string[];
}

export interface ProfitPrediction {
  estimatedYield: number;
  estimatedPrice: number;
  estimatedCost: number;
  totalProfit: number;
  riskWarning: string;
  suggestions: string;
}

export interface PestReport {
  id: string;
  lat: number;
  lng: number;
  pestType: string;
  severity: CropDiseaseSeverity;
  timestamp: number;
}
