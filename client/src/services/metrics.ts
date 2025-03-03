import api from './api';

export interface AlgorithmMetrics {
  id: string;
  name: string;
  averageExecutionTime: number;
  averageNodesExplored: number;
  averageMemoryUsed: number;
  successRate: number;
}

export async function getAlgorithmMetrics(): Promise<AlgorithmMetrics[]> {
  try {
    const response = await api.get('/metrics/algorithms');
    return response.data;
  } catch (error) {
    console.error('Error fetching algorithm metrics:', error);
    throw error;
  }
}