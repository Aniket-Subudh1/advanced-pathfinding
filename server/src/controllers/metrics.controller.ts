
import { Request, Response, NextFunction } from 'express';
import { getAllMetrics, getMetricsForAlgorithm } from '../services/metrics.service';
import { AlgorithmType } from 'shared/src/types';
import { logger } from '../utils';


export const getAlgorithmMetrics = (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const metrics = getAllMetrics();
    logger.info(`Returning metrics for all algorithms: ${metrics.length} records`);
    return res.json(metrics);
  } catch (error) {
    logger.error('Error getting algorithm metrics:', error);
    next(error);
  }
};


export const getAlgorithmMetricsById = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const metrics = getMetricsForAlgorithm(id as AlgorithmType);
    
    if (!metrics) {
      return res.status(404).json({ error: `Metrics for algorithm ${id} not found` });
    }
    
    return res.json(metrics);
  } catch (error) {
    logger.error(`Error getting metrics for algorithm ${req.params.id}:`, error);
    next(error);
  }
};