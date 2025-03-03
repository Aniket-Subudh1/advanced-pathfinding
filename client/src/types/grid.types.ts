export interface Position {
  x: number;
  y: number;
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
