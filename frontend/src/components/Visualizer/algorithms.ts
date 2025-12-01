import { ArrayBar, SortingStep } from "./types";

// Generate unique ID based on index for stable element tracking
let idCounter = 0;
const generateId = (): string => {
  return `bar-${idCounter++}`;
};

// Generate random array
export const generateRandomArray = (
  size: number,
  maxValue: number = 100
): ArrayBar[] => {
  return Array.from({ length: size }, (_, index) => ({
    id: `bar-${index}`,
    value: Math.floor(Math.random() * (maxValue - 5 + 1)) + 5, // Generates 5 to maxValue inclusive (5-100)
    state: "default" as const,
  }));
};

// Deep clone array bars
const cloneArray = (arr: ArrayBar[]): ArrayBar[] => {
  return arr.map((bar) => ({ ...bar }));
};

// Swap only the values, not the IDs (to maintain element identity)
const swapValues = (arr: ArrayBar[], i: number, j: number): void => {
  const temp = arr[i].value;
  arr[i].value = arr[j].value;
  arr[j].value = temp;
};

// Sleep utility for animations
export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// ==================== SORTING ALGORITHMS ====================

// Bubble Sort with steps
export function* bubbleSortGenerator(
  array: ArrayBar[]
): Generator<SortingStep> {
  const arr = cloneArray(array);
  const n = arr.length;
  const sorted: number[] = [];

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      // Comparing
      arr[j].state = "comparing";
      arr[j + 1].state = "comparing";

      yield {
        array: cloneArray(arr),
        comparing: [j, j + 1],
        swapping: [],
        sorted: [...sorted],
        description: `Comparing ${arr[j].value} and ${arr[j + 1].value}`,
      };

      if (arr[j].value > arr[j + 1].value) {
        // Swapping
        arr[j].state = "swapping";
        arr[j + 1].state = "swapping";

        yield {
          array: cloneArray(arr),
          comparing: [],
          swapping: [j, j + 1],
          sorted: [...sorted],
          description: `Swapping ${arr[j].value} and ${arr[j + 1].value}`,
        };

        swapValues(arr, j, j + 1);
      }

      arr[j].state = "default";
      arr[j + 1].state = "default";
    }

    arr[n - 1 - i].state = "sorted";
    sorted.push(n - 1 - i);
  }

  arr[0].state = "sorted";
  sorted.push(0);

  yield {
    array: cloneArray(arr),
    comparing: [],
    swapping: [],
    sorted: [...sorted],
    description: "Sorting complete!",
  };
}

// Selection Sort with steps
export function* selectionSortGenerator(
  array: ArrayBar[]
): Generator<SortingStep> {
  const arr = cloneArray(array);
  const n = arr.length;
  const sorted: number[] = [];

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    arr[minIdx].state = "selected";

    yield {
      array: cloneArray(arr),
      comparing: [minIdx],
      swapping: [],
      sorted: [...sorted],
      description: `Finding minimum from index ${i}`,
    };

    for (let j = i + 1; j < n; j++) {
      arr[j].state = "comparing";

      yield {
        array: cloneArray(arr),
        comparing: [minIdx, j],
        swapping: [],
        sorted: [...sorted],
        description: `Comparing ${arr[minIdx].value} with ${arr[j].value}`,
      };

      if (arr[j].value < arr[minIdx].value) {
        arr[minIdx].state = "default";
        minIdx = j;
        arr[minIdx].state = "selected";
      } else {
        arr[j].state = "default";
      }
    }

    if (minIdx !== i) {
      arr[i].state = "swapping";
      arr[minIdx].state = "swapping";

      yield {
        array: cloneArray(arr),
        comparing: [],
        swapping: [i, minIdx],
        sorted: [...sorted],
        description: `Swapping ${arr[i].value} with minimum ${arr[minIdx].value}`,
      };

      swapValues(arr, i, minIdx);
    }

    arr[i].state = "sorted";
    if (minIdx !== i) arr[minIdx].state = "default";
    sorted.push(i);
  }

  arr[n - 1].state = "sorted";
  sorted.push(n - 1);

  yield {
    array: cloneArray(arr),
    comparing: [],
    swapping: [],
    sorted: [...sorted],
    description: "Sorting complete!",
  };
}

// Insertion Sort with steps
export function* insertionSortGenerator(
  array: ArrayBar[]
): Generator<SortingStep> {
  const arr = cloneArray(array);
  const n = arr.length;
  const sorted: number[] = [0];
  arr[0].state = "sorted";

  yield {
    array: cloneArray(arr),
    comparing: [],
    swapping: [],
    sorted: [...sorted],
    description: "First element is trivially sorted",
  };

  for (let i = 1; i < n; i++) {
    const keyValue = arr[i].value;
    arr[i].state = "selected";
    let j = i - 1;

    yield {
      array: cloneArray(arr),
      comparing: [i],
      swapping: [],
      sorted: [...sorted],
      description: `Inserting ${keyValue} into sorted portion`,
    };

    while (j >= 0 && arr[j].value > keyValue) {
      arr[j].state = "comparing";

      yield {
        array: cloneArray(arr),
        comparing: [j, j + 1],
        swapping: [],
        sorted: [...sorted],
        description: `${arr[j].value} > ${keyValue}, shifting right`,
      };

      arr[j + 1].value = arr[j].value;
      arr[j].state = "sorted";
      j--;
    }

    arr[j + 1].value = keyValue;
    arr[j + 1].state = "sorted";
    sorted.push(i);

    yield {
      array: cloneArray(arr),
      comparing: [],
      swapping: [],
      sorted: [...sorted],
      description: `Inserted ${keyValue} at position ${j + 1}`,
    };
  }

  yield {
    array: cloneArray(arr),
    comparing: [],
    swapping: [],
    sorted: [...sorted],
    description: "Sorting complete!",
  };
}

// Quick Sort with steps
export function* quickSortGenerator(
  array: ArrayBar[],
  low: number = 0,
  high: number = array.length - 1,
  sorted: number[] = []
): Generator<SortingStep> {
  // The initial call from getSortingGenerator will clone the array.
  // Subsequent recursive calls will operate on the same array reference.

  if (low < high) {
    // Partition
    const pivotValue = array[high].value;
    array[high].state = "pivot";
    let i = low - 1;

    yield {
      array: cloneArray(array),
      comparing: [high],
      swapping: [],
      sorted: [...sorted],
      description: `Pivot selected: ${pivotValue}`,
    };

    for (let j = low; j < high; j++) {
      array[j].state = "comparing";

      yield {
        array: cloneArray(array),
        comparing: [j, high],
        swapping: [],
        sorted: [...sorted],
        description: `Comparing ${array[j].value} with pivot ${pivotValue}`,
      };

      if (array[j].value <= pivotValue) {
        i++;
        if (i !== j) {
          array[i].state = "swapping";
          array[j].state = "swapping";

          yield {
            array: cloneArray(array),
            comparing: [],
            swapping: [i, j],
            sorted: [...sorted],
            description: `Swapping ${array[i].value} and ${array[j].value}`,
          };

          swapValues(array, i, j);
        }
      }

      // Reset states after comparison/potential swap, unless it's a sorted element
      if (array[j].state !== "sorted" && j !== high) array[j].state = "default";
      if (array[i] && array[i].state !== "sorted" && i !== high)
        array[i].state = "default";
    }

    // Reset pivot state before final swap
    array[high].state = "default";

    // Place pivot
    swapValues(array, i + 1, high);
    array[i + 1].state = "sorted";
    sorted.push(i + 1);

    yield {
      array: cloneArray(array),
      comparing: [],
      swapping: [],
      sorted: [...sorted],
      description: `Pivot ${pivotValue} placed at position ${i + 1}`,
    };

    const pivotIndex = i + 1;

    // Recursively sort left
    yield* quickSortGenerator(array, low, pivotIndex - 1, sorted);
    // Recursively sort right
    yield* quickSortGenerator(array, pivotIndex + 1, high, sorted);
  } else if (low === high && !sorted.includes(low)) {
    array[low].state = "sorted";
    sorted.push(low);

    yield {
      array: cloneArray(array),
      comparing: [],
      swapping: [],
      sorted: [...sorted],
      description: `Element ${array[low].value} is in place`,
    };
  }
}

// Merge Sort with steps
export function* mergeSortGenerator(
  array: ArrayBar[],
  left: number = 0,
  right: number = array.length - 1,
  sorted: number[] = []
): Generator<SortingStep> {
  if (left >= right) {
    return;
  }

  const mid = Math.floor((left + right) / 2);

  // Highlight the subarray being divided
  for (let i = left; i <= right; i++) {
    if (array[i].state !== "sorted") {
      array[i].state = "comparing";
    }
  }

  yield {
    array: cloneArray(array),
    comparing: Array.from({ length: right - left + 1 }, (_, i) => left + i),
    swapping: [],
    sorted: [...sorted],
    description: `Dividing array: indices ${left} to ${right}`,
  };

  // Reset states
  for (let i = left; i <= right; i++) {
    if (array[i].state !== "sorted") {
      array[i].state = "default";
    }
  }

  // Recursively sort left half
  yield* mergeSortGenerator(array, left, mid, sorted);
  // Recursively sort right half
  yield* mergeSortGenerator(array, mid + 1, right, sorted);

  // Merge the sorted halves
  yield* mergeArrays(array, left, mid, right, sorted);
}

// Helper function to merge two sorted subarrays
function* mergeArrays(
  array: ArrayBar[],
  left: number,
  mid: number,
  right: number,
  sorted: number[]
): Generator<SortingStep> {
  // Create temporary arrays with values
  const leftSize = mid - left + 1;
  const rightSize = right - mid;
  const leftArray: number[] = [];
  const rightArray: number[] = [];

  for (let i = 0; i < leftSize; i++) {
    leftArray[i] = array[left + i].value;
  }
  for (let j = 0; j < rightSize; j++) {
    rightArray[j] = array[mid + 1 + j].value;
  }

  let i = 0;
  let j = 0;
  let k = left;

  // Highlight elements being merged
  for (let idx = left; idx <= right; idx++) {
    if (array[idx].state !== "sorted") {
      array[idx].state = "selected";
    }
  }

  yield {
    array: cloneArray(array),
    comparing: Array.from({ length: right - left + 1 }, (_, idx) => left + idx),
    swapping: [],
    sorted: [...sorted],
    description: `Merging subarrays: [${left}..${mid}] and [${
      mid + 1
    }..${right}]`,
  };

  // Merge the temp arrays back
  while (i < leftSize && j < rightSize) {
    array[k].state = "comparing";

    if (leftArray[i] <= rightArray[j]) {
      yield {
        array: cloneArray(array),
        comparing: [k],
        swapping: [],
        sorted: [...sorted],
        description: `Placing ${leftArray[i]} from left subarray at position ${k}`,
      };

      array[k].value = leftArray[i];
      array[k].state = "swapping";
      i++;
    } else {
      yield {
        array: cloneArray(array),
        comparing: [k],
        swapping: [],
        sorted: [...sorted],
        description: `Placing ${rightArray[j]} from right subarray at position ${k}`,
      };

      array[k].value = rightArray[j];
      array[k].state = "swapping";
      j++;
    }

    yield {
      array: cloneArray(array),
      comparing: [],
      swapping: [k],
      sorted: [...sorted],
      description: `Merged element at position ${k}`,
    };

    k++;
  }

  // Copy remaining elements from left array
  while (i < leftSize) {
    array[k].value = leftArray[i];
    array[k].state = "swapping";

    yield {
      array: cloneArray(array),
      comparing: [],
      swapping: [k],
      sorted: [...sorted],
      description: `Copying remaining element ${leftArray[i]} at position ${k}`,
    };

    i++;
    k++;
  }

  // Copy remaining elements from right array
  while (j < rightSize) {
    array[k].value = rightArray[j];
    array[k].state = "swapping";

    yield {
      array: cloneArray(array),
      comparing: [],
      swapping: [k],
      sorted: [...sorted],
      description: `Copying remaining element ${rightArray[j]} at position ${k}`,
    };

    j++;
    k++;
  }

  // Mark merged region as sorted if it's the entire array
  if (left === 0 && right === array.length - 1) {
    for (let idx = left; idx <= right; idx++) {
      array[idx].state = "sorted";
      if (!sorted.includes(idx)) {
        sorted.push(idx);
      }
    }

    yield {
      array: cloneArray(array),
      comparing: [],
      swapping: [],
      sorted: [...sorted],
      description: "Merge sort complete!",
    };
  } else {
    // Mark this merged section
    for (let idx = left; idx <= right; idx++) {
      array[idx].state = "default";
    }

    yield {
      array: cloneArray(array),
      comparing: [],
      swapping: [],
      sorted: [...sorted],
      description: `Merged subarray [${left}..${right}]`,
    };
  }
}

// Get sorting generator based on algorithm
export const getSortingGenerator = (
  algorithm: string,
  array: ArrayBar[]
): Generator<SortingStep> => {
  const arr = array.map((item) => ({ ...item, state: "default" as const }));

  switch (algorithm) {
    case "bubble":
      return bubbleSortGenerator(arr);
    case "selection":
      return selectionSortGenerator(arr);
    case "insertion":
      return insertionSortGenerator(arr);
    case "merge":
      return mergeSortGenerator(arr);
    case "quick":
      return quickSortGenerator(arr);
    default:
      return bubbleSortGenerator(arr);
  }
};
