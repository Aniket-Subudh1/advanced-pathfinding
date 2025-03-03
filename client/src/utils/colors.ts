export const algorithmColors = {
    astar: '#8b5cf6', // Purple
    jps: '#ec4899',   // Pink
    bts: '#f59e0b',   // Amber
    flowfield: '#10b981', // Emerald
    hpa: '#3b82f6'    // Blue
  };
  
  export const getCellColor = (cellType: string): string => {
    switch (cellType) {
      case 'start':
        return '#10b981'; // Green
      case 'end':
        return '#ef4444'; // Red
      case 'wall':
        return '#1f2937'; // Dark Gray
      case 'path':
        return '#fbbf24'; // Yellow
      case 'visited':
        return '#93c5fd'; // Light Blue
      case 'visiting':
        return '#3b82f6'; // Blue
      default:
        return '#ffffff'; // White
    }
  };