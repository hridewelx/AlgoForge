import React from "react";
import { ArrayBar, SortingStep } from "../../types";

interface VisualizationProps {
  isDark: boolean;
  array: ArrayBar[];
  currentStep: SortingStep | null;
  currentStepIndex: number;
  stepHistoryLength: number;
}

const Visualization: React.FC<VisualizationProps> = ({
  isDark,
  array,
  currentStep,
  currentStepIndex,
  stepHistoryLength,
}) => {
  const getBarColor = (state: ArrayBar["state"]): string => {
    switch (state) {
      case "comparing":
        return "bg-yellow-500";
      case "swapping":
        return "bg-red-500";
      case "sorted":
        return "bg-green-500";
      case "selected":
        return "bg-purple-500";
      case "pivot":
        return "bg-orange-500";
      default:
        return "bg-cyan-500";
    }
  };

  return (
    <div className="flex-1 p-6 flex flex-col min-h-0">
      {/* Bars Container */}
      <div className="flex-1 flex items-end justify-center gap-1 min-h-[200px] max-h-[calc(100%-120px)]">
        {array.map((bar) => (
          <div
            key={bar.id}
            className={`${getBarColor(bar.state)} transition-all duration-200 rounded-t-sm relative group`}
            style={{
              height: `${Math.min(bar.value, 100)}%`,
              minHeight: "20px",
              width: `${Math.max(100 / array.length - 1, 1)}%`,
              maxWidth: "50px",
            }}
          >
            <div
              className={`absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 ${
                isDark ? "bg-gray-700 text-white" : "bg-slate-800 text-white"
              }`}
            >
              {bar.value}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Section */}
      <div className="flex-shrink-0 mt-4">
        {/* Current Step Description */}
        {currentStep && (
          <div
            className={`p-3 rounded-xl border mb-4 ${
              isDark
                ? "bg-gray-800/80 border-gray-700"
                : "bg-white border-slate-200 shadow-sm"
            }`}
          >
            <p className={`text-center font-medium ${isDark ? "text-white" : "text-slate-900"}`}>
              {currentStep.description}
            </p>
            <p className={`text-center text-sm mt-1 ${isDark ? "text-cyan-400" : "text-cyan-600"}`}>
              Step {currentStepIndex + 1} of {stepHistoryLength}
            </p>
          </div>
        )}

        {/* Legend */}
        <div className={`flex flex-wrap justify-center gap-4 text-sm py-3 px-4 rounded-xl ${isDark ? "bg-gray-800/50" : "bg-slate-100"}`}>
          {[
            { color: "bg-cyan-500", label: "Default" },
            { color: "bg-yellow-500", label: "Comparing" },
            { color: "bg-red-500", label: "Swapping" },
            { color: "bg-purple-500", label: "Selected" },
            { color: "bg-orange-500", label: "Pivot" },
            { color: "bg-green-500", label: "Sorted" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <div className={`w-4 h-4 ${item.color} rounded`} />
              <span className={isDark ? "text-gray-400" : "text-slate-600"}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Visualization;
