// DSA Visualizer Type Definitions

// ==================== Array & Sorting Types ====================
export interface ArrayBar {
  value: number;
  id: string;
  state: 'default' | 'comparing' | 'swapping' | 'sorted' | 'pivot' | 'selected';
}

export interface SortingStep {
  array: ArrayBar[];
  comparing: number[];
  swapping: number[];
  sorted: number[];
  description: string;
}

export type SortingAlgorithm = 'bubble' | 'selection' | 'insertion' | 'merge' | 'quick' | 'heap';

// Tree Types
export interface TreeNode {
  id: string;
  value: number;
  left: TreeNode | null;
  right: TreeNode | null;
  x?: number;
  y?: number;
  state?: 'default' | 'visiting' | 'visited' | 'found' | 'path';
  highlighted?: boolean;
  visited?: boolean;
}

export interface BSTOperation {
  type: 'insert' | 'delete' | 'search';
  value: number;
  path: string[];
}

export type TreeTraversal = 'inorder' | 'preorder' | 'postorder' | 'levelorder';

// Graph Types
export interface GraphNode {
  id: string;
  label: string;
  x?: number;
  y?: number;
  state?: 'default' | 'visiting' | 'visited' | 'current' | 'path' | 'start' | 'end';
  visited?: boolean;
  distance?: number;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  weight?: number;
  state?: 'default' | 'considering' | 'selected' | 'path' | 'rejected';
  directed?: boolean;
}

export interface Graph {
  nodes: GraphNode[];
  edges: GraphEdge[];
  directed?: boolean;
  weighted?: boolean;
}

export type GraphAlgorithm = 'bfs' | 'dfs' | 'dijkstra' | 'bellman-ford' | 'kruskal' | 'prim';

// Linked List Types
export interface ListNode {
  id: string;
  value: number;
  next: string | null;
  state: 'default' | 'current' | 'visited' | 'found' | 'new';
}

export interface LinkedList {
  head: string | null;
  nodes: Map<string, ListNode>;
}

// Stack & Queue Types
export interface StackQueueItem {
  id: string;
  value: number;
  state: 'default' | 'pushing' | 'popping' | 'peek';
}

// Visualization State
export interface VisualizationState {
  isPlaying: boolean;
  isPaused: boolean;
  speed: number;
  currentStep: number;
  totalSteps: number;
}

export interface VisualizerSettings {
  speed: number;
  dataSize: number;
  theme: 'dark' | 'light';
  showValues: boolean;
  soundEnabled: boolean;
}

// Component Props
export interface ArrayVisualizerProps {
  array: ArrayBar[];
  maxValue: number;
  showValues?: boolean;
  height?: number;
}

export interface TreeVisualizerProps {
  root: TreeNode | null;
  width?: number;
  height?: number;
  showValues?: boolean;
}

export interface GraphVisualizerProps {
  graph: Graph;
  width?: number;
  height?: number;
  showWeights?: boolean;
}

export interface ControlPanelProps {
  state: VisualizationState;
  settings: VisualizerSettings;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onSpeedChange: (speed: number) => void;
  onSizeChange: (size: number) => void;
}

// Algorithm Info
export interface AlgorithmInfo {
  name: string;
  timeComplexity: {
    best: string;
    average: string;
    worst: string;
  };
  spaceComplexity: string;
  description: string;
  stable?: boolean;
  inPlace?: boolean;
  pseudocode?: string;
}

export const ALGORITHM_INFO: Record<string, AlgorithmInfo> = {
  bubble: {
    name: 'Bubble Sort',
    timeComplexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
    spaceComplexity: 'O(1)',
    description: 'Repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.',
    stable: true,
    inPlace: true,
    pseudocode: `for i = 0 to n-1
  for j = 0 to n-i-1
    if arr[j] > arr[j+1]
      swap(arr[j], arr[j+1])`,
  },
  selection: {
    name: 'Selection Sort',
    timeComplexity: { best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)' },
    spaceComplexity: 'O(1)',
    description: 'Divides the input into a sorted and unsorted region, and iteratively selects the smallest element from the unsorted region.',
    stable: false,
    inPlace: true,
    pseudocode: `for i = 0 to n-1
  min_idx = i
  for j = i+1 to n
    if arr[j] < arr[min_idx]
      min_idx = j
  swap(arr[i], arr[min_idx])`,
  },
  insertion: {
    name: 'Insertion Sort',
    timeComplexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
    spaceComplexity: 'O(1)',
    description: 'Builds the sorted array one item at a time by repeatedly picking the next item and inserting it into the sorted portion.',
    stable: true,
    inPlace: true,
    pseudocode: `for i = 1 to n
  key = arr[i]
  j = i - 1
  while j >= 0 and arr[j] > key
    arr[j+1] = arr[j]
    j = j - 1
  arr[j+1] = key`,
  },
  merge: {
    name: 'Merge Sort',
    timeComplexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
    spaceComplexity: 'O(n)',
    description: 'Divides the array into halves, recursively sorts them, and then merges the sorted halves.',
    stable: true,
    inPlace: false,
    pseudocode: `mergeSort(arr, l, r)
  if l < r
    m = (l + r) / 2
    mergeSort(arr, l, m)
    mergeSort(arr, m+1, r)
    merge(arr, l, m, r)`,
  },
  quick: {
    name: 'Quick Sort',
    timeComplexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)' },
    spaceComplexity: 'O(log n)',
    description: 'Selects a pivot element and partitions the array around the pivot, then recursively sorts the partitions.',
    stable: false,
    inPlace: true,
    pseudocode: `quickSort(arr, low, high)
  if low < high
    pi = partition(arr, low, high)
    quickSort(arr, low, pi-1)
    quickSort(arr, pi+1, high)`,
  },
  heap: {
    name: 'Heap Sort',
    timeComplexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
    spaceComplexity: 'O(1)',
    description: 'Converts the array into a heap data structure, then repeatedly extracts the maximum element.',
    stable: false,
    inPlace: true,
    pseudocode: `heapSort(arr)
  buildMaxHeap(arr)
  for i = n-1 to 1
    swap(arr[0], arr[i])
    heapify(arr, 0, i)`,
  },
  bfs: {
    name: 'Breadth-First Search',
    timeComplexity: { best: 'O(V+E)', average: 'O(V+E)', worst: 'O(V+E)' },
    spaceComplexity: 'O(V)',
    description: 'Explores all neighbors at the present depth before moving to nodes at the next depth level.',
  },
  dfs: {
    name: 'Depth-First Search',
    timeComplexity: { best: 'O(V+E)', average: 'O(V+E)', worst: 'O(V+E)' },
    spaceComplexity: 'O(V)',
    description: 'Explores as far as possible along each branch before backtracking.',
  },
  dijkstra: {
    name: "Dijkstra's Algorithm",
    timeComplexity: { best: 'O((V+E) log V)', average: 'O((V+E) log V)', worst: 'O((V+E) log V)' },
    spaceComplexity: 'O(V)',
    description: 'Finds the shortest path from a source node to all other nodes in a weighted graph.',
  },
};
