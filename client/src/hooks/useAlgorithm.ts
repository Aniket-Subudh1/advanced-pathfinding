import { useState, useCallback } from 'react';
import { 
  AlgorithmType, 
  AlgorithmOptions, 
  AlgorithmResult, 
  GridData, 
  Position 
} from '@/types';
import { executeAlgorithm } from '@/services/algorithms';

export function useAlgorithm() {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<AlgorithmType>('astar');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [result, setResult] = useState<AlgorithmResult | null>(null);
  
  const [options, setOptions] = useState<AlgorithmOptions>({
    allowDiagonal: true,
    heuristic: 'manhattan',
    weight: 1,
    bidirectional: false,
    tieBreaker: true
  });
  
  // Update algorithm options
  const updateOption = useCallback(<K extends keyof AlgorithmOptions>(
    key: K, 
    value: AlgorithmOptions[K]
  ) => {
    setOptions(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  // Change the selected algorithm
  const changeAlgorithm = useCallback((algorithm: AlgorithmType) => {
    setSelectedAlgorithm(algorithm);
    // Reset results when changing algorithm
    setResult(null);
  }, []);

  // Run the selected algorithm
  const runAlgorithm = useCallback(async (
    grid: GridData
  ) => {
    try {
      setIsRunning(true);
      const algorithmResult = await executeAlgorithm(
        selectedAlgorithm,
        grid,
        grid.startPosition,
        grid.endPosition,
        options
      );
      
      setResult(algorithmResult);
      return algorithmResult;
    } catch (error) {
      console.error('Error running algorithm:', error);
      throw error;
    } finally {
      setIsRunning(false);
    }
  }, [selectedAlgorithm, options]);

  return {
    selectedAlgorithm,
    options,
    isRunning,
    result,
    changeAlgorithm,
    updateOption,
    runAlgorithm
  };
}