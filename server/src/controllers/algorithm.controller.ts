import { Request, Response, NextFunction } from 'express';
import { algorithmService } from '../services';
import { logger } from '../utils';
import { AlgorithmType } from '../types';

const algorithms = {
  'astar': {
    id: 'astar',
    name: 'A* Algorithm',
    description: 'A widely used pathfinding algorithm that uses heuristics.',
    complexityTime: 'O(E log V)',
    complexitySpace: 'O(V)',
    color: '#8b5cf6'  
  },
  'jps': {
    id: 'jps',
    name: 'Jump Point Search',
    description: 'An optimization of A* for uniform-cost grids.',
    complexityTime: 'O(E log V)',
    complexitySpace: 'O(V)',
    color: '#ec4899'  
  },
  'bts': {
    id: 'bts',
    name: 'Bidirectional Theta*',
    description: 'A bidirectional version of Theta*.',
    complexityTime: 'O(E log V)',
    complexitySpace: 'O(V)',
    color: '#f59e0b'  
  },
  'flowfield': {
    id: 'flowfield',
    name: 'Flow Field Pathfinding',
    description: 'Creates a vector field for multiple agents.',
    complexityTime: 'O(V)',
    complexitySpace: 'O(V)',
    color: '#10b981'  
  },
  'hpa': {
    id: 'hpa',
    name: 'Hierarchical Pathfinding A*',
    description: 'A multi-level pathfinding approach.',
    complexityTime: 'O(E log V)',
    complexitySpace: 'O(V + A)',
    color: '#3b82f6'  
  }
};


export const executeAlgorithm = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { algorithm, grid, start, end, options } = req.body;
    
    logger.info(`Executing algorithm: ${algorithm}`, { options });
    
    const result = await algorithmService.executeAlgorithm(
      algorithm,
      grid,
      start,
      end,
      options
    );
    
    return res.json(result);
  } catch (error) {
    next(error);
  }
};


export const listAlgorithms = (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const algorithmList = Object.values(algorithms);
    return res.json(algorithmList);
  } catch (error) {
    next(error);
  }
};


export const getAlgorithmDetails = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    
    if (!algorithms[id as AlgorithmType]) {
      return res.status(404).json({ error: `Algorithm ${id} not found` });
    }
    
    return res.json(algorithms[id as AlgorithmType]);
  } catch (error) {
    next(error);
  }
};
