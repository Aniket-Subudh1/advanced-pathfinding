import React, { useEffect, useRef, useState } from 'react';
import { AlgorithmMetricsData } from '@/services/metrics';

interface PerformanceChartProps {
  metrics: AlgorithmMetricsData[];
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({ metrics }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeMetric, setActiveMetric] = useState<'time' | 'nodes' | 'memory'>('time');
  
  const algorithmColors = {
    'astar': '#8b5cf6', 
    'jps': '#ec4899',   
    'bts': '#f59e0b',   
    'flowfield': '#10b981', 
    'hpa': '#3b82f6'    
  };
  
  // Format time values for display
  const formatTime = (milliseconds: number): string => {
    if (milliseconds < 1) {
      return `${(milliseconds * 1000).toFixed(2)} μs`;
    }
    if (milliseconds < 1000) {
      return `${milliseconds.toFixed(2)} ms`;
    }
    return `${(milliseconds / 1000).toFixed(2)} s`;
  };

  useEffect(() => {
    console.log("Current metrics data:", metrics);
    
    // Get the canvas context
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Use a smaller render function for clarity
    const renderChart = () => {
      // Clear previous render
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // If no metrics data, just draw the axes
      if (metrics.length === 0) {
        drawAxes(ctx, canvas.width, canvas.height);
        return;
      }
      
      // Get values based on active metric
      const values = metrics.map(m => {
        switch (activeMetric) {
          case 'time': return m.averageExecutionTime || 0;
          case 'nodes': return m.averageNodesExplored || 0;
          case 'memory': return m.averageMemoryUsed || 0;
          default: return 0;
        }
      });
      
      // Draw the chart
      drawAxes(ctx, canvas.width, canvas.height);
      drawBars(ctx, metrics, values, canvas.width, canvas.height);
      drawYAxisTitle(ctx, canvas.height, activeMetric);
    };
    
    // Draw axes
    const drawAxes = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      ctx.beginPath();
      ctx.moveTo(40, 10);
      ctx.lineTo(40, height - 30);
      ctx.lineTo(width - 10, height - 30);
      ctx.strokeStyle = '#9CA3AF';
      ctx.lineWidth = 1;
      ctx.stroke();
    };
    
    // Draw bars
    const drawBars = (
      ctx: CanvasRenderingContext2D, 
      metrics: AlgorithmMetricsData[], 
      values: number[], 
      width: number, 
      height: number
    ) => {
      const maxValue = Math.max(...values, 0.01);
      const barWidth = (width - 60) / Math.max(metrics.length, 1);
      const barMargin = 10;
      
      metrics.forEach((metric, i) => {
        const value = values[i];
        const barHeight = Math.max((value / maxValue) * (height - 50), 1); 
        const x = 50 + i * (barWidth + barMargin);
        const y = height - 30 - barHeight;
        
        // Draw bar
        const colorKey = metric.id as keyof typeof algorithmColors;
        ctx.fillStyle = algorithmColors[colorKey] || '#3B82F6';
        ctx.fillRect(x, y, barWidth - barMargin, barHeight);
        
        // Draw algorithm name
        ctx.fillStyle = '#1F2937';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        const name = metric.name?.split(' ')[0] || metric.id;
        ctx.fillText(name, x + (barWidth - barMargin) / 2, height - 15);
        
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
    };
    
    // Draw Y-axis title
    const drawYAxisTitle = (
      ctx: CanvasRenderingContext2D, 
      height: number, 
      activeMetric: string
    ) => {
      ctx.save();
      ctx.translate(15, height / 2);
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
    };
    
    // Initial render
    renderChart();
    
  }, [metrics, activeMetric]);
  
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">Algorithm Comparison</h3>
        
        <div className="flex space-x-2">
          <button 
            className={`px-2 py-1 text-xs rounded-md ${activeMetric === 'time' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
            onClick={() => setActiveMetric('time')}
          >
            Time
          </button>
          <button 
            className={`px-2 py-1 text-xs rounded-md ${activeMetric === 'nodes' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
            onClick={() => setActiveMetric('nodes')}
          >
            Nodes
          </button>
          <button 
            className={`px-2 py-1 text-xs rounded-md ${activeMetric === 'memory' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
            onClick={() => setActiveMetric('memory')}
          >
            Memory
          </button>
        </div>
      </div>
      
      <div className="relative h-64">
        {metrics.every(m => m.totalExecutions === 0) && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-500">
            Run algorithms to see comparison data
          </div>
        )}
        <canvas
          ref={canvasRef}
          width={500}
          height={250}
          style={{ width: '100%', height: '100%' }}
        />
      </div>
    </div>
  );
};

export default PerformanceChart;