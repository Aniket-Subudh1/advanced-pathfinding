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

export interface Position {
  x: number;
  y: number;
}

export interface GridCell {
  x: number;
  y: number;
  type: string;
  cost: number;
  walkable: boolean;
}

export interface GridData {
  width: number;
  height: number;
  cells: GridCell[];
  startPosition: Position;
  endPosition: Position;
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
