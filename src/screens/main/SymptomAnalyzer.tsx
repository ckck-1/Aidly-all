
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Image, Camera } from 'lucide-react';
import { setSymptomImage, setSymptomAnalysis } from '../../store/features/healthSlice';
import { analyzeSymptomImage } from '../../services/openaiService';
import { toast } from 'sonner';

const SymptomAnalyzer: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<{
    diagnosis: string;
    recommendations: string[];
  } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const dispatch = useDispatch();
  
  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    
    // Create URL for the image
    const imageUrl = URL.createObjectURL(file);
    setSelectedImage(imageUrl);
    setAnalysisResult(null);
    
    // In a real app, we'd save this to state/storage
    dispatch(setSymptomImage(imageUrl));
  };
  
  const handleCaptureImage = () => {
    // In a real app, we'd open the camera directly
    // For this demo, we'll trigger the file input
    document.getElementById('image-upload')?.click();
  };
  
  const handleAnalyzeImage = async () => {
    if (!selectedImage) {
      toast.error('Please select or capture an image first');
      return;
    }
    
    setIsAnalyzing(true);
    
    try {
      // In a real app, we'd send the image to be analyzed
      const result = await analyzeSymptomImage('mock-image-data');
      
      // Update state with analysis results
      setAnalysisResult(result);
      dispatch(setSymptomAnalysis(result));
      toast.success('Analysis complete');
    } catch (error) {
      toast.error('Failed to analyze image. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  return (
    <div className="flex flex-col space-y-6">
      <div className="aidly-card text-center">
        <h2 className="text-xl font-semibold mb-4">Symptom Analyzer</h2>
        <p className="text-gray-700 mb-4">
          Upload or capture an image of your symptoms for AI analysis
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-4">
          <button
            onClick={() => document.getElementById('image-upload')?.click()}
            className="flex items-center justify-center gap-2 bg-white border border-gray-300 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Image size={20} />
            <span>Upload Image</span>
          </button>
          
          <button
            onClick={handleCaptureImage}
            className="flex items-center justify-center gap-2 bg-white border border-gray-300 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Camera size={20} />
            <span>Take Photo</span>
          </button>
          
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageSelect}
          />
        </div>
        
        {selectedImage && (
          <div className="mb-4">
            <div className="max-w-xs mx-auto rounded-lg overflow-hidden border border-gray-200">
              <img src={selectedImage} alt="Selected symptom" className="w-full h-auto" />
            </div>
          </div>
        )}
        
        <button
          onClick={handleAnalyzeImage}
          disabled={!selectedImage || isAnalyzing}
          className={`aidly-gradient rounded-lg py-2 px-6 text-white font-medium w-full transition-transform ${
            !selectedImage || isAnalyzing
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:scale-[1.02] active:scale-[0.98]'
          }`}
        >
          {isAnalyzing ? 'Analyzing...' : 'Analyze Image'}
        </button>
      </div>
      
      {analysisResult && (
        <div className="aidly-card">
          <h3 className="text-lg font-semibold mb-3">Analysis Results</h3>
          
          <div className="mb-4">
            <h4 className="text-md font-medium text-gray-700 mb-1">Potential Diagnosis:</h4>
            <p className="text-gray-800">{analysisResult.diagnosis}</p>
          </div>
          
          <div>
            <h4 className="text-md font-medium text-gray-700 mb-1">Recommendations:</h4>
            <ul className="list-disc pl-5 space-y-1">
              {analysisResult.recommendations.map((rec, index) => (
                <li key={index} className="text-gray-800">{rec}</li>
              ))}
            </ul>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500 italic">
              Note: This analysis is not a medical diagnosis. Please consult with a healthcare professional for proper medical advice.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SymptomAnalyzer;
