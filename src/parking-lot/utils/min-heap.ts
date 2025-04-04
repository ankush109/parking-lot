class MinHeap {
    private heap: number[] = [];
    watchHeap(){
        console.log(this.heap,"current heap look like this.....")
    }
    size(){
      return this.heap.length
    }
    insert(value: number) {
      this.heap.push(value);
      this.bubbleUp();
    }
    getNearest(clear=0){
      if (this.heap.length === 0) return null;
      if (this.heap.length === 1) return this.heap.pop() ?? null; 
  
      const min = this.heap[0];
    
  
      return min;
    }
    extractMin(): number | null {
        if (this.heap.length === 0) return null;
        if (this.heap.length === 1) return this.heap.pop() ?? null; 
    
        const min = this.heap[0];
        const last = this.heap.pop(); 
    
        if (last !== undefined) {
            this.heap[0] = last; 
            this.heapify(0);
        }
    
        return min;
    }
  
    private bubbleUp() {
      let index = this.heap.length - 1;
      while (index > 0) {
        let parentIndex = Math.floor((index - 1) / 2);
        if (this.heap[index] >= this.heap[parentIndex]) break;
        [this.heap[index], this.heap[parentIndex]] = [this.heap[parentIndex], this.heap[index]];
        index = parentIndex;
      }
    }
  
    private heapify(index: number) {
      let left = 2 * index + 1;
      let right = 2 * index + 2;
      let smallest = index;
  
      if (left < this.heap.length && this.heap[left] < this.heap[smallest]) smallest = left;
      if (right < this.heap.length && this.heap[right] < this.heap[smallest]) smallest = right;
  
      if (smallest !== index) {
        [this.heap[index], this.heap[smallest]] = [this.heap[smallest], this.heap[index]];
        this.heapify(smallest);
      }
    }
  
    isEmpty() {
      return this.heap.length === 0;
    }
}

export default MinHeap