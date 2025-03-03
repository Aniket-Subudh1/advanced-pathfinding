import React from 'react';
import { Button } from '@/components/shared';

interface AnimationControlsProps {
  isVisualizing: boolean;
  onStart: () => void;
  onStop: () => void;
  onReset: () => void;
  currentStep: number;
  totalSteps: number;
  speed: number;
  onSpeedChange: (speed: number) => void;
}

const AnimationControls: React.FC<AnimationControlsProps> = ({
  isVisualizing,
  onStart,
  onStop,
  onReset,
  currentStep,
  totalSteps,
  speed,
  onSpeedChange
}) => {
  // Convert speed to display value (reverse the scale so higher = faster)
  const displaySpeed = 110 - speed;
  
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
      <h3 className="text-lg font-medium text-gray-900 mb-3">Visualization Controls</h3>
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex space-x-2">
          {isVisualizing ? (
            <Button onClick={onStop} variant="secondary">
              Pause
            </Button>
          ) : (
            <Button onClick={onStart} variant="primary" disabled={currentStep >= totalSteps}>
              {currentStep === 0 ? 'Start Visualization' : 'Resume'}
            </Button>
          )}
          
          <Button onClick={onReset} variant="outline" disabled={isVisualizing}>
            Reset
          </Button>
        </div>
        
        <div className="text-sm text-gray-700">
          Step {currentStep} of {totalSteps}
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-700">Speed:</span>
        <input
          type="range"
          min="10"
          max="100"
          value={displaySpeed}
          onChange={(e) => onSpeedChange(110 - parseInt(e.target.value))}
          disabled={isVisualizing}
          className="flex-grow"
        />
        <div className="flex items-center space-x-1">
          <span className="text-sm text-gray-700">{Math.round(displaySpeed / 10)}</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
      
      <div className="mt-4 bg-gray-100 rounded-full h-2.5">
        <div 
          className="bg-primary-600 h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${(currentStep / Math.max(totalSteps, 1)) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default AnimationControls;