import { 
  GridData, 
  Position, 
  AlgorithmOptions, 
  AlgorithmResult 
} from '../../../../shared/src/types';
import { astar } from '../../../../shared/src/algorithms';

export async function runAstar(
  grid: GridData,
  start: Position,
  end: Position,
  options: AlgorithmOptions
): Promise<AlgorithmResult> {
  return astar(grid, start, end, options);
}

