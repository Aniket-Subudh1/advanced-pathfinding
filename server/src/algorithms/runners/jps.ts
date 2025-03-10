import { 
    GridData, 
    Position, 
    AlgorithmOptions, 
    AlgorithmResult 
  } from '../../../../shared/src/types';
  import { jumpPointSearch } from '../../../../shared/src/algorithms';
 
  export async function runJPS(
    grid: GridData,
    start: Position,
    end: Position,
    options: AlgorithmOptions
  ): Promise<AlgorithmResult> {
    return jumpPointSearch(grid, start, end, options);
  }