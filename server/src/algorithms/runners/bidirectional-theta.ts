import { 
    GridData, 
    Position, 
    AlgorithmOptions, 
    AlgorithmResult 
  } from '../../../../shared/src/types';
  import { bidirectionalTheta } from '../../../../shared/src/algorithms';
  
 
  export async function runBidirectionalTheta(
    grid: GridData,
    start: Position,
    end: Position,
    options: AlgorithmOptions
  ): Promise<AlgorithmResult> {
    return bidirectionalTheta(grid, start, end, options);
  }