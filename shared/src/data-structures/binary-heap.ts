export class BinaryHeap<T> {
    private heap: T[] = [];
    private compare: (a: T, b: T) => number;

    constructor(compare: (a: T, b: T) => number) {
      this.compare = compare;
    }
  
  
    push(element: T): void {
      this.heap.push(element);
      this.bubbleUp(this.heap.length - 1);
    }
  

    pop(): T | undefined {
      if (this.isEmpty()) {
        return undefined;
      }
  
      const top = this.heap[0];
      const bottom = this.heap.pop();
  
      if (this.heap.length > 0 && bottom !== undefined) {
        this.heap[0] = bottom;
        this.sinkDown(0);
      }
  
      return top;
    }

    peek(): T | undefined {
      return this.heap.length > 0 ? this.heap[0] : undefined;
    }
  

    isEmpty(): boolean {
      return this.heap.length === 0;
    }

    size(): number {
      return this.heap.length;
    }
  

    private bubbleUp(index: number): void {
      const element = this.heap[index];
  
      while (index > 0) {
        const parentIndex = Math.floor((index - 1) / 2);
        const parent = this.heap[parentIndex];
  
        if (this.compare(element, parent) >= 0) {
          break;
        }
  
        this.heap[parentIndex] = element;
        this.heap[index] = parent;
        index = parentIndex;
      }
    }
  

    private sinkDown(index: number): void {
      const length = this.heap.length;
      const element = this.heap[index];
  
      while (true) {
        const leftChildIndex = 2 * index + 1;
        const rightChildIndex = 2 * index + 2;
        let swapIndex = -1;
  
        if (leftChildIndex < length) {
          const leftChild = this.heap[leftChildIndex];
          if (this.compare(leftChild, element) < 0) {
            swapIndex = leftChildIndex;
          }
        }
  
        if (rightChildIndex < length) {
          const rightChild = this.heap[rightChildIndex];
          if (
            (swapIndex === -1 && this.compare(rightChild, element) < 0) ||
            (swapIndex !== -1 && this.compare(rightChild, this.heap[swapIndex]) < 0)
          ) {
            swapIndex = rightChildIndex;
          }
        }
  
        if (swapIndex === -1) {
          break;
        }
  
        this.heap[index] = this.heap[swapIndex];
        this.heap[swapIndex] = element;
        index = swapIndex;
      }
    }
  }