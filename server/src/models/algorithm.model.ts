// We'll use the types from the shared library
import { 
    AlgorithmType, 
    AlgorithmOptions, 
    AlgorithmResult 
  } from 'shared/src/types';
  
  // Define additional types used specifically on the server
  
  export interface AlgorithmExecutionResult extends AlgorithmResult {
    algorithmId: AlgorithmType;
    options: AlgorithmOptions;
    executionId: string;
    timestamp: Date;
    success: boolean;
  }
  
  export interface AlgorithmExecutionRequest {
    algorithm: AlgorithmType;
    grid: any;
    start: { x: number, y: number };
    end: { x: number, y: number };
    options: AlgorithmOptions;
  }
  
  export interface AlgorithmMetricsData {
    id: AlgorithmType;
    name: string;
    totalExecutions: number;
    averageExecutionTime: number;
    averageNodesExplored: number;
    averageMemoryUsed: number;
    successRate: number;
  }
  
  // Store for algorithm metrics (in-memory)
  export class AlgorithmMetricsStore {
    private static instance: AlgorithmMetricsStore;
    private metrics: Map<AlgorithmType, AlgorithmMetricsData> = new Map();
  
    private constructor() {
      // Initialize with empty metrics for all algorithm types
      const algorithmTypes: AlgorithmType[] = ['astar', 'jps', 'bts', 'flowfield', 'hpa'];
      algorithmTypes.forEach(type => {
        this.metrics.set(type, {
          id: type,
          name: this.getAlgorithmName(type),
          totalExecutions: 0,
          averageExecutionTime: 0,
          averageNodesExplored: 0,
          averageMemoryUsed: 0,
          successRate: 100
        });
      });
    }
  
    public static getInstance(): AlgorithmMetricsStore {
      if (!AlgorithmMetricsStore.instance) {
        AlgorithmMetricsStore.instance = new AlgorithmMetricsStore();
      }
      return AlgorithmMetricsStore.instance;
    }
  
    private getAlgorithmName(type: AlgorithmType): string {
      const names: Record<AlgorithmType, string> = {
        'astar': 'A* Algorithm',
        'jps': 'Jump Point Search',
        'bts': 'Bidirectional Theta*',
        'flowfield': 'Flow Field',
        'hpa': 'Hierarchical A*'
      };
      return names[type];
    }
  
    public recordExecution(result: AlgorithmExecutionResult): void {
      const { algorithmId, metrics, success } = result;
      const currentMetrics = this.metrics.get(algorithmId);
  
      if (currentMetrics) {
        const totalExec = currentMetrics.totalExecutions + 1;
        const successRate = ((currentMetrics.successRate * currentMetrics.totalExecutions) + (success ? 100 : 0)) / totalExec;
  
        // Update with weighted average
        this.metrics.set(algorithmId, {
          ...currentMetrics,
          totalExecutions: totalExec,
          averageExecutionTime: this.calculateNewAverage(
            currentMetrics.averageExecutionTime, 
            metrics.executionTimeMs, 
            totalExec
          ),
          averageNodesExplored: this.calculateNewAverage(
            currentMetrics.averageNodesExplored, 
            metrics.nodesExplored, 
            totalExec
          ),
          averageMemoryUsed: this.calculateNewAverage(
            currentMetrics.averageMemoryUsed, 
            metrics.memoryUsed, 
            totalExec
          ),
          successRate
        });
      }
    }
  
    private calculateNewAverage(currentAvg: number, newValue: number, totalCount: number): number {
      return ((currentAvg * (totalCount - 1)) + newValue) / totalCount;
    }
  
    public getMetrics(): AlgorithmMetricsData[] {
      return Array.from(this.metrics.values());
    }
  
    public getMetricsForAlgorithm(algorithmId: AlgorithmType): AlgorithmMetricsData | undefined {
      return this.metrics.get(algorithmId);
    }
  }