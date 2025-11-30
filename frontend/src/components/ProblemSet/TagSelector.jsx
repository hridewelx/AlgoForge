import { SlidersHorizontal } from "lucide-react";
import { ALL_TAGS } from "./constants";

const TagSelector = ({ currentTags, onTagToggle, isDark = true }) => {
  return (
    <div className={`mb-8 p-4 ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'} border rounded-xl shadow-lg`}>
      <h3 className={`text-md font-semibold ${isDark ? 'text-white' : 'text-slate-900'} mb-3 flex items-center`}>
        <SlidersHorizontal className="mr-2 w-4 h-4" /> 
        Filter by Topic
        {currentTags.length > 0 && (
          <span className="ml-4 text-sm text-blue-500 font-normal px-2 py-0.5 bg-blue-500/10 rounded-full">
            {currentTags.length} Selected
          </span>
        )}
      </h3>
      <div className="flex flex-wrap gap-2 pr-2 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
        {ALL_TAGS.map((tag) => {
          const lowerTag = tag.toLowerCase();
          const isSelected = currentTags.includes(lowerTag);
          return (
            <button
              key={tag}
              onClick={() => onTagToggle(tag)}
              className={`
                text-sm font-medium px-3 py-1 rounded-full transition-all duration-200
                ${
                  isSelected
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20 border-blue-600"
                    : isDark
                      ? "bg-slate-800/70 text-slate-400 hover:bg-slate-700 border border-slate-700"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200"
                }
              `}
            >
              {tag}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TagSelector;
