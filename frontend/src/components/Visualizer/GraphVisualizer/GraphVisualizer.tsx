import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Graph } from '../types';
import { useTheme } from '../../../contexts/ThemeContext';
import { useResizablePanel } from '../shared/hooks/useResizablePanel';
import { ControlPanel, GraphSVG, InfoPanel, GraphAlgorithm } from './components';
import {
  createDefaultGraph,
  calculateNodePositions,
  bfsGenerator,
  dfsGenerator,
  dijkstraGenerator,
  StepResult,
  NodePosition,
} from './utils/graphAlgorithms';

const GraphVisualizer: React.FC = () => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  
  const [graph, setGraph] = useState<Graph>(createDefaultGraph);
  const [positions, setPositions] = useState<NodePosition[]>([]);
  const [algorithm, setAlgorithm] = useState<GraphAlgorithm>('bfs');
  const [startNode, setStartNode] = useState<string>('A');
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [currentNode, setCurrentNode] = useState<string>('');
  const [visitedNodes, setVisitedNodes] = useState<string[]>([]);
  const [description, setDescription] = useState<string>('');
  const [showInfo, setShowInfo] = useState<boolean>(true);
  const [speed, setSpeed] = useState<number>(50);

  const { panelWidth, isResizing, panelRef, handleMouseDown } = useResizablePanel({ defaultWidth: 320 });

  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const generatorRef = useRef<Generator<StepResult> | null>(null);

  // Calculate positions when graph changes
  useEffect(() => {
    const width = 600;
    const height = 400;
    setPositions(calculateNodePositions(graph.nodes, width, height));
  }, [graph.nodes]);

  // Get generator based on algorithm
  const getGenerator = useCallback(() => {
    switch (algorithm) {
      case 'bfs':
        return bfsGenerator(graph, startNode);
      case 'dfs':
        return dfsGenerator(graph, startNode);
      case 'dijkstra':
        return dijkstraGenerator(graph, startNode);
    }
  }, [algorithm, graph, startNode]);

  // Run animation
  const runAlgorithm = useCallback(() => {
    if (isAnimating) return;

    setIsAnimating(true);
    setCurrentNode('');
    setVisitedNodes([]);
    setGraph(prev => ({
      ...prev,
      nodes: prev.nodes.map(n => ({ ...n, visited: false, distance: Infinity })),
    }));

    generatorRef.current = getGenerator();

    const animate = () => {
      if (!generatorRef.current) return;

      const result = generatorRef.current.next();

      if (!result.done && result.value) {
        const { nodes, current, visited, description } = result.value;
        setGraph(prev => ({ ...prev, nodes }));
        setCurrentNode(current);
        setVisitedNodes(visited);
        setDescription(description);

        const delay = Math.max(100, 1000 - speed * 9);
        animationRef.current = setTimeout(animate, delay);
      } else {
        setIsAnimating(false);
        setCurrentNode('');
      }
    };

    animate();
  }, [isAnimating, getGenerator, speed]);

  // Stop animation
  const stopAnimation = useCallback(() => {
    if (animationRef.current) {
      clearTimeout(animationRef.current);
    }
    setIsAnimating(false);
    generatorRef.current = null;
  }, []);

  // Reset graph
  const resetGraph = useCallback(() => {
    stopAnimation();
    setGraph(createDefaultGraph());
    setCurrentNode('');
    setVisitedNodes([]);
    setDescription('');
  }, [stopAnimation]);

  return (
    <div className={`flex flex-col h-full ${isDark ? 'bg-gray-900' : 'bg-slate-50'}`}>
      {/* Control Panel */}
      <ControlPanel
        isDark={isDark}
        algorithm={algorithm}
        setAlgorithm={setAlgorithm}
        startNode={startNode}
        setStartNode={setStartNode}
        speed={speed}
        setSpeed={setSpeed}
        nodes={graph.nodes}
        isAnimating={isAnimating}
        showInfo={showInfo}
        setShowInfo={setShowInfo}
        onRunAlgorithm={runAlgorithm}
        onStopAnimation={stopAnimation}
        onReset={resetGraph}
      />

      {/* Description */}
      {description && (
        <div className={`px-4 py-2 border-b ${isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-slate-50 border-slate-200'}`}>
          <p className="text-cyan-500 text-sm text-center">{description}</p>
        </div>
      )}

      {/* Main Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Graph Visualization */}
        <div ref={containerRef} className="flex-1 p-4 flex items-center justify-center">
          <GraphSVG
            isDark={isDark}
            graph={graph}
            positions={positions}
            currentNode={currentNode}
            visitedNodes={visitedNodes}
            algorithm={algorithm}
          />
        </div>

        {/* Info Panel */}
        {showInfo && (
          <InfoPanel
            isDark={isDark}
            panelWidth={panelWidth}
            isResizing={isResizing}
            handleMouseDown={handleMouseDown}
            panelRef={panelRef}
            algorithm={algorithm}
            visitedNodes={visitedNodes}
          />
        )}
      </div>
    </div>
  );
};

export default GraphVisualizer;
