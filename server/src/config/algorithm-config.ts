import { 
    AlgorithmType, 
    AlgorithmInfo 
  } from 'shared/src/types';
  
  // Algorithm configurations
  export const algorithms: Record<AlgorithmType, AlgorithmInfo> = {
    'astar': {
      id: 'astar',
      name: 'A* Algorithm',
      description: 'A widely used pathfinding algorithm that uses heuristics to find the shortest path efficiently. It combines the advantages of Dijkstra\'s algorithm and greedy best-first search.',
      complexityTime: 'O(E log V)',
      complexitySpace: 'O(V)',
      color: '#8b5cf6'  // Purple
    },
    'jps': {
      id: 'jps',
      name: 'Jump Point Search',
      description: 'An optimization of A* for uniform-cost grids that identifies "jump points" to skip unnecessary nodes, dramatically reducing computation time while maintaining path optimality.',
      complexityTime: 'O(E log V)',
      complexitySpace: 'O(V)',
      color: '#ec4899'  // Pink
    },
    'bts': {
      id: 'bts',
      name: 'Bidirectional Theta*',
      description: 'A bidirectional version of Theta* that searches from both start and end simultaneously while allowing any-angle movements, resulting in more natural and smooth paths.',
      complexityTime: 'O(E log V)',
      complexitySpace: 'O(V)',
      color: '#f59e0b'  // Amber
    },
    'flowfield': {
      id: 'flowfield',
      name: 'Flow Field Pathfinding',
      description: 'Creates a vector field across the entire grid that multiple agents can follow simultaneously, ideal for crowd simulation and multi-agent pathfinding scenarios.',
      complexityTime: 'O(V)',
      complexitySpace: 'O(V)',
      color: '#10b981'  // Emerald
    },
    'hpa': {
      id: 'hpa',
      name: 'Hierarchical Pathfinding A*',
      description: 'A multi-level abstraction approach that creates a hierarchical graph of the environment, solving complex path queries efficiently by breaking them into smaller, simpler problems.',
      complexityTime: 'O(E log V)',
      complexitySpace: 'O(V + A)',
      color: '#3b82f6'  // Blue
    }
  };
  
  // Default algorithm options
  export const defaultAlgorithmOptions = {
    allowDiagonal: true,
    heuristic: 'manhattan',
    weight: 1.0,
    bidirectional: false,
    tieBreaker: true
  };