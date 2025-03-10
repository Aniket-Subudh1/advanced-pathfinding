import { GridData, Position, AlgorithmOptions, AlgorithmResult } from '../../types';
import { Grid } from '../../data-structures/grid';
import { VectorField, Vector } from '../../data-structures/vector-field';

export function flowField(
  gridData: GridData,
  startPos: Position,
  endPos: Position,
  options: AlgorithmOptions = {
    allowDiagonal: true,
    heuristic: 'euclidean',
    weight: 1,
    bidirectional: false,
    tieBreaker: false
  }
): AlgorithmResult {
  const startTime = performance.now();
  let nodesExplored = 0;
  
  const grid = new Grid(gridData);
  
  const costField = createCostField(grid, endPos);
  
  const flowField = createFlowField(grid, costField);
  
  const { path, visited } = tracePath(grid, flowField, startPos, endPos);
  
  const endTime = performance.now();
  nodesExplored = visited.length;
  
  return {
    path,
    visited,
    metrics: {
      nodesExplored,
      executionTimeMs: endTime - startTime,
      pathLength: path.length,
      memoryUsed: calculateMemoryUsage(grid.width, grid.height)
    }
  };
}
 
function createCostField(grid: Grid, goalPos: Position): number[][] {
  const { width, height } = grid;
  
  const costField: number[][] = Array(height).fill(0).map(() => 
    Array(width).fill(Infinity)
  );
  
  const queue: Position[] = [];
  
  costField[goalPos.y][goalPos.x] = 0;
  queue.push({ ...goalPos });
  
  while (queue.length > 0) {
    const current = queue.shift()!;
    const currentCost = costField[current.y][current.x];
    
  
    const neighbors = grid.getNeighbors(current.x, current.y, true);
    
    for (const neighbor of neighbors) {
      const isDiagonal = neighbor.x !== current.x && neighbor.y !== current.y;
      const moveCost = isDiagonal ? 1.414 : 1.0; // sqrt(2) for diagonal
      const neighborCost = currentCost + moveCost;
      
      if (neighborCost < costField[neighbor.y][neighbor.x]) {
        costField[neighbor.y][neighbor.x] = neighborCost;
        queue.push({ ...neighbor });
      }
    }
  }
  
  return costField;
}


function createFlowField(grid: Grid, costField: number[][]): VectorField {
  const { width, height } = grid;
  const flowField = new VectorField(width, height);
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (!grid.isWalkable(x, y)) {
        continue;
      }
      
      let lowestCost = costField[y][x];
      let bestDir: Vector = { x: 0, y: 0 };
      
      const directions = [
        { x: -1, y: -1 }, { x: 0, y: -1 }, { x: 1, y: -1 },
        { x: -1, y: 0 },                    { x: 1, y: 0 },
        { x: -1, y: 1 },  { x: 0, y: 1 },  { x: 1, y: 1 }
      ];
      
      for (const dir of directions) {
        const nx = x + dir.x;
        const ny = y + dir.y;
        
        if (nx < 0 || nx >= width || ny < 0 || ny >= height) {
          continue;
        }
        
        if (!grid.isWalkable(nx, ny)) {
          continue;
        }
        
        if (costField[ny][nx] < lowestCost) {
          lowestCost = costField[ny][nx];
          bestDir = { ...dir };
        }
      }
      
      flowField.setVector(x, y, bestDir);
    }
  }
  
  flowField.normalizeAll();
  
  return flowField;
}

function tracePath(
  grid: Grid, 
  flowField: VectorField, 
  startPos: Position, 
  goalPos: Position
): { path: Position[], visited: Position[] } {
  const path: Position[] = [];
  const visited: Position[] = [];
  
  let current = { ...startPos };
  let prevPos: Position | null = null;
  
  const maxIterations = grid.width * grid.height;
  let iterations = 0;
  
  while (iterations < maxIterations) {
    visited.push({ ...current });
    
    if (current.x === goalPos.x && current.y === goalPos.y) {
      break;
    }
    
    const vector = flowField.getVector(current.x, current.y);
    
  
    if (!vector || (vector.x === 0 && vector.y === 0)) {
      break;
    }
    
    let nextX = current.x;
    let nextY = current.y;
    
  
    if (Math.abs(vector.x) > Math.abs(vector.y)) {
      nextX += Math.sign(vector.x);
      if (vector.y !== 0) {
        nextY += Math.sign(vector.y);
      }
    } else if (Math.abs(vector.y) > Math.abs(vector.x)) {
      nextY += Math.sign(vector.y);
      if (vector.x !== 0) {
        nextX += Math.sign(vector.x);
      }
    } else {
      nextX += Math.sign(vector.x);
      nextY += Math.sign(vector.y);
    }
    
    if (!grid.isValidPosition(nextX, nextY) || !grid.isWalkable(nextX, nextY)) {
      nextX = current.x + Math.sign(vector.x);
      nextY = current.y;
      
      if (!grid.isValidPosition(nextX, nextY) || !grid.isWalkable(nextX, nextY)) {
        nextX = current.x;
        nextY = current.y + Math.sign(vector.y);
        
        if (!grid.isValidPosition(nextX, nextY) || !grid.isWalkable(nextX, nextY)) {
          break;
        }
      }
    }
    
    if (prevPos && prevPos.x === nextX && prevPos.y === nextY) {
      break;
    }
    
    prevPos = { ...current };
    current = { x: nextX, y: nextY };
    
    if ((current.x !== startPos.x || current.y !== startPos.y) && 
        (current.x !== goalPos.x || current.y !== goalPos.y)) {
      path.push({ ...current });
    }
    
   
    iterations++;
  }
  
  return { path, visited };
}


function calculateMemoryUsage(width: number, height: number): number {
  return width * height * 12;
}