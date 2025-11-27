import { useEffect, useState, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import axiosClient from "../utilities/axiosClient";
import { NavLink } from "react-router";
import UserAvatar from "../components/UI/UserAvatar";
import AuthButton from "../components/UI/AuthButton";
import { SlidersHorizontal, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

// --- Icons (Inline SVGs for zero-dependency) ---
const SearchIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);
const FilterIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
    />
  </svg>
);
const CheckCircleIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
      clipRule="evenodd"
    />
  </svg>
);
const ArrowRightIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M14 5l7 7m0 0l-7 7m7-7H3"
    />
  </svg>
);

// List of all unique tags (sorted for clean UI)
const ALL_TAGS = [
  "Array",
  "String",
  "Hash Table",
  "Math",
  "Dynamic Programming",
  "Sorting",
  "Greedy",
  "Depth-First Search",
  "Binary Search",
  "Database",
  "Matrix",
  "Bit Manipulation",
  "Tree",
  "Breadth-First Search",
  "Two Pointers",
  "Prefix Sum",
  "Heap (Priority Queue)",
  "Simulation",
  "Counting",
  "Graph",
  "Binary Tree",
  "Stack",
  "Sliding Window",
  "Design",
  "Enumeration",
  "Backtracking",
  "Union Find",
  "Number Theory",
  "Linked List",
  "Ordered Set",
  "Monotonic Stack",
  "Segment Tree",
  "Trie",
  "Combinatorics",
  "Divide and Conquer",
  "Bitmask",
  "Queue",
  "Recursion",
  "Geometry",
  "Binary Indexed Tree",
  "Memoization",
  "Hash Function",
  "Binary Search Tree",
  "Shortest Path",
  "String Matching",
  "Topological Sort",
  "Rolling Hash",
  "Game Theory",
  "Interactive",
  "Data Stream",
  "Monotonic Queue",
  "Brainteaser",
  "Doubly-Linked List",
  "Randomized",
  "Merge Sort",
  "Counting Sort",
  "Iterator",
  "Concurrency",
  "Line Sweep",
  "Probability and Statistics",
  "Quickselect",
  "Suffix Array",
  "Minimum Spanning Tree",
  "Bucket Sort",
  "Shell",
  "Reservoir Sampling",
  "Strongly Connected Component",
  "Eulerian Circuit",
  "Radix Sort",
  "Rejection Sampling",
  "Biconnected Component",
].sort((a, b) => a.localeCompare(b));

// --- Filter Bar Component ---

const ProblemFilterBar = ({
  filters,
  setFilters,
  searchQuery,
  setSearchQuery,
  onClear,
}) => {
  // Handler for difficulty/status selects
  const handleSelectChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const isFilterActive =
    filters.difficulty !== "all" ||
    filters.tag.length > 0 ||
    filters.status !== "all" ||
    searchQuery.length > 0;

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 mb-4 backdrop-blur-md shadow-lg sticky top-20 z-30 transition-all duration-300">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[200px] w-full md:w-auto">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
            <SearchIcon />
          </div>
          <input
            type="text"
            placeholder="Search problems by title..."
            className="w-full bg-slate-950 border border-slate-800 text-white text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block pl-10 p-2.5 placeholder-slate-500 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap gap-2 md:gap-4 items-center">
          <div className="flex items-center text-slate-500 text-sm font-medium mr-1">
            <FilterIcon />
            <span className="ml-2 hidden sm:block">Filters:</span>
          </div>

          {/* Difficulty Select */}
          <select
            className="bg-slate-950 border border-slate-800 text-slate-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 hover:bg-slate-800 transition-colors cursor-pointer appearance-none pr-8"
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
            className="bg-slate-950 border border-slate-800 text-slate-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 hover:bg-slate-800 transition-colors cursor-pointer appearance-none pr-8"
            value={filters.status}
            onChange={(e) => handleSelectChange("status", e.target.value)}
          >
            <option value="all">Status</option>
            <option value="solved">Solved</option>
          </select>

          {/* Clear Button (Visible only if filters are active) */}
          {isFilterActive && (
            <button
              onClick={onClear}
              className="text-sm text-slate-500 hover:text-red-400 p-2.5 transition-colors duration-200 flex items-center"
              title="Clear all filters"
            >
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              <span className="hidden md:inline">Clear</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Tag Selector Component ---

const TagSelector = ({ currentTags, onTagToggle }) => {
  return (
    <div className="mb-8 p-4 bg-slate-900/60 border border-slate-800 rounded-xl shadow-lg">
      <h3 className="text-md font-semibold text-white mb-3 flex items-center">
        <SlidersHorizontal className="mr-2 w-4 h-4" /> Filter by Topic
        {currentTags.length > 0 && (
          <span className="ml-4 text-sm text-blue-400 font-normal px-2 py-0.5 bg-blue-500/10 rounded-full">
            {currentTags.length} Selected Tags
          </span>
        )}
      </h3>
      <div className="flex flex-wrap gap-2 pr-2">
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
                    : "bg-slate-800/70 text-slate-400 hover:bg-slate-700 border border-slate-700"
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

// --- Main Component ---

const PROBLEMS_PER_PAGE = 20;

function ProblemSet() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.authentication);
  const [problems, setProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    difficulty: "all",
    tag: [], // Array for multi-select
    status: "all",
  });

  // Data Fetching
  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const { data } = await axiosClient.get("/problems/problemset");
        setProblems(data.problems);
      } catch (error) {
        console.error("Error fetching problems:", error);
      }
    };

    const fetchSolvedProblems = async () => {
      try {
        await axiosClient.get("/problems/individualsolved").then(({ data }) => {
          setSolvedProblems(data.problems);
        });
      } catch (error) {
        // Ignore error if not authenticated
      }
    };
    fetchProblems();

    if (isAuthenticated) {
      fetchSolvedProblems();
    }
  }, [isAuthenticated]);

  // Handler for clicking a tag pill
  const handleTagToggle = (tag) => {
    const lowerTag = tag.toLowerCase();
    setFilters((prevFilters) => {
      let newTags;
      if (prevFilters.tag.includes(lowerTag)) {
        // Deselect
        newTags = prevFilters.tag.filter((t) => t !== lowerTag);
      } else {
        // Select
        newTags = [...prevFilters.tag, lowerTag];
      }
      return { ...prevFilters, tag: newTags };
    });
  };

  // Combined Filter Logic
  const filteredProblems = useMemo(() => {
    // Helper to map problem tags to lowercase for comparison
    const problemsWithLowerTags = problems.map((problem) => ({
      ...problem,
      tagsLower: Array.isArray(problem.tags)
        ? problem.tags.map((t) => t.toLowerCase())
        : [],
    }));

    return problemsWithLowerTags.filter((problem) => {
      // 1. Search Query Match
      const searchMatch = problem.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      // 2. Difficulty Match
      const difficultyMatch =
        filters.difficulty === "all" ||
        problem.difficulty.toLowerCase() === filters.difficulty.toLowerCase();

      // 3. Status Match
      const isSolved = solvedProblems.some((sp) => sp._id === problem._id);
      const statusMatch =
        filters.status === "all" || (filters.status === "solved" && isSolved);

      // 4. Tag Match (NEW LOGIC: Problem must have ALL of the selected tags)
      const tagMatch =
        filters.tag.length === 0 || // If tag array is empty, it matches all
        (problem.tagsLower.length > 0 &&
          filters.tag.every((filterTag) =>
            problem.tagsLower.includes(filterTag)
          ));

      return searchMatch && difficultyMatch && statusMatch && tagMatch;
    });
  }, [problems, solvedProblems, searchQuery, filters]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredProblems.length / PROBLEMS_PER_PAGE);
  
  const paginatedProblems = useMemo(() => {
    const startIndex = (currentPage - 1) * PROBLEMS_PER_PAGE;
    const endIndex = startIndex + PROBLEMS_PER_PAGE;
    return filteredProblems.slice(startIndex, endIndex);
  }, [filteredProblems, currentPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filters]);

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "medium":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      case "hard":
        return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  const completionPercentage =
    problems.length > 0
      ? Math.round((solvedProblems.length / problems.length) * 100)
      : 0;

  const handleClearFilters = () => {
    setFilters({ difficulty: "all", tag: [], status: "all" }); // Clear tag array
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans selection:bg-blue-500/30 selection:text-blue-200 relative overflow-hidden">
      {/* Background Tech Pattern */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-blue-500 opacity-20 blur-[100px]"></div>
      </div>

      {/* Navigation Bar (Sticky) */}
      <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                  />
                </svg>
              </div>
              <NavLink
                to="/"
                className="text-xl font-bold text-white tracking-tight"
              >
                AlgoForge
              </NavLink>
            </div>

            <div className="flex items-center gap-6">
              <NavLink
                to="/"
                className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
              >
                Dashboard
              </NavLink>
              {isAuthenticated ? <UserAvatar /> : <AuthButton />}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-10">
        {/* Hero / Stats Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          <div className="lg:col-span-2">
            <h1 className="text-4xl font-bold text-white mb-3">
              Problem{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                Explorer
              </span>
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl leading-relaxed">
              Master algorithms with our curated collection. Track your progress
              and challenge yourself with real-world interview problems.
            </p>
          </div>

          {/* Progress Card */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all duration-500"></div>
            <div className="flex justify-between items-end mb-2 relative z-10">
              <div>
                <p className="text-sm text-slate-400 font-medium uppercase tracking-wider">
                  Your Progress
                </p>
                <p className="text-2xl font-bold text-white mt-1">
                  {solvedProblems.length}{" "}
                  <span className="text-slate-500 text-lg font-normal">
                    / {problems.length}
                  </span>
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-blue-400">
                  {completionPercentage}%
                </p>
              </div>
            </div>
            {/* Progress Bar */}
            <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2.5 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* --- Filters Bar --- */}
        <ProblemFilterBar
          filters={filters}
          setFilters={setFilters}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onClear={handleClearFilters}
        />

        {/* --- Tag Selector --- */}
        <TagSelector currentTags={filters.tag} onTagToggle={handleTagToggle} />

        {/* Results Count & Pagination Info */}
        {filteredProblems.length > 0 && (
          <div className="flex items-center justify-between mb-4 text-sm text-slate-400">
            <span>
              Showing {((currentPage - 1) * PROBLEMS_PER_PAGE) + 1} - {Math.min(currentPage * PROBLEMS_PER_PAGE, filteredProblems.length)} of {filteredProblems.length} problems
            </span>
            <span>Page {currentPage} of {totalPages}</span>
          </div>
        )}

        {/* Problems List */}
        <div className="space-y-4">
          {filteredProblems.length === 0 ? (
            <div className="text-center py-20 bg-slate-900/30 rounded-2xl border border-slate-800 border-dashed">
              <div className="text-slate-500 text-lg font-medium">
                No problems found matching your criteria.
              </div>
              <button
                onClick={handleClearFilters}
                className="mt-4 px-6 py-2 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-lg transition-colors"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            paginatedProblems.map((problem) => {
              const isSolved = solvedProblems.some(
                (sp) => sp._id === problem._id
              );
              return (
                <div
                  key={problem._id}
                  className="group relative bg-slate-900/60 hover:bg-slate-800/80 backdrop-blur-sm rounded-xl border border-slate-800 hover:border-blue-500/30 p-5 transition-all duration-300 hover:shadow-lg hover:shadow-blue-900/10 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  {/* Left: Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-lg font-bold text-slate-100 group-hover:text-blue-400 transition-colors">
                        <NavLink
                          to={`/problem/${problem._id}`}
                          className="focus:outline-none"
                        >
                          {problem.title}
                        </NavLink>
                      </h2>
                      {isSolved && (
                        <span
                          title="Solved"
                          className="text-emerald-500 animate-in fade-in zoom-in duration-300"
                        >
                          <CheckCircleIcon />
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`px-2.5 py-0.5 rounded text-xs font-semibold border ${getDifficultyColor(
                          problem.difficulty
                        )}`}
                      >
                        {problem.difficulty}
                      </span>

                      {/* Tags - Showing all tags */}
                      {problem.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="text-xs text-slate-500 bg-slate-950 border border-slate-800 px-2 py-0.5 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Right: Action */}
                  <div className="flex items-center">
                    <NavLink
                      to={`/problem/${problem._id}`}
                      target="_blank"
                      className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white rounded-lg font-medium transition-all duration-300 border border-slate-700 hover:border-blue-500 group-hover:translate-x-1"
                    >
                      Solve
                      <ArrowRightIcon />
                    </NavLink>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8 pb-8">
            {/* First Page */}
            <button
              onClick={() => goToPage(1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              title="First Page"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>
            
            {/* Previous Page */}
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              title="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
              {getPageNumbers().map((page, idx) => (
                page === '...' ? (
                  <span key={`ellipsis-${idx}`} className="px-2 text-slate-500">...</span>
                ) : (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`min-w-[40px] h-10 rounded-lg font-medium transition-all ${
                      currentPage === page
                        ? 'bg-blue-600 text-white border border-blue-500 shadow-lg shadow-blue-500/20'
                        : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    {page}
                  </button>
                )
              ))}
            </div>

            {/* Next Page */}
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              title="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            
            {/* Last Page */}
            <button
              onClick={() => goToPage(totalPages)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              title="Last Page"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProblemSet;
