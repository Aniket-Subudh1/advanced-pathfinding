import { useState, useRef, useCallback, useEffect } from 'react';
import { Position } from '@/types';

export function useVisualization() {
  const [isVisualizing, setIsVisualizing] = useState(false);
  const [visualizationSpeed, setVisualizationSpeed] = useState(10); // milliseconds per step
  const [currentStep, setCurrentStep] = useState(0);
  
  const visitedRef = useRef<Position[]>([]);
  const pathRef = useRef<Position[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const visualizationSteps = useRef<{
    type: 'visited' | 'path';
    position: Position;
  }[]>([]);
  
  // Prepare visualization steps
  const prepareVisualization = useCallback((visited: Position[], path: Position[]) => {
    visitedRef.current = [...visited];
    pathRef.current = [...path];
    
    // Create interleaved steps (all visited first, then path)
    const steps = [
      ...visited.map(pos => ({ type: 'visited' as const, position: pos })),
      ...path.map(pos => ({ type: 'path' as const, position: pos }))
    ];
    
    visualizationSteps.current = steps;
    setCurrentStep(0);
  }, []);
  
  // Start the visualization
  const startVisualization = useCallback(() => {
    if (visualizationSteps.current.length === 0) {
      return;
    }
    
    setIsVisualizing(true);
  }, []);
  
  // Stop the visualization
  const stopVisualization = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    setIsVisualizing(false);
  }, []);
  
  // Reset the visualization
  const resetVisualization = useCallback(() => {
    stopVisualization();
    setCurrentStep(0);
  }, [stopVisualization]);
  
  // Change the speed
  const changeSpeed = useCallback((speed: number) => {
    setVisualizationSpeed(speed);
  }, []);
  
  // Handle visualization steps
  useEffect(() => {
    if (!isVisualizing) return;
    
    if (currentStep >= visualizationSteps.current.length) {
      setIsVisualizing(false);
      return;
    }
    
    const step = () => {
      setCurrentStep(prev => prev + 1);
    };
    
    timeoutRef.current = setTimeout(step, visualizationSpeed);
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isVisualizing, currentStep, visualizationSpeed]);
  
  // Get current visualization state
  const getCurrentState = useCallback(() => {
    const visitedPositions: Position[] = [];
    const pathPositions: Position[] = [];
    
    for (let i = 0; i < currentStep; i++) {
      const step = visualizationSteps.current[i];
      if (!step) continue;
      
      if (step.type === 'visited') {
        visitedPositions.push(step.position);
      } else {
        pathPositions.push(step.position);
      }
    }
    
    return {
      visited: visitedPositions,
      path: pathPositions,
      totalSteps: visualizationSteps.current.length,
      currentStep
    };
  }, [currentStep]);
  
  return {
    isVisualizing,
    visualizationSpeed,
    currentStep,
    prepareVisualization,
    startVisualization,
    stopVisualization,
    resetVisualization,
    changeSpeed,
    getCurrentState
  };
}