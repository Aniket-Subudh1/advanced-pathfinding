import React from 'react';
import { AlgorithmOptions } from '@/types';
import { Button, Dropdown } from '@/components/shared';

interface ConfigPanelProps {
  options: AlgorithmOptions;
  onUpdateOption: <K extends keyof AlgorithmOptions>(key: K, value: AlgorithmOptions[K]) => void;
  onRunAlgorithm: () => void;
  isRunning: boolean;
  showAdvanced?: boolean;
  onToggleAdvanced?: () => void;
}

const ConfigPanel: React.FC<ConfigPanelProps> = ({
  options,
  onUpdateOption,
  onRunAlgorithm,
  isRunning,
  showAdvanced = false,
  onToggleAdvanced
}) => {
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">Algorithm Configuration</h3>
        {onToggleAdvanced && (
          <button
            onClick={onToggleAdvanced}
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            {showAdvanced ? 'Hide Advanced' : 'Show Advanced'}
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Heuristic
          </label>
          <Dropdown
            options={[
              { value: 'manhattan', label: 'Manhattan Distance' },
              { value: 'euclidean', label: 'Euclidean Distance' },
              { value: 'diagonal', label: 'Diagonal Distance' }
            ]}
            value={options.heuristic}
            onChange={(value) => onUpdateOption('heuristic', value as AlgorithmOptions['heuristic'])}
            disabled={isRunning}
          />
        </div>
        
        <div>
          <label className="flex items-center space-x-2 mb-4">
            <input
              type="checkbox"
              checked={options.allowDiagonal}
              onChange={(e) => onUpdateOption('allowDiagonal', e.target.checked)}
              disabled={isRunning}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <span className="text-sm font-medium text-gray-700">Allow Diagonal Movement</span>
          </label>
        </div>
        
        {showAdvanced && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Heuristic Weight: {options.weight}
              </label>
              <input
                type="range"
                min="0.5"
                max="5"
                step="0.1"
                value={options.weight}
                onChange={(e) => onUpdateOption('weight', parseFloat(e.target.value))}
                disabled={isRunning}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Exact (0.5)</span>
                <span>Balanced (1)</span>
                <span>Greedy (5)</span>
              </div>
            </div>
            
            <div>
              <label className="flex items-center space-x-2 mb-2">
                <input
                  type="checkbox"
                  checked={options.bidirectional}
                  onChange={(e) => onUpdateOption('bidirectional', e.target.checked)}
                  disabled={isRunning}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <span className="text-sm font-medium text-gray-700">Use Bidirectional Search</span>
              </label>
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={options.tieBreaker}
                  onChange={(e) => onUpdateOption('tieBreaker', e.target.checked)}
                  disabled={isRunning}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <span className="text-sm font-medium text-gray-700">Use Tie-Breaking</span>
              </label>
            </div>
          </>
        )}
      </div>
      
      <Button
        onClick={onRunAlgorithm}
        disabled={isRunning}
        className="w-full py-3"
      >
        {isRunning ? (
          <div className="flex items-center justify-center space-x-2">
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Running Algorithm...</span>
          </div>
        ) : (
          'Run Algorithm'
        )}
      </Button>
    </div>
  );
};

export default ConfigPanel;