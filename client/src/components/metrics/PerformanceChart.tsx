import React, { useEffect, useRef, useState } from 'react';
import { AlgorithmMetrics } from '@/services/metrics';
import { formatTime } from '@/utils/timing';
import { algorithmColors } from '@/utils/colors';

interface PerformanceChartProps {
  metrics: AlgorithmMetrics[];
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({ metrics }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeMetric, setActiveMetric] = useState<'time' | 'nodes' | 'memory'>('time');
  
  useEffect(() => {
    if (!canvasRef.current || metrics.length === 0) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Get data based on active metric
    const values = metrics.map(m => {
      switch (activeMetric) {
        case 'time': return m.averageExecutionTime;
        case 'nodes': return m.averageNodesExplored;
        case 'memory': return m.averageMemoryUsed;
        default: return m.averageExecutionTime;
      }
    });
    
    const maxValue = Math.max(...values);
    const barWidth = (canvas.width - 60) / metrics.length;
    const barMargin = 10;
    
    // Draw axes
    ctx.beginPath();
    ctx.moveTo(40, 10);
    ctx.lineTo(40, canvas.height - 30);
    ctx.lineTo(canvas.width - 10, canvas.height - 30);
    ctx.strokeStyle = '#9CA3AF';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // Draw bars
    metrics.forEach((metric, i) => {
      const value = values[i];
      const barHeight = ((value / maxValue) || 0) * (canvas.height - 50);
      const x = 50 + i * (barWidth + barMargin);
      const y = canvas.height - 30 - barHeight;
      
      // Draw bar
      ctx.fillStyle = algorithmColors[metric.id as keyof typeof algorithmColors] || '#3B82F6';
      ctx.fillRect(x, y, barWidth - barMargin, barHeight);
      
      // Draw label
      ctx.fillStyle = '#1F2937';
      ctx.font = '10px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(metric.name.split(' ')[0], x + (barWidth - barMargin) / 2, canvas.height - 15);
      
      // Draw value
      ctx.fillStyle = '#4B5563';
      ctx.font = '9px Arial';
      ctx.textAlign = 'center';
      let displayValue = '';
      switch (activeMetric) {
        case 'time': 
          displayValue = formatTime(value);
          break;
        case 'nodes': 
          displayValue = value > 1000 ? `${(value / 1000).toFixed(1)}K` : value.toFixed(0);
          break;
        case 'memory': 
          displayValue = `${(value / 1024).toFixed(1)}KB`;
          break;
      }
      ctx.fillText(displayValue, x + (barWidth - barMargin) / 2, y - 5);
    });
    
    // Draw y-axis title
    ctx.save();
    ctx.translate(15, canvas.height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = '#4B5563';
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';
    
    let yAxisTitle = '';
    switch (activeMetric) {
      case 'time': yAxisTitle = 'Execution Time'; break;
      case 'nodes': yAxisTitle = 'Nodes Explored'; break;
      case 'memory': yAxisTitle = 'Memory Used'; break;
    }
    
    ctx.fillText(yAxisTitle, 0, 0);
    ctx.restore();
    
  }, [metrics, activeMetric]);
  
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">Algorithm Comparison</h3>
        
        <div className="flex space-x-2">
          <button 
            className={`px-2 py-1 text-xs rounded-md ${activeMetric === 'time' ? 'bg-primary-100 text-primary-800' : 'bg-gray-100 text-gray-800'}`}
            onClick={() => setActiveMetric('time')}
          >
            Time
          </button>
          <button 
            className={`px-2 py-1 text-xs rounded-md ${activeMetric === 'nodes' ? 'bg-primary-100 text-primary-800' : 'bg-gray-100 text-gray-800'}`}
            onClick={() => setActiveMetric('nodes')}
          >
            Nodes
          </button>
          <button 
            className={`px-2 py-1 text-xs rounded-md ${activeMetric === 'memory' ? 'bg-primary-100 text-primary-800' : 'bg-gray-100 text-gray-800'}`}
            onClick={() => setActiveMetric('memory')}
          >
            Memory
          </button>
        </div>
      </div>
      
      {metrics.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-gray-500">
          Run algorithms to see comparison data
        </div>
      ) : (
        <canvas
          ref={canvasRef}
          width={500}
          height={250}
          className="w-full h-64"
        />
      )}
    </div>
  );
};

export default PerformanceChart;