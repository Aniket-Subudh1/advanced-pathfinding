import { GridCell, GridData, Position } from '@/types';

export const createEmptyGrid = (width: number, height: number): GridData => {
  const cells: GridCell[] = [];

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      cells.push({
        x,
        y,
        type: 'empty',
        cost: 1,
        walkable: true
      });
    }
  }

  // Default start and end positions
  const startPosition: Position = { x: Math.floor(width / 4), y: Math.floor(height / 2) };
  const endPosition: Position = { x: Math.floor(width * 3 / 4), y: Math.floor(height / 2) };

  // Set start and end cells
  const startIndex = getIndexFromPosition(startPosition, width);
  const endIndex = getIndexFromPosition(endPosition, width);
  
  cells[startIndex].type = 'start';
  cells[endIndex].type = 'end';

  return {
    width,
    height,
    cells,
    startPosition,
    endPosition
  };
};

export const getIndexFromPosition = (position: Position, gridWidth: number): number => {
  return position.y * gridWidth + position.x;
};

export const getPositionFromIndex = (index: number, gridWidth: number): Position => {
  return {
    x: index % gridWidth,
    y: Math.floor(index / gridWidth)
  };
};

export const isPositionValid = (position: Position, width: number, height: number): boolean => {
  return position.x >= 0 && position.x < width && position.y >= 0 && position.y < height;
};

export const clearPath = (grid: GridData): GridData => {
  const newCells = grid.cells.map(cell => {
    if (cell.type === 'path' || cell.type === 'visited' || cell.type === 'visiting') {
      return { ...cell, type: 'empty' as const };
    }
    return cell;
  });

  return {
    ...grid,
    cells: newCells
  };
};

export const generateRandomWalls = (grid: GridData, percentage: number): GridData => {
  const newCells = grid.cells.map(cell => {
    // Don't make start or end cells into walls
    if (cell.type !== 'start' && cell.type !== 'end') {
      if (Math.random() < percentage / 100) {
        return { ...cell, type: 'wall' as const, walkable: false };
      }
    }
    return cell;
  });

  return {
    ...grid,
    cells: newCells
  };
};