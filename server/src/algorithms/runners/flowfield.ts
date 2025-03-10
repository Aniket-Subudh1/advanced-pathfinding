import { 
    GridData, 
    Position, 
    AlgorithmOptions, 
    AlgorithmResult 
  } from '../../../../shared/src/types';
  import { flowField } from '../../../../shared/src/algorithms';

  export async function runFlowField(
    grid: GridData,
    start: Position,
    end: Position,
    options: AlgorithmOptions
  ): Promise<AlgorithmResult> {
    return flowField(grid, start, end, options);
  }
  