import React, { useState } from 'react';
import { Button, Dropdown, Modal } from '@/components/shared';

interface GridControlsProps {
  onResetGrid: () => void;
  onClearPath: () => void;
  onGenerateMaze: (density: number) => void;
  onResizeGrid: (width: number, height: number) => void;
  isAlgorithmRunning: boolean;
}

const GridControls: React.FC<GridControlsProps> = ({
  onResetGrid,
  onClearPath,
  onGenerateMaze,
  onResizeGrid,
  isAlgorithmRunning
}) => {
  const [isResizeModalOpen, setIsResizeModalOpen] = useState(false);
  const [gridWidth, setGridWidth] = useState(20);
  const [gridHeight, setGridHeight] = useState(20);
  const [mazeDensity, setMazeDensity] = useState(30);

  const handleResizeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onResizeGrid(gridWidth, gridHeight);
    setIsResizeModalOpen(false);
  };

  return (
    <div className="flex flex-wrap gap-2 items-center mb-4">
      <Button
        onClick={onResetGrid}
        disabled={isAlgorithmRunning}
        variant="outline"
      >
        Reset Grid
      </Button>
      
      <Button
        onClick={onClearPath}
        disabled={isAlgorithmRunning}
        variant="outline"
      >
        Clear Path
      </Button>
      
      <Button
        onClick={() => onGenerateMaze(mazeDensity)}
        disabled={isAlgorithmRunning}
        variant="outline"
      >
        Generate Maze
      </Button>
      
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-700">Density:</span>
        <input
          type="range"
          min="10"
          max="50"
          value={mazeDensity}
          onChange={(e) => setMazeDensity(parseInt(e.target.value))}
          disabled={isAlgorithmRunning}
          className="w-24"
        />
        <span className="text-sm text-gray-700">{mazeDensity}%</span>
      </div>
      
      <Button
        onClick={() => setIsResizeModalOpen(true)}
        disabled={isAlgorithmRunning}
        variant="outline"
      >
        Resize Grid
      </Button>
      
      {/* Resize Modal */}
      <Modal
        isOpen={isResizeModalOpen}
        onClose={() => setIsResizeModalOpen(false)}
        title="Resize Grid"
        size="sm"
      >
        <form onSubmit={handleResizeSubmit}>
          <div className="mb-4">
            <label htmlFor="gridWidth" className="block text-sm font-medium text-gray-700 mb-1">
              Width
            </label>
            <input
              type="number"
              id="gridWidth"
              value={gridWidth}
              onChange={(e) => setGridWidth(Math.max(5, Math.min(50, parseInt(e.target.value) || 20)))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              min="5"
              max="50"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="gridHeight" className="block text-sm font-medium text-gray-700 mb-1">
              Height
            </label>
            <input
              type="number"
              id="gridHeight"
              value={gridHeight}
              onChange={(e) => setGridHeight(Math.max(5, Math.min(50, parseInt(e.target.value) || 20)))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              min="5"
              max="50"
            />
          </div>
          
          <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
            <Button
              type="submit"
              variant="primary"
            >
              Apply
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsResizeModalOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default GridControls;