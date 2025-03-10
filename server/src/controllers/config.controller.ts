import { Request, Response, NextFunction } from 'express';

// Default algorithm options
const defaultAlgorithmOptions = {
  allowDiagonal: true,
  heuristic: 'manhattan',
  weight: 1.0,
  bidirectional: false,
  tieBreaker: true
};


export const getDefaultOptions = (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    return res.json(defaultAlgorithmOptions);
  } catch (error) {
    next(error);
  }
};
