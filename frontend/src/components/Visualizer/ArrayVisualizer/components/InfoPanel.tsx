import React from "react";
import { SortingAlgorithm, ALGORITHM_INFO } from "../../types";
import { InfoPanelWrapper, StatsCard, FunFact } from "../../shared";
import {
  Zap,
  Target,
  Lightbulb,
  BookOpen,
  PanelRightClose,
  PanelRightOpen,
} from "lucide-react";

interface InfoPanelProps {
  algorithm: SortingAlgorithm;
  isDark: boolean;
  isPanelMinimized: boolean;
  setIsPanelMinimized: (value: boolean) => void;
  panelWidth: number;
  isResizing: boolean;
  handleMouseDown: (e: React.MouseEvent) => void;
  panelRef: React.RefObject<HTMLDivElement | null>;
}

const InfoPanel: React.FC<InfoPanelProps> = ({
  algorithm,
  isDark,
  isPanelMinimized,
  setIsPanelMinimized,
  panelWidth,
  isResizing,
  handleMouseDown,
  panelRef,
}) => {
  const algoInfo = ALGORITHM_INFO[algorithm];

  const funFacts: Record<SortingAlgorithm, string> = {
    bubble: "Bubble Sort is called 'sinking sort' because smaller elements 'bubble' to the top while larger ones 'sink' to the bottom!",
    selection: "Selection Sort always makes exactly n(n-1)/2 comparisons, regardless of the initial order of elements!",
    insertion: "Insertion Sort is how most people naturally sort playing cards in their hands!",
    merge: "Merge Sort was invented by John von Neumann in 1945 and is still used in many modern sorting implementations!",
    quick: "Quick Sort is the default sorting algorithm in many programming languages including JavaScript's V8 engine!",
    heap: "Heap Sort uses a binary heap data structure, making it excellent for priority queue implementations!",
  };

  const whenToUse: Record<SortingAlgorithm, string[]> = {
    bubble: [
      "Educational purposes & understanding sorting basics",
      "Small datasets where simplicity matters",
      "Nearly sorted arrays (best case is O(n))",
    ],
    selection: [
      "When memory writes are expensive",
      "Small arrays with minimal swaps needed",
      "Situations requiring predictable performance",
    ],
    insertion: [
      "Online sorting (processing elements as they arrive)",
      "Nearly sorted data (very efficient)",
      "Small datasets or as part of hybrid sorts",
    ],
    merge: [
      "Large datasets requiring guaranteed O(n log n)",
      "Linked lists (no random access needed)",
      "When stability is required",
    ],
    quick: [
      "General-purpose sorting (fastest in practice)",
      "When in-place sorting is needed",
      "Arrays with good cache performance",
    ],
    heap: [
      "When guaranteed O(n log n) with O(1) space is needed",
      "Priority queue applications",
      "Systems with limited memory",
    ],
  };

  if (isPanelMinimized) {
    return (
      <div
        className={`relative border-l overflow-y-auto flex-shrink-0 w-14 ${
          isDark ? "bg-gray-800 border-gray-700" : "bg-white border-slate-200"
        }`}
      >
        <div className="flex flex-col items-center py-4 gap-4">
          <button
            onClick={() => setIsPanelMinimized(false)}
            className={`p-2 rounded-lg transition-colors ${
              isDark ? "hover:bg-gray-700" : "hover:bg-slate-100"
            }`}
            title="Expand Panel"
          >
            <PanelRightOpen className="w-5 h-5 text-cyan-500" />
          </button>
          <div className={`w-8 h-px ${isDark ? "bg-gray-700" : "bg-slate-200"}`} />
          <div className="flex flex-col items-center gap-2">
            <Zap className="w-5 h-5 text-cyan-500" />
            <span
              className={`text-xs ${isDark ? "text-gray-400" : "text-slate-500"}`}
              style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
            >
              {algoInfo.name}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={panelRef}
      className={`relative border-l overflow-y-auto flex-shrink-0 ${
        isDark ? "bg-gray-800 border-gray-700" : "bg-white border-slate-200"
      }`}
      style={{ width: panelWidth }}
    >
      {/* Resize Handle */}
      <div
        onMouseDown={handleMouseDown}
        className={`absolute left-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-cyan-500 transition-colors z-10 ${
          isResizing ? "bg-cyan-500" : isDark ? "bg-gray-700" : "bg-slate-200"
        }`}
      />

      <div className="p-4 pl-3">
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-xl font-bold flex items-center gap-2 ${isDark ? "text-white" : "text-slate-900"}`}>
            <Zap className="w-5 h-5 text-cyan-500" />
            {algoInfo.name}
          </h3>
          <button
            onClick={() => setIsPanelMinimized(true)}
            className={`p-1.5 rounded-lg transition-colors ${isDark ? "hover:bg-gray-700" : "hover:bg-slate-100"}`}
            title="Minimize Panel"
          >
            <PanelRightClose className={`w-4 h-4 ${isDark ? "text-gray-400" : "text-slate-500"}`} />
          </button>
        </div>

        <div className="space-y-4">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-2">
            <StatsCard isDark={isDark} label="Best" value={algoInfo.timeComplexity.best} type="best" />
            <StatsCard isDark={isDark} label="Worst" value={algoInfo.timeComplexity.worst} type="worst" />
          </div>

          {/* Performance Overview */}
          <div className={`rounded-xl p-4 ${isDark ? "bg-gray-700/50" : "bg-slate-50 border border-slate-200"}`}>
            <h4 className={`text-sm font-semibold mb-3 flex items-center gap-2 ${isDark ? "text-white" : "text-slate-800"}`}>
              <Target className="w-4 h-4 text-cyan-500" />
              Performance Profile
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className={`text-sm ${isDark ? "text-gray-400" : "text-slate-500"}`}>Average Time</span>
                <span className={`text-sm font-medium px-2 py-0.5 rounded ${isDark ? "bg-yellow-900/30 text-yellow-400" : "bg-yellow-100 text-yellow-700"}`}>
                  {algoInfo.timeComplexity.average}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className={`text-sm ${isDark ? "text-gray-400" : "text-slate-500"}`}>Space</span>
                <span className={`text-sm font-medium px-2 py-0.5 rounded ${isDark ? "bg-purple-900/30 text-purple-400" : "bg-purple-100 text-purple-700"}`}>
                  {algoInfo.spaceComplexity}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className={`text-sm ${isDark ? "text-gray-400" : "text-slate-500"}`}>Stability</span>
                <span className={`text-sm font-medium px-2 py-0.5 rounded ${
                  algoInfo.stable
                    ? isDark ? "bg-green-900/30 text-green-400" : "bg-green-100 text-green-700"
                    : isDark ? "bg-red-900/30 text-red-400" : "bg-red-100 text-red-700"
                }`}>
                  {algoInfo.stable ? "✓ Stable" : "✗ Unstable"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className={`text-sm ${isDark ? "text-gray-400" : "text-slate-500"}`}>In-Place</span>
                <span className={`text-sm font-medium px-2 py-0.5 rounded ${
                  algoInfo.inPlace
                    ? isDark ? "bg-green-900/30 text-green-400" : "bg-green-100 text-green-700"
                    : isDark ? "bg-orange-900/30 text-orange-400" : "bg-orange-100 text-orange-700"
                }`}>
                  {algoInfo.inPlace ? "✓ Yes" : "✗ No"}
                </span>
              </div>
            </div>
          </div>

          {/* How It Works */}
          <div className={`rounded-xl p-4 ${isDark ? "bg-gray-700/50" : "bg-slate-50 border border-slate-200"}`}>
            <h4 className={`text-sm font-semibold mb-3 flex items-center gap-2 ${isDark ? "text-white" : "text-slate-800"}`}>
              <Lightbulb className="w-4 h-4 text-yellow-500" />
              How It Works
            </h4>
            <p className={`text-sm leading-relaxed ${isDark ? "text-gray-300" : "text-slate-600"}`}>
              {algoInfo.description}
            </p>
          </div>

          {/* When to Use */}
          <div className={`rounded-xl p-4 ${isDark ? "bg-gradient-to-br from-cyan-900/20 to-blue-900/20 border border-cyan-800/30" : "bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200"}`}>
            <h4 className={`text-sm font-semibold mb-3 flex items-center gap-2 ${isDark ? "text-white" : "text-slate-800"}`}>
              <BookOpen className="w-4 h-4 text-cyan-500" />
              When to Use
            </h4>
            <ul className={`text-sm space-y-2 ${isDark ? "text-gray-300" : "text-slate-600"}`}>
              {whenToUse[algorithm].map((use, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-cyan-500 mt-0.5">→</span>
                  <span>{use}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Pseudocode */}
          {algoInfo.pseudocode && (
            <div className={`rounded-xl p-4 ${isDark ? "bg-gray-700/50" : "bg-slate-50 border border-slate-200"}`}>
              <h4 className={`text-sm font-semibold mb-3 flex items-center gap-2 ${isDark ? "text-white" : "text-slate-800"}`}>
                <span className="text-cyan-500 font-mono text-xs">{`</>`}</span>
                Pseudocode
              </h4>
              <pre className={`text-xs font-mono whitespace-pre-wrap leading-relaxed p-3 rounded-lg ${isDark ? "bg-gray-800 text-gray-300" : "bg-white text-slate-600 border border-slate-200"}`}>
                {algoInfo.pseudocode}
              </pre>
            </div>
          )}

          {/* Fun Fact */}
          <FunFact isDark={isDark} fact={funFacts[algorithm]} />
        </div>
      </div>
    </div>
  );
};

export default InfoPanel;
