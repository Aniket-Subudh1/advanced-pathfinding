import { AlgorithmType } from '../types';

export interface AlgorithmMetricsData {
  id: AlgorithmType;
  name: string;
  totalExecutions: number;
  averageExecutionTime: number;
  averageNodesExplored: number;
  averageMemoryUsed: number;
  successRate: number;
}

// In-memory store for algorithm metrics
class AlgorithmMetricsStore {
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

  public getMetrics(): AlgorithmMetricsData[] {
    return Array.from(this.metrics.values());
  }

  public getMetricsForAlgorithm(algorithmId: AlgorithmType): AlgorithmMetricsData | undefined {
    return this.metrics.get(algorithmId);
  }
}

/**
 * Get metrics for all algorithms
 */
export const getAllMetrics = (): AlgorithmMetricsData[] => {
  return AlgorithmMetricsStore.getInstance().getMetrics();
};

/**
 * Get metrics for a specific algorithm
 */
export const getMetricsForAlgorithm = (algorithmId: AlgorithmType): AlgorithmMetricsData | undefined => {
  return AlgorithmMetricsStore.getInstance().getMetricsForAlgorithm(algorithmId);
};
