import { Request, Response, NextFunction } from 'express';
import { validateAlgorithmRequest } from '../utils/validation';

export const validateAlgorithmExecution = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const { algorithm, grid, start, end, options } = req.body;
    
    validateAlgorithmRequest(algorithm, grid, start, end, options);
    
    next();
  } catch (error) {
    next(error);
  }
};