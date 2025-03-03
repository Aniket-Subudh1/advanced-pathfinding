import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/errors';
import logger from '../utils/logger';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  // Log the error
  logger.error(`Error processing request: ${err.message}`, {
    error: err.stack,
    path: req.path,
    method: req.method
  });
  
  // Handle specific error types
  if (err instanceof ApiError) {
    return res.status(err.status).json({
      error: {
        message: err.message,
        ...(err as any).errors && { errors: (err as any).errors }
      }
    });
  }
  
  // Handle unexpected errors
  return res.status(500).json({
    error: {
      message: 'An unexpected error occurred',
      ...(process.env.NODE_ENV !== 'production' && { originalError: err.message })
    }
  });
};