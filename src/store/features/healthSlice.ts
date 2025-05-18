
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TemperatureReading {
  value: number;
  timestamp: number;
}

interface SymptomAnalysis {
  imageUrl: string | null;
  diagnosis: string | null;
  recommendations: string[] | null;
  timestamp: number | null;
}

interface HealthState {
  temperature: TemperatureReading | null;
  hasFever: boolean;
  symptomAnalysis: SymptomAnalysis;
}

const initialState: HealthState = {
  temperature: null,
  hasFever: false,
  symptomAnalysis: {
    imageUrl: null,
    diagnosis: null,
    recommendations: null,
    timestamp: null,
  },
};

const healthSlice = createSlice({
  name: 'health',
  initialState,
  reducers: {
    updateTemperature: (state, action: PayloadAction<TemperatureReading>) => {
      state.temperature = action.payload;
      state.hasFever = action.payload.value > 37.5;
    },
    resetFever: (state) => {
      state.hasFever = false;
    },
    setSymptomImage: (state, action: PayloadAction<string>) => {
      state.symptomAnalysis.imageUrl = action.payload;
    },
    setSymptomAnalysis: (state, action: PayloadAction<{ diagnosis: string; recommendations: string[] }>) => {
      state.symptomAnalysis.diagnosis = action.payload.diagnosis;
      state.symptomAnalysis.recommendations = action.payload.recommendations;
      state.symptomAnalysis.timestamp = Date.now();
    },
    clearSymptomAnalysis: (state) => {
      state.symptomAnalysis = {
        imageUrl: null,
        diagnosis: null,
        recommendations: null,
        timestamp: null,
      };
    },
  },
});

export const { 
  updateTemperature, 
  resetFever, 
  setSymptomImage, 
  setSymptomAnalysis, 
  clearSymptomAnalysis 
} = healthSlice.actions;
export default healthSlice.reducer;
