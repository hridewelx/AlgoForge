import React from "react";
import { ArrayBar, SortingAlgorithm } from "../../types";
import {
  Play,
  Pause,
  RotateCcw,
  Shuffle,
  ChevronRight,
  ChevronLeft,
  Settings2,
  Info,
  Zap,
  BarChart3,
  PanelRightClose,
  PanelRightOpen,
  Edit3,
} from "lucide-react";

interface ControlPanelProps {
  isDark: boolean;
  algorithm: SortingAlgorithm;
  setAlgorithm: (algo: SortingAlgorithm) => void;
  arraySize: number;
  setArraySize: (size: number) => void;
  speed: number;
  setSpeed: (speed: number) => void;
  isPlaying: boolean;
  isEditingArray: boolean;
  array: ArrayBar[];
  showInfo: boolean;
  setShowInfo: (show: boolean) => void;
  isPanelMinimized: boolean;
  setIsPanelMinimized: (minimized: boolean) => void;
  currentStepIndex: number;
  onGenerateNewArray: () => void;
  onOpenCustomArrayEditor: () => void;
  onStepBackward: () => void;
  onStepForward: () => void;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  isDark,
  algorithm,
  setAlgorithm,
  arraySize,
  setArraySize,
  speed,
  setSpeed,
  isPlaying,
  isEditingArray,
  array,
  showInfo,
  setShowInfo,
  isPanelMinimized,
  setIsPanelMinimized,
  currentStepIndex,
  onGenerateNewArray,
  onOpenCustomArrayEditor,
  onStepBackward,
  onStepForward,
  onPlay,
  onPause,
  onReset,
}) => {
  return (
    <div
      className={`border-b ${
        isDark
          ? "bg-gradient-to-r from-gray-800 via-gray-800 to-gray-800/95 border-gray-700"
          : "bg-gradient-to-r from-white via-slate-50 to-white border-slate-200 shadow-md"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          {/* Left Section: Algorithm & Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 flex-1">
            {/* Algorithm Selection Card */}
            <div
              className={`rounded-xl px-4 py-3 border backdrop-blur-sm ${
                isDark
                  ? "bg-gray-700/30 border-gray-600"
                  : "bg-white border-slate-200 shadow-sm"
              }`}
            >
              <label
                className={`text-xs font-semibold mb-2 flex items-center gap-2 ${
                  isDark ? "text-gray-300" : "text-slate-600"
                }`}
              >
                <Settings2 className="w-3.5 h-3.5" />
                ALGORITHM
              </label>
              <select
                value={algorithm}
                onChange={(e) => {
                  setAlgorithm(e.target.value as SortingAlgorithm);
                  onReset();
                }}
                disabled={isPlaying}
                className={`px-4 py-2.5 rounded-lg border-2 font-medium focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all ${
                  isDark
                    ? "bg-gray-800 text-white border-gray-600 hover:border-gray-500"
                    : "bg-slate-50 text-slate-900 border-slate-300 hover:border-slate-400"
                }`}
              >
                <option value="bubble">🫧 Bubble Sort</option>
                <option value="selection">🎯 Selection Sort</option>
                <option value="insertion">📥 Insertion Sort</option>
                <option value="merge">🔀 Merge Sort</option>
                <option value="quick">⚡ Quick Sort</option>
              </select>
            </div>

            {/* Size & Speed Controls */}
            <div className="flex items-center gap-4">
              {/* Array Size */}
              <div
                className={`rounded-xl px-4 py-3 min-w-[140px] border ${
                  isDark
                    ? "bg-gray-700/30 border-gray-600"
                    : "bg-white border-slate-200 shadow-sm"
                }`}
              >
                <label
                  className={`text-xs font-semibold mb-2 flex items-center gap-1.5 ${
                    isDark ? "text-gray-300" : "text-slate-600"
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  SIZE
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="5"
                    max="50"
                    value={arraySize}
                    onChange={(e) => setArraySize(Number(e.target.value))}
                    disabled={isPlaying || isEditingArray}
                    className="flex-1 h-2 rounded-lg appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      background: isDark
                        ? `linear-gradient(to right, rgb(6 182 212) 0%, rgb(6 182 212) ${
                            ((arraySize - 5) / 45) * 100
                          }%, rgb(55 65 81) ${
                            ((arraySize - 5) / 45) * 100
                          }%, rgb(55 65 81) 100%)`
                        : `linear-gradient(to right, rgb(6 182 212) 0%, rgb(6 182 212) ${
                            ((arraySize - 5) / 45) * 100
                          }%, rgb(226 232 240) ${
                            ((arraySize - 5) / 45) * 100
                          }%, rgb(226 232 240) 100%)`,
                    }}
                  />
                  <span
                    className={`text-sm font-bold min-w-[2ch] text-center ${
                      isDark ? "text-cyan-400" : "text-cyan-600"
                    }`}
                  >
                    {array.length}
                  </span>
                </div>
              </div>

              {/* Speed */}
              <div
                className={`rounded-xl px-4 py-3 min-w-[140px] border ${
                  isDark
                    ? "bg-gray-700/30 border-gray-600"
                    : "bg-white border-slate-200 shadow-sm"
                }`}
              >
                <label
                  className={`text-xs font-semibold mb-2 flex items-center gap-1.5 ${
                    isDark ? "text-gray-300" : "text-slate-600"
                  }`}
                >
                  <Zap className="w-3.5 h-3.5" />
                  SPEED
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={speed}
                    onChange={(e) => setSpeed(Number(e.target.value))}
                    className="flex-1 h-2 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: isDark
                        ? `linear-gradient(to right, rgb(6 182 212) 0%, rgb(6 182 212) ${speed}%, rgb(55 65 81) ${speed}%, rgb(55 65 81) 100%)`
                        : `linear-gradient(to right, rgb(6 182 212) 0%, rgb(6 182 212) ${speed}%, rgb(226 232 240) ${speed}%, rgb(226 232 240) 100%)`,
                    }}
                  />
                  <span
                    className={`text-sm font-bold min-w-[3ch] text-center ${
                      isDark ? "text-cyan-400" : "text-cyan-600"
                    }`}
                  >
                    {speed}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section: Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={onGenerateNewArray}
              disabled={isPlaying}
              className={`p-2.5 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed group ${
                isDark
                  ? "bg-gray-700/50 hover:bg-gray-600 border border-gray-600"
                  : "bg-slate-100 hover:bg-slate-200 border border-slate-300"
              }`}
              title="Generate New Array"
            >
              <Shuffle
                className={`w-5 h-5 transition-transform group-hover:rotate-180 ${
                  isDark ? "text-gray-300" : "text-slate-600"
                }`}
              />
            </button>

            <button
              onClick={onOpenCustomArrayEditor}
              disabled={isPlaying}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium ${
                isDark
                  ? "bg-purple-600/80 hover:bg-purple-600 text-white border border-purple-500"
                  : "bg-purple-600 hover:bg-purple-700 text-white shadow-sm"
              }`}
              title="Enter Custom Array"
            >
              <Edit3 className="w-4 h-4" />
              <span className="hidden sm:inline">Custom</span>
            </button>

            <div className={`w-px h-10 ${isDark ? "bg-gray-600" : "bg-slate-300"}`} />

            <button
              onClick={onStepBackward}
              disabled={isPlaying || currentStepIndex <= 0}
              className={`p-2.5 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                isDark
                  ? "bg-gray-700/50 hover:bg-gray-600 border border-gray-600"
                  : "bg-slate-100 hover:bg-slate-200 border border-slate-300"
              }`}
              title="Step Backward"
            >
              <ChevronLeft className={`w-5 h-5 ${isDark ? "text-gray-300" : "text-slate-600"}`} />
            </button>

            <button
              onClick={isPlaying ? onPause : onPlay}
              className={`p-3 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-105 ${
                isPlaying
                  ? "bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                  : "bg-gradient-to-br from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
              }`}
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 text-white" />
              ) : (
                <Play className="w-6 h-6 text-white" />
              )}
            </button>

            <button
              onClick={onStepForward}
              disabled={isPlaying}
              className={`p-2.5 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                isDark
                  ? "bg-gray-700/50 hover:bg-gray-600 border border-gray-600"
                  : "bg-slate-100 hover:bg-slate-200 border border-slate-300"
              }`}
              title="Step Forward"
            >
              <ChevronRight className={`w-5 h-5 ${isDark ? "text-gray-300" : "text-slate-600"}`} />
            </button>

            <button
              onClick={onReset}
              disabled={isPlaying}
              className={`p-2.5 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                isDark
                  ? "bg-gray-700/50 hover:bg-gray-600 border border-gray-600"
                  : "bg-slate-100 hover:bg-slate-200 border border-slate-300"
              }`}
              title="Reset"
            >
              <RotateCcw className={`w-5 h-5 ${isDark ? "text-gray-300" : "text-slate-600"}`} />
            </button>

            <div className={`w-px h-10 ${isDark ? "bg-gray-600" : "bg-slate-300"}`} />

            <button
              onClick={() => {
                if (!showInfo) {
                  setShowInfo(true);
                  setIsPanelMinimized(false);
                } else {
                  setIsPanelMinimized(!isPanelMinimized);
                }
              }}
              className={`p-2.5 rounded-lg transition-all ${
                showInfo && !isPanelMinimized
                  ? "bg-cyan-600 hover:bg-cyan-700"
                  : isDark
                  ? "bg-gray-700/50 hover:bg-gray-600 border border-gray-600"
                  : "bg-slate-100 hover:bg-slate-200 border border-slate-300"
              }`}
              title={isPanelMinimized ? "Expand Panel" : "Minimize Panel"}
            >
              {isPanelMinimized ? (
                <PanelRightOpen className="w-5 h-5 text-white" />
              ) : (
                <PanelRightClose
                  className={`w-5 h-5 ${
                    showInfo && !isPanelMinimized
                      ? "text-white"
                      : isDark
                      ? "text-gray-300"
                      : "text-slate-600"
                  }`}
                />
              )}
            </button>

            <button
              onClick={() => setShowInfo(!showInfo)}
              className={`p-2.5 rounded-lg transition-all ${
                showInfo
                  ? "bg-cyan-600 hover:bg-cyan-700"
                  : isDark
                  ? "bg-gray-700/50 hover:bg-gray-600 border border-gray-600"
                  : "bg-slate-100 hover:bg-slate-200 border border-slate-300"
              }`}
              title="Toggle Info Panel"
            >
              <Info
                className={`w-5 h-5 ${
                  showInfo
                    ? "text-white"
                    : isDark
                    ? "text-gray-300"
                    : "text-slate-600"
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
