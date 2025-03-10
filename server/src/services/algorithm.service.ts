import { v4 as uuidv4 } from 'uuid';
import {
  AlgorithmType,
  AlgorithmOptions,
  GridData,
  Position,
  AlgorithmResult
} from 'shared/src/types';
import { AlgorithmExecutionResult, AlgorithmMetricsStore } from '../models/algorithm.model';
import { runAlgorithm } from '../algorithms';
import { logger } from '../utils';

const defaultAlgorithmOptions: AlgorithmOptions = {
  allowDiagonal: true,
  heuristic: 'manhattan',
  weight: 1.0,
  bidirectional: false,
  tieBreaker: true
};


export const executeAlgorithm = async (
  algorithmId: AlgorithmType,
  grid: GridData,
  start: Position,
  end: Position,
  options: Partial<AlgorithmOptions> = {}
): Promise<AlgorithmResult> => {
  const startTime = performance.now();
  
  const algorithmOptions: AlgorithmOptions = {
    ...defaultAlgorithmOptions,
    ...options
  };
  
  const memoryBefore = process.memoryUsage().heapUsed;
  
  try {
    const result = await runAlgorithm(
      algorithmId,
      grid,
      start,
      end,
      algorithmOptions
    );
    
    const endTime = performance.now();
    const executionTime = endTime - startTime;
    
    // Memory usage after execution
    const memoryAfter = process.memoryUsage().heapUsed;
    const memoryUsed = memoryAfter - memoryBefore;
    
    // Update metrics with actual values
    result.metrics.executionTimeMs = executionTime;
    result.metrics.memoryUsed = memoryUsed;
    
    // Record execution for metrics
    const executionResult: AlgorithmExecutionResult = {
      ...result,
      algorithmId,
      options: algorithmOptions,
      executionId: uuidv4(),
      timestamp: new Date(),
      success: result.path.length > 0
    };
    
    // Store metrics - this is the important part!
    AlgorithmMetricsStore.getInstance().recordExecution(executionResult);
    
    logger.info(`Algorithm ${algorithmId} executed successfully`, {
      executionTime,
      nodesExplored: result.metrics.nodesExplored,
      pathLength: result.metrics.pathLength
    });
    
    return result;
  } catch (error) {
    logger.error(`Error executing algorithm ${algorithmId}:`, { error });
    throw error;
  }
};