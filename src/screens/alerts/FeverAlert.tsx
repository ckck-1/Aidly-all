
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { resetFever } from '../../store/features/healthSlice';
import { ThermometerSun } from 'lucide-react';

const FeverAlert: React.FC = () => {
  const dispatch = useDispatch();
  const { temperature } = useSelector((state: RootState) => state.health);
  
  const handleDismiss = () => {
    dispatch(resetFever());
  };
  
  // Recommendations based on temperature level
  const getRecommendations = () => {
    if (!temperature) return [];
    
    if (temperature.value >= 39.0) {
      return [
        "Seek medical attention immediately",
        "Take fever-reducing medication as directed by a healthcare provider",
        "Stay hydrated by drinking plenty of fluids",
        "Rest and avoid physical activity",
        "Apply cool compresses to forehead and neck"
      ];
    } else if (temperature.value >= 38.0) {
      return [
        "Take fever-reducing medication (follow package instructions)",
        "Stay hydrated with water or electrolyte drinks",
        "Rest and avoid physical exertion",
        "Monitor temperature every 2-3 hours",
        "Seek medical attention if fever persists for more than 3 days"
      ];
    } else {
      return [
        "Stay hydrated by drinking plenty of fluids",
        "Rest and avoid strenuous activity",
        "Monitor temperature regularly",
        "Take fever-reducing medication if needed (follow package instructions)",
        "Contact a healthcare provider if symptoms worsen"
      ];
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full animate-fade-in overflow-hidden">
        {/* Alert header */}
        <div className="aidly-gradient p-6 flex items-center space-x-3">
          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <ThermometerSun size={28} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Temperature Alert</h2>
            <p className="text-white text-opacity-90">Elevated body temperature detected</p>
          </div>
        </div>
        
        {/* Alert content */}
        <div className="p-6">
          <div className="mb-6 text-center">
            <div className="text-4xl font-bold text-aidly-red mb-1">
              {temperature ? temperature.value.toFixed(1) : '--'} °C
            </div>
            <p className="text-gray-500">
              {new Date(temperature?.timestamp || Date.now()).toLocaleString()}
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Recommendations</h3>
            <ul className="space-y-2">
              {getRecommendations().map((rec, index) => (
                <li key={index} className="flex items-start">
                  <span className="inline-block w-5 h-5 bg-aidly-red rounded-full text-white flex-shrink-0 flex items-center justify-center text-xs mr-2 mt-0.5">
                    {index + 1}
                  </span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="text-sm text-gray-500 italic mb-6">
            Note: This is not medical advice. If you're concerned about your symptoms, please consult a healthcare professional.
          </div>
          
          <button
            onClick={handleDismiss}
            className="w-full py-3 aidly-gradient rounded-lg text-white font-medium transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Dismiss Alert
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeverAlert;
