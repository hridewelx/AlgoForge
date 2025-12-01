import React, { useState, useEffect, useRef, useCallback } from 'react';
import { TreeNode as TreeNodeType } from '../types';
import { useTheme } from '../../../contexts/ThemeContext';
import { useResizablePanel } from '../shared/hooks/useResizablePanel';
import { ControlPanel, TreeNode, InfoPanel } from './components';
import {
  insertNode,
  deleteNode,
  cloneTree,
  highlightNode,
  markVisited,
  clearHighlights,
  getTreeDepth,
  inorderTraversal,
  preorderTraversal,
  postorderTraversal,
  levelOrderTraversal,
} from './utils/bstOperations';

export type TraversalType = 'inorder' | 'preorder' | 'postorder' | 'levelorder';

const TreeVisualizer: React.FC = () => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  
  const [root, setRoot] = useState<TreeNodeType | null>(null);
  const [inputValue, setInputValue] = useState<string>('');
  const [searchValue, setSearchValue] = useState<string>('');
  const [traversalType, setTraversalType] = useState<TraversalType>('inorder');
  const [traversalResult, setTraversalResult] = useState<number[]>([]);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [showInfo, setShowInfo] = useState<boolean>(true);
  const [message, setMessage] = useState<string>('');

  const { panelWidth, isResizing, panelRef, handleMouseDown } = useResizablePanel({ defaultWidth: 320 });
  const animationRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Initialize with some nodes
  useEffect(() => {
    const initialValues = [50, 30, 70, 20, 40, 60, 80];
    let tree: TreeNodeType | null = null;
    initialValues.forEach(val => {
      tree = insertNode(tree, val);
    });
    setRoot(tree);
  }, []);

  // Insert node
  const handleInsert = useCallback(() => {
    const value = parseInt(inputValue);
    if (isNaN(value)) {
      setMessage('Please enter a valid number');
      return;
    }

    setRoot(prev => insertNode(cloneTree(prev), value));
    setInputValue('');
    setMessage(`Inserted ${value}`);
  }, [inputValue]);

  // Delete node
  const handleDelete = useCallback(() => {
    const value = parseInt(inputValue);
    if (isNaN(value)) {
      setMessage('Please enter a valid number');
      return;
    }

    setRoot(prev => deleteNode(cloneTree(prev), value));
    setInputValue('');
    setMessage(`Deleted ${value}`);
  }, [inputValue]);

  // Search node
  const handleSearch = useCallback(() => {
    const value = parseInt(searchValue);
    if (isNaN(value)) {
      setMessage('Please enter a valid number');
      return;
    }

    setRoot(prev => highlightNode(cloneTree(prev), value, true));
    setMessage(`Searching for ${value}`);

    setTimeout(() => {
      setRoot(prev => highlightNode(cloneTree(prev), value, false));
    }, 2000);
  }, [searchValue]);

  // Run traversal animation
  const runTraversal = useCallback(async () => {
    if (!root || isAnimating) return;

    setIsAnimating(true);
    setTraversalResult([]);
    setRoot(prev => clearHighlights(cloneTree(prev)));

    let generator: Generator<number>;
    switch (traversalType) {
      case 'inorder':
        generator = inorderTraversal(root);
        break;
      case 'preorder':
        generator = preorderTraversal(root);
        break;
      case 'postorder':
        generator = postorderTraversal(root);
        break;
      case 'levelorder':
        generator = levelOrderTraversal(root);
        break;
    }

    const results: number[] = [];
    
    const animate = () => {
      const result = generator.next();
      if (!result.done) {
        const value = result.value;
        results.push(value);
        setTraversalResult([...results]);
        setRoot(prev => {
          const highlighted = highlightNode(cloneTree(prev), value, true);
          return markVisited(highlighted, value);
        });

        animationRef.current = setTimeout(() => {
          setRoot(prev => highlightNode(cloneTree(prev), value, false));
          setTimeout(animate, 300);
        }, 500);
      } else {
        setIsAnimating(false);
        setMessage(`${traversalType.charAt(0).toUpperCase() + traversalType.slice(1)} traversal complete`);
      }
    };

    animate();
  }, [root, traversalType, isAnimating]);

  // Stop animation
  const stopAnimation = useCallback(() => {
    if (animationRef.current) {
      clearTimeout(animationRef.current);
    }
    setIsAnimating(false);
    setRoot(prev => clearHighlights(cloneTree(prev)));
  }, []);

  // Reset tree
  const resetTree = useCallback(() => {
    stopAnimation();
    const initialValues = [50, 30, 70, 20, 40, 60, 80];
    let tree: TreeNodeType | null = null;
    initialValues.forEach(val => {
      tree = insertNode(tree, val);
    });
    setRoot(tree);
    setTraversalResult([]);
    setMessage('Tree reset to default');
  }, [stopAnimation]);

  const treeDepth = getTreeDepth(root);
  const svgWidth = Math.max(800, Math.pow(2, treeDepth) * 60);
  const svgHeight = Math.max(400, treeDepth * 100 + 100);

  return (
    <div className={`flex flex-col h-full ${isDark ? 'bg-gray-900' : 'bg-slate-50'}`}>
      {/* Control Panel */}
      <ControlPanel
        isDark={isDark}
        inputValue={inputValue}
        setInputValue={setInputValue}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        traversalType={traversalType}
        setTraversalType={setTraversalType}
        isAnimating={isAnimating}
        showInfo={showInfo}
        setShowInfo={setShowInfo}
        onInsert={handleInsert}
        onDelete={handleDelete}
        onSearch={handleSearch}
        onRunTraversal={runTraversal}
        onStopAnimation={stopAnimation}
        onReset={resetTree}
      />

      {/* Message */}
      {message && (
        <div className={`px-4 py-2 border-b ${isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-slate-50 border-slate-200'}`}>
          <p className="text-cyan-500 text-sm text-center">{message}</p>
        </div>
      )}

      {/* Traversal Result */}
      {traversalResult.length > 0 && (
        <div className={`px-4 py-2 border-b ${isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-slate-50 border-slate-200'}`}>
          <p className={`text-sm text-center ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <span className={isDark ? 'text-gray-400' : 'text-slate-500'}>Traversal: </span>
            {traversalResult.join(' → ')}
          </p>
        </div>
      )}

      {/* Main Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Tree Visualization */}
        <div className="flex-1 overflow-auto p-4">
          <svg
            width={svgWidth}
            height={svgHeight}
            className="mx-auto"
            style={{ minWidth: '100%', minHeight: '100%' }}
          >
            {root && (
              <TreeNode
                node={root}
                x={svgWidth / 2}
                y={50}
                level={1}
                maxLevel={10}
                spacing={svgWidth / 4}
                highlighted={root.highlighted || false}
                visited={root.visited || false}
              />
            )}
          </svg>
        </div>

        {/* Info Panel */}
        {showInfo && (
          <InfoPanel
            isDark={isDark}
            panelWidth={panelWidth}
            isResizing={isResizing}
            handleMouseDown={handleMouseDown}
            panelRef={panelRef}
          />
        )}
      </div>
    </div>
  );
};

export default TreeVisualizer;
