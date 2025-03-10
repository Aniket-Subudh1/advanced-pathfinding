import { GridData, GridCell, Position } from 'shared/src/types';

export interface GridAnalysisResult {
  gridSize: { width: number, height: number };
  totalCells: number;
  walkableCells: number;
  wallCells: number;
  startPosition: Position;
  endPosition: Position;
  pathExists: boolean;
}

export function analyzeGrid(grid: GridData): GridAnalysisResult {
  const { width, height, cells, startPosition, endPosition } = grid;
  
  const totalCells = width * height;
  const walkableCells = cells.filter(cell => cell.walkable).length;
  const wallCells = totalCells - walkableCells;
  
  
  const pathExists = walkableCells > 0;
  
  return {
    gridSize: { width, height },
    totalCells,
    walkableCells,
    wallCells,
    startPosition,
    endPosition,
    pathExists
  };
}