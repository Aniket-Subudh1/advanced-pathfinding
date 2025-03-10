import { Position } from '../types';

export class SpatialHash {
  private cells: Map<string, Position[]> = new Map();
  private cellSize: number;

  constructor(cellSize: number = 10) {
    this.cellSize = cellSize;
  }


  insert(position: Position): void {
    const cell = this.getCell(position);
    if (!this.cells.has(cell)) {
      this.cells.set(cell, []);
    }
    this.cells.get(cell)!.push({ ...position });
  }

  query(position: Position, radius: number): Position[] {
    const result: Position[] = [];
    const cellRadius = Math.ceil(radius / this.cellSize);
    
    const centerX = Math.floor(position.x / this.cellSize);
    const centerY = Math.floor(position.y / this.cellSize);
    
    for (let y = centerY - cellRadius; y <= centerY + cellRadius; y++) {
      for (let x = centerX - cellRadius; x <= centerX + cellRadius; x++) {
        const cell = `${x},${y}`;
        if (this.cells.has(cell)) {
          const points = this.cells.get(cell)!.filter(p => {
            const dx = p.x - position.x;
            const dy = p.y - position.y;
            return dx * dx + dy * dy <= radius * radius;
          });
          
          result.push(...points);
        }
      }
    }
    
    return result;
  }

  clear(): void {
    this.cells.clear();
  }

  private getCell(position: Position): string {
    const x = Math.floor(position.x / this.cellSize);
    const y = Math.floor(position.y / this.cellSize);
    return `${x},${y}`;
  }
}