import { useState, useEffect, useRef } from 'react';
import { 
  bubbleSort,
  quickSort,
  mergeSort,
  insertionSort,
  selectionSort,
  heapSort,
  shellSort,
  countingSort,
  radixSort,
  cocktailSort
} from '@/app/algo/sorting-algo';

// Define sorting algorithm types
const algorithms = {
  'Bubble Sort': bubbleSort,
  'Quick Sort': quickSort,
  'Merge Sort': mergeSort,
  'Insertion Sort': insertionSort,
  'Selection Sort': selectionSort,
  'Heap Sort': heapSort,
  'Shell Sort': shellSort,
  'Counting Sort': countingSort,
  'Radix Sort': radixSort,
  'Cocktail Sort': cocktailSort
};

const SortingVisualizer = () => {
  const [array, setArray] = useState([]);
  const [arraySize, setArraySize] = useState(20);
  const [algorithm, setAlgorithm] = useState('Bubble Sort');
  const [isSorting, setIsSorting] = useState(false);
  const [sorted, setSorted] = useState(false);
  const [speed, setSpeed] = useState(50);
  const [currentStep, setCurrentStep] = useState(-1);
  const [currentIndices, setCurrentIndices] = useState([]);
  const [steps, setSteps] = useState({ swaps: [], comparisons: [] });
  const [showComparisons, setShowComparisons] = useState(true);
  const [showSwaps, setShowSwaps] = useState(true);
  
  // Keep the original array and a working copy for visualization
  const originalArray = useRef([]);
  const [visualArray, setVisualArray] = useState([]);
  // Keep sorted array for final result
  const sortedArrayRef = useRef([]);

  // Generate a new random array
  const generateArray = () => {
    const newArray = Array.from({ length: arraySize }, () => 
      Math.floor(Math.random() * 100) + 1
    );
    setArray(newArray);
    setVisualArray([...newArray]);
    originalArray.current = [...newArray];
    setSorted(false);
    setCurrentStep(-1);
    setCurrentIndices([]);
    setSteps({ swaps: [], comparisons: [] });
  };

  // Initialize the array
  useEffect(() => {
    generateArray();
  }, [arraySize]);

  // Run the selected sorting algorithm
  const runSort = () => {
    setIsSorting(true);
    setSorted(false);
    
    // Reset visual array to original state
    setVisualArray([...originalArray.current]);
    
    // Get the sorting function based on the selected algorithm
    const sortFunction = algorithms[algorithm];
    
    // Run the sorting algorithm
    const result = sortFunction({ values: [...originalArray.current] });
    
    // Save the sorted result for later
    sortedArrayRef.current = [...result.sortedValues];
    
    // Save the steps (swaps and comparisons)
    setSteps({
      swaps: result.swaps,
      comparisons: result.comparisons
    });
    
    // Start visualization from the beginning
    setCurrentStep(0);
  };

  // Handle visualization steps
  useEffect(() => {
    if (!isSorting || currentStep === -1) return;
    
    let timer;
    const totalSteps = Math.max(
      showComparisons ? steps.comparisons.length : 0,
      showSwaps ? steps.swaps.length : 0
    );
    
    if (currentStep < totalSteps) {
      // Get current comparison and swap indices
      const indices = [];
      
      if (showComparisons && currentStep < steps.comparisons.length) {
        indices.push(...steps.comparisons[currentStep]);
      }
      
      // Apply swap if this step has one
      if (showSwaps && currentStep < steps.swaps.length) {
        indices.push(...steps.swaps[currentStep]);
        
        // Perform the actual swap in the visual array
        const [i, j] = steps.swaps[currentStep];
        setVisualArray(prevArray => {
          const newArray = [...prevArray];
          [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
          return newArray;
        });
      }
      
      setCurrentIndices(indices);
      
      // Move to next step after delay
      timer = setTimeout(() => {
        setCurrentStep(currentStep + 1);
      }, 1000 - speed * 10);
    } else {
      // Sorting complete - ensure array is fully sorted
      setVisualArray([...sortedArrayRef.current]);
      setIsSorting(false);
      setSorted(true);
      setCurrentIndices([]);
    }
    
    return () => clearTimeout(timer);
  }, [currentStep, isSorting, steps, speed, showComparisons, showSwaps]);

  // Reset visualization
  const resetVisualization = () => {
    setIsSorting(false);
    setSorted(false);
    setCurrentStep(-1);
    setCurrentIndices([]);
    setVisualArray([...originalArray.current]);
  };

  // Get bar color based on its state
  const getBarColor = (index) => {
    if (sorted) return 'bg-green-500';
    if (currentIndices.includes(index)) {
      if (showSwaps && currentStep < steps.swaps.length && 
          steps.swaps[currentStep].includes(index)) {
        return 'bg-red-500'; // Swapping
      }
      return 'bg-blue-500'; // Comparing
    }
    return 'bg-gray-500';
  };

  return (
    <div className="flex flex-col items-center p-4 text-white rounded-lg shadow-lg w-full max-w-6xl">
      <h1 className="text-2xl font-bold mb-4">Sorting Algorithm Visualizer</h1>
      
      {/* Controls */}
      <div className="flex flex-wrap justify-center gap-4 mb-6 w-full">
        <div className="flex flex-col">
          <label className="text-sm mb-1 ">Algorithm</label>
          <select 
            className="px-3 py-2 border rounded text-black" 
            value={algorithm} 
            onChange={(e) => setAlgorithm(e.target.value)}
            disabled={isSorting}
          >
            {Object.keys(algorithms).map((algo) => (
              <option key={algo} value={algo}>{algo}</option>
            ))}
          </select>
        </div>
        
        <div className="flex flex-col">
          <label className="text-sm mb-1">Array Size</label>
          <input 
            type="range" 
            min="5" 
            max="100" 
            value={arraySize} 
            onChange={(e) => setArraySize(parseInt(e.target.value))}
            disabled={isSorting} 
            className="w-32"
          />
          <span className="text-xs text-center">{arraySize}</span>
        </div>
        
        <div className="flex flex-col">
          <label className="text-sm mb-1">Speed</label>
          <input 
            type="range" 
            min="1" 
            max="99" 
            value={speed} 
            onChange={(e) => setSpeed(parseInt(e.target.value))}
            className="w-32"
          />
          <span className="text-xs text-center">{speed}%</span>
        </div>
        
        <div className="flex items-end gap-2">
          <button 
            onClick={generateArray} 
            disabled={isSorting}
            className="px-3 py-2 bg-gray-700 text-white rounded hover:bg-gray-800 disabled:opacity-50"
          >
            Generate New Array
          </button>
          
          <button 
            onClick={runSort} 
            disabled={isSorting || sorted}
            className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            Sort!
          </button>
          
          <button 
            onClick={resetVisualization} 
            disabled={!isSorting && !sorted}
            className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
          >
            Reset
          </button>
        </div>
      </div>
      
      {/* Visualization Options */}
      <div className="flex gap-6 mb-4">
        <div className="flex items-center">
          <input 
            type="checkbox" 
            id="showComparisons" 
            checked={showComparisons} 
            onChange={() => setShowComparisons(!showComparisons)}
            disabled={isSorting}
            className="mr-2"
          />
          <label htmlFor="showComparisons" className="text-sm">
            Show Comparisons
          </label>
        </div>
        
        <div className="flex items-center">
          <input 
            type="checkbox" 
            id="showSwaps" 
            checked={showSwaps} 
            onChange={() => setShowSwaps(!showSwaps)}
            disabled={isSorting}
            className="mr-2"
          />
          <label htmlFor="showSwaps" className="text-sm">
            Show Swaps
          </label>
        </div>
      </div>
      
      {/* Legend */}
      <div className="flex gap-4 mb-4">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-gray-500 mr-2"></div>
          <span className="text-sm">Unsorted</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-blue-500 mr-2"></div>
          <span className="text-sm">Comparing</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-red-500 mr-2"></div>
          <span className="text-sm">Swapping</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-500 mr-2"></div>
          <span className="text-sm">Sorted</span>
        </div>
      </div>
      
      {/* Array Visualization */}
      <div className="w-full h-64 flex items-end justify-center gap-1 p-4 rounded ">
        {visualArray.map((value, index) => (
          <div 
            key={index} 
            className={`w-full  ${getBarColor(index)} transition-all duration-100`}
            style={{
              height: `${(value / Math.max(...visualArray)) * 100}%`,
              maxWidth: `${900 / arraySize}px`
            }}
          ></div>
        ))}
      </div>
      
      {/* Statistics */}
      <div className="mt-4 text-sm">
        <p>Steps: {currentStep === -1 ? 0 : currentStep} / {Math.max(steps.comparisons.length, steps.swaps.length)}</p>
        <p>Total Comparisons: {steps.comparisons.length}</p>
        <p>Total Swaps: {steps.swaps.length}</p>
      </div>
    </div>
  );
};

export default SortingVisualizer;