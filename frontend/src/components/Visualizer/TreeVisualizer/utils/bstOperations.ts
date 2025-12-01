import { TreeNode } from '../../types';

// Generate random ID
export const generateId = (): string => Math.random().toString(36).substring(2, 9);

// BST Insert
export const insertNode = (root: TreeNode | null, value: number): TreeNode => {
  if (!root) {
    return { id: generateId(), value, left: null, right: null };
  }

  if (value < root.value) {
    root.left = insertNode(root.left, value);
  } else if (value > root.value) {
    root.right = insertNode(root.right, value);
  }

  return root;
};

// Find minimum node
export const findMin = (node: TreeNode): TreeNode => {
  while (node.left) {
    node = node.left;
  }
  return node;
};

// BST Delete
export const deleteNode = (root: TreeNode | null, value: number): TreeNode | null => {
  if (!root) return null;

  if (value < root.value) {
    root.left = deleteNode(root.left, value);
  } else if (value > root.value) {
    root.right = deleteNode(root.right, value);
  } else {
    if (!root.left) return root.right;
    if (!root.right) return root.left;

    const minNode = findMin(root.right);
    root.value = minNode.value;
    root.right = deleteNode(root.right, minNode.value);
  }

  return root;
};

// Traversal generators
export function* inorderTraversal(node: TreeNode | null): Generator<number> {
  if (!node) return;
  yield* inorderTraversal(node.left);
  yield node.value;
  yield* inorderTraversal(node.right);
}

export function* preorderTraversal(node: TreeNode | null): Generator<number> {
  if (!node) return;
  yield node.value;
  yield* preorderTraversal(node.left);
  yield* preorderTraversal(node.right);
}

export function* postorderTraversal(node: TreeNode | null): Generator<number> {
  if (!node) return;
  yield* postorderTraversal(node.left);
  yield* postorderTraversal(node.right);
  yield node.value;
}

export function* levelOrderTraversal(root: TreeNode | null): Generator<number> {
  if (!root) return;
  const queue: TreeNode[] = [root];
  while (queue.length > 0) {
    const node = queue.shift()!;
    yield node.value;
    if (node.left) queue.push(node.left);
    if (node.right) queue.push(node.right);
  }
}

// Deep clone tree
export const cloneTree = (node: TreeNode | null): TreeNode | null => {
  if (!node) return null;
  return {
    id: node.id,
    value: node.value,
    left: cloneTree(node.left),
    right: cloneTree(node.right),
    highlighted: false,
    visited: false,
  };
};

// Find and highlight node
export const highlightNode = (
  root: TreeNode | null,
  value: number,
  highlight: boolean
): TreeNode | null => {
  if (!root) return null;

  const newNode: TreeNode = {
    ...root,
    highlighted: root.value === value ? highlight : false,
    left: highlightNode(root.left, value, highlight),
    right: highlightNode(root.right, value, highlight),
  };

  return newNode;
};

// Mark node as visited
export const markVisited = (
  root: TreeNode | null,
  value: number
): TreeNode | null => {
  if (!root) return null;

  return {
    ...root,
    visited: root.value === value ? true : root.visited,
    left: markVisited(root.left, value),
    right: markVisited(root.right, value),
  };
};

// Clear highlights
export const clearHighlights = (root: TreeNode | null): TreeNode | null => {
  if (!root) return null;
  return {
    ...root,
    highlighted: false,
    visited: false,
    left: clearHighlights(root.left),
    right: clearHighlights(root.right),
  };
};

// Calculate tree depth
export const getTreeDepth = (node: TreeNode | null): number => {
  if (!node) return 0;
  return 1 + Math.max(getTreeDepth(node.left), getTreeDepth(node.right));
};

// Create initial tree
export const createInitialTree = (): TreeNode | null => {
  const initialValues = [50, 30, 70, 20, 40, 60, 80];
  let tree: TreeNode | null = null;
  initialValues.forEach(val => {
    tree = insertNode(tree, val);
  });
  return tree;
};
