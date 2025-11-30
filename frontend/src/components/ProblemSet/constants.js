// All available tags for filtering problems
export const ALL_TAGS = [
  "Array",
  "String",
  "Hash Table",
  "Math",
  "Dynamic Programming",
  "Sorting",
  "Greedy",
  "Depth-First Search",
  "Binary Search",
  "Database",
  "Matrix",
  "Bit Manipulation",
  "Tree",
  "Breadth-First Search",
  "Two Pointers",
  "Prefix Sum",
  "Heap (Priority Queue)",
  "Simulation",
  "Counting",
  "Graph",
  "Binary Tree",
  "Stack",
  "Sliding Window",
  "Design",
  "Enumeration",
  "Backtracking",
  "Union Find",
  "Number Theory",
  "Linked List",
  "Ordered Set",
  "Monotonic Stack",
  "Segment Tree",
  "Trie",
  "Combinatorics",
  "Divide and Conquer",
  "Bitmask",
  "Queue",
  "Recursion",
  "Geometry",
  "Binary Indexed Tree",
  "Memoization",
  "Hash Function",
  "Binary Search Tree",
  "Shortest Path",
  "String Matching",
  "Topological Sort",
  "Rolling Hash",
  "Game Theory",
  "Interactive",
  "Data Stream",
  "Monotonic Queue",
  "Brainteaser",
  "Doubly-Linked List",
  "Randomized",
  "Merge Sort",
  "Counting Sort",
  "Iterator",
  "Concurrency",
  "Line Sweep",
  "Probability and Statistics",
  "Quickselect",
  "Suffix Array",
  "Minimum Spanning Tree",
  "Bucket Sort",
  "Shell",
  "Reservoir Sampling",
  "Strongly Connected Component",
  "Eulerian Circuit",
  "Radix Sort",
  "Rejection Sampling",
  "Biconnected Component",
].sort((a, b) => a.localeCompare(b));

// Problems per page for pagination
export const PROBLEMS_PER_PAGE = 20;

// Difficulty color mapping
export const getDifficultyColor = (difficulty) => {
  switch (difficulty?.toLowerCase()) {
    case "easy":
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    case "medium":
      return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
    case "hard":
      return "bg-rose-500/10 text-rose-400 border-rose-500/20";
    default:
      return "bg-slate-500/10 text-slate-400 border-slate-500/20";
  }
};
