import api from './api';
import { AlgorithmInfo, AlgorithmOptions, AlgorithmResult, GridData, Position } from '@/types';

export async function getAlgorithms(): Promise<AlgorithmInfo[]> {
  try {
    const response = await api.get('/algorithms/list');
    return response.data;
  } catch (error) {
    console.error('Error fetching algorithms:', error);
    throw error;
  }
}

export async function getAlgorithmDetails(id: string): Promise<AlgorithmInfo> {
  try {
    const response = await api.get(`/algorithms/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching algorithm details:', error);
    throw error;
  }
}

export async function executeAlgorithm(
  algorithm: string,
  grid: GridData,
  start: Position,
  end: Position,
  options: AlgorithmOptions
): Promise<AlgorithmResult> {
  try {
    const response = await api.post('/algorithms/execute', {
      algorithm,
      grid,
      start,
      end,
      options,
    });
    return response.data;
  } catch (error) {
    console.error('Error executing algorithm:', error);
    throw error;
  }
}