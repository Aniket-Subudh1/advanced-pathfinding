import { GridData, Position, AlgorithmOptions, AlgorithmResult, PathNode } from '../../types';
import { Grid } from '../../data-structures/grid';
import { PriorityQueue } from '../../data-structures/priority-queue';
import { manhattanDistance, euclideanDistance, diagonalDistance } from '../../utils';


export function astar(
  gridData: GridData,
  startPos: Position,
  endPos: Position,
  options: AlgorithmOptions = {
    allowDiagonal: true,
    heuristic: 'manhattan',
    weight: 1,
    bidirectional: false,
    tieBreaker: true
  }
): AlgorithmResult {
  const startTime = performance.now();
  let nodesExplored = 0;
  
  const grid = new Grid(gridData);
  
  let heuristicFn: (x1: number, y1: number, x2: number, y2: number) => number;
  switch (options.heuristic) {
    case 'euclidean':
      heuristicFn = euclideanDistance;
      break;
    case 'diagonal':
      heuristicFn = diagonalDistance;
      break;
    case 'manhattan':
    default:
      heuristicFn = manhattanDistance;
      break;
  }
  
  const openSet = new PriorityQueue<PathNode>();
  const closedSet = new Set<string>();
  
  const nodeMap = new Map<string, PathNode>();
  
  const startNode: PathNode = {
    x: startPos.x,
    y: startPos.y,
    g: 0,
    h: heuristicFn(startPos.x, startPos.y, endPos.x, endPos.y) * options.weight, 
    f: 0, 
    parent: undefined
  };
  startNode.f = startNode.g + startNode.h;
  

  openSet.enqueue(startNode, startNode.f);
  nodeMap.set(`${startNode.x},${startNode.y}`, startNode);
  
  const visited: Position[] = [];
  
 
  while (!openSet.isEmpty()) {
    const current = openSet.dequeue()!;
    const currentKey = `${current.x},${current.y}`;

    visited.push({ x: current.x, y: current.y });
    nodesExplored++;
    
    if (current.x === endPos.x && current.y === endPos.y) {
      const path = reconstructPath(current);
      
      const endTime = performance.now();
      
      return {
        path,
        visited,
        metrics: {
          nodesExplored,
          executionTimeMs: endTime - startTime,
          pathLength: path.length,
          memoryUsed: calculateMemoryUsage(openSet.size(), closedSet.size)
        }
      };
    }
    
    closedSet.add(currentKey);
    
    const neighbors = grid.getNeighbors(current.x, current.y, options.allowDiagonal);
    
    for (const neighbor of neighbors) {
      const neighborKey = `${neighbor.x},${neighbor.y}`;
      
   
      if (closedSet.has(neighborKey)) {
        continue;
      }
      
   
      const movementCost = grid.getCost(current.x, current.y, neighbor.x, neighbor.y);
      const tentativeG = current.g + movementCost;
      
   
      let neighborNode = nodeMap.get(neighborKey);
      const isNewNode = !neighborNode;
      
      if (isNewNode) {
      
        neighborNode = {
          x: neighbor.x,
          y: neighbor.y,
          g: Infinity,
          h: heuristicFn(neighbor.x, neighbor.y, endPos.x, endPos.y) * options.weight,
          f: Infinity,
          parent: undefined
        };
        nodeMap.set(neighborKey, neighborNode);
      }
      

      if (neighborNode && tentativeG < neighborNode.g) {
     
        neighborNode.parent = current;
        neighborNode.g = tentativeG;
        
   
        if (options.tieBreaker) {
          const dx1 = neighbor.x - endPos.x;
          const dy1 = neighbor.y - endPos.y;
          const dx2 = startPos.x - endPos.x;
          const dy2 = startPos.y - endPos.y;
          const cross = Math.abs(dx1 * dy2 - dx2 * dy1);
          const tieBreaker = cross * 0.001;
          
          neighborNode.h += tieBreaker;
        }
        
  
        neighborNode.f = neighborNode.g + neighborNode.h;
        
      
        if (isNewNode) {
          openSet.enqueue(neighborNode, neighborNode.f);
        } else {
        
          openSet.updatePriority(
            neighborNode, 
            neighborNode.f,
            (a, b) => a.x === b.x && a.y === b.y
          );
        }
      }
    }
  }
  
 
  const endTime = performance.now();
  
  return {
    path: [],
    visited,
    metrics: {
      nodesExplored,
      executionTimeMs: endTime - startTime,
      pathLength: 0,
      memoryUsed: calculateMemoryUsage(openSet.size(), closedSet.size)
    }
  };
}


function reconstructPath(goalNode: PathNode): Position[] {
  const path: Position[] = [];
  let current: PathNode | undefined = goalNode;

  while (current && current.parent && current.parent.parent) {
    path.unshift({ x: current.x, y: current.y });
    current = current.parent;
  }
  
  return path;
}


function calculateMemoryUsage(openSetSize: number, closedSetSize: number): number {
  const nodeSize = 40;
  return (openSetSize + closedSetSize) * nodeSize;
}