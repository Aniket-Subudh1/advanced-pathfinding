import { GridData, Position, AlgorithmOptions, AlgorithmResult, PathNode } from '../../types';
import { Grid } from '../../data-structures/grid';
import { PriorityQueue } from '../../data-structures/priority-queue';
import { manhattanDistance, euclideanDistance, diagonalDistance } from '../../utils';


export function jumpPointSearch(
  gridData: GridData,
  startPos: Position,
  endPos: Position,
  options: AlgorithmOptions = {
    allowDiagonal: true,
    heuristic: 'euclidean',
    weight: 1,
    bidirectional: false,
    tieBreaker: true
  }
): AlgorithmResult {
  options.allowDiagonal = true;
  
  const startTime = performance.now();
  let nodesExplored = 0;
  
  const grid = new Grid(gridData);
  
  let heuristicFn: (x1: number, y1: number, x2: number, y2: number) => number;
  switch (options.heuristic) {
    case 'manhattan':
      heuristicFn = manhattanDistance;
      break;
    case 'diagonal':
      heuristicFn = diagonalDistance;
      break;
    case 'euclidean':
    default:
      heuristicFn = euclideanDistance;
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
    
    // Move current node from open to closed set
    closedSet.add(currentKey);
    
    // Identify and process successors with jumping
    identifySuccessors(current, endPos, grid, openSet, closedSet, nodeMap, visited, heuristicFn, options.weight, options.tieBreaker);
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


function identifySuccessors(
  current: PathNode,
  endPos: Position,
  grid: Grid,
  openSet: PriorityQueue<PathNode>,
  closedSet: Set<string>,
  nodeMap: Map<string, PathNode>,
  visited: Position[],
  heuristicFn: (x1: number, y1: number, x2: number, y2: number) => number,
  weight: number,
  useTieBreaker: boolean
): void {
  // Get the neighbors that might have jump points
  const neighbors = getNeighbors(current, grid);
  
  // Process each neighbor
  for (const neighbor of neighbors) {
    // Get jump point in the direction of the neighbor
    const jumpPoint = jump(
      neighbor.x, neighbor.y,
      current.x, current.y,
      endPos, grid, visited
    );
    
    // If a jump point is found
    if (jumpPoint) {
      const jumpPointKey = `${jumpPoint.x},${jumpPoint.y}`;
      
      // Skip if in closed set
      if (closedSet.has(jumpPointKey)) {
        continue;
      }
      
      // Calculate g score
      const dx = jumpPoint.x - current.x;
      const dy = jumpPoint.y - current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const tentativeG = current.g + distance;
      
      // Get or create jump point node
      let jumpPointNode = nodeMap.get(jumpPointKey);
      const isNewNode = !jumpPointNode;
      
      if (isNewNode) {
        // Create new node
        jumpPointNode = {
          x: jumpPoint.x,
          y: jumpPoint.y,
          g: Infinity,
          h: heuristicFn(jumpPoint.x, jumpPoint.y, endPos.x, endPos.y) * weight,
          f: Infinity,
          parent: undefined
        };
        nodeMap.set(jumpPointKey, jumpPointNode);
      }
      
      if (jumpPointNode && tentativeG < jumpPointNode.g) {
        jumpPointNode.parent = current;
        jumpPointNode.g = tentativeG;
        
        // Apply tie-breaking for equal f values
        if (useTieBreaker) {
          // Calculate tie-breaker
          const dx1 = jumpPoint.x - endPos.x;
          const dy1 = jumpPoint.y - endPos.y;
          const dx2 = current.x - endPos.x;
          const dy2 = current.y - endPos.y;
          const cross = Math.abs(dx1 * dy2 - dx2 * dy1);
          const tieBreaker = cross * 0.001;
          
          jumpPointNode.h += tieBreaker;
        }
        
        // Calculate f value
        jumpPointNode.f = jumpPointNode.g + jumpPointNode.h;
        
        // Add to open set if new
        if (isNewNode) {
          openSet.enqueue(jumpPointNode, jumpPointNode.f);
        } else {
          if (jumpPointNode) {
            openSet.updatePriority(
              jumpPointNode, 
              jumpPointNode.f,
              (a, b) => a.x === b.x && a.y === b.y
            );
          }
        }
      }
    }
  }
}


function getNeighbors(current: PathNode, grid: Grid): Position[] {
  const neighbors: Position[] = [];
  const x = current.x;
  const y = current.y;
  
  // If this is the start node, consider all neighbors
  if (!current.parent) {
    // Get all walkable neighbors
    return grid.getNeighbors(x, y, true);
  }
  
  // Calculate direction from parent to current
  const px = current.parent.x;
  const py = current.parent.y;
  const dx = (x - px) / Math.max(Math.abs(x - px), 1);
  const dy = (y - py) / Math.max(Math.abs(y - py), 1);
  
  // Diagonal movement
  if (dx !== 0 && dy !== 0) {
    // Check if horizontal and vertical neighbors are walkable
    const horizontalWalkable = grid.isWalkable(x + dx, y);
    const verticalWalkable = grid.isWalkable(x, y + dy);
    
    // Keep the diagonal direction
    if (grid.isValidPosition(x + dx, y + dy) && grid.isWalkable(x + dx, y + dy)) {
      neighbors.push({ x: x + dx, y: y + dy });
    }
    
    // Check for forced neighbors in horizontal direction
    if (horizontalWalkable) {
      if (!grid.isWalkable(x - dx, y)) {
        neighbors.push({ x: x + dx, y });
      }
    }
    
    // Check for forced neighbors in vertical direction
    if (verticalWalkable) {
      if (!grid.isWalkable(x, y - dy)) {
        neighbors.push({ x, y: y + dy });
      }
    }
  } 
  // Horizontal movement
  else if (dx !== 0) {
    // Keep the horizontal direction
    if (grid.isValidPosition(x + dx, y) && grid.isWalkable(x + dx, y)) {
      neighbors.push({ x: x + dx, y });
    }
    
    // Check for forced neighbors in vertical directions
    if (!grid.isWalkable(x, y + 1)) {
      neighbors.push({ x: x + dx, y: y + 1 });
    }
    if (!grid.isWalkable(x, y - 1)) {
      neighbors.push({ x: x + dx, y: y - 1 });
    }
  } 
  // Vertical movement
  else {
    if (grid.isValidPosition(x, y + dy) && grid.isWalkable(x, y + dy)) {
      neighbors.push({ x, y: y + dy });
    }
    
    // Check for forced neighbors in horizontal directions
    if (!grid.isWalkable(x + 1, y)) {
      neighbors.push({ x: x + 1, y: y + dy });
    }
    if (!grid.isWalkable(x - 1, y)) {
      neighbors.push({ x: x - 1, y: y + dy });
    }
  }
  
  return neighbors;
}

function jump(
  x: number, y: number,
  parentX: number, parentY: number,
  endPos: Position, grid: Grid,
  visited: Position[]
): Position | null {
  // Check if position is valid and walkable
  if (!grid.isValidPosition(x, y) || !grid.isWalkable(x, y)) {
    return null;
  }
  
  // Add to visited nodes for visualization
  visited.push({ x, y });
  
  // Return if goal is found
  if (x === endPos.x && y === endPos.y) {
    return { x, y };
  }
  
  // Calculate direction from parent
  const dx = x - parentX;
  const dy = y - parentY;
  
  // Diagonal movement
  if (dx !== 0 && dy !== 0) {
    if ((grid.isWalkable(x - dx, y + dy) && !grid.isWalkable(x - dx, y)) ||
        (grid.isWalkable(x + dx, y - dy) && !grid.isWalkable(x, y - dy))) {
      return { x, y };
    }
    
    if (jump(x + dx, y, x, y, endPos, grid, visited) || 
        jump(x, y + dy, x, y, endPos, grid, visited)) {
      return { x, y };
    }
  } 
  // Horizontal movement
  else if (dx !== 0) {
    if ((grid.isWalkable(x, y + 1) && !grid.isWalkable(x - dx, y + 1)) ||
        (grid.isWalkable(x, y - 1) && !grid.isWalkable(x - dx, y - 1))) {
      return { x, y };
    }
  } 
  // Vertical movement
  else if (dy !== 0) {
    if ((grid.isWalkable(x + 1, y) && !grid.isWalkable(x + 1, y - dy)) ||
        (grid.isWalkable(x - 1, y) && !grid.isWalkable(x - 1, y - dy))) {
      return { x, y };
    }
  }
  
  if (dx !== 0 && dy !== 0) {
    const jumpX = jump(x + dx, y, x, y, endPos, grid, visited);
    const jumpY = jump(x, y + dy, x, y, endPos, grid, visited);
    
    if (jumpX || jumpY) {
      return { x, y };
    }
    
    return jump(x + dx, y + dy, x, y, endPos, grid, visited);
  } else if (dx !== 0) {
    return jump(x + dx, y, x, y, endPos, grid, visited);
  } else {
    return jump(x, y + dy, x, y, endPos, grid, visited);
  }
}


function reconstructPath(goalNode: PathNode): Position[] {
  const path: Position[] = [];
  let current: PathNode | undefined = goalNode;
  
  // Don't include start and end nodes in the path
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