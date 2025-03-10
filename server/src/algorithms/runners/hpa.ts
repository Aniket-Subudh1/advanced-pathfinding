import { 
    GridData, 
    Position, 
    AlgorithmOptions, 
    AlgorithmResult 
  } from '../../../../shared/src/types';
  import { hierarchicalPathfinding } from '../../../../shared/src/algorithms';
 
  export async function runHPA(
    grid: GridData,
    start: Position,
    end: Position,
    options: AlgorithmOptions
  ): Promise<AlgorithmResult> {
    return hierarchicalPathfinding(grid, start, end, options);
  }
  