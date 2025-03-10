import { GridData, Position, AlgorithmOptions, AlgorithmResult, PathNode } from '../../types';
import { Grid } from '../../data-structures/grid';
import { PriorityQueue } from '../../data-structures/priority-queue';
import { manhattanDistance, euclideanDistance, diagonalDistance } from '../../utils';

interface MeetingPointType {
  forwardNode: PathNode;
  backwardNode: PathNode;
  cost: number;
}

export function bidirectionalTheta(
  gridData: GridData,
  startPos: Position,
  endPos: Position,
  options: AlgorithmOptions = {
    allowDiagonal: true,
    heuristic: 'euclidean',
    weight: 1,
    bidirectional: true,
    tieBreaker: true
  }
): AlgorithmResult {
  const startTime = performance.now();
  let nodesExplored = 0;
  
  const searchOptions: AlgorithmOptions = {
    ...options,
    bidirectional: true
  };
  
  const grid = new Grid(gridData);
  
  let heuristicFn: (x1: number, y1: number, x2: number, y2: number) => number;
  switch (searchOptions.heuristic) {
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
  
  const openSetForward = new PriorityQueue<PathNode>();
  const closedSetForward = new Set<string>();
  const nodeMapForward = new Map<string, PathNode>();
  
  const openSetBackward = new PriorityQueue<PathNode>();
  const closedSetBackward = new Set<string>();
  const nodeMapBackward = new Map<string, PathNode>();
  
  const startNode: PathNode = {
    x: startPos.x,
    y: startPos.y,
    g: 0,
    h: heuristicFn(startPos.x, startPos.y, endPos.x, endPos.y) * searchOptions.weight,
    f: 0,
    parent: undefined
  };
  startNode.f = startNode.g + startNode.h;
  
  const endNode: PathNode = {
    x: endPos.x,
    y: endPos.y,
    g: 0,
    h: heuristicFn(endPos.x, endPos.y, startPos.x, startPos.y) * searchOptions.weight,
    f: 0,
    parent: undefined
  };
  endNode.f = endNode.g + endNode.h;
  
  openSetForward.enqueue(startNode, startNode.f);
  nodeMapForward.set(`${startNode.x},${startNode.y}`, startNode);
  
  openSetBackward.enqueue(endNode, endNode.f);
  nodeMapBackward.set(`${endNode.x},${endNode.y}`, endNode);
  
  const visited: Position[] = [];
  
  let bestMeetingPoint: MeetingPointType | null = null;
  
  while (!openSetForward.isEmpty() && !openSetBackward.isEmpty()) {
    const forwardPeek = openSetForward.peek();
    const backwardPeek = openSetBackward.peek();
    
    if (bestMeetingPoint !== null && 
        forwardPeek !== undefined && 
        backwardPeek !== undefined && 
        forwardPeek.f + backwardPeek.f >= bestMeetingPoint.cost) {
      break;
    }
    
    if (!openSetForward.isEmpty()) {
      const current = openSetForward.dequeue();
      if (!current) continue;
      
      const currentKey = `${current.x},${current.y}`;
      
      if (closedSetForward.has(currentKey)) {
        continue;
      }
      
      visited.push({ x: current.x, y: current.y });
      nodesExplored++;
      
      const backwardNode = nodeMapBackward.get(currentKey);
      if (backwardNode) {
        const meetingCost = current.g + backwardNode.g;
        if (bestMeetingPoint === null || meetingCost < bestMeetingPoint.cost) {
          bestMeetingPoint = {
            forwardNode: current,
            backwardNode: backwardNode,
            cost: meetingCost
          };
        }
      }
      
      closedSetForward.add(currentKey);
      
      const neighbors = grid.getNeighbors(current.x, current.y, searchOptions.allowDiagonal);
      
      for (const neighbor of neighbors) {
        const neighborKey = `${neighbor.x},${neighbor.y}`;
        
        if (closedSetForward.has(neighborKey)) {
          continue;
        }
        
        let neighborNode = nodeMapForward.get(neighborKey);
        const isNewNode = !neighborNode;
        
        if (isNewNode) {
          neighborNode = {
            x: neighbor.x,
            y: neighbor.y,
            g: Infinity,
            h: heuristicFn(neighbor.x, neighbor.y, endPos.x, endPos.y) * searchOptions.weight,
            f: Infinity,
            parent: undefined
          };
          nodeMapForward.set(neighborKey, neighborNode);
        }
        
        if (!neighborNode) continue;
        
        let newParent = current;
        let newGScore = current.g + euclideanDistance(current.x, current.y, neighbor.x, neighbor.y);
        
        if (current.parent && hasLineOfSight(current.parent, neighbor, grid)) {
          const parentGScore = current.parent.g + 
                               euclideanDistance(current.parent.x, current.parent.y, neighbor.x, neighbor.y);
          
          if (parentGScore < newGScore) {
            newParent = current.parent;
            newGScore = parentGScore;
          }
        }
        
        if (newGScore < neighborNode.g) {
          neighborNode.parent = newParent;
          neighborNode.g = newGScore;
          
          if (searchOptions.tieBreaker) {
            const dx1 = neighbor.x - endPos.x;
            const dy1 = neighbor.y - endPos.y;
            const dx2 = current.x - endPos.x;
            const dy2 = current.y - endPos.y;
            const cross = Math.abs(dx1 * dy2 - dx2 * dy1);
            const tieBreaker = cross * 0.001;
            
            neighborNode.h += tieBreaker;
          }
          
          neighborNode.f = neighborNode.g + neighborNode.h;
          
          if (isNewNode) {
            openSetForward.enqueue(neighborNode, neighborNode.f);
          } else {
            openSetForward.updatePriority(
              neighborNode, 
              neighborNode.f,
              (a, b) => a.x === b.x && a.y === b.y
            );
          }
        }
      }
    }
    
    const updatedForwardPeek = openSetForward.peek();
    const updatedBackwardPeek = openSetBackward.peek();
    
    if (bestMeetingPoint !== null && 
        updatedForwardPeek !== undefined && 
        updatedBackwardPeek !== undefined && 
        updatedForwardPeek.f + updatedBackwardPeek.f >= bestMeetingPoint.cost) {
      break;
    }
    
    if (!openSetBackward.isEmpty()) {
      const current = openSetBackward.dequeue();
      if (!current) continue;
      
      const currentKey = `${current.x},${current.y}`;
      
      if (closedSetBackward.has(currentKey)) {
        continue;
      }
      
      visited.push({ x: current.x, y: current.y });
      nodesExplored++;
      
      const forwardNode = nodeMapForward.get(currentKey);
      if (forwardNode) {
        const meetingCost = current.g + forwardNode.g;
        if (bestMeetingPoint === null || meetingCost < bestMeetingPoint.cost) {
          bestMeetingPoint = {
            forwardNode: forwardNode,
            backwardNode: current,
            cost: meetingCost
          };
        }
      }
      
      closedSetBackward.add(currentKey);
      
      const neighbors = grid.getNeighbors(current.x, current.y, searchOptions.allowDiagonal);
      
      for (const neighbor of neighbors) {
        const neighborKey = `${neighbor.x},${neighbor.y}`;
        
        if (closedSetBackward.has(neighborKey)) {
          continue;
        }
        
        let neighborNode = nodeMapBackward.get(neighborKey);
        const isNewNode = !neighborNode;
        
        if (isNewNode) {
          neighborNode = {
            x: neighbor.x,
            y: neighbor.y,
            g: Infinity,
            h: heuristicFn(neighbor.x, neighbor.y, startPos.x, startPos.y) * searchOptions.weight,
            f: Infinity,
            parent: undefined
          };
          nodeMapBackward.set(neighborKey, neighborNode);
        }
        
        if (!neighborNode) continue;
        
        let newParent = current;
        let newGScore = current.g + euclideanDistance(current.x, current.y, neighbor.x, neighbor.y);
        
        if (current.parent && hasLineOfSight(current.parent, neighbor, grid)) {
          const parentGScore = current.parent.g + 
                               euclideanDistance(current.parent.x, current.parent.y, neighbor.x, neighbor.y);
          
          if (parentGScore < newGScore) {
            newParent = current.parent;
            newGScore = parentGScore;
          }
        }
        
        if (newGScore < neighborNode.g) {
          neighborNode.parent = newParent;
          neighborNode.g = newGScore;
          
          if (searchOptions.tieBreaker) {
            const dx1 = neighbor.x - startPos.x;
            const dy1 = neighbor.y - startPos.y;
            const dx2 = current.x - startPos.x;
            const dy2 = current.y - startPos.y;
            const cross = Math.abs(dx1 * dy2 - dx2 * dy1);
            const tieBreaker = cross * 0.001;
            
            neighborNode.h += tieBreaker;
          }
          
          neighborNode.f = neighborNode.g + neighborNode.h;
          
          if (isNewNode) {
            openSetBackward.enqueue(neighborNode, neighborNode.f);
          } else {
            openSetBackward.updatePriority(
              neighborNode, 
              neighborNode.f,
              (a, b) => a.x === b.x && a.y === b.y
            );
          }
        }
      }
    }
  }
  
  const path: Position[] = [];
  
  if (bestMeetingPoint !== null) {
    let current: PathNode | undefined = bestMeetingPoint.forwardNode;
    const forwardPath: Position[] = [];
    
    while (current && current.parent) {
      forwardPath.unshift({ x: current.x, y: current.y });
      current = current.parent;
    }
    
    current = bestMeetingPoint.backwardNode;
    const backwardPath: Position[] = [];
    
    while (current && current.parent) {
      backwardPath.push({ x: current.x, y: current.y });
      current = current.parent;
    }
    
    path.push(...forwardPath);
    path.push(...backwardPath);
  }
  
  const endTime = performance.now();
  
  return {
    path,
    visited,
    metrics: {
      nodesExplored,
      executionTimeMs: endTime - startTime,
      pathLength: path.length,
      memoryUsed: calculateMemoryUsage(
        openSetForward.size() + openSetBackward.size(),
        closedSetForward.size + closedSetBackward.size
      )
    }
  };
}

function hasLineOfSight(nodeA: PathNode, nodeB: Position, grid: Grid): boolean {
  const x0 = nodeA.x;
  const y0 = nodeA.y;
  const x1 = nodeB.x;
  const y1 = nodeB.y;
  
  const dx = Math.abs(x1 - x0);
  const dy = Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1;
  const sy = y0 < y1 ? 1 : -1;
  
  let err = dx - dy;
  let x = x0;
  let y = y0;
  
  while (!(x === x1 && y === y1)) {
    const e2 = 2 * err;
    
    if (e2 > -dy) {
      err -= dy;
      x += sx;
    }
    
    if (e2 < dx) {
      err += dx;
      y += sy;
    }
    
    if ((x === x0 && y === y0) || (x === x1 && y === y1)) {
      continue;
    }
    
    if (!grid.isWalkable(x, y)) {
      return false;
    }
  }
  
  return true;
}

function calculateMemoryUsage(openSetSize: number, closedSetSize: number): number {
  const nodeSize = 40;
  return (openSetSize + closedSetSize) * nodeSize;
}