import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axiosClient from "../../utilities/axiosClient";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router";
import DeleteQuestionModal from "./DeleteQuestionModal";
import { Files, CheckCircle, Zap, HeartPulse, Filter } from "lucide-react";

const Questions = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    difficulty: "",
    status: "",
  });
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("table"); // 'table' or 'grid'
  const [sortBy, setSortBy] = useState("title");
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    question: null,
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const { user, isAuthenticated } = useSelector(
    (state) => state.authentication
  );

  useEffect(() => {
    if (isAuthenticated && user?.role === "admin") {
      fetchQuestions();
    }
  }, [isAuthenticated, user]);

  const fetchQuestions = async () => {
    try {
      const { data } = await axiosClient.get("problems/problemset");
      // console.log("fetched problems", data);
      setQuestions(data.problems || []);
    } catch (error) {
      toast.error("Failed to fetch questions");
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (question) => {
    setDeleteModal({ isOpen: true, question });
  };

  const closeDeleteModal = () => {
    if (!isDeleting) {
      setDeleteModal({ isOpen: false, question: null });
    }
  };

  const handleDelete = async () => {
    const questionId = deleteModal.question._id;
    setIsDeleting(true);
    try {
      await axiosClient.delete(`/problems/delete/${questionId}`);
      toast.success("Question deleted successfully");
      closeDeleteModal();
      fetchQuestions();
      setSelected((prev) =>
        prev.filter((selectedId) => selectedId !== questionId)
      );
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete question");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleView = (id) => {
    navigate(`/problem/${id}`);
  };

  // Enhanced filtering and sorting
  const filteredAndSortedQuestions = questions
    .filter((q) => {
      const searchMatch =
        !filters.search ||
        q.title?.toLowerCase().includes(filters.search.toLowerCase()) ||
        q.tags?.some((tag) =>
          tag.toLowerCase().includes(filters.search.toLowerCase())
        );

      const difficultyMatch =
        !filters.difficulty || q.difficulty === filters.difficulty;
      const statusMatch = !filters.status || q.status === filters.status;

      return searchMatch && difficultyMatch && statusMatch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title?.localeCompare(b.title);
        case "difficulty":
          const difficultyOrder = { Easy: 1, Medium: 2, Hard: 3 };
          return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        default:
          return 0;
      }
    });

  const stats = {
    total: questions.length,
    easy: questions.filter((q) => q.difficulty === "Easy").length,
    medium: questions.filter((q) => q.difficulty === "Medium").length,
    hard: questions.filter((q) => q.difficulty === "Hard").length,
    filtered: filteredAndSortedQuestions.length,
    selected: selected.length,
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "text-green-400 bg-green-400/10 border-green-400/20";
      case "Medium":
        return "text-amber-400 bg-amber-400/10 border-amber-400/20";
      case "Hard":
        return "text-red-400 bg-red-400/10 border-red-400/20";
      default:
        return "text-slate-400 bg-slate-400/10 border-slate-400/20";
    }
  };

  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-96">
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
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-slate-400">Administrator privileges required</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Question Bank
            </h1>
            <p className="text-slate-400 mt-1">
              Manage your coding challenges
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700">
              <button
                onClick={() => setViewMode("table")}
                className={`p-2 rounded-md transition-all ${
                  viewMode === "table"
                    ? "bg-blue-600 text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md transition-all ${
                  viewMode === "grid"
                    ? "bg-blue-600 text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  />
                </svg>
              </button>
            </div>

            {/* Add Question Button */}
            <Link to="/admin/questions/create">
              <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                <span className="hidden sm:inline">Create Question</span>
                <span className="sm:hidden">Add</span>
              </button>
            </Link>
          </div>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
            {
              label: "Total",
              value: stats.total,
              icon: <Files size={18} />,
              color: "blue",
            },
            {
              label: "Easy",
              value: stats.easy,
              icon: <CheckCircle size={18} />,
              color: "emerald",
            },
            {
              label: "Medium",
              value: stats.medium,
              icon: <Zap size={18} />,
              color: "orange",
            },
            {
              label: "Hard",
              value: stats.hard,
              icon: <HeartPulse size={18} />,
              color: "red",
            },
            {
              label: "Filtered",
              value: stats.filtered,
              icon: <Filter size={18} />,
              color: "purple",
            },
          ].map((stat, index) => (
            <div
              key={index}
              className={`bg-slate-900/50 backdrop-blur-sm rounded-xl p-4 border border-slate-800 hover:border-${stat.color}-500/30 transition-all`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className={`text-xl font-bold text-${stat.color}-400`}>
                    {stat.value}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {stat.label}
                  </div>
                </div>
                <div className={`text-${stat.color}-400/50`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters and Controls */}
        <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-4 border border-slate-800">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500"
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
              <input
                placeholder="Search questions..."
                className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                value={filters.search}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
              />
            </div>
            <select
              className="bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              value={filters.difficulty}
              onChange={(e) =>
                setFilters({ ...filters, difficulty: e.target.value })
              }
            >
              <option value="">All Levels</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
            <select
              className="bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="title">By Title</option>
              <option value="difficulty">By Difficulty</option>
              <option value="newest">By Newest</option>
            </select>
          </div>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="flex items-center justify-center h-64 bg-slate-900/50 rounded-xl border border-slate-800">
            <div className="text-center">
              <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-slate-400 text-sm">Loading questions...</p>
            </div>
          </div>
        ) : (
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-800 overflow-hidden">
            {viewMode === "table" ? (
              // Table View
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-800/50 border-b border-slate-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Problem
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider hidden sm:table-cell">
                        Difficulty
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider hidden md:table-cell">
                        Tags
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {filteredAndSortedQuestions.map((question, index) => (
                      <tr
                        key={question._id}
                        className={`group hover:bg-slate-800/50 transition-colors ${
                          selected.includes(question._id)
                            ? "bg-blue-500/5"
                            : ""
                        }`}
                      >
                        {/* Question Title */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center text-slate-400 text-xs font-medium flex-shrink-0">
                              {index + 1}
                            </div>
                            <div className="min-w-0">
                              <div className="text-sm font-medium text-white truncate max-w-[200px] sm:max-w-[300px]">
                                {question.title}
                              </div>
                              <div className="text-xs text-slate-500 sm:hidden mt-0.5">
                                <span className={`${getDifficultyColor(question.difficulty).split(' ')[0]}`}>
                                  {question.difficulty}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                        {/* Difficulty */}
                        <td className="px-4 py-3 hidden sm:table-cell">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(
                              question.difficulty
                            )}`}
                          >
                            {question.difficulty}
                          </span>
                        </td>
                        {/* Tags */}
                        <td className="px-4 py-3 hidden md:table-cell">
                          <div className="flex flex-wrap gap-1">
                            {question.tags?.slice(0, 2).map((tag, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 text-xs text-slate-400 bg-slate-800 rounded"
                              >
                                {tag}
                              </span>
                            ))}
                            {question.tags?.length > 2 && (
                              <span className="px-2 py-0.5 text-xs text-slate-500">
                                +{question.tags.length - 2}
                              </span>
                            )}
                          </div>
                        </td>
                        {/* Actions */}
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleView(question._id)}
                              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                              title="View"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => navigate(`/admin/questions/update/${question._id}`)}
                              className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => openDeleteModal(question)}
                              className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              // Grid View
              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredAndSortedQuestions.map((question, index) => (
                  <div
                    key={question._id}
                    className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 hover:border-slate-600 transition-all group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(
                          question.difficulty
                        )}`}
                      >
                        {question.difficulty}
                      </span>
                      <span className="text-xs text-slate-500">#{index + 1}</span>
                    </div>
                    <h3 className="text-white font-medium mb-2 line-clamp-2 group-hover:text-blue-300 transition-colors">
                      {question.title}
                    </h3>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {question.tags?.slice(0, 3).map((tag, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 text-xs text-slate-400 bg-slate-700 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 pt-3 border-t border-slate-700">
                      <button
                        onClick={() => handleView(question._id)}
                        className="flex-1 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                      >
                        View
                      </button>
                      <button
                        onClick={() => navigate(`/admin/questions/update/${question._id}`)}
                        className="flex-1 py-2 text-xs text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 rounded-lg transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => openDeleteModal(question)}
                        className="flex-1 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {/* Empty State */}
        {!loading && filteredAndSortedQuestions.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 bg-slate-900/50 rounded-xl border border-slate-800 text-center">
            <div className="w-16 h-16 bg-slate-800 rounded-xl flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-slate-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              No questions found
            </h3>
            <p className="text-slate-400 text-sm mb-4 max-w-sm">
              {filters.search || filters.difficulty
                ? "Try adjusting your filters"
                : "Start by creating your first question"}
            </p>
            <Link to="/admin/questions/create">
              <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Create Question
              </button>
            </Link>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteQuestionModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        questionTitle={deleteModal.question?.title || ""}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default Questions;
