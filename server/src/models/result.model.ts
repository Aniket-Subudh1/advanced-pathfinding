import { AlgorithmResult, Position } from 'shared/src/types';

export interface ResultWithVisualization extends AlgorithmResult {
  stepsVisited: Position[][];
  stepsPath: Position[][];
}

export function createEmptyResult(): AlgorithmResult {
  return {
    path: [],
    visited: [],
    metrics: {
      nodesExplored: 0,
      executionTimeMs: 0,
      pathLength: 0,
      memoryUsed: 0
    }
  };
}