import { GridData, GridCell, Position, CellType } from '../types';

export class Grid {
  readonly width: number;
  readonly height: number;
  private cells: GridCell[];
  private startPosition: Position;
  private endPosition: Position;

  constructor(gridData: GridData) {
    this.width = gridData.width;
    this.height = gridData.height;
    this.cells = [...gridData.cells];
    this.startPosition = { ...gridData.startPosition };
    this.endPosition = { ...gridData.endPosition };
  }

  getCell(x: number, y: number): GridCell | null {
    if (!this.isValidPosition(x, y)) {
      return null;
    }
    
    const index = this.getIndexFromPosition(x, y);
    return this.cells[index];
  }

  isValidPosition(x: number, y: number): boolean {
    return x >= 0 && x < this.width && y >= 0 && y < this.height;
  }

  isWalkable(x: number, y: number): boolean {
    const cell = this.getCell(x, y);
    return cell ? cell.walkable : false;
  }

  getIndexFromPosition(x: number, y: number): number {
    return y * this.width + x;
  }


  getPositionFromIndex(index: number): Position {
    return {
      x: index % this.width,
      y: Math.floor(index / this.width)
    };
  }

  getStartPosition(): Position {
    return { ...this.startPosition };
  }


  getEndPosition(): Position {
    return { ...this.endPosition };
  }

  getNeighbors(x: number, y: number, allowDiagonal: boolean): Position[] {
    const neighbors: Position[] = [];
    
    const directions = [
      { x: 0, y: -1 }, 
      { x: 1, y: 0 },  
      { x: 0, y: 1 },  
      { x: -1, y: 0 }  
    ];
    
    if (allowDiagonal) {
      directions.push(
        { x: 1, y: -1 },  
        { x: 1, y: 1 },   
        { x: -1, y: 1 },  
        { x: -1, y: -1 }  
      );
    }
    
    for (const dir of directions) {
      const nx = x + dir.x;
      const ny = y + dir.y;
      
      if (this.isValidPosition(nx, ny) && this.isWalkable(nx, ny)) {
        neighbors.push({ x: nx, y: ny });
      }
    }
    
    return neighbors;
  }

 
  getDiagonalNeighbors(x: number, y: number): Position[] {
    const neighbors: Position[] = [];
    const directions = [
      { x: 1, y: -1 }, 
      { x: 1, y: 1 },   
      { x: -1, y: 1 }, 
      { x: -1, y: -1 } 
    ];
    
    for (const dir of directions) {
      const nx = x + dir.x;
      const ny = y + dir.y;
      
      if (this.isValidPosition(nx, ny) && this.isWalkable(nx, ny)) {
        neighbors.push({ x: nx, y: ny });
      }
    }
    
    return neighbors;
  }

  
  getCost(fromX: number, fromY: number, toX: number, toY: number): number {
    if (fromX !== toX && fromY !== toY) {
      return 1.414;
    }
    
    return 1;
  }

 
  toGridData(): GridData {
    return {
      width: this.width,
      height: this.height,
      cells: [...this.cells],
      startPosition: { ...this.startPosition },
      endPosition: { ...this.endPosition }
    };
  }
}