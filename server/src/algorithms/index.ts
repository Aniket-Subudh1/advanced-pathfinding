import { AlgorithmType, GridData, Position, AlgorithmOptions, AlgorithmResult } from '../../../shared/src/types';
import { runAstar } from './runners/astar';
import { runJPS } from './runners/jps';
import { runBidirectionalTheta } from './runners/bidirectional-theta';
import { runFlowField } from './runners/flowfield';
import { runHPA } from './runners/hpa';


export async function runAlgorithm(
  algorithmId: AlgorithmType,
  grid: GridData,
  start: Position,
  end: Position,
  options: AlgorithmOptions
): Promise<AlgorithmResult> {
  switch (algorithmId) {
    case 'astar':
      return await runAstar(grid, start, end, options);
    case 'jps':
      return await runJPS(grid, start, end, options);
    case 'bts':
      return await runBidirectionalTheta(grid, start, end, options);
    case 'flowfield':
      return await runFlowField(grid, start, end, options);
    case 'hpa':
      return await runHPA(grid, start, end, options);
    default:
      throw new Error(`Algorithm ${algorithmId} not found`);
  }
}