export class PriorityQueue<T> {
    private heap: { element: T; priority: number }[] = [];
  
    enqueue(element: T, priority: number): void {
      const node = { element, priority };
      this.heap.push(node);
      this.bubbleUp(this.heap.length - 1);
    }
  
    dequeue(): T | undefined {
      if (this.isEmpty()) {
        return undefined;
      }
  
      const top = this.heap[0];
      const bottom = this.heap.pop();
  
      if (this.heap.length > 0 && bottom) {
        this.heap[0] = bottom;
        this.sinkDown(0);
      }
  
      return top.element;
    }
  
 
    peek(): T | undefined {
      return this.heap.length > 0 ? this.heap[0].element : undefined;
    }

    contains(element: T, comparator: (a: T, b: T) => boolean): boolean {
      return this.heap.some(node => comparator(node.element, element));
    }

    updatePriority(element: T, newPriority: number, comparator: (a: T, b: T) => boolean): boolean {
      for (let i = 0; i < this.heap.length; i++) {
        if (comparator(this.heap[i].element, element)) {
          if (newPriority < this.heap[i].priority) {
            this.heap[i].priority = newPriority;
            this.bubbleUp(i);
          } 
          else if (newPriority > this.heap[i].priority) {
            this.heap[i].priority = newPriority;
            this.sinkDown(i);
          }
          return true;
        }
      }
      return false;
    }
  

    isEmpty(): boolean {
      return this.heap.length === 0;
    }

    size(): number {
      return this.heap.length;
    }

    clear(): void {
      this.heap = [];
    }

    private bubbleUp(index: number): void {
      const element = this.heap[index];
  
      while (index > 0) {
        const parentIndex = Math.floor((index - 1) / 2);
        const parent = this.heap[parentIndex];
  
        if (element.priority >= parent.priority) {
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
          if (leftChild.priority < element.priority) {
            swapIndex = leftChildIndex;
          }
        }
  
        if (rightChildIndex < length) {
          const rightChild = this.heap[rightChildIndex];
          if (
            (swapIndex === -1 && rightChild.priority < element.priority) ||
            (swapIndex !== -1 && rightChild.priority < this.heap[swapIndex].priority)
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