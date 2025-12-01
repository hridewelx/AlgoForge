import React from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Plus,
  Minus,
  Search,
  Info,
} from 'lucide-react';

export type TraversalType = 'inorder' | 'preorder' | 'postorder' | 'levelorder';

interface ControlPanelProps {
  isDark: boolean;
  inputValue: string;
  setInputValue: (value: string) => void;
  searchValue: string;
  setSearchValue: (value: string) => void;
  traversalType: TraversalType;
  setTraversalType: (type: TraversalType) => void;
  isAnimating: boolean;
  showInfo: boolean;
  setShowInfo: (show: boolean) => void;
  onInsert: () => void;
  onDelete: () => void;
  onSearch: () => void;
  onRunTraversal: () => void;
  onStopAnimation: () => void;
  onReset: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  isDark,
  inputValue,
  setInputValue,
  searchValue,
  setSearchValue,
  traversalType,
  setTraversalType,
  isAnimating,
  showInfo,
  setShowInfo,
  onInsert,
  onDelete,
  onSearch,
  onRunTraversal,
  onStopAnimation,
  onReset,
}) => {
  return (
    <div className={`flex flex-wrap items-center justify-between gap-4 p-4 border-b ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200 shadow-sm'}`}>
      {/* Node Operations */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Value"
            disabled={isAnimating}
            className={`w-24 px-3 py-2 rounded-lg border focus:border-cyan-500 focus:outline-none disabled:opacity-50 ${isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-slate-900 border-slate-300'}`}
          />
          <button
            onClick={onInsert}
            disabled={isAnimating}
            className="p-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors disabled:opacity-50"
            title="Insert"
          >
            <Plus className="w-5 h-5 text-white" />
          </button>
          <button
            onClick={onDelete}
            disabled={isAnimating}
            className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50"
            title="Delete"
          >
            <Minus className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="number"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search"
            disabled={isAnimating}
            className={`w-24 px-3 py-2 rounded-lg border focus:border-cyan-500 focus:outline-none disabled:opacity-50 ${isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-slate-900 border-slate-300'}`}
          />
          <button
            onClick={onSearch}
            disabled={isAnimating}
            className="p-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors disabled:opacity-50"
            title="Search"
          >
            <Search className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Traversal Controls */}
      <div className="flex items-center gap-4">
        <select
          value={traversalType}
          onChange={(e) => setTraversalType(e.target.value as TraversalType)}
          disabled={isAnimating}
          className={`px-3 py-2 rounded-lg border focus:border-cyan-500 focus:outline-none disabled:opacity-50 ${isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-slate-900 border-slate-300'}`}
        >
          <option value="inorder">In-Order</option>
          <option value="preorder">Pre-Order</option>
          <option value="postorder">Post-Order</option>
          <option value="levelorder">Level-Order</option>
        </select>

        <button
          onClick={isAnimating ? onStopAnimation : onRunTraversal}
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
