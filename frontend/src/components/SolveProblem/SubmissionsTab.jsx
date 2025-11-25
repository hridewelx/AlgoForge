import { useState, useMemo } from "react";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaBomb,
  FaTools,
  FaFileAlt,
} from "react-icons/fa";

const ProblemSubmissions = ({ submissions }) => {
  console.log("submissions prop", submissions);
  const [expandedCode, setExpandedCode] = useState(null);
  const [filters, setFilters] = useState({
    language: "",
    status: "",
    sortBy: "newest", // newest, oldest
  });

  // Filter and sort submissions
  const filteredSubmissions = useMemo(() => {
    let filtered = submissions || [];

    // Filter by language
    if (filters.language) {
      filtered = filtered.filter((sub) => sub.language === filters.language);
    }

    // Filter by status
    if (filters.status) {
      filtered = filtered.filter((sub) => sub.status === filters.status);
    }

    // Sort submissions
    filtered = [...filtered].sort((a, b) => {
      if (filters.sortBy === "newest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
    });

    return filtered;
  }, [submissions, filters]);

  // Get unique languages and statuses for filter options
  const uniqueLanguages = useMemo(() => {
    const languages = [
      ...new Set(submissions?.map((sub) => sub.language) || []),
    ];
    return languages.sort();
  }, [submissions]);

  const uniqueStatuses = useMemo(() => {
    const statuses = [...new Set(submissions?.map((sub) => sub.status) || [])];
    return statuses.sort();
  }, [submissions]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Accepted":
        return "text-green-400 bg-green-400/10 border-green-400/20";
      case "Wrong Answer":
        return "text-red-400 bg-red-400/10 border-red-400/20";
      case "Time Limit Exceeded":
        return "text-amber-400 bg-amber-400/10 border-amber-400/20";
      case "Runtime Error":
        return "text-purple-400 bg-purple-400/10 border-purple-400/20";
      case "Compilation Error":
        return "text-orange-400 bg-orange-400/10 border-orange-400/20";
      default:
        return "text-slate-400 bg-slate-400/10 border-slate-400/20";
    }
  };

  const getLanguageColor = (language) => {
    switch (language) {
      case "cpp":
        return "text-blue-400 bg-blue-400/10";
      case "python":
        return "text-green-400 bg-green-400/10";
      case "java":
        return "text-orange-400 bg-orange-400/10";
      case "javascript":
        return "text-yellow-400 bg-yellow-400/10";
      default:
        return "text-slate-400 bg-slate-400/10";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Accepted":
        return <FaCheckCircle className="text-green-500" />;
      case "Wrong Answer":
        return <FaTimesCircle className="text-red-500" />;
      case "Time Limit Exceeded":
        return <FaClock className="text-amber-500" />;
      case "Runtime Error":
        return <FaBomb className="text-orange-500" />;
      case "Compilation Error":
        return <FaTools className="text-blue-500" />;
      default:
        return <FaFileAlt className="text-gray-400" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffInSeconds = Math.floor((now - past) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000)
      return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return formatDate(dateString);
  };

  const clearFilters = () => {
    setFilters({
      language: "",
      status: "",
      sortBy: "newest",
    });
  };

  if (!submissions || !Array.isArray(submissions) || submissions.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">
            No Submissions Yet
          </h3>
          <p className="text-slate-400">Submit your solution to see it here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with Stats */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Your Submissions</h2>
          <p className="text-slate-400 text-sm">
            {filteredSubmissions.length} of {submissions.length} submission
            {submissions.length !== 1 ? "s" : ""}
            {filters.language || filters.status ? " (filtered)" : ""}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="flex items-center space-x-4 mt-2 lg:mt-0">
          <div className="text-sm text-slate-400">
            <span className="text-green-400 font-medium">
              {submissions.filter((s) => s.status === "Accepted").length}
            </span>{" "}
            accepted
          </div>
          <div className="text-sm text-slate-400">
            <span className="text-red-400 font-medium">
              {submissions.filter((s) => s.status !== "Accepted").length}
            </span>{" "}
            failed
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-slate-800/40 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            {/* Language Filter */}
            <select
              className="bg-slate-700 border border-slate-600 text-white rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors duration-200"
              value={filters.language}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, language: e.target.value }))
              }
            >
              <option value="">All Languages</option>
              {uniqueLanguages.map((lang) => (
                <option key={lang} value={lang} className="bg-slate-700">
                  {lang.toUpperCase()}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              className="bg-slate-700 border border-slate-600 text-white rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors duration-200"
              value={filters.status}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, status: e.target.value }))
              }
            >
              <option value="">All Status</option>
              {uniqueStatuses.map((status) => (
                <option key={status} value={status} className="bg-slate-700">
                  {status}
                </option>
              ))}
            </select>

            {/* Sort By */}
            <select
              className="bg-slate-700 border border-slate-600 text-white rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors duration-200"
              value={filters.sortBy}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, sortBy: e.target.value }))
              }
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>

          {/* Clear Filters */}
          {(filters.language || filters.status) && (
            <button
              onClick={clearFilters}
              className="px-3 py-2 bg-slate-600 hover:bg-slate-500 text-white text-sm rounded-lg transition-colors duration-200 whitespace-nowrap"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Submissions List */}
      <div className="space-y-3">
        {filteredSubmissions.length === 0 ? (
          <div className="text-center py-8 bg-slate-800/30 rounded-xl border border-slate-700">
            <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg
                className="w-6 h-6 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">
              No matching submissions
            </h3>
            <p className="text-slate-400 text-sm">Try adjusting your filters</p>
          </div>
        ) : (
          filteredSubmissions.map((submission) => (
            <div
              key={submission._id}
              className="bg-slate-800/40 backdrop-blur-sm rounded-xl p-4 border border-slate-700 hover:border-slate-600 transition-all duration-200 group"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-3 gap-2">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  {/* Status with Icon */}
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">
                      {getStatusIcon(submission.status)}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                        submission.status
                      )}`}
                    >
                      {submission.status}
                    </span>
                  </div>

                  {/* Language */}
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${getLanguageColor(
                      submission.language
                    )}`}
                  >
                    {submission.language.toUpperCase()}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-slate-400">
                  <span>{formatDate(submission.createdAt)}</span>
                  <span className="hidden sm:block">•</span>
                  <span className="text-slate-500">
                    {formatTimeAgo(submission.createdAt)}
                  </span>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm mb-3">
                <div className="flex items-center space-x-2 bg-slate-700/30 rounded-lg p-2">
                  <svg
                    className="w-4 h-4 text-slate-400 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  <div>
                    <div className="text-slate-300 font-medium">
                      {submission.runTime} ms
                    </div>
                    <div className="text-slate-500 text-xs">Runtime</div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 bg-slate-700/30 rounded-lg p-2">
                  <svg
                    className="w-4 h-4 text-slate-400 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
                    />
                  </svg>
                  <div>
                    <div className="text-slate-300 font-medium">
                      {submission.memory} KB
                    </div>
                    <div className="text-slate-500 text-xs">Memory</div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 bg-slate-700/30 rounded-lg p-2">
                  <svg
                    className="w-4 h-4 text-slate-400 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    <div className="text-slate-300 font-medium">
                      {submission.testCasePassed}/{submission.totalTestCases}
                    </div>
                    <div className="text-slate-500 text-xs">Test Cases</div>
                  </div>
                </div>
              </div>

              {/* Code Preview */}
              {submission.code && (
                <div className="mt-3 p-3 bg-slate-900/50 rounded-lg border border-slate-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-400 text-sm font-medium">
                      Code Preview
                    </span>
                    <button
                      onClick={() =>
                        setExpandedCode(
                          expandedCode === submission._id
                            ? null
                            : submission._id
                        )
                      }
                      className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center space-x-1 transition-colors duration-200"
                    >
                      <span>
                        {expandedCode === submission._id
                          ? "Collapse"
                          : "View Full Code"}
                      </span>
                      <svg
                        className={`w-4 h-4 transition-transform duration-200 ${
                          expandedCode === submission._id ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                  </div>
                  <pre className="text-slate-300 text-xs overflow-x-auto bg-slate-800/50 p-3 rounded font-mono">
                    {expandedCode === submission._id
                      ? submission.code
                      : `${submission.code
                          .split("\n")
                          .slice(0, 4)
                          .join("\n")}\n\n// ... ${
                          submission.code.split("\n").length - 4
                        } more lines`}
                  </pre>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProblemSubmissions;
