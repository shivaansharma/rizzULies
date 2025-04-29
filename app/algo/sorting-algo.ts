export interface SortResult {
    sortedValues: number[];
    comparisons: number[][];
    swaps: number[][];
  }
  
  export interface SortConfig {
    values: number[];
    swaps?: number[][];
    comparisons?: number[][];
  }
  
  
  export function swap(arr: number[], i: number, j: number): void {
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
  
  export function partition({ values, low, high, swaps, comparisons }: 
    { values: number[], low: number, high: number, swaps: number[][], comparisons: number[][] }): number {
    
    const pivot = values[high];
    let i = low - 1;
    
    for (let j = low; j < high; j++) {
      comparisons.push([j, high]);
      
      if (values[j] <= pivot) {
        i++;
        if (i !== j) {
          swaps.push([i, j]);
          swap(values, i, j);
        }
      }
    }
    
    if (i + 1 !== high) {
      swaps.push([i + 1, high]);
      swap(values, i + 1, high);
    }
    
    return i + 1;
  }
  
  export function merge({ values, low, mid, high, swaps, comparisons }: 
    { values: number[], low: number, mid: number, high: number, swaps: number[][], comparisons: number[][] }): void {
    
    const leftSize = mid - low + 1;
    const rightSize = high - mid;
    
   
    const leftArray = new Array(leftSize);
    const rightArray = new Array(rightSize);
    
   
    for (let i = 0; i < leftSize; i++) {
      leftArray[i] = values[low + i];
    }
    
    for (let j = 0; j < rightSize; j++) {
      rightArray[j] = values[mid + 1 + j];
    }
    
  
    let i = 0;
    let j = 0; 
    let k = low;
    
    while (i < leftSize && j < rightSize) {
      comparisons.push([low + i, mid + 1 + j]);
      
      if (leftArray[i] <= rightArray[j]) {
        if (values[k] !== leftArray[i]) {
          swaps.push([k, low + i]);
          values[k] = leftArray[i];
        }
        i++;
      } else {
        if (values[k] !== rightArray[j]) {
          swaps.push([k, mid + 1 + j]);
          values[k] = rightArray[j];
        }
        j++;
      }
      k++;
    }
    
  
    while (i < leftSize) {
      if (values[k] !== leftArray[i]) {
        swaps.push([k, low + i]);
        values[k] = leftArray[i];
      }
      i++;
      k++;
    }
    
   
    while (j < rightSize) {
      if (values[k] !== rightArray[j]) {
        swaps.push([k, mid + 1 + j]);
        values[k] = rightArray[j];
      }
      j++;
      k++;
    }
  }
  
  // 1. Bubble Sort
  export function bubbleSort({ values }: SortConfig): SortResult {
    const arr = [...values];
    const swaps: number[][] = [];
    const comparisons: number[][] = [];
    
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        comparisons.push([j, j + 1]);
        
        if (arr[j] > arr[j + 1]) {
          swaps.push([j, j + 1]);
          swap(arr, j, j + 1);
        }
      }
    }
    
    return { sortedValues: arr, comparisons, swaps };
  }
  
  // 2. Quick Sort
  export function quickSort({ values }: SortConfig): SortResult {
    const arr = [...values];
    const swaps: number[][] = [];
    const comparisons: number[][] = [];
    
    function quickSortHelper(low: number, high: number): void {
      if (low < high) {
        const pivotIndex = partition({ 
          values: arr, 
          low, 
          high, 
          swaps, 
          comparisons 
        });
        
        quickSortHelper(low, pivotIndex - 1);
        quickSortHelper(pivotIndex + 1, high);
      }
    }
    
    quickSortHelper(0, arr.length - 1);
    
    return { sortedValues: arr, comparisons, swaps };
  }
  
  // 3. Merge Sort
  export function mergeSort({ values }: SortConfig): SortResult {
    const arr = [...values];
    const swaps: number[][] = [];
    const comparisons: number[][] = [];
    
    function mergeSortHelper(low: number, high: number): void {
      if (low < high) {
        const mid = Math.floor((low + high) / 2);
        
        mergeSortHelper(low, mid);
        mergeSortHelper(mid + 1, high);
        
        merge({ 
          values: arr, 
          low, 
          mid, 
          high, 
          swaps, 
          comparisons 
        });
      }
    }
    
    mergeSortHelper(0, arr.length - 1);
    
    return { sortedValues: arr, comparisons, swaps };
  }
  
  // 4. Insertion Sort
  export function insertionSort({ values }: SortConfig): SortResult {
    const arr = [...values];
    const swaps: number[][] = [];
    const comparisons: number[][] = [];
    
    for (let i = 1; i < arr.length; i++) {
      const key = arr[i];
      let j = i - 1;
      
      while (j >= 0) {
        comparisons.push([j, i]);
        
        if (arr[j] > key) {
          swaps.push([j + 1, j]);
          arr[j + 1] = arr[j];
          j--;
        } else {
          break;
        }
      }
      
      if (j + 1 !== i) {
        arr[j + 1] = key;
      }
    }
    
    return { sortedValues: arr, comparisons, swaps };
  }
  
  // 5. Selection Sort
  export function selectionSort({ values }: SortConfig): SortResult {
    const arr = [...values];
    const swaps: number[][] = [];
    const comparisons: number[][] = [];
    
    for (let i = 0; i < arr.length - 1; i++) {
      let minIndex = i;
      
      for (let j = i + 1; j < arr.length; j++) {
        comparisons.push([minIndex, j]);
        
        if (arr[j] < arr[minIndex]) {
          minIndex = j;
        }
      }
      
      if (minIndex !== i) {
        swaps.push([i, minIndex]);
        swap(arr, i, minIndex);
      }
    }
    
    return { sortedValues: arr, comparisons, swaps };
  }
  
  // 6. Heap Sort
  export function heapSort({ values }: SortConfig): SortResult {
    const arr = [...values];
    const swaps: number[][] = [];
    const comparisons: number[][] = [];
    
    function heapify(n: number, i: number): void {
      let largest = i;
      const left = 2 * i + 1;
      const right = 2 * i + 2;
      
      if (left < n) {
        comparisons.push([largest, left]);
        if (arr[left] > arr[largest]) {
          largest = left;
        }
      }
      
      if (right < n) {
        comparisons.push([largest, right]);
        if (arr[right] > arr[largest]) {
          largest = right;
        }
      }
      
      if (largest !== i) {
        swaps.push([i, largest]);
        swap(arr, i, largest);
        heapify(n, largest);
      }
    }
    
    // Build max heap
    for (let i = Math.floor(arr.length / 2) - 1; i >= 0; i--) {
      heapify(arr.length, i);
    }
    
    // Extract elements from heap one by one
    for (let i = arr.length - 1; i > 0; i--) {
      swaps.push([0, i]);
      swap(arr, 0, i);
      heapify(i, 0);
    }
    
    return { sortedValues: arr, comparisons, swaps };
  }
  
  // 7. Shell Sort
  export function shellSort({ values }: SortConfig): SortResult {
    const arr = [...values];
    const swaps: number[][] = [];
    const comparisons: number[][] = [];
    
    let gap = Math.floor(arr.length / 2);
    
    while (gap > 0) {
      for (let i = gap; i < arr.length; i++) {
        const temp = arr[i];
        let j = i;
        
        while (j >= gap) {
          comparisons.push([j - gap, j]);
          
          if (arr[j - gap] > temp) {
            swaps.push([j, j - gap]);
            arr[j] = arr[j - gap];
            j -= gap;
          } else {
            break;
          }
        }
        
        if (j !== i) {
          arr[j] = temp;
        }
      }
      
      gap = Math.floor(gap / 2);
    }
    
    return { sortedValues: arr, comparisons, swaps };
  }
  
  // 8. Counting Sort (for non-negative integers)
  export function countingSort({ values }: SortConfig): SortResult {
    const arr = [...values];
    const swaps: number[][] = [];
    const comparisons: number[][] = [];
    
    if (arr.length === 0) {
      return { sortedValues: arr, comparisons, swaps };
    }
    
    // Find the maximum element
    let max = arr[0];
    for (let i = 1; i < arr.length; i++) {
      comparisons.push([0, i]);
      max = Math.max(max, arr[i]);
    }
    
    // Create count array and output array
    const count = new Array(max + 1).fill(0);
    const output = new Array(arr.length);
    
    // Store count of each element
    for (let i = 0; i < arr.length; i++) {
      count[arr[i]]++;
    }
    
    // Store cumulative count
    for (let i = 1; i <= max; i++) {
      count[i] += count[i - 1];
    }
    
    // Build the output array
    for (let i = arr.length - 1; i >= 0; i--) {
      const index = count[arr[i]] - 1;
      output[index] = arr[i];
      swaps.push([i, index]);
      count[arr[i]]--;
    }
    
    // Copy the output array to arr
    for (let i = 0; i < arr.length; i++) {
      arr[i] = output[i];
    }
    
    return { sortedValues: arr, comparisons, swaps };
  }
  
  // 9. Radix Sort (for non-negative integers)
  export function radixSort({ values }: SortConfig): SortResult {
    const arr = [...values];
    const swaps: number[][] = [];
    const comparisons: number[][] = [];
    
    if (arr.length === 0) {
      return { sortedValues: arr, comparisons, swaps };
    }
    
    // Find the maximum number to know number of digits
    let max = arr[0];
    for (let i = 1; i < arr.length; i++) {
      comparisons.push([0, i]);
      max = Math.max(max, arr[i]);
    }
    
    // Do counting sort for every digit
    for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
      const output = new Array(arr.length);
      const count = new Array(10).fill(0);
      
      // Store count of occurrences in count[]
      for (let i = 0; i < arr.length; i++) {
        const digit = Math.floor(arr[i] / exp) % 10;
        count[digit]++;
      }
      
      // Change count[i] so that count[i] now contains
      // actual position of this digit in output[]
      for (let i = 1; i < 10; i++) {
        count[i] += count[i - 1];
      }
      
      // Build the output array
      for (let i = arr.length - 1; i >= 0; i--) {
        const digit = Math.floor(arr[i] / exp) % 10;
        const index = count[digit] - 1;
        output[index] = arr[i];
        swaps.push([i, index]);
        count[digit]--;
      }
      
      // Copy the output array to arr[]
      for (let i = 0; i < arr.length; i++) {
        arr[i] = output[i];
      }
    }
    
    return { sortedValues: arr, comparisons, swaps };
  }
  
  // 10. Cocktail Sort (Bidirectional Bubble Sort)
  export function cocktailSort({ values }: SortConfig): SortResult {
    const arr = [...values];
    const swaps: number[][] = [];
    const comparisons: number[][] = [];
    
    let swapped = true;
    let start = 0;
    let end = arr.length - 1;
    
    while (swapped) {
      // Reset swapped flag for the forward pass
      swapped = false;
      
      // Forward pass (like bubble sort)
      for (let i = start; i < end; i++) {
        comparisons.push([i, i + 1]);
        
        if (arr[i] > arr[i + 1]) {
          swaps.push([i, i + 1]);
          swap(arr, i, i + 1);
          swapped = true;
        }
      }
      
      // If nothing was swapped, then array is sorted
      if (!swapped) {
        break;
      }
      
      // Reset swapped flag for the backward pass
      swapped = false;
      
      // Decrement end because the largest element is at the end
      end--;
      
      // Backward pass (bubble largest from right to left)
      for (let i = end - 1; i >= start; i--) {
        comparisons.push([i, i + 1]);
        
        if (arr[i] > arr[i + 1]) {
          swaps.push([i, i + 1]);
          swap(arr, i, i + 1);
          swapped = true;
        }
      }
      
      // Increment start because the smallest element is at the start
      start++;
    }
    
    return { sortedValues: arr, comparisons, swaps };
  }