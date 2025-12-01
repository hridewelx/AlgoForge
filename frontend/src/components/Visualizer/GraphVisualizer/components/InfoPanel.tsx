import React from 'react';
import {
  Network,
  ArrowRight,
  Lightbulb,
  BookOpen,
  Target,
  Clock,
  Layers,
  Route,
  Zap,
} from 'lucide-react';
import { GraphAlgorithm } from './ControlPanel';

interface InfoPanelProps {
  isDark: boolean;
  panelWidth: number;
  isResizing: boolean;
  handleMouseDown: (e: React.MouseEvent) => void;
  panelRef: React.RefObject<HTMLDivElement | null>;
  algorithm: GraphAlgorithm;
  visitedNodes: string[];
}

const InfoPanel: React.FC<InfoPanelProps> = ({
  isDark,
  panelWidth,
  isResizing,
  handleMouseDown,
  panelRef,
  algorithm,
  visitedNodes,
}) => {
  return (
    <div 
      ref={panelRef}
      className={`relative border-l overflow-y-auto flex-shrink-0 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200'}`}
      style={{ width: panelWidth }}
    >
      {/* Resize Handle */}
      <div
        onMouseDown={handleMouseDown}
        className={`absolute left-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-cyan-500 transition-colors z-10 ${
          isResizing ? 'bg-cyan-500' : isDark ? 'bg-gray-700' : 'bg-slate-200'
        }`}
      />

      <div className="p-4 pl-3">
        <h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          <Network className="w-5 h-5 text-cyan-500" />
          {algorithm === 'bfs' && 'Breadth-First Search'}
          {algorithm === 'dfs' && 'Depth-First Search'}
          {algorithm === 'dijkstra' && "Dijkstra's Algorithm"}
        </h3>

        <div className="space-y-4">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-2">
            <div className={`rounded-lg p-3 text-center ${isDark ? 'bg-gradient-to-br from-green-900/30 to-green-800/20 border border-green-700/30' : 'bg-gradient-to-br from-green-50 to-green-100 border border-green-200'}`}>
              <Clock className="w-4 h-4 mx-auto mb-1 text-green-500" />
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>Time</p>
              <p className={`text-sm font-bold ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                {algorithm === 'dijkstra' ? 'O((V+E)logV)' : 'O(V + E)'}
              </p>
            </div>
            <div className={`rounded-lg p-3 text-center ${isDark ? 'bg-gradient-to-br from-purple-900/30 to-purple-800/20 border border-purple-700/30' : 'bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200'}`}>
              <Layers className="w-4 h-4 mx-auto mb-1 text-purple-500" />
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>Space</p>
              <p className={`text-sm font-bold ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>O(V)</p>
            </div>
          </div>

          {/* How It Works */}
          <div className={`rounded-xl p-4 ${isDark ? 'bg-gray-700/50' : 'bg-slate-50 border border-slate-200'}`}>
            <h4 className={`text-sm font-semibold mb-3 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
              <Lightbulb className="w-4 h-4 text-yellow-500" />
              How It Works
            </h4>
            <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>
              {algorithm === 'bfs' && "BFS explores the graph layer by layer, like ripples in a pond. Starting from a node, it visits ALL neighbors first before moving deeper. Uses a queue (FIFO) to track which nodes to visit next."}
              {algorithm === 'dfs' && "DFS dives deep into the graph, exploring as far as possible along each branch before backtracking. Think of it like navigating a maze - go until you hit a dead end, then backtrack. Uses a stack (LIFO) or recursion."}
              {algorithm === 'dijkstra' && "Dijkstra's algorithm finds the shortest path to ALL nodes from a starting point. It greedily picks the closest unvisited node, updates distances to its neighbors, and repeats. Uses a priority queue for efficiency."}
            </p>
          </div>

          {/* Data Structure Used */}
          <div className={`rounded-xl p-4 ${isDark ? 'bg-gradient-to-br from-cyan-900/20 to-blue-900/20 border border-cyan-800/30' : 'bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200'}`}>
            <h4 className={`text-sm font-semibold mb-3 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
              <Route className="w-4 h-4 text-cyan-500" />
              Data Structure
            </h4>
            <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-800/50' : 'bg-white'}`}>
              {algorithm === 'bfs' && (
                <>
                  <p className="text-cyan-500 font-semibold text-sm">Queue (FIFO)</p>
                  <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>First In, First Out</p>
                  <p className={`text-xs ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>📌 Ensures level-by-level exploration</p>
                </>
              )}
              {algorithm === 'dfs' && (
                <>
                  <p className="text-purple-500 font-semibold text-sm">Stack (LIFO)</p>
                  <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>Last In, First Out</p>
                  <p className={`text-xs ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>📌 Enables deep exploration & backtracking</p>
                </>
              )}
              {algorithm === 'dijkstra' && (
                <>
                  <p className="text-orange-500 font-semibold text-sm">Priority Queue (Min-Heap)</p>
                  <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>Always extracts minimum distance</p>
                  <p className={`text-xs ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>📌 Greedy selection of closest node</p>
                </>
              )}
            </div>
          </div>

          {/* Use Cases */}
          <div className={`rounded-xl p-4 ${isDark ? 'bg-gray-700/50' : 'bg-slate-50 border border-slate-200'}`}>
            <h4 className={`text-sm font-semibold mb-3 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
              <Target className="w-4 h-4 text-cyan-500" />
              Real-World Applications
            </h4>
            <ul className={`text-sm space-y-2 ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>
              {algorithm === 'bfs' && (
                <>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-500 mt-0.5">→</span>
                    <span><strong>Social Networks:</strong> Finding friends within N degrees</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-500 mt-0.5">→</span>
                    <span><strong>Web Crawlers:</strong> Indexing websites level by level</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-500 mt-0.5">→</span>
                    <span><strong>Shortest Path:</strong> Unweighted graphs (min edges)</span>
                  </li>
                </>
              )}
              {algorithm === 'dfs' && (
                <>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-500 mt-0.5">→</span>
                    <span><strong>Maze Solving:</strong> Find any path to the exit</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-500 mt-0.5">→</span>
                    <span><strong>Topological Sort:</strong> Task scheduling with dependencies</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-500 mt-0.5">→</span>
                    <span><strong>Cycle Detection:</strong> Finding loops in graphs</span>
                  </li>
                </>
              )}
              {algorithm === 'dijkstra' && (
                <>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-500 mt-0.5">→</span>
                    <span><strong>GPS Navigation:</strong> Finding fastest routes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-500 mt-0.5">→</span>
                    <span><strong>Network Routing:</strong> OSPF protocol in routers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-500 mt-0.5">→</span>
                    <span><strong>Flight Planning:</strong> Cheapest flight connections</span>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Legend */}
          <div className={`rounded-xl p-4 ${isDark ? 'bg-gray-700/50' : 'bg-slate-50 border border-slate-200'}`}>
            <h4 className={`text-sm font-semibold mb-3 ${isDark ? 'text-white' : 'text-slate-800'}`}>
              Legend
            </h4>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-cyan-500 rounded-full" />
                <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>Unvisited</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-500 rounded-full" />
                <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>Current</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded-full" />
                <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>Visited</span>
              </div>
            </div>
          </div>

          {/* Visited Order */}
          {visitedNodes.length > 0 && (
            <div className={`rounded-xl p-4 ${isDark ? 'bg-gradient-to-br from-green-900/20 to-emerald-900/20 border border-green-800/30' : 'bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200'}`}>
              <h4 className={`text-sm font-semibold mb-3 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                <Zap className="w-4 h-4 text-green-500" />
                Visit Order
              </h4>
              <div className="flex flex-wrap items-center gap-1">
                {visitedNodes.map((node, index) => (
                  <React.Fragment key={node}>
                    <span className="text-white font-medium bg-green-600 px-2 py-1 rounded text-sm">
                      {node}
                    </span>
                    {index < visitedNodes.length - 1 && (
                      <ArrowRight className={`w-4 h-4 ${isDark ? 'text-gray-500' : 'text-slate-400'}`} />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}

          {/* Fun Fact */}
          <div className={`rounded-xl p-4 ${isDark ? 'bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-800/30' : 'bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200'}`}>
            <h4 className={`text-sm font-semibold mb-2 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
              💡 Did You Know?
            </h4>
            <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>
              {algorithm === 'bfs' && "BFS was first invented for solving mazes! It was published in 1959 by E.F. Moore for finding the shortest path out of a maze."}
              {algorithm === 'dfs' && "DFS is the backbone of many advanced algorithms like finding strongly connected components (Tarjan's algorithm) and solving Sudoku puzzles!"}
              {algorithm === 'dijkstra' && "Dijkstra invented his famous algorithm in just 20 minutes while having coffee! It was 1956, and he was thinking about the shortest route from Rotterdam to Groningen."}
            </p>
          </div>

          {/* BFS vs DFS comparison - only show for BFS/DFS */}
          {(algorithm === 'bfs' || algorithm === 'dfs') && (
            <div className={`rounded-xl p-4 ${isDark ? 'bg-gray-700/50' : 'bg-slate-50 border border-slate-200'}`}>
              <h4 className={`text-sm font-semibold mb-3 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                <BookOpen className="w-4 h-4 text-cyan-500" />
                BFS vs DFS
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className={isDark ? 'text-gray-400' : 'text-slate-500'}>Memory</span>
                  <span className={isDark ? 'text-gray-300' : 'text-slate-600'}>BFS uses more (stores entire level)</span>
                </div>
                <div className="flex justify-between">
                  <span className={isDark ? 'text-gray-400' : 'text-slate-500'}>Shortest Path</span>
                  <span className={isDark ? 'text-gray-300' : 'text-slate-600'}>BFS guarantees it (unweighted)</span>
                </div>
                <div className="flex justify-between">
                  <span className={isDark ? 'text-gray-400' : 'text-slate-500'}>Deep Graphs</span>
                  <span className={isDark ? 'text-gray-300' : 'text-slate-600'}>DFS is more memory efficient</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InfoPanel;
