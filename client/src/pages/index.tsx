import React, { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import { AlgorithmSelector, ConfigPanel } from '@/components/algorithm-controls';
import { Grid, GridControls } from '@/components/grid';
import { MetricsPanel, PerformanceChart } from '@/components/metrics';
import { AnimationControls, PathRenderer } from '@/components/visualization';
import { useGrid, useAlgorithm, useVisualization } from '@/hooks';
import { getAlgorithmDetails, getAlgorithmMetrics } from '@/services';
import { AlgorithmInfo, AlgorithmMetrics } from '@/types';

export default function Home() {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [algorithmDetails, setAlgorithmDetails] = useState<AlgorithmInfo | null>(null);
  const [algorithmMetrics, setAlgorithmMetrics] = useState<AlgorithmMetrics[]>([]);
  const [cellSize, setCellSize] = useState(25);
  
  const {
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
  } = useGrid();
  
  const {
    selectedAlgorithm,
    options,
    isRunning,
    result,
    changeAlgorithm,
    updateOption,
    runAlgorithm
  } = useAlgorithm();
  
  const {
    isVisualizing,
    visualizationSpeed,
    currentStep,
    prepareVisualization,
    startVisualization,
    stopVisualization,
    resetVisualization,
    changeSpeed,
    getCurrentState
  } = useVisualization();
  
  // Fetch algorithm details when selected algorithm changes
  useEffect(() => {
    const fetchAlgorithmDetails = async () => {
      try {
        const details = await getAlgorithmDetails(selectedAlgorithm);
        setAlgorithmDetails(details);
      } catch (error) {
        console.error('Error fetching algorithm details:', error);
      }
    };
    
    fetchAlgorithmDetails();
  }, [selectedAlgorithm]);
  
  // Fetch algorithm metrics
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const metrics = await getAlgorithmMetrics();
        setAlgorithmMetrics(metrics);
      } catch (error) {
        console.error('Error fetching algorithm metrics:', error);
      }
    };
    
    fetchMetrics();
  }, []);
  
  // Callback for running the algorithm
  const handleRunAlgorithm = useCallback(async () => {
    try {
      resetVisualization();
      const algorithmResult = await runAlgorithm(grid);
      if (algorithmResult) {
        prepareVisualization(algorithmResult.visited, algorithmResult.path);
      }
    } catch (error) {
      console.error('Error running algorithm:', error);
    }
  }, [grid, runAlgorithm, resetVisualization, prepareVisualization]);
  
  // Update grid when visualization state changes
  useEffect(() => {
    const { visited, path } = getCurrentState();
    updateWithResults(path, visited);
  }, [currentStep, getCurrentState, updateWithResults]);
  
  return (
    <>
      <Head>
        <title>Advanced Pathfinding Visualization</title>
        <meta name="description" content="A sophisticated implementation of modern pathfinding algorithms" />
      </Head>
      
      <div className="min-h-screen bg-gray-50 py-6">
        <div className="container mx-auto px-4">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Advanced Pathfinding Visualization</h1>
            <p className="text-gray-600">
              Explore and compare sophisticated pathfinding algorithms
            </p>
          </header>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <AlgorithmSelector
                selectedAlgorithm={selectedAlgorithm}
                onSelectAlgorithm={changeAlgorithm}
                disabled={isRunning || isVisualizing}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <ConfigPanel
                  options={options}
                  onUpdateOption={updateOption}
                  onRunAlgorithm={handleRunAlgorithm}
                  isRunning={isRunning}
                  showAdvanced={showAdvanced}
                  onToggleAdvanced={() => setShowAdvanced(!showAdvanced)}
                />
                
                {result && (
                  <AnimationControls
                    isVisualizing={isVisualizing}
                    onStart={startVisualization}
                    onStop={stopVisualization}
                    onReset={resetVisualization}
                    currentStep={currentStep}
                    totalSteps={getCurrentState().totalSteps}
                    speed={visualizationSpeed}
                    onSpeedChange={changeSpeed}
                  />
                )}
              </div>
              
              <GridControls
                onResetGrid={resetGrid}
                onClearPath={resetPath}
                onGenerateMaze={generateMaze}
                onResizeGrid={resizeGrid}
                isAlgorithmRunning={isRunning || isVisualizing}
              />
              
              <div className="relative inline-block">
                <Grid
                  grid={grid}
                  onCellClick={handleCellClick}
                  onMouseDown={(x, y) => startDrawing(x, y, grid.cells[y * grid.width + x].type === 'wall' ? 'empty' : 'wall')}
                  onMouseUp={stopDrawing}
                  onMouseEnter={drawOnCell}
                  cellSize={cellSize}
                  className="mb-4"
                />
                
                {result && currentStep > 0 && (
                  <PathRenderer
                    visited={getCurrentState().visited}
                    path={getCurrentState().path}
                    gridWidth={grid.width}
                    gridHeight={grid.height}
                    cellSize={cellSize}
                    startPosition={grid.startPosition}
                    endPosition={grid.endPosition}
                  />
                )}
              </div>
              
              <div className="mb-4 flex items-center space-x-4">
                <label className="text-sm text-gray-700">Cell Size:</label>
                <input
                  type="range"
                  min="10"
                  max="40"
                  value={cellSize}
                  onChange={(e) => setCellSize(parseInt(e.target.value))}
                  className="w-32"
                />
                <span className="text-sm text-gray-700">{cellSize}px</span>
              </div>
            </div>
            
            <div>
              <div className="mb-6">
                <MetricsPanel
                  result={result}
                  algorithmName={algorithmDetails?.name || selectedAlgorithm}
                />
              </div>
              
              <div className="mb-6">
                <PerformanceChart metrics={algorithmMetrics} />
              </div>
              
              {algorithmDetails && (
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">About {algorithmDetails.name}</h3>
                  <p className="text-gray-600 mb-4">{algorithmDetails.description}</p>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Time Complexity:</span>{' '}
                      <span className="text-gray-600">{algorithmDetails.complexityTime}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Space Complexity:</span>{' '}
                      <span className="text-gray-600">{algorithmDetails.complexitySpace}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}