import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

export const requestLogger = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const { method, path, params, query, body } = req;
  
  logger.info(`Request received: ${method} ${path}`, {
    params,
    query,
    body: process.env.NODE_ENV !== 'production' ? body : undefined
  });
  
  next();
};