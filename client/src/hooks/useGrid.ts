import { useState, useCallback } from 'react';
import { 
  GridData, 
  Position, 
  CellType 
} from '@/types';
import { 
  createEmptyGrid, 
  getIndexFromPosition, 
  isPositionValid,
  clearPath,
  generateRandomWalls
} from '@/utils/grid-helpers';

export function useGrid(initialWidth = 20, initialHeight = 20) {
  const [grid, setGrid] = useState<GridData>(() => createEmptyGrid(initialWidth, initialHeight));
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [drawType, setDrawType] = useState<'wall' | 'empty'>('wall');
  const [dragItem, setDragItem] = useState<'start' | 'end' | null>(null);
  
  // Reset the grid to empty
  const resetGrid = useCallback(() => {
    setGrid(createEmptyGrid(grid.width, grid.height));
  }, [grid.width, grid.height]);
  
  // Clear just the path, keeping walls
  const resetPath = useCallback(() => {
    setGrid(clearPath(grid));
  }, [grid]);

  // Handle cell click
  const handleCellClick = useCallback((x: number, y: number) => {
    const position: Position = { x, y };
    const index = getIndexFromPosition(position, grid.width);
    const cell = grid.cells[index];

    if (cell.type === 'start' || cell.type === 'end') {
      return;
    }

    const newCells = [...grid.cells];
    const newType: CellType = cell.type === 'wall' ? 'empty' : 'wall';
    newCells[index] = { 
      ...cell, 
      type: newType, 
      walkable: newType !== 'wall' 
    };

    setGrid({
      ...grid,
      cells: newCells
    });
  }, [grid]);

  // Start drawing walls or erasing
  const startDrawing = useCallback((x: number, y: number, type: 'wall' | 'empty') => {
    const position: Position = { x, y };
    const index = getIndexFromPosition(position, grid.width);
    const cell = grid.cells[index];

    if (cell.type === 'start') {
      setDragItem('start');
      return;
    }

    if (cell.type === 'end') {
      setDragItem('end');
      return;
    }

    setDrawType(type);
    setIsDrawing(true);
    
    // Also apply to the first cell
    const newCells = [...grid.cells];
    newCells[index] = { 
      ...cell, 
      type, 
      walkable: type !== 'wall'
    };

    setGrid({
      ...grid,
      cells: newCells
    });
  }, [grid]);

  // Stop drawing
  const stopDrawing = useCallback(() => {
    setIsDrawing(false);
    setDragItem(null);
  }, []);

  // Draw on cell while mouse is down
  const drawOnCell = useCallback((x: number, y: number) => {
    if (!isDrawing && !dragItem) return;

    const position: Position = { x, y };
    
    if (!isPositionValid(position, grid.width, grid.height)) return;
    
    const index = getIndexFromPosition(position, grid.width);
    const cell = grid.cells[index];

    // If dragging start or end
    if (dragItem) {
      if (cell.type === 'wall' || cell.type === 'start' || cell.type === 'end') {
        return; // Can't move to a wall or other special cell
      }

      const newCells = [...grid.cells];
      
      // Find and reset old position
      const oldPositionIndex = getIndexFromPosition(
        dragItem === 'start' ? grid.startPosition : grid.endPosition, 
        grid.width
      );
      newCells[oldPositionIndex] = { 
        ...newCells[oldPositionIndex], 
        type: 'empty',
        walkable: true
      };
      
      // Set new position
      newCells[index] = { 
        ...cell, 
        type: dragItem,
        walkable: true
      };

      const newGrid = {
        ...grid,
        cells: newCells
      };

      // Update the position reference
      if (dragItem === 'start') {
        newGrid.startPosition = position;
      } else {
        newGrid.endPosition = position;
      }

      setGrid(newGrid);
      return;
    }

    // Normal drawing of walls or erasing
    if (cell.type !== 'start' && cell.type !== 'end') {
      const newCells = [...grid.cells];
      newCells[index] = { 
        ...cell, 
        type: drawType, 
        walkable: drawType !== 'wall'
      };

      setGrid({
        ...grid,
        cells: newCells
      });
    }
  }, [isDrawing, dragItem, drawType, grid]);

  // Generate random walls
  const generateMaze = useCallback((density: number = 30) => {
    // First clear the grid
    const clearedGrid = clearPath(grid);
    // Then add random walls
    setGrid(generateRandomWalls(clearedGrid, density));
  }, [grid]);

  // Resize the grid
  const resizeGrid = useCallback((width: number, height: number) => {
    setGrid(createEmptyGrid(width, height));
  }, []);

  // Update grid with algorithm results
  const updateWithResults = useCallback((path: Position[], visited: Position[]) => {
    const newCells = [...grid.cells];
    
    // First mark all visited cells
    visited.forEach(pos => {
      const index = getIndexFromPosition(pos, grid.width);
      const cell = newCells[index];
      if (cell.type !== 'start' && cell.type !== 'end') {
        newCells[index] = { ...cell, type: 'visited' };
      }
    });
    
    // Then mark the path cells (overrides visited)
    path.forEach(pos => {
      const index = getIndexFromPosition(pos, grid.width);
      const cell = newCells[index];
      if (cell && cell.type !== 'start' && cell.type !== 'end') {
        newCells[index] = { ...cell, type: 'path' };
      }
    });
    
    setGrid({
      ...grid,
      cells: newCells
    });
  }, [grid]);

  return {
    grid,
    resetGrid,
    resetPath,
    handleCellClick,
    startDrawing,
    stopDrawing,
    drawOnCell,
    generateMaze,
    resizeGrid,
    updateWithResults
  };
}