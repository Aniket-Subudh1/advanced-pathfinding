import { astar } from './astar';
import { jumpPointSearch } from './jumppoint';
import { bidirectionalTheta } from './bidirectional';
import { flowField } from './flowfield';
import { hierarchicalPathfinding } from './hierarchical';

import { 
  GridData, 
  Position, 
  AlgorithmOptions, 
  AlgorithmResult, 
  AlgorithmType 
} from '../types';


export function executeAlgorithm(
  algorithm: AlgorithmType,
  gridData: GridData,
  start: Position,
  end: Position,
  options: AlgorithmOptions
): AlgorithmResult {
  switch (algorithm) {
    case 'astar':
      return astar(gridData, start, end, options);
    case 'jps':
      return jumpPointSearch(gridData, start, end, options);
    case 'bts':
      return bidirectionalTheta(gridData, start, end, options);
    case 'flowfield':
      return flowField(gridData, start, end, options);
    case 'hpa':
      return hierarchicalPathfinding(gridData, start, end, options);
    default:
      throw new Error(`Algorithm ${algorithm} not found`);
  }
}

export {
  astar,
  jumpPointSearch,
  bidirectionalTheta,
  flowField,
  hierarchicalPathfinding
};