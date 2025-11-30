import { SearchIcon, FilterIcon, ClearIcon } from "./Icons";

const ProblemFilterBar = ({
  filters,
  setFilters,
  searchQuery,
  setSearchQuery,
  onClear,
  isDark = true,
}) => {
  const handleSelectChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const isFilterActive =
    filters.difficulty !== "all" ||
    filters.tag.length > 0 ||
    filters.status !== "all" ||
    searchQuery.length > 0;

  return (
    <div className={`${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-slate-200'} border rounded-xl p-4 mb-4 backdrop-blur-md shadow-lg sticky top-20 z-30 transition-all duration-300`}>
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[200px] w-full md:w-auto">
          <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            <SearchIcon />
          </div>
          <input
            type="text"
            placeholder="Search problems by title..."
            className={`w-full ${isDark ? 'bg-slate-950 border-slate-800 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'} border text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block pl-10 p-2.5 transition-all`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap gap-2 md:gap-4 items-center">
          <div className={`flex items-center ${isDark ? 'text-slate-500' : 'text-slate-500'} text-sm font-medium mr-1`}>
            <FilterIcon />
            <span className="ml-2 hidden sm:block">Filters:</span>
          </div>

          {/* Difficulty Select */}
          <select
            className={`${isDark ? 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'} border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 transition-colors cursor-pointer appearance-none pr-8`}
            value={filters.difficulty}
            onChange={(e) => handleSelectChange("difficulty", e.target.value)}
          >
            <option value="all">Difficulty</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          {/* Status Select */}
          <select
            className={`${isDark ? 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'} border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 transition-colors cursor-pointer appearance-none pr-8`}
            value={filters.status}
            onChange={(e) => handleSelectChange("status", e.target.value)}
          >
            <option value="all">Status</option>
            <option value="solved">Solved</option>
          </select>

          {/* Clear Button */}
          {isFilterActive && (
            <button
              onClick={onClear}
              className={`text-sm ${isDark ? 'text-slate-500 hover:text-red-400' : 'text-slate-500 hover:text-red-500'} p-2.5 transition-colors duration-200 flex items-center gap-1`}
              title="Clear all filters"
            >
              <ClearIcon />
              <span className="hidden md:inline">Clear</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProblemFilterBar;
