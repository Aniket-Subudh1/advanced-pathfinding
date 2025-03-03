import { BadRequestError, ValidationError } from './errors';
import { 
  AlgorithmOptions, 
  AlgorithmType, 
  GridData, 
  Position 
} from 'shared/src/types';
import { algorithms } from '../config/algorithm-config';

export function validateAlgorithmRequest(
  algorithm: any, 
  grid: any, 
  start: any, 
  end: any, 
  options: any
): void {
  const errors: Record<string, string[]> = {};
  
  // Validate algorithm
  if (!algorithm) {
    errors.algorithm = ['Algorithm is required'];
  } else if (!Object.keys(algorithms).includes(algorithm)) {
    errors.algorithm = [`Invalid algorithm: ${algorithm}`];
  }
  
  // Validate grid
  if (!grid) {
    errors.grid = ['Grid is required'];
  } else {
    if (!grid.width || typeof grid.width !== 'number') {
      errors.grid = [...(errors.grid || []), 'Grid width is required and must be a number'];
    }
    if (!grid.height || typeof grid.height !== 'number') {
      errors.grid = [...(errors.grid || []), 'Grid height is required and must be a number'];
    }
    if (!Array.isArray(grid.cells)) {
      errors.grid = [...(errors.grid || []), 'Grid cells are required and must be an array'];
    } else if (grid.cells.length !== grid.width * grid.height) {
      errors.grid = [...(errors.grid || []), 'Grid cells length must match width * height'];
    }
  }
  
  // Validate start position
  if (!start) {
    errors.start = ['Start position is required'];
  } else {
    if (typeof start.x !== 'number' || start.x < 0 || start.x >= (grid?.width || 0)) {
      errors.start = [...(errors.start || []), 'Start x position is invalid'];
    }
    if (typeof start.y !== 'number' || start.y < 0 || start.y >= (grid?.height || 0)) {
      errors.start = [...(errors.start || []), 'Start y position is invalid'];
    }
  }
  
  // Validate end position
  if (!end) {
    errors.end = ['End position is required'];
  } else {
    if (typeof end.x !== 'number' || end.x < 0 || end.x >= (grid?.width || 0)) {
      errors.end = [...(errors.end || []), 'End x position is invalid'];
    }
    if (typeof end.y !== 'number' || end.y < 0 || end.y >= (grid?.height || 0)) {
      errors.end = [...(errors.end || []), 'End y position is invalid'];
    }
  }
  
  // Validate options
  if (options) {
    if (typeof options.allowDiagonal !== 'undefined' && typeof options.allowDiagonal !== 'boolean') {
      errors.options = [...(errors.options || []), 'allowDiagonal must be a boolean'];
    }
    
    const validHeuristics = ['manhattan', 'euclidean', 'diagonal'];
    if (options.heuristic && !validHeuristics.includes(options.heuristic)) {
      errors.options = [...(errors.options || []), `heuristic must be one of: ${validHeuristics.join(', ')}`];
    }
    
    if (options.weight && (typeof options.weight !== 'number' || options.weight <= 0)) {
      errors.options = [...(errors.options || []), 'weight must be a positive number'];
    }
    
    if (typeof options.bidirectional !== 'undefined' && typeof options.bidirectional !== 'boolean') {
      errors.options = [...(errors.options || []), 'bidirectional must be a boolean'];
    }
    
    if (typeof options.tieBreaker !== 'undefined' && typeof options.tieBreaker !== 'boolean') {
      errors.options = [...(errors.options || []), 'tieBreaker must be a boolean'];
    }
  }
  
  // Throw validation error if any errors were found
  if (Object.keys(errors).length > 0) {
    throw new ValidationError('Validation failed', errors);
  }
}