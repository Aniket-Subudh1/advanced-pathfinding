export const manhattanDistance = (
  x1: number, 
  y1: number, 
  x2: number, 
  y2: number
): number => {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
};


export const euclideanDistance = (
  x1: number, 
  y1: number, 
  x2: number, 
  y2: number
): number => {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
};

export const diagonalDistance = (
  x1: number, 
  y1: number, 
  x2: number, 
  y2: number
): number => {
  const dx = Math.abs(x1 - x2);
  const dy = Math.abs(y1 - y2);
  return Math.max(dx, dy) + (Math.sqrt(2) - 1) * Math.min(dx, dy);
};


export const createEmptyGrid = (width: number, height: number) => {
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

  const startPosition: Position = { x: Math.floor(width / 4), y: Math.floor(height / 2) };
  const endPosition: Position = { x: Math.floor(width * 3 / 4), y: Math.floor(height / 2) };

  const startIndex = startPosition.y * width + startPosition.x;
  const endIndex = endPosition.y * width + endPosition.x;
  
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

import { GridCell, Position } from '../types';
