import React from 'react';
import { StatsCard, FunFact } from '../../shared';
import {
  TreePine,
  Target,
  Layers,
  BookOpen,
  Lightbulb,
} from 'lucide-react';

interface InfoPanelProps {
  isDark: boolean;
  panelWidth: number;
  isResizing: boolean;
  handleMouseDown: (e: React.MouseEvent) => void;
  panelRef: React.RefObject<HTMLDivElement | null>;
}

const InfoPanel: React.FC<InfoPanelProps> = ({
  isDark,
  panelWidth,
  isResizing,
  handleMouseDown,
  panelRef,
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
          <TreePine className="w-5 h-5 text-cyan-500" />
          Binary Search Tree
        </h3>

        <div className="space-y-4">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-2">
            <StatsCard isDark={isDark} label="Avg Case" value="O(log n)" type="best" />
            <StatsCard isDark={isDark} label="Worst" value="O(n)" type="worst" />
          </div>

          {/* Key Properties */}
          <div className={`rounded-xl p-4 ${isDark ? 'bg-gray-700/50' : 'bg-slate-50 border border-slate-200'}`}>
            <h4 className={`text-sm font-semibold mb-3 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
              <Target className="w-4 h-4 text-cyan-500" />
              Key Properties
            </h4>
            <ul className={`text-sm space-y-2 ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>
              <li className="flex items-start gap-2">
                <span className="text-cyan-500 mt-0.5">→</span>
                <span><strong>Left subtree</strong> contains only nodes with values <span className="text-cyan-500 font-medium">less than</span> the parent</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-500 mt-0.5">→</span>
                <span><strong>Right subtree</strong> contains only nodes with values <span className="text-cyan-500 font-medium">greater than</span> the parent</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-500 mt-0.5">→</span>
                <span><strong>In-order traversal</strong> gives a <span className="text-green-500 font-medium">sorted sequence</span></span>
              </li>
            </ul>
          </div>

          {/* Operations */}
          <div className={`rounded-xl p-4 ${isDark ? 'bg-gray-700/50' : 'bg-slate-50 border border-slate-200'}`}>
            <h4 className={`text-sm font-semibold mb-3 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
              <Layers className="w-4 h-4 text-purple-500" />
              Operations Complexity
            </h4>
            <div className="space-y-2">
              {[
                { op: '🔍 Search', time: 'O(log n)' },
                { op: '➕ Insert', time: 'O(log n)' },
                { op: '➖ Delete', time: 'O(log n)' },
                { op: '📊 Space', time: 'O(n)' },
              ].map((item) => (
                <div key={item.op} className="flex justify-between items-center">
                  <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>{item.op}</span>
                  <span className={`text-sm font-medium px-2 py-0.5 rounded ${isDark ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700'}`}>{item.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Traversal Guide */}
          <div className={`rounded-xl p-4 ${isDark ? 'bg-gradient-to-br from-cyan-900/20 to-blue-900/20 border border-cyan-800/30' : 'bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200'}`}>
            <h4 className={`text-sm font-semibold mb-3 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
              <BookOpen className="w-4 h-4 text-cyan-500" />
              Traversal Guide
            </h4>
            <div className="space-y-3">
              {[
                { name: 'In-Order (LNR)', desc: 'Left → Node → Right', note: '📌 Gives sorted output!', color: 'text-cyan-500' },
                { name: 'Pre-Order (NLR)', desc: 'Node → Left → Right', note: '📌 Used to copy/serialize trees', color: 'text-purple-500' },
                { name: 'Post-Order (LRN)', desc: 'Left → Right → Node', note: '📌 Used to delete trees', color: 'text-orange-500' },
                { name: 'Level-Order (BFS)', desc: 'Level by level traversal', note: '📌 Uses a queue', color: 'text-green-500' },
              ].map((item) => (
                <div key={item.name} className={`p-2 rounded-lg ${isDark ? 'bg-gray-800/50' : 'bg-white'}`}>
                  <p className={`${item.color} font-semibold text-sm`}>{item.name}</p>
                  <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>{item.desc}</p>
                  <p className={`text-xs ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>{item.note}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className={`rounded-xl p-4 ${isDark ? 'bg-gray-700/50' : 'bg-slate-50 border border-slate-200'}`}>
            <h4 className={`text-sm font-semibold mb-3 ${isDark ? 'text-white' : 'text-slate-800'}`}>Legend</h4>
            <div className="flex flex-wrap gap-3">
              {[
                { color: 'bg-cyan-500', label: 'Default' },
                { color: 'bg-yellow-500', label: 'Current' },
                { color: 'bg-green-500', label: 'Visited' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <div className={`w-4 h-4 ${item.color} rounded-full`} />
                  <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Fun Fact */}
          <FunFact
            isDark={isDark}
            fact="A balanced BST with n nodes has a height of only log₂(n)! That means with 1 million nodes, you only need ~20 comparisons to find any value. Self-balancing variants like AVL and Red-Black trees ensure this efficiency is maintained."
          />

          {/* When to Use */}
          <div className={`rounded-xl p-4 ${isDark ? 'bg-gray-700/50' : 'bg-slate-50 border border-slate-200'}`}>
            <h4 className={`text-sm font-semibold mb-3 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
              <Lightbulb className="w-4 h-4 text-yellow-500" />
              When to Use BST
            </h4>
            <ul className={`text-sm space-y-2 ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>
              {[
                'Need fast search, insert & delete',
                'Implementing dictionaries & sets',
                'Priority queues (with modifications)',
                'Database indexing systems',
              ].map((use, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-cyan-500 mt-0.5">→</span>
                  <span>{use}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoPanel;
