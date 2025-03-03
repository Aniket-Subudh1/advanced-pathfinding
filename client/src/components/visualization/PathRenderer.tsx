import React, { useEffect, useRef } from 'react';
import { Position } from '@/types';

interface PathRendererProps {
  visited: Position[];
  path: Position[];
  gridWidth: number;
  gridHeight: number;
  cellSize: number;
  startPosition: Position;
  endPosition: Position;
}

const PathRenderer: React.FC<PathRendererProps> = ({
  visited,
  path,
  gridWidth,
  gridHeight,
  cellSize,
  startPosition,
  endPosition
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw visited cells
    ctx.fillStyle = 'rgba(147, 197, 253, 0.5)'; // Light blue
    for (const pos of visited) {
      ctx.fillRect(
        pos.x * cellSize,
        pos.y * cellSize,
        cellSize,
        cellSize
      );
    }
    
    // Draw path
    if (path.length > 0) {
      // Draw path line
      ctx.beginPath();
      ctx.moveTo(
        startPosition.x * cellSize + cellSize / 2,
        startPosition.y * cellSize + cellSize / 2
      );
      
      for (const pos of path) {
        ctx.lineTo(
          pos.x * cellSize + cellSize / 2,
          pos.y * cellSize + cellSize / 2
        );
      }
      
      ctx.lineTo(
        endPosition.x * cellSize + cellSize / 2,
        endPosition.y * cellSize + cellSize / 2
      );
      
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.8)'; // Amber
      ctx.lineWidth = cellSize / 3;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.stroke();
      
      // Draw path points
      ctx.fillStyle = 'rgba(245, 158, 11, 0.6)'; // Amber
      for (const pos of path) {
        ctx.beginPath();
        ctx.arc(
          pos.x * cellSize + cellSize / 2,
          pos.y * cellSize + cellSize / 2,
          cellSize / 4,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
    }
    
    // Draw start and end points
    // Start point (green)
    ctx.fillStyle = 'rgba(16, 185, 129, 0.8)'; // Green
    ctx.beginPath();
    ctx.arc(
      startPosition.x * cellSize + cellSize / 2,
      startPosition.y * cellSize + cellSize / 2,
      cellSize / 2,
      0,
      Math.PI * 2
    );
    ctx.fill();
    
    // End point (red)
    ctx.fillStyle = 'rgba(239, 68, 68, 0.8)'; // Red
    ctx.beginPath();
    ctx.arc(
      endPosition.x * cellSize + cellSize / 2,
      endPosition.y * cellSize + cellSize / 2,
      cellSize / 2,
      0,
      Math.PI * 2
    );
    ctx.fill();
    
  }, [visited, path, gridWidth, gridHeight, cellSize, startPosition, endPosition]);
  
  return (
    <canvas
      ref={canvasRef}
      width={gridWidth * cellSize}
      height={gridHeight * cellSize}
      className="absolute top-0 left-0 pointer-events-none"
    />
  );
};

export default PathRenderer;