import React from 'react';
import { AlgorithmResult } from '@/types';
import { formatTime } from '@/utils/timing';

interface MetricsPanelProps {
  result: AlgorithmResult | null;
  algorithmName: string;
}

const MetricsPanel: React.FC<MetricsPanelProps> = ({ result, algorithmName }) => {
  if (!result) {
    return (
      <div className="bg-white p-4 rounded-lg border border-gray-200 text-center text-gray-500">
        Run the algorithm to see performance metrics
      </div>
    );
  }

  const { metrics } = result;

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <h3 className="text-lg font-medium text-gray-900 mb-3">Performance Metrics: {algorithmName}</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 p-3 rounded-md">
          <div className="text-sm text-gray-500">Execution Time</div>
          <div className="text-lg font-semibold">{formatTime(metrics.executionTimeMs)}</div>
        </div>
        
        <div className="bg-gray-50 p-3 rounded-md">
          <div className="text-sm text-gray-500">Nodes Explored</div>
          <div className="text-lg font-semibold">{metrics.nodesExplored.toLocaleString()}</div>
        </div>
        
        <div className="bg-gray-50 p-3 rounded-md">
          <div className="text-sm text-gray-500">Path Length</div>
          <div className="text-lg font-semibold">{metrics.pathLength.toLocaleString()} cells</div>
        </div>
        
        <div className="bg-gray-50 p-3 rounded-md">
          <div className="text-sm text-gray-500">Memory Used</div>
          <div className="text-lg font-semibold">{(metrics.memoryUsed / 1024).toFixed(2)} KB</div>
        </div>
      </div>
      
      <div className="mt-4 text-xs text-gray-500">
        <div className="flex justify-between">
          <span>Path found: {result.path.length > 0 ? 'Yes' : 'No'}</span>
          <span>Optimal: {result.path.length > 0 ? 'Yes' : 'N/A'}</span>
        </div>
      </div>
    </div>
  );
};

export default MetricsPanel;