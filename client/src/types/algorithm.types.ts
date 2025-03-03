export type AlgorithmType = 
  | 'astar'
  | 'jps'
  | 'bts'
  | 'flowfield'
  | 'hpa';

export interface AlgorithmInfo {
  id: AlgorithmType;
  name: string;
  description: string;
  complexityTime: string;
  complexitySpace: string;
  color: string;
}

export interface AlgorithmOptions {
  allowDiagonal: boolean;
  heuristic: 'manhattan' | 'euclidean' | 'diagonal';
  weight: number;
  bidirectional: boolean;
  tieBreaker: boolean;
}

export interface AlgorithmResult {
  path: Position[];
  visited: Position[];
  metrics: {
    nodesExplored: number;
    executionTimeMs: number;
    pathLength: number;
    memoryUsed: number;
  };
}
