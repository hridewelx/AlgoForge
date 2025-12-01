import React from 'react';
import { GraphNode } from '../../types';
import {
  Play,
  Pause,
  RotateCcw,
  Info,
} from 'lucide-react';

export type GraphAlgorithm = 'bfs' | 'dfs' | 'dijkstra';

interface ControlPanelProps {
  isDark: boolean;
  algorithm: GraphAlgorithm;
  setAlgorithm: (algorithm: GraphAlgorithm) => void;
  startNode: string;
  setStartNode: (node: string) => void;
  speed: number;
  setSpeed: (speed: number) => void;
  nodes: GraphNode[];
  isAnimating: boolean;
  showInfo: boolean;
  setShowInfo: (show: boolean) => void;
  onRunAlgorithm: () => void;
  onStopAnimation: () => void;
  onReset: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  isDark,
  algorithm,
  setAlgorithm,
  startNode,
  setStartNode,
  speed,
  setSpeed,
  nodes,
  isAnimating,
  showInfo,
  setShowInfo,
  onRunAlgorithm,
  onStopAnimation,
  onReset,
}) => {
  return (
    <div className={`flex flex-wrap items-center justify-between gap-4 p-4 border-b ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200 shadow-sm'}`}>
      {/* Algorithm Selection */}
      <div className="flex items-center gap-4">
        <div className="flex flex-col">
          <label className={`text-xs mb-1 ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>Algorithm</label>
          <select
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value as GraphAlgorithm)}
            disabled={isAnimating}
            className={`px-3 py-2 rounded-lg border focus:border-cyan-500 focus:outline-none disabled:opacity-50 ${isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-slate-900 border-slate-300'}`}
          >
            <option value="bfs">BFS (Breadth-First)</option>
            <option value="dfs">DFS (Depth-First)</option>
            <option value="dijkstra">Dijkstra's Algorithm</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className={`text-xs mb-1 ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>Start Node</label>
          <select
            value={startNode}
            onChange={(e) => setStartNode(e.target.value)}
            disabled={isAnimating}
            className={`px-3 py-2 rounded-lg border focus:border-cyan-500 focus:outline-none disabled:opacity-50 ${isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-slate-900 border-slate-300'}`}
          >
            {nodes.map(node => (
              <option key={node.id} value={node.id}>
                Node {node.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className={`text-xs mb-1 ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
            Speed: {speed}%
          </label>
          <input
            type="range"
            min="1"
            max="100"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className={`w-24 h-2 rounded-lg appearance-none cursor-pointer accent-cyan-500 ${isDark ? 'bg-gray-700' : 'bg-slate-200'}`}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={isAnimating ? onStopAnimation : onRunAlgorithm}
          className={`p-3 rounded-lg transition-colors ${
            isAnimating
              ? 'bg-red-600 hover:bg-red-700'
              : 'bg-cyan-600 hover:bg-cyan-700'
          }`}
        >
          {isAnimating ? (
            <Pause className="w-6 h-6 text-white" />
          ) : (
            <Play className="w-6 h-6 text-white" />
          )}
        </button>

        <button
          onClick={onReset}
          disabled={isAnimating}
          className={`p-2 rounded-lg transition-colors disabled:opacity-50 ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-slate-100 hover:bg-slate-200'}`}
          title="Reset"
        >
          <RotateCcw className={`w-5 h-5 ${isDark ? 'text-white' : 'text-slate-700'}`} />
        </button>

        <button
          onClick={() => setShowInfo(!showInfo)}
          className={`p-2 rounded-lg transition-colors ${
            showInfo ? 'bg-cyan-600' : isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-slate-100 hover:bg-slate-200'
          }`}
        >
          <Info className={`w-5 h-5 ${showInfo ? 'text-white' : isDark ? 'text-white' : 'text-slate-700'}`} />
        </button>
      </div>
    </div>
  );
};

export default ControlPanel;
