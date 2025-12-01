import React from "react";
import { X, Check, Edit3 } from "lucide-react";

interface CustomArrayModalProps {
  isDark: boolean;
  customArrayInput: string;
  setCustomArrayInput: (value: string) => void;
  onApply: () => void;
  onClose: () => void;
}

const CustomArrayModal: React.FC<CustomArrayModalProps> = ({
  isDark,
  customArrayInput,
  setCustomArrayInput,
  onApply,
  onClose,
}) => {
  const validNumbers = customArrayInput
    .split(/[\s,]+/)
    .filter((s) => s.trim() !== "")
    .map((s) => parseInt(s, 10))
    .filter((n) => !isNaN(n) && n >= 1 && n <= 100);

  return (
    <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
      <div
        className={`rounded-xl p-6 w-full max-w-lg mx-4 border shadow-2xl ${
          isDark ? "bg-gray-800 border-gray-700" : "bg-white border-slate-200"
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <h3
            className={`text-lg font-semibold flex items-center gap-2 ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            <Edit3 className="w-5 h-5 text-purple-500" />
            Custom Array Input
          </h3>
          <button
            onClick={onClose}
            className={`p-1 rounded-lg transition-colors ${
              isDark ? "hover:bg-gray-700" : "hover:bg-slate-100"
            }`}
          >
            <X className={`w-5 h-5 ${isDark ? "text-gray-400" : "text-slate-500"}`} />
          </button>
        </div>

        <p className={`text-sm mb-4 ${isDark ? "text-gray-400" : "text-slate-500"}`}>
          Enter numbers separated by commas or spaces (values: 1-100, size: 2-50)
        </p>

        <textarea
          value={customArrayInput}
          onChange={(e) => setCustomArrayInput(e.target.value)}
          placeholder="e.g., 64, 34, 25, 12, 22, 11, 90"
          className={`w-full h-32 px-4 py-3 rounded-lg border focus:border-cyan-500 focus:outline-none resize-none font-mono text-sm ${
            isDark
              ? "bg-gray-700 text-white border-gray-600"
              : "bg-slate-50 text-slate-900 border-slate-300"
          }`}
          autoFocus
        />

        <div className="flex items-center justify-between mt-4">
          <div className={`text-sm ${isDark ? "text-gray-400" : "text-slate-500"}`}>
            {validNumbers.length} valid numbers
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-lg transition-colors ${
                isDark
                  ? "bg-gray-700 hover:bg-gray-600 text-white"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
            >
              Cancel
            </button>
            <button
              onClick={onApply}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomArrayModal;
