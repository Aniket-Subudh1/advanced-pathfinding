import React, { useCallback } from 'react';
import Cell from './Cell';
import { GridData } from '@/types';

interface GridProps {
  grid: GridData;
  onCellClick?: (x: number, y: number) => void;
  onMouseDown?: (x: number, y: number) => void;
  onMouseUp?: () => void;
  onMouseEnter?: (x: number, y: number) => void;
  cellSize?: number;
  className?: string;
}

const Grid: React.FC<GridProps> = ({
  grid,
  onCellClick,
  onMouseDown,
  onMouseUp,
  onMouseEnter,
  cellSize = 25,
  className = ''
}) => {
  const { width, height, cells } = grid;

  // Convert 1D array to 2D for easier rendering
  const getCellAt = useCallback((x: number, y: number) => {
    const index = y * width + x;
    return cells[index];
  }, [cells, width]);

  const handleMouseLeave = () => {
    // Stop drawing if mouse leaves the grid
    if (onMouseUp) onMouseUp();
  };

  return (
    <div 
      className={`border border-gray-300 inline-flex flex-col ${className}`}
      onMouseUp={onMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      {Array.from({ length: height }).map((_, y) => (
        <div key={y} className="flex flex-row">
          {Array.from({ length: width }).map((_, x) => {
            const cell = getCellAt(x, y);
            return (
              <Cell
                key={`${x}-${y}`}
                x={x}
                y={y}
                type={cell.type}
                size={cellSize}
                onClick={onCellClick}
                onMouseDown={onMouseDown}
                onMouseEnter={onMouseEnter}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Grid;