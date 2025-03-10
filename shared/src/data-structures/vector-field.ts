import { Position } from '../types';

export interface Vector {
  x: number;
  y: number;
}

export class VectorField {
  private width: number;
  private height: number;
  private field: Vector[][];

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    
    this.field = Array(height).fill(0).map(() => 
      Array(width).fill(0).map(() => ({ x: 0, y: 0 }))
    );
  }


  setVector(x: number, y: number, vector: Vector): void {
    if (this.isValidPosition(x, y)) {
      this.field[y][x] = { ...vector };
    }
  }


  getVector(x: number, y: number): Vector | null {
    if (this.isValidPosition(x, y)) {
      return { ...this.field[y][x] };
    }
    return null;
  }


  normalizeVector(x: number, y: number): void {
    if (this.isValidPosition(x, y)) {
      const vector = this.field[y][x];
      
      const magnitude = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
      if (magnitude > 0) {
        vector.x /= magnitude;
        vector.y /= magnitude;
      }
    }
  }

 
  normalizeAll(): void {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        this.normalizeVector(x, y);
      }
    }
  }

  isValidPosition(x: number, y: number): boolean {
    return x >= 0 && x < this.width && y >= 0 && y < this.height;
  }

  getDimensions(): { width: number, height: number } {
    return { width: this.width, height: this.height };
  }
}