
import React, { useEffect, useState, useRef } from 'react';

const VoiceWaveform: React.FC = () => {
  const [bars, setBars] = useState<number[]>(Array(30).fill(10));
  const animationRef = useRef<number | null>(null);
  const lastUpdateTimeRef = useRef<number>(Date.now());

  // Function to generate more realistic voice-like patterns
  const generateWaveform = (timestamp: number) => {
    // Calculate time passed since last update
    const timeDelta = timestamp - lastUpdateTimeRef.current;
    
    // Only update every ~50ms for performance
    if (timeDelta > 50) {
      lastUpdateTimeRef.current = timestamp;
      
      // Create a more natural voice-like pattern
      setBars(prevBars => {
        return prevBars.map((height, index) => {
          const baseHeight = 10; // minimum height
          const maxAdditionalHeight = 50; // maximum additional height
          
          // Create a wave-like pattern with some randomness
          const waveComponent = Math.sin(timestamp / 200 + index / 3) * 20;
          const randomComponent = Math.random() * 10;
          
          // Combine base height, wave pattern, and randomness
          return Math.max(5, Math.min(90, baseHeight + waveComponent + randomComponent));
        });
      });
    }
    
    // Continue animation loop
    animationRef.current = requestAnimationFrame(generateWaveform);
  };
  
  useEffect(() => {
    // Start animation
    animationRef.current = requestAnimationFrame(generateWaveform);
    
    // Cleanup function to cancel animation when component unmounts
    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);
  
  return (
    <div className="flex items-center justify-center h-16 my-4">
      {bars.map((height, index) => (
        <div
          key={index}
          className="waveform-bar mx-0.5"
          style={{
            height: `${height}%`,
            width: '3px',
            background: 'linear-gradient(to bottom, #ea384c, #000000)',
            transition: 'height 0.1s ease-in-out',
            borderRadius: '1px'
          }}
        />
      ))}
    </div>
  );
};

export default VoiceWaveform;
