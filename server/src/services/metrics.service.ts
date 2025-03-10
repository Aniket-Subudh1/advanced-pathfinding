import { AlgorithmType } from 'shared/src/types';
import { AlgorithmMetricsData, AlgorithmMetricsStore } from '../models/algorithm.model';
import { logger } from '../utils';


export const getAllMetrics = (): AlgorithmMetricsData[] => {
  const metrics = AlgorithmMetricsStore.getInstance().getMetrics();
  logger.info(`Fetching metrics for all algorithms: ${metrics.length} records found`);
  return metrics;
};


export const getMetricsForAlgorithm = (algorithmId: AlgorithmType): AlgorithmMetricsData | undefined => {
  const metrics = AlgorithmMetricsStore.getInstance().getMetricsForAlgorithm(algorithmId);
  logger.info(`Fetching metrics for algorithm ${algorithmId}: ${metrics ? 'found' : 'not found'}`);
  return metrics;
};