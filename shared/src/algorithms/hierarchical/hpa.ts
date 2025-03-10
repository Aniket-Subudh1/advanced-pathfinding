import { GridData, Position, AlgorithmOptions, AlgorithmResult, PathNode } from '../../types';
import { Grid } from '../../data-structures/grid';
import { PriorityQueue } from '../../data-structures/priority-queue';
import { manhattanDistance, euclideanDistance, diagonalDistance } from '../../utils';

export function hierarchicalPathfinding(
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
  
  const clusterSize = Math.min(8, Math.max(grid.width, grid.height) / 4);
  const clusters = createClusters(grid, clusterSize);
  
  const entrances = findEntrances(grid, clusters);
  
  const abstractGraph = buildAbstractGraph(grid, clusters, entrances, heuristicFn);
  
  const startCluster = getClusterForPosition(startPos, clusters);
  const endCluster = getClusterForPosition(endPos, clusters);
  
  insertStartAndEndNodes(
    abstractGraph, 
    startPos, 
    endPos, 
    startCluster,
    endCluster,
    grid,
    heuristicFn,
    clusters
  );
  
  const abstractPath = findPathInAbstractGraph(
    abstractGraph,
    startPos,
    endPos,
    heuristicFn,
    options.weight,
    options.tieBreaker
  );
  
  const visited: Position[] = [];
  
  const path = refinePath(
    abstractPath,
    grid,
    heuristicFn,
    options,
    visited,
    nodesExplored
  );
  
  nodesExplored = visited.length;
  
  const endTime = performance.now();
  
  return {
    path,
    visited,
    metrics: {
      nodesExplored,
      executionTimeMs: endTime - startTime,
      pathLength: path.length,
      memoryUsed: calculateMemoryUsage(clusters.length, entrances.length, abstractGraph.nodes.length)
    }
  };
}


interface Cluster {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
}


interface Entrance {
  id: number;
  position: Position;
  cluster1Id: number;
  cluster2Id: number;
}


interface AbstractNode {
  id: number;
  position: Position;
  clusterId: number;
  isEntrance: boolean;
  isStartOrEnd: boolean;
}


interface AbstractEdge {
  from: number; 
  to: number;   
  cost: number;
}


interface AbstractGraph {
  nodes: AbstractNode[];
  edges: Map<number, AbstractEdge[]>; 
}


function createClusters(grid: Grid, clusterSize: number): Cluster[] {
  const clusters: Cluster[] = [];
  let clusterId = 0;
  
  for (let y = 0; y < grid.height; y += clusterSize) {
    for (let x = 0; x < grid.width; x += clusterSize) {
      const width = Math.min(clusterSize, grid.width - x);
      const height = Math.min(clusterSize, grid.height - y);
      
      clusters.push({
        id: clusterId++,
        x,
        y,
        width,
        height
      });
    }
  }
  
  return clusters;
}


function findEntrances(grid: Grid, clusters: Cluster[]): Entrance[] {
  const entrances: Entrance[] = [];
  let entranceId = 0;
  
  for (let i = 0; i < clusters.length; i++) {
    const cluster = clusters[i];
    
    const rightCluster = clusters.find(c => 
      c.x === cluster.x + cluster.width && 
      c.y === cluster.y
    );
    
    if (rightCluster) {
      for (let y = cluster.y; y < cluster.y + cluster.height; y++) {
        const x = cluster.x + cluster.width - 1;
        if (grid.isWalkable(x, y) && grid.isWalkable(x + 1, y)) {
          entrances.push({
            id: entranceId++,
            position: { x, y },
            cluster1Id: cluster.id,
            cluster2Id: rightCluster.id
          });
        }
      }
    }
    
    const belowCluster = clusters.find(c => 
      c.x === cluster.x && 
      c.y === cluster.y + cluster.height
    );
    
    if (belowCluster) {
      for (let x = cluster.x; x < cluster.x + cluster.width; x++) {
        const y = cluster.y + cluster.height - 1; 
        
        if (grid.isWalkable(x, y) && grid.isWalkable(x, y + 1)) {
          entrances.push({
            id: entranceId++,
            position: { x, y },
            cluster1Id: cluster.id,
            cluster2Id: belowCluster.id
          });
        }
      }
    }
  }
  
  return entrances;
}


function buildAbstractGraph(
  grid: Grid,
  clusters: Cluster[],
  entrances: Entrance[],
  heuristicFn: (x1: number, y1: number, x2: number, y2: number) => number
): AbstractGraph {
  const abstractGraph: AbstractGraph = {
    nodes: [],
    edges: new Map()
  };
  
  for (const entrance of entrances) {
    const node: AbstractNode = {
      id: entrance.id,
      position: entrance.position,
      clusterId: entrance.cluster1Id, 
      isEntrance: true,
      isStartOrEnd: false
    };
    
    abstractGraph.nodes.push(node);
  }
  
  for (const cluster of clusters) {
    const clusterEntrances = entrances.filter(
      e => e.cluster1Id === cluster.id || e.cluster2Id === cluster.id
    );
    
    if (clusterEntrances.length < 2) {
      continue;
    }
    
    for (let i = 0; i < clusterEntrances.length; i++) {
      const entrance1 = clusterEntrances[i];
      const node1Id = entrance1.id;
      
      if (!abstractGraph.edges.has(node1Id)) {
        abstractGraph.edges.set(node1Id, []);
      }
      
      for (let j = i + 1; j < clusterEntrances.length; j++) {
        const entrance2 = clusterEntrances[j];
        const node2Id = entrance2.id;
        
        const cost = computePathCost(
          entrance1.position,
          entrance2.position,
          grid,
          heuristicFn
        );
        
        if (cost === Infinity) {
          continue;
        }
        
        // Add edges in both directions
        abstractGraph.edges.get(node1Id)!.push({
          from: node1Id,
          to: node2Id,
          cost
        });
        
        if (!abstractGraph.edges.has(node2Id)) {
          abstractGraph.edges.set(node2Id, []);
        }
        
        abstractGraph.edges.get(node2Id)!.push({
          from: node2Id,
          to: node1Id,
          cost
        });
      }
    }
  }
  
  return abstractGraph;
}


function computePathCost(
  start: Position,
  end: Position,
  grid: Grid,
  heuristicFn: (x1: number, y1: number, x2: number, y2: number) => number
): number {
  
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function getClusterForPosition(position: Position, clusters: Cluster[]): Cluster | null {
  for (const cluster of clusters) {
    if (
      position.x >= cluster.x &&
      position.x < cluster.x + cluster.width &&
      position.y >= cluster.y &&
      position.y < cluster.y + cluster.height
    ) {
      return cluster;
    }
  }
  
  return null;
}


function findNearestCluster(position: Position, clusters: Cluster[]): Cluster {
  let nearestCluster = clusters[0];
  let minDistance = Infinity;
  
  for (const cluster of clusters) {
    const clusterCenterX = cluster.x + cluster.width / 2;
    const clusterCenterY = cluster.y + cluster.height / 2;
    
    const dx = position.x - clusterCenterX;
    const dy = position.y - clusterCenterY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < minDistance) {
      minDistance = distance;
      nearestCluster = cluster;
    }
  }
  
  return nearestCluster;
}


function insertStartAndEndNodes(
  abstractGraph: AbstractGraph,
  startPos: Position,
  endPos: Position,
  startCluster: Cluster | null,
  endCluster: Cluster | null,
  grid: Grid,
  heuristicFn: (x1: number, y1: number, x2: number, y2: number) => number,
  clusters: Cluster[]
): void {
  if (!startCluster) {
    startCluster = findNearestCluster(startPos, clusters);
  }
  
  if (!endCluster) {
    endCluster = findNearestCluster(endPos, clusters);
  }
  
  const startNodeId = abstractGraph.nodes.length;
  const startNode: AbstractNode = {
    id: startNodeId,
    position: startPos,
    clusterId: startCluster.id,
    isEntrance: false,
    isStartOrEnd: true
  };
  
  abstractGraph.nodes.push(startNode);
  abstractGraph.edges.set(startNodeId, []);
  
  const endNodeId = abstractGraph.nodes.length;
  const endNode: AbstractNode = {
    id: endNodeId,
    position: endPos,
    clusterId: endCluster.id,
    isEntrance: false,
    isStartOrEnd: true
  };
  
  abstractGraph.nodes.push(endNode);
  abstractGraph.edges.set(endNodeId, []);
  
  const startClusterEntrances = abstractGraph.nodes.filter(
    node => (
      node.isEntrance && 
      node.clusterId === startCluster.id
    )
  );
  
  for (const entrance of startClusterEntrances) {
    const cost = computePathCost(
      startPos,
      entrance.position,
      grid,
      heuristicFn
    );
    
    if (cost === Infinity) {
      continue;
    }
    
    abstractGraph.edges.get(startNodeId)!.push({
      from: startNodeId,
      to: entrance.id,
      cost
    });
    
    abstractGraph.edges.get(entrance.id)!.push({
      from: entrance.id,
      to: startNodeId,
      cost
    });
  }
  
  const endClusterEntrances = abstractGraph.nodes.filter(
    node => (
      node.isEntrance && 
      node.clusterId === endCluster.id
    )
  );
  
  for (const entrance of endClusterEntrances) {
    const cost = computePathCost(
      endPos,
      entrance.position,
      grid,
      heuristicFn
    );
    
    if (cost === Infinity) {
      continue;
    }
    
    abstractGraph.edges.get(endNodeId)!.push({
      from: endNodeId,
      to: entrance.id,
      cost
    });
    
    abstractGraph.edges.get(entrance.id)!.push({
      from: entrance.id,
      to: endNodeId,
      cost
    });
  }
  
  if (startCluster.id === endCluster.id) {
    const cost = computePathCost(
      startPos,
      endPos,
      grid,
      heuristicFn
    );
    
    if (cost !== Infinity) {
      abstractGraph.edges.get(startNodeId)!.push({
        from: startNodeId,
        to: endNodeId,
        cost
      });
      
      abstractGraph.edges.get(endNodeId)!.push({
        from: endNodeId,
        to: startNodeId,
        cost
      });
    }
  }
}


function findPathInAbstractGraph(
  abstractGraph: AbstractGraph,
  startPos: Position,
  endPos: Position,
  heuristicFn: (x1: number, y1: number, x2: number, y2: number) => number,
  weight: number,
  useTieBreaker: boolean
): AbstractNode[] {
  // Find start and end nodes
  const startNode = abstractGraph.nodes.find(node => 
    node.isStartOrEnd && node.position.x === startPos.x && node.position.y === startPos.y
  );
  
  const endNode = abstractGraph.nodes.find(node => 
    node.isStartOrEnd && node.position.x === endPos.x && node.position.y === endPos.y
  );
  
  if (!startNode || !endNode) {
    return [];
  }
  
  const openSet = new PriorityQueue<{
    nodeId: number;
    g: number;
    f: number;
    parent: number | null;
  }>();
  
  const gScore = new Map<number, number>();
  const parent = new Map<number, number>();
  const closed = new Set<number>();
  
  gScore.set(startNode.id, 0);
  openSet.enqueue({
    nodeId: startNode.id,
    g: 0,
    f: heuristicFn(
      startNode.position.x, startNode.position.y,
      endNode.position.x, endNode.position.y
    ) * weight,
    parent: null
  }, 0);
  
  // Main search loop
  while (!openSet.isEmpty()) {
    const current = openSet.dequeue();
    if (!current) continue;
    
    // Skip if already closed
    if (closed.has(current.nodeId)) {
      continue;
    }
    
    // Check if reached end
    if (current.nodeId === endNode.id) {
      // Reconstruct path
      const path: AbstractNode[] = [];
      let currentId: number | null = endNode.id;
      
      while (currentId !== null) {
        const node = abstractGraph.nodes.find(n => n.id === currentId);
        if (node) {
          path.unshift(node);
        }
        currentId = parent.get(currentId) ?? null;
      }
      
      return path;
    }
    
    // Add to closed set
    closed.add(current.nodeId);
    
    // Get neighbors
    const edges = abstractGraph.edges.get(current.nodeId) || [];
    
    // Process each neighbor
    for (const edge of edges) {
      const neighborId = edge.to;
      
      // Skip if closed
      if (closed.has(neighborId)) {
        continue;
      }
      
      // Calculate g score
      const tentativeG = current.g + edge.cost;
      
      // Check if better path
      if (!gScore.has(neighborId) || tentativeG < gScore.get(neighborId)!) {
        // Update path
        gScore.set(neighborId, tentativeG);
        parent.set(neighborId, current.nodeId);
        
        // Get neighbor node
        const neighbor = abstractGraph.nodes.find(n => n.id === neighborId);
        
        if (neighbor) {
          // Calculate f score
          let h = heuristicFn(
            neighbor.position.x, neighbor.position.y,
            endNode.position.x, endNode.position.y
          ) * weight;
          
          // Apply tie-breaking
          if (useTieBreaker) {
            const dx1 = neighbor.position.x - endNode.position.x;
            const dy1 = neighbor.position.y - endNode.position.y;
            const dx2 = startNode.position.x - endNode.position.x;
            const dy2 = startNode.position.y - endNode.position.y;
            const cross = Math.abs(dx1 * dy2 - dx2 * dy1);
            h += cross * 0.001;
          }
          
          const f = tentativeG + h;
          
          // Add to open set
          openSet.enqueue({
            nodeId: neighborId,
            g: tentativeG,
            f,
            parent: current.nodeId
          }, f);
        }
      }
    }
  }
  
  return [];
}


function refinePath(
  abstractPath: AbstractNode[],
  grid: Grid,
  heuristicFn: (x1: number, y1: number, x2: number, y2: number) => number,
  options: AlgorithmOptions,
  visited: Position[],
  nodesExplored: number
): Position[] {
  const path: Position[] = [];
  
  // If no abstract path, return empty path
  if (abstractPath.length <= 1) {
    return path;
  }
  
  // Refine each segment of the abstract path
  for (let i = 0; i < abstractPath.length - 1; i++) {
    const fromNode = abstractPath[i];
    const toNode = abstractPath[i + 1];
    
    // Find low-level path between these nodes
    const segmentPath = findLowLevelPath(
      fromNode.position,
      toNode.position,
      grid,
      heuristicFn,
      options,
      visited,
      nodesExplored
    );
    
    // Add segment path to main path (skip last node to avoid duplicates)
    if (i < abstractPath.length - 2) {
      path.push(...segmentPath.slice(0, -1));
    } else {
      path.push(...segmentPath);
    }
  }
  
  return path;
}


function findLowLevelPath(
  start: Position,
  end: Position,
  grid: Grid,
  heuristicFn: (x1: number, y1: number, x2: number, y2: number) => number,
  options: AlgorithmOptions,
  visited: Position[],
  nodesExplored: number
): Position[] {
  
  const openSet = new PriorityQueue<PathNode>();
  const closedSet = new Set<string>();
  
  // Track nodes
  const nodeMap = new Map<string, PathNode>();
  
  // Create start node
  const startNode: PathNode = {
    x: start.x,
    y: start.y,
    g: 0,
    h: heuristicFn(start.x, start.y, end.x, end.y) * options.weight,
    f: 0,
    parent: undefined
  };
  startNode.f = startNode.g + startNode.h;
  
  // Add start node to open set
  openSet.enqueue(startNode, startNode.f);
  nodeMap.set(`${startNode.x},${startNode.y}`, startNode);
  
  // Main search loop
  while (!openSet.isEmpty()) {
    // Get node with lowest f value
    const current = openSet.dequeue();
    if (!current) continue;
    
    const currentKey = `${current.x},${current.y}`;
    
    // Add to visited
    visited.push({ x: current.x, y: current.y });
    nodesExplored++;
    
    // Check if reached end
    if (current.x === end.x && current.y === end.y) {
      // Reconstruct path
      const path: Position[] = [];
      let currentNode: PathNode | undefined = current;
      
      while (currentNode) {
        path.unshift({ x: currentNode.x, y: currentNode.y });
        currentNode = currentNode.parent;
      }
      
      return path;
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
          h: heuristicFn(neighbor.x, neighbor.y, end.x, end.y) * options.weight,
          f: Infinity,
          parent: undefined
        };
        nodeMap.set(neighborKey, neighborNode);
      }
      
      if (!neighborNode) continue;
      
      if (tentativeG < neighborNode.g) {
        neighborNode.parent = current;
        neighborNode.g = tentativeG;
        
        if (options.tieBreaker) {
          const dx1 = neighbor.x - end.x;
          const dy1 = neighbor.y - end.y;
          const dx2 = start.x - end.x;
          const dy2 = start.y - end.y;
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
  
  return [];
}


function calculateMemoryUsage(
  numClusters: number,
  numEntrances: number,
  numAbstractNodes: number
): number {
  
  const clusterMemory = numClusters * 20;
  const entranceMemory = numEntrances * 16;
  const abstractNodeMemory = numAbstractNodes * 24;
  const abstractEdgeMemory = numAbstractNodes * 4 * 16;
  
  return clusterMemory + entranceMemory + abstractNodeMemory + abstractEdgeMemory;
}