import { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import axiosClient from "../../utilities/axiosClient";
import { toast } from "react-hot-toast";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus, vs } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useTheme } from "../../contexts/ThemeContext";
import {
  Code2,
  BarChart3,
  MemoryStick,
  CheckCircle2,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Filter,
  SortAsc,
  Calendar,
  User,
  Languages,
  Trophy,
  Zap,
  FileCode,
  Eye,
  EyeOff
} from "lucide-react";

const SolutionsTab = ({ problem, solutionsData }) => {
  const { isDark } = useTheme();
  const { user, isAuthenticated } = useSelector(
    (state) => state.authentication
  );
  const [solutions, setSolutions] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [expandedSolution, setExpandedSolution] = useState(null);
  const [activeTab, setActiveTab] = useState("solutions");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (solutionsData) {
      const acceptedSolutions = (solutionsData || []).filter(
        (sub) => sub.status === "Accepted"
      );
      setSolutions(acceptedSolutions);
      setLoading(false);
    }
  }, [solutionsData]);

  const handleVote = async (solutionId, voteType) => {
    if (!isAuthenticated) {
      toast.error("Please sign in to vote");
      return;
    }

    const previousSolutions = [...solutions];
    setSolutions((prev) =>
      prev.map((sol) => {
        if (sol._id !== solutionId) return sol;

        const currentVote = sol.userVote;
        let newUpvote = sol.upvote || 0;
        let newUserVote = voteType;

        if (currentVote === voteType) {
          newUpvote = voteType === "up" ? newUpvote - 1 : newUpvote + 1;
          newUserVote = null;
        } else if (currentVote) {
          newUpvote = voteType === "up" ? newUpvote + 2 : newUpvote - 2;
        } else {
          newUpvote = voteType === "up" ? newUpvote + 1 : newUpvote - 1;
        }

        return { ...sol, upvote: newUpvote, userVote: newUserVote };
      })
    );

    try {
      const response = await axiosClient.post(
        `/submissions/vote/${solutionId}`,
        {
          voteType:
            solutions.find((s) => s._id === solutionId)?.userVote === voteType
              ? "remove"
              : voteType,
        }
      );

      setSolutions((prev) =>
        prev.map((sol) =>
          sol._id === solutionId
            ? {
                ...sol,
                upvote: response.data.upvote,
                userVote: response.data.userVote,
              }
            : sol
        )
      );
    } catch (error) {
      console.error("Error voting:", error);
      setSolutions(previousSolutions);
      toast.error("Failed to record vote");
    }
  };

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    toast.success("Code copied to clipboard!");
  };

  const filteredAndSortedSolutions = useMemo(() => {
    const filtered = solutions.filter(
      (sol) => selectedLanguage === "all" || sol.language === selectedLanguage
    );

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "votes":
          return (b.upvote || 0) - (a.upvote || 0);
        case "runtime":
          return (a.runTime || 0) - (b.runTime || 0);
        case "memory":
          return (a.memory || 0) - (b.memory || 0);
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        default:
          return 0;
      }
    });
  }, [solutions, selectedLanguage, sortBy]);

  const languageStats = useMemo(() => {
    const stats = {};
    solutions.forEach((sol) => {
      stats[sol.language] = (stats[sol.language] || 0) + 1;
    });
    return stats;
  }, [solutions]);

  const languageNames = {
    python: "Python",
    javascript: "JavaScript",
    java: "Java",
    cpp: "C++",
    c: "C",
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatRuntime = (runtime) => {
    if (!runtime) return "N/A";
    return `${(runtime * 1000).toFixed(0)} ms`;
  };

  const formatMemory = (memory) => {
    if (!memory) return "N/A";
    return memory < 1024 ? `${memory} KB` : `${(memory / 1024).toFixed(1)} MB`;
  };

  const getLanguageColor = (language) => {
    const colors = {
      python: "from-blue-500 to-yellow-600",
      javascript: "from-yellow-400 to-yellow-600",
      java: "from-red-500 to-red-700",
      cpp: "from-blue-400 to-blue-600",
      c: "from-blue-500 to-blue-700",
    };
    return colors[language] || "from-gray-500 to-gray-700";
  };

  const StatsPanel = () => (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`rounded-xl p-6 border ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-slate-50 border-slate-200'}`}>
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <FileCode className="w-5 h-5 text-blue-500" />
            </div>
            <span className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Total Solutions</span>
          </div>
          <div className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{solutions.length}</div>
        </div>

        <div className={`rounded-xl p-6 border ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-slate-50 border-slate-200'}`}>
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Languages className="w-5 h-5 text-purple-500" />
            </div>
            <span className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Languages</span>
          </div>
          <div className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{Object.keys(languageStats).length}</div>
        </div>

        <div className={`rounded-xl p-6 border ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-slate-50 border-slate-200'}`}>
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Trophy className="w-5 h-5 text-green-500" />
            </div>
            <span className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Most Votes</span>
          </div>
          <div className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {Math.max(...solutions.map((s) => s.upvote || 0), 0)}
          </div>
        </div>
      </div>

      {/* Language Distribution */}
      <div className={`rounded-xl p-6 border ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-slate-50 border-slate-200'}`}>
        <h3 className={`text-lg font-semibold mb-6 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          <BarChart3 className="w-5 h-5 text-blue-500" />
          Language Distribution
        </h3>
        <div className="space-y-4">
          {Object.entries(languageStats)
            .sort(([, a], [, b]) => b - a)
            .map(([lang, count]) => {
              const percentage = (count / solutions.length) * 100;
              return (
                <div key={lang} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`w-3 h-8 rounded-full bg-gradient-to-b ${getLanguageColor(lang)}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className={`font-medium text-sm ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                          {languageNames[lang] || lang}
                        </span>
                        <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{count}</span>
                      </div>
                      <div className={`w-full rounded-full h-2 ${isDark ? 'bg-slate-700/50' : 'bg-slate-200'}`}>
                        <div
                          className={`h-2 rounded-full bg-gradient-to-r ${getLanguageColor(lang)} transition-all duration-500 ease-out`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-96 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className={`font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Loading solutions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-full ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
      {/* Header */}
      <div className={`border-b ${isDark ? 'border-slate-700/50 bg-slate-800/30' : 'border-slate-200 bg-slate-50'}`}>
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-2xl font-bold flex items-center gap-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                <Code2 className="w-7 h-7 text-blue-500" />
                Community Solutions
              </h1>
              <p className={`mt-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Explore {solutions.length} solutions for{" "}
                <span className="text-blue-500 font-semibold">"{problem?.title}"</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto">
        {/* Tabs */}
        <div className={`flex border-b mb-8 ${isDark ? 'border-slate-700/50' : 'border-slate-200'}`}>
          <button
            onClick={() => setActiveTab("solutions")}
            className={`px-6 py-4 font-semibold text-sm border-b-2 transition-all duration-200 flex items-center gap-2 ${
              activeTab === "solutions"
                ? "border-blue-500 text-blue-500 bg-blue-500/5"
                : isDark 
                  ? "border-transparent text-slate-400 hover:text-slate-300 hover:bg-slate-800/30"
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"
            }`}
          >
            <Code2 className="w-4 h-4" />
            Solutions ({solutions.length})
          </button>
          <button
            onClick={() => setActiveTab("stats")}
            className={`px-6 py-4 font-semibold text-sm border-b-2 transition-all duration-200 flex items-center gap-2 ${
              activeTab === "stats"
                ? "border-purple-500 text-purple-500 bg-purple-500/5"
                : isDark 
                  ? "border-transparent text-slate-400 hover:text-slate-300 hover:bg-slate-800/30"
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Statistics
          </button>
        </div>

        {activeTab === "stats" ? (
          <StatsPanel />
        ) : (
          <>
            {/* Filters */}
            <div className={`rounded-xl p-6 border mb-8 ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
                <div className="flex flex-wrap gap-4 items-center">
                  <div className="flex items-center gap-3">
                    <Filter className={`w-4 h-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                    <select
                      value={selectedLanguage}
                      onChange={(e) => setSelectedLanguage(e.target.value)}
                      className={`px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-all duration-200 ${isDark ? 'bg-slate-700/50 border-slate-600/50 text-slate-200' : 'bg-white border-slate-300 text-slate-700'}`}
                    >
                      <option value="all">All Languages</option>
                      {Object.keys(languageStats).map((lang) => (
                        <option key={lang} value={lang}>
                          {languageNames[lang] || lang}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-3">
                    <SortAsc className={`w-4 h-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className={`px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-all duration-200 ${isDark ? 'bg-slate-700/50 border-slate-600/50 text-slate-200' : 'bg-white border-slate-300 text-slate-700'}`}
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="votes">Most Voted</option>
                      <option value="runtime">Fastest Runtime</option>
                      <option value="memory">Lowest Memory</option>
                    </select>
                  </div>
                </div>

                <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Showing {filteredAndSortedSolutions.length} of {solutions.length} solutions
                </div>
              </div>
            </div>

            {/* Solutions List */}
            {filteredAndSortedSolutions.length === 0 ? (
              <div className={`text-center py-16 rounded-xl border ${isDark ? 'bg-slate-800/30 border-slate-700/50' : 'bg-slate-50 border-slate-200'}`}>
                <Code2 className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />
                <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>No solutions found</h3>
                <p className={`max-w-md mx-auto ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  {selectedLanguage !== "all"
                    ? `No ${languageNames[selectedLanguage] || selectedLanguage} solutions found. Try another language.`
                    : "No accepted solutions available yet. Be the first to submit one!"}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredAndSortedSolutions.map((solution) => (
                  <div
                    key={solution._id}
                    className={`border rounded-xl transition-all duration-300 ${isDark ? 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600/70' : 'bg-white border-slate-200 hover:border-slate-300'}`}
                  >
                    <div className="p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                            <User className="w-6 h-6" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className={`text-lg font-semibold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                              {solution.userId?.firstName && solution.userId?.lastName
                                ? `${solution.userId.firstName} ${solution.userId.lastName}`
                                : "Anonymous User"}
                            </h3>
                            <div className={`flex items-center gap-4 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                              <span className="flex items-center gap-1.5">
                                <Calendar className="w-4 h-4" />
                                {formatDate(solution.createdAt)}
                              </span>
                              <span className="flex items-center gap-1.5">
                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                                Accepted
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Votes */}
                        <div className={`flex items-center gap-2 rounded-lg p-2 ${isDark ? 'bg-slate-700/50' : 'bg-slate-100'}`}>
                          <button
                            onClick={() => handleVote(solution._id, "up")}
                            className={`p-1.5 rounded transition-all duration-200 ${
                              solution.userVote === "up"
                                ? "text-green-500 bg-green-500/20"
                                : isDark 
                                  ? "text-slate-400 hover:text-green-400 hover:bg-slate-600/50"
                                  : "text-slate-500 hover:text-green-500 hover:bg-slate-200"
                            }`}
                          >
                            <ThumbsUp className="w-4 h-4" />
                          </button>
                          <span
                            className={`px-2 font-semibold min-w-[40px] text-center ${
                              (solution.upvote || 0) > 0
                                ? "text-green-500"
                                : (solution.upvote || 0) < 0
                                ? "text-red-500"
                                : isDark ? "text-slate-400" : "text-slate-500"
                            }`}
                          >
                            {solution.upvote || 0}
                          </span>
                          <button
                            onClick={() => handleVote(solution._id, "down")}
                            className={`p-1.5 rounded transition-all duration-200 ${
                              solution.userVote === "down"
                                ? "text-red-500 bg-red-500/20"
                                : isDark 
                                  ? "text-slate-400 hover:text-red-400 hover:bg-slate-600/50"
                                  : "text-slate-500 hover:text-red-500 hover:bg-slate-200"
                            }`}
                          >
                            <ThumbsDown className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Meta Information */}
                      <div className="flex flex-wrap items-center gap-3 mb-4">
                        <div className={`flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r ${getLanguageColor(solution.language)}/20 border rounded-lg ${isDark ? 'border-slate-600/50' : 'border-slate-300'}`}>
                          <FileCode className="w-4 h-4" />
                          <span className={`text-sm font-medium capitalize ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                            {solution.language}
                          </span>
                        </div>

                        <div className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-lg ${isDark ? 'bg-slate-700/50 border-slate-600/50' : 'bg-slate-100 border-slate-300'}`}>
                          <Zap className="w-4 h-4 text-blue-400" />
                          <span className={`text-sm font-mono ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                            {formatRuntime(solution.runTime)}
                          </span>
                        </div>

                        <div className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-lg ${isDark ? 'bg-slate-700/50 border-slate-600/50' : 'bg-slate-100 border-slate-300'}`}>
                          <MemoryStick className="w-4 h-4 text-purple-400" />
                          <span className={`text-sm font-mono ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                            {formatMemory(solution.memory)}
                          </span>
                        </div>

                        <div className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-lg ${isDark ? 'bg-slate-700/50 border-slate-600/50' : 'bg-slate-100 border-slate-300'}`}>
                          <CheckCircle2 className="w-4 h-4 text-green-400" />
                          <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                            {solution.testCasePassed || 0}/{solution.totalTestCases || 0} passed
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className={`flex items-center justify-between pt-4 border-t ${isDark ? 'border-slate-700/50' : 'border-slate-200'}`}>
                        <button
                          onClick={() =>
                            setExpandedSolution(
                              expandedSolution === solution._id ? null : solution._id
                            )
                          }
                          className="text-blue-500 hover:text-blue-400 text-sm font-medium flex items-center gap-2 transition-colors"
                        >
                          {expandedSolution === solution._id ? (
                            <>
                              <EyeOff className="w-4 h-4" />
                              Hide Code
                            </>
                          ) : (
                            <>
                              <Eye className="w-4 h-4" />
                              View Solution
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => copyCode(solution.code)}
                          className={`text-sm font-medium flex items-center gap-2 transition-colors ${isDark ? 'text-slate-400 hover:text-slate-300' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                          <Copy className="w-4 h-4" />
                          Copy Code
                        </button>
                      </div>
                    </div>

                    {/* Code Display */}
                    {expandedSolution === solution._id && (
                      <div className={`border-t ${isDark ? 'border-slate-700/50' : 'border-slate-200'}`}>
                        <div className="relative">
                          <div className="absolute top-4 right-4 z-10">
                            <div className={`backdrop-blur-sm rounded-lg px-3 py-1.5 border ${isDark ? 'bg-slate-800/90 border-slate-700/50' : 'bg-white/90 border-slate-300'}`}>
                              <span className={`text-sm font-mono capitalize ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                                {solution.language}
                              </span>
                            </div>
                          </div>
                          <SyntaxHighlighter
                            language={solution.language}
                            style={isDark ? vscDarkPlus : vs}
                            customStyle={{
                              margin: 0,
                              padding: "2rem",
                              background: isDark ? "rgb(15 23 42 / 0.8)" : "rgb(248 250 252)",
                              fontSize: "0.9rem",
                              borderBottomLeftRadius: "0.75rem",
                              borderBottomRightRadius: "0.75rem",
                            }}
                            showLineNumbers
                            wrapLines
                            lineProps={{
                              style: {
                                wordBreak: "break-all",
                                whiteSpace: "pre-wrap",
                              },
                            }}
                          >
                            {solution.code}
                          </SyntaxHighlighter>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SolutionsTab;