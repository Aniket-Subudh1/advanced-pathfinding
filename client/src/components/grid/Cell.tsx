import React from 'react';
import { CellType } from '@/types';
import { getCellColor } from '@/utils/colors';

interface CellProps {
  x: number;
  y: number;
  type: CellType;
  size?: number;
  onClick?: (x: number, y: number) => void;
  onMouseDown?: (x: number, y: number) => void;
  onMouseEnter?: (x: number, y: number) => void;
}

const Cell: React.FC<CellProps> = ({
  x,
  y,
  type,
  size = 25,
  onClick,
  onMouseDown,
  onMouseEnter
}) => {
  const handleClick = () => {
    if (onClick) onClick(x, y);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    // Prevent default to avoid text selection during drag
    e.preventDefault();
    if (onMouseDown) onMouseDown(x, y);
  };

  const handleMouseEnter = () => {
    if (onMouseEnter) onMouseEnter(x, y);
  };

  const cellColor = getCellColor(type);

  // Add special styling for start and end cells
  let content = null;
  if (type === 'start') {
    content = (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-2/3 h-2/3">
        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm0 8.625a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25zM15.375 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zM7.5 10.875a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25z" clipRule="evenodd" />
      </svg>
    );
  } else if (type === 'end') {
    content = (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-2/3 h-2/3">
        <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
      </svg>
    );
  }

  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: cellColor,
        transition: 'background-color 0.2s'
      }}
      className="grid-cell flex items-center justify-center"
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseEnter={handleMouseEnter}
    >
      {content}
    </div>
  );
};

export default Cell;