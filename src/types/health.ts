
export interface TemperatureReading {
  value: number;
  timestamp: number;
}

export interface SymptomAnalysis {
  imageUrl: string | null;
  diagnosis: string | null;
  recommendations: string[] | null;
  timestamp: number | null;
}
