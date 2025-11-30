import { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import axiosClient from "../utilities/axiosClient";
import Navbar from "../components/UI/Navbar";
import { useTheme } from "../contexts/ThemeContext";
import {
  ProblemFilterBar,
  TagSelector,
  ProblemCard,
  Pagination,
  ProgressCard,
  PROBLEMS_PER_PAGE,
} from "../components/ProblemSet";
import { Code2, Sparkles, Target } from "lucide-react";

function ProblemSet() {
  const { isDark } = useTheme();
  const { isAuthenticated } = useSelector((state) => state.authentication);
  const [problems, setProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    difficulty: "all",
    tag: [],
    status: "all",
  });

  // Data Fetching
  useEffect(() => {
    const fetchProblems = async () => {
      setLoading(true);
      try {
        const { data } = await axiosClient.get("/problems/problemset");
        setProblems(data.problems);
      } catch (error) {
        console.error("Error fetching problems:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchSolvedProblems = async () => {
      try {
        const { data } = await axiosClient.get("/problems/individualsolved");
        setSolvedProblems(data.problems);
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
      const newTags = prevFilters.tag.includes(lowerTag)
        ? prevFilters.tag.filter((t) => t !== lowerTag)
        : [...prevFilters.tag, lowerTag];
      return { ...prevFilters, tag: newTags };
    });
  };

  // Combined Filter Logic
  const filteredProblems = useMemo(() => {
    const problemsWithLowerTags = problems.map((problem) => ({
      ...problem,
      tagsLower: Array.isArray(problem.tags)
        ? problem.tags.map((t) => t.toLowerCase())
        : [],
    }));

    return problemsWithLowerTags.filter((problem) => {
      const searchMatch = problem.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const difficultyMatch =
        filters.difficulty === "all" ||
        problem.difficulty.toLowerCase() === filters.difficulty.toLowerCase();

      const isSolved = solvedProblems.some((sp) => sp._id === problem._id);
      const statusMatch =
        filters.status === "all" || (filters.status === "solved" && isSolved);

      const tagMatch =
        filters.tag.length === 0 ||
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
    return filteredProblems.slice(startIndex, startIndex + PROBLEMS_PER_PAGE);
  }, [filteredProblems, currentPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filters]);

  const handleClearFilters = () => {
    setFilters({ difficulty: "all", tag: [], status: "all" });
    setSearchQuery("");
  };

  // Stats calculation
  const easyCount = problems.filter((p) => p.difficulty?.toLowerCase() === "easy").length;
  const mediumCount = problems.filter((p) => p.difficulty?.toLowerCase() === "medium").length;
  const hardCount = problems.filter((p) => p.difficulty?.toLowerCase() === "hard").length;

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-950 text-slate-300' : 'bg-slate-50 text-slate-700'} font-sans selection:bg-blue-500/30 selection:text-blue-200 relative overflow-hidden`}>
      {/* Background Pattern */}
      <div className="fixed inset-0 z-0 opacity-20 pointer-events-none">
        <div className={`absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]`} />
        <div className={`absolute left-1/4 top-1/4 -z-10 h-[400px] w-[400px] rounded-full ${isDark ? 'bg-blue-500 opacity-10' : 'bg-blue-500 opacity-5'} blur-[120px]`} />
        <div className={`absolute right-1/4 bottom-1/4 -z-10 h-[300px] w-[300px] rounded-full ${isDark ? 'bg-indigo-500 opacity-10' : 'bg-indigo-500 opacity-5'} blur-[100px]`} />
      </div>

      <Navbar />

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Hero Section */}
        <section className="mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Title Section */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-xl ${isDark ? 'bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border-blue-500/20' : 'bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border-blue-500/30'} border`}>
                  <Code2 className="w-6 h-6 text-blue-500" />
                </div>
                <span className={`text-sm font-medium ${isDark ? 'text-blue-400 bg-blue-500/10' : 'text-blue-600 bg-blue-500/10'} px-3 py-1 rounded-full`}>
                  {problems.length} Problems Available
                </span>
              </div>

              <h1 className={`text-4xl md:text-5xl font-bold ${isDark ? 'text-white' : 'text-slate-900'} leading-tight`}>
                Problem{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
                  Explorer
                </span>
              </h1>

              <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'} text-lg max-w-2xl leading-relaxed`}>
                Master algorithms and data structures with our curated collection. 
                Track your progress and challenge yourself with real-world interview problems.
              </p>

              {/* Quick Stats */}
              <div className="flex flex-wrap gap-4 pt-2">
                <div className="flex items-center gap-2 text-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Easy:</span>
                  <span className="text-emerald-400 font-semibold">{easyCount}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="w-2 h-2 rounded-full bg-yellow-400" />
                  <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Medium:</span>
                  <span className="text-yellow-400 font-semibold">{mediumCount}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="w-2 h-2 rounded-full bg-rose-400" />
                  <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Hard:</span>
                  <span className="text-rose-400 font-semibold">{hardCount}</span>
                </div>
              </div>
            </div>

            {/* Progress Card */}
            <ProgressCard
              solvedCount={solvedProblems.length}
              totalCount={problems.length}
              isDark={isDark}
            />
          </div>
        </section>

        {/* Filters Section */}
        <ProblemFilterBar
          filters={filters}
          setFilters={setFilters}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onClear={handleClearFilters}
          isDark={isDark}
        />

        {/* Tag Selector */}
        <TagSelector currentTags={filters.tag} onTagToggle={handleTagToggle} isDark={isDark} />

        {/* Results Info */}
        {filteredProblems.length > 0 && (
          <div className={`flex items-center justify-between mb-4 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'} px-1`}>
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              <span>
                Showing{" "}
                <span className={`${isDark ? 'text-white' : 'text-slate-900'} font-medium`}>
                  {(currentPage - 1) * PROBLEMS_PER_PAGE + 1}-
                  {Math.min(currentPage * PROBLEMS_PER_PAGE, filteredProblems.length)}
                </span>{" "}
                of{" "}
                <span className={`${isDark ? 'text-white' : 'text-slate-900'} font-medium`}>
                  {filteredProblems.length}
                </span>{" "}
                problems
              </span>
            </div>
            <span className={`${isDark ? 'bg-slate-800/50' : 'bg-slate-200/50'} px-3 py-1 rounded-full`}>
              Page {currentPage} of {totalPages}
            </span>
          </div>
        )}

        {/* Problems List */}
        <section className="space-y-4">
          {loading ? (
            // Loading skeleton
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'} rounded-xl border p-5 animate-pulse`}
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-3 flex-1">
                      <div className={`h-5 ${isDark ? 'bg-slate-800' : 'bg-slate-200'} rounded w-1/3`} />
                      <div className="flex gap-2">
                        <div className={`h-4 ${isDark ? 'bg-slate-800' : 'bg-slate-200'} rounded w-16`} />
                        <div className={`h-4 ${isDark ? 'bg-slate-800' : 'bg-slate-200'} rounded w-20`} />
                        <div className={`h-4 ${isDark ? 'bg-slate-800' : 'bg-slate-200'} rounded w-24`} />
                      </div>
                    </div>
                    <div className={`h-10 ${isDark ? 'bg-slate-800' : 'bg-slate-200'} rounded w-24`} />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProblems.length === 0 ? (
            // Empty state
            <div className={`text-center py-20 ${isDark ? 'bg-slate-900/30 border-slate-800' : 'bg-white border-slate-200'} rounded-2xl border border-dashed`}>
              <Sparkles className={`w-12 h-12 ${isDark ? 'text-slate-600' : 'text-slate-400'} mx-auto mb-4`} />
              <div className={`${isDark ? 'text-slate-400' : 'text-slate-600'} text-lg font-medium mb-2`}>
                No problems found matching your criteria
              </div>
              <p className={`${isDark ? 'text-slate-500' : 'text-slate-500'} text-sm mb-4`}>
                Try adjusting your filters or search query
              </p>
              <button
                onClick={handleClearFilters}
                className="px-6 py-2.5 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-lg transition-colors font-medium"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            // Problem cards
            paginatedProblems.map((problem) => (
              <ProblemCard
                key={problem._id}
                problem={problem}
                isSolved={solvedProblems.some((sp) => sp._id === problem._id)}
                isDark={isDark}
              />
            ))
          )}
        </section>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          isDark={isDark}
        />
      </main>
    </div>
  );
}

export default ProblemSet;
