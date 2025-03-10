// shared/src/types/index.ts - Updated with PathNode interface

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


export interface PathNode {
  x: number;
  y: number;
  g: number;       
  h: number;       
  f: number;       
  parent?: PathNode; 
}

export type CellType = 
  | 'empty' 
  | 'wall' 
  | 'start' 
  | 'end' 
  | 'visited' 
  | 'visiting' 
  | 'path';

export interface GridCell {
  x: number;
  y: number;
  type: CellType;
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