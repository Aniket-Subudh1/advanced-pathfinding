import { astar } from './runners/astar';
import { AlgorithmType, AlgorithmOptions, GridData, Position, AlgorithmResult } from 'shared/src/types';
import { NotFoundError } from '../utils';

/**
 * Run the specified algorithm
 */
export async function runAlgorithm(
  algorithmId: AlgorithmType,
  grid: GridData,
  start: Position,
  end: Position,
  options: AlgorithmOptions
): Promise<AlgorithmResult> {
  switch (algorithmId) {
    case 'astar':
      return await astar(grid, start, end, options);
    case 'jps':
      // Would implement JPS algorithm
      throw new NotFoundError('Jump Point Search algorithm not yet implemented');
    case 'bts':
      // Would implement Bidirectional Theta* algorithm
      throw new NotFoundError('Bidirectional Theta* algorithm not yet implemented');
    case 'flowfield':
      // Would implement Flow Field algorithm
      throw new NotFoundError('Flow Field algorithm not yet implemented');
    case 'hpa':
      // Would implement Hierarchical Pathfinding A* algorithm
      throw new NotFoundError('Hierarchical Pathfinding A* algorithm not yet implemented');
    default:
      throw new NotFoundError(`Algorithm ${algorithmId} not found`);
  }
}