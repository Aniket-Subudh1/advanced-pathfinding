import api from './api';
import { AlgorithmType } from '@/types';

export interface AlgorithmMetricsData {
  id: AlgorithmType;
  name: string;
  totalExecutions: number;
  averageExecutionTime: number;
  averageNodesExplored: number;
  averageMemoryUsed: number;
  successRate: number;
}

export async function getAlgorithmMetrics(): Promise<AlgorithmMetricsData[]> {
  try {
    console.log("Fetching algorithm metrics from API");
    const response = await api.get('/metrics/algorithms');
    console.log("Received metrics:", response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching algorithm metrics:', error);
    throw error;
  }
}