import { Request, Response, NextFunction } from 'express';
import { metricsService } from '../services';
import { AlgorithmType } from '../types';

/**
 * Get metrics for all algorithms
 */
export const getAlgorithmMetrics = (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const metrics = metricsService.getAllMetrics();
    return res.json(metrics);
  } catch (error) {
    next(error);
  }
};

/**
 * Get metrics for a specific algorithm
 */
export const getAlgorithmMetricsById = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const metrics = metricsService.getMetricsForAlgorithm(id as AlgorithmType);
    
    if (!metrics) {
      return res.status(404).json({ error: `Metrics for algorithm ${id} not found` });
    }
    
    return res.json(metrics);
  } catch (error) {
    next(error);
  }
};
