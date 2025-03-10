export const algorithmColors = {
    astar: '#8b5cf6', 
    jps: '#ec4899',   
    bts: '#f59e0b',   
    flowfield: '#10b981', 
    hpa: '#3b82f6'   
  };
  
  export const getCellColor = (cellType: string): string => {
    switch (cellType) {
      case 'start':
        return '#10b981'; 
      case 'end':
        return '#ef4444'; 
        return '#1f2937'; 
      case 'path':
        return '#fbbf24'; 
      case 'visited':
        return '#93c5fd'; 
      case 'visiting':
        return '#3b82f6'; 
      default:
        return '#ffffff'; 
    }
  };