import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { RootState } from '../../store/store';
import { addMessage, setIsRecording } from '../../store/features/chatSlice';
import { transcribeAudio, generateChatResponse } from '../../services/openaiService';
import { AudioRecorder } from '../../services/audioService';
import VoiceWaveform from '../../components/voice/VoiceWaveform';
import { Mic, MicOff } from 'lucide-react';
import { toast } from 'sonner';

const VoiceAgent: React.FC = () => {
  const dispatch = useDispatch();
  const { isRecording } = useSelector((state: RootState) => state.chat);
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const audioRecorder = useRef(new AudioRecorder());
  
  // Timer for recording duration
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    
    if (isRecording) {
      timer = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      setRecordingTime(0);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRecording]);
  
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  const handleToggleRecording = async () => {
    if (isProcessing) return;
    
    if (!isRecording) {
      try {
        // Start recording
        await audioRecorder.current.startRecording();
        dispatch(setIsRecording(true));
        toast.info('Recording started. Speak now...');
        setAiResponse(null); // Clear previous response
      } catch (error) {
        console.error('Failed to start recording:', error);
        toast.error('Failed to start recording. Please check your microphone permissions.');
      }
    } else {
      // Stop recording and process
      dispatch(setIsRecording(false));
      setIsProcessing(true);
      toast.info('Processing your message...');
      
      try {
        // Get the recorded audio data
        const audioBase64 = await audioRecorder.current.stopRecording();
        
        // Transcribe the audio
        const transcript = await transcribeAudio(audioBase64);
        
        // Add the transcribed message to the chat
        const userMessage = {
          id: uuidv4(),
          text: transcript,
          sender: 'user' as const,
          timestamp: Date.now()
        };
        dispatch(addMessage(userMessage));
        
        // Generate AI response
        const response = await generateChatResponse([userMessage]);
        
        // Add AI response to chat
        const aiMessage = {
          id: uuidv4(),
          text: response,
          sender: 'ai' as const,
          timestamp: Date.now()
        };
        dispatch(addMessage(aiMessage));
        
        // Display the response
        setAiResponse(response);
      } catch (error) {
        console.error('Error in voice processing:', error);
        toast.error('Failed to process your message. Please try again.');
      } finally {
        setIsProcessing(false);
      }
    }
  };
  
  return (
    <div className="h-full flex flex-col">
      {/* Voice assistant visualization area */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 mb-4">
        <div 
          className={`w-32 h-32 rounded-full flex items-center justify-center mb-6 transition-all duration-300 ${
            isRecording ? 'bg-aidly-red pulse-animation' : 'bg-gray-200'
          }`}
          onClick={!isProcessing ? handleToggleRecording : undefined}
          style={{ cursor: isProcessing ? 'default' : 'pointer' }}
        >
          <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center">
            {isRecording ? (
              <Mic size={48} className="text-aidly-red animate-pulse" />
            ) : (
              <Mic size={48} className="text-gray-500" />
            )}
          </div>
        </div>
        
        {isRecording && (
          <>
            <VoiceWaveform />
            <p className="text-sm font-medium text-gray-600 mt-2">{formatTime(recordingTime)}</p>
          </>
        )}
        
        {isProcessing && (
          <div className="flex flex-col items-center">
            <div className="mt-4 w-8 h-8 border-t-2 border-aidly-red rounded-full animate-spin"></div>
            <p className="text-gray-500 mt-2">Processing...</p>
          </div>
        )}
        
        {!isRecording && !isProcessing && (
          <button
            onClick={handleToggleRecording}
            className="aidly-gradient px-6 py-3 rounded-full text-white font-medium shadow-md transition-transform hover:scale-[1.05] active:scale-[0.98]"
          >
            Tap to speak
          </button>
        )}
      </div>
      
      {/* Response area */}
      <div className="aidly-card min-h-[150px] max-h-[300px] overflow-y-auto mb-4 p-4">
        {aiResponse ? (
          <p className="text-gray-800">{aiResponse}</p>
        ) : (
          <p className="text-gray-500 italic">Ask me anything about health...</p>
        )}
      </div>
      
      {/* Recording controls */}
      {isRecording && (
        <div className="flex justify-center mb-6">
          <button
            onClick={handleToggleRecording}
            className="bg-white border border-aidly-red text-aidly-red px-6 py-3 rounded-full font-medium shadow-sm transition-transform hover:scale-[1.05] active:scale-[0.98]"
          >
            Stop Recording
          </button>
        </div>
      )}
      
      <style>{`
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(234, 56, 76, 0.4); }
          70% { box-shadow: 0 0 0 15px rgba(234, 56, 76, 0); }
          100% { box-shadow: 0 0 0 0 rgba(234, 56, 76, 0); }
        }
        
        .pulse-animation {
          animation: pulse 2s infinite;
        }
      `}</style>
    </div>
  );
};

export default VoiceAgent;
