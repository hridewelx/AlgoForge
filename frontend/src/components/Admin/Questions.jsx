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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg
                  className="w-6 h-6 text-white"
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
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
                  Question Bank
                </h1>
                <p className="text-slate-400 mt-1 font-medium">
                  Manage your coding challenges with precision
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            {/* View Mode Toggle */}
            <div className="flex bg-slate-800/80 rounded-xl p-1.5 border border-slate-700 shadow-inner">
              <button
                onClick={() => setViewMode("table")}
                className={`p-3 rounded-lg transition-all duration-300 ${
                  viewMode === "table"
                    ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg transform scale-105"
                    : "text-slate-400 hover:text-white hover:bg-slate-700/50"
                }`}
              >
                <svg
                  className="w-5 h-5"
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
                className={`p-3 rounded-lg transition-all duration-300 ${
                  viewMode === "grid"
                    ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg transform scale-105"
                    : "text-slate-400 hover:text-white hover:bg-slate-700/50"
                }`}
              >
                <svg
                  className="w-5 h-5"
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
              <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-6 py-3.5 rounded-xl font-semibold transition-all duration-300 flex items-center gap-3 shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5 border border-blue-500/30">
                <svg
                  className="w-5 h-5"
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
                <span>Create Question</span>
              </button>
            </Link>
          </div>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
          {[
            {
              label: "Total Questions",
              value: stats.total,
              color: "blue",
              icon: <Files size={20} strokeWidth={1.5} />,
            },
            {
              label: "Easy",
              value: stats.easy,
              color: "green",
              icon: <CheckCircle size={20} strokeWidth={1.5} />,
            },
            {
              label: "Medium",
              value: stats.medium,
              color: "amber",
              icon: <Zap size={20} strokeWidth={1.5} />,
            },
            {
              label: "Hard",
              value: stats.hard,
              color: "red",
              icon: <HeartPulse size={20} strokeWidth={1.5} />,
            },
            {
              label: "Filtered",
              value: stats.filtered,
              color: "purple",
              icon: <Filter size={20} strokeWidth={1.5} />,
            },
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-5 border border-slate-700/50 hover:border-slate-600 transition-all duration-300 group hover:transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div
                    className={`text-2xl font-bold text-${stat.color}-400 group-hover:scale-110 transition-transform duration-300`}
                  >
                    {stat.value}
                  </div>
                  <div className="text-sm text-slate-400 mt-1 font-medium">
                    {stat.label}
                  </div>
                </div>
                <div
                  className={`text-2xl opacity-80 group-hover:scale-110 transition-transform duration-300`}
                >
                  {stat.icon}
                </div>
              </div>
              <div
                className={`w-full h-1 bg-${stat.color}-500/20 rounded-full mt-3 overflow-hidden`}
              >
                <div
                  className={`h-full bg-${stat.color}-500 rounded-full transition-all duration-1000 ease-out`}
                  style={{
                    width: `${(stat.value / Math.max(stats.total, 1)) * 100}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Filters and Controls */}
        <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 shadow-xl">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="flex-1 relative">
                <svg
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400"
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
                  placeholder="Search by title..."
                  className="w-full bg-slate-700/50 border border-slate-600 text-white placeholder-slate-400 rounded-xl pl-12 pr-4 py-3.5 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200"
                  value={filters.search}
                  onChange={(e) =>
                    setFilters({ ...filters, search: e.target.value })
                  }
                />
              </div>
              <select
                className="bg-slate-700/50 border border-slate-600 text-white rounded-xl px-4 py-3.5 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 appearance-none cursor-pointer"
                value={filters.difficulty}
                onChange={(e) =>
                  setFilters({ ...filters, difficulty: e.target.value })
                }
              >
                <option value="">All Difficulty Levels</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
            <div className="flex items-center gap-4">
              <select
                className="bg-slate-700/50 border border-slate-600 text-white rounded-xl px-4 py-3.5 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 appearance-none cursor-pointer"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="title">Sort by Title</option>
                <option value="difficulty">Sort by Difficulty</option>
                <option value="newest">Sort by Newest</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="flex items-center justify-center min-h-96 bg-slate-800/30 rounded-2xl border border-slate-700/50">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-400 text-lg font-medium">
                Loading your questions...
              </p>
              <p className="text-slate-500 text-sm mt-2">
                Preparing your coding challenges
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 shadow-xl overflow-hidden">
            {viewMode === "table" ? (
              // Table View
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-700/50 border-b border-slate-700/50">
                    <tr>
                      <th className="p-6 text-left text-slate-300 font-bold text-lg">
                        Problem
                      </th>
                      <th className="p-6 text-left text-slate-300 font-bold text-lg">
                        Difficulty
                      </th>
                      <th className="p-6 text-left text-slate-300 font-bold text-lg">
                        Tags
                      </th>
                      <th className="p-6 text-left text-slate-300 font-bold text-lg">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/30">
                    {filteredAndSortedQuestions.map((question, index) => (
                      <tr
                        key={question._id}
                        className={`group transition-all duration-300 hover:bg-slate-700/20 ${
                          selected.includes(question._id)
                            ? "bg-blue-500/10 border-l-4 border-l-blue-500"
                            : "border-l-4 border-l-transparent"
                        }`}
                      >
                        {/* Question Title */}
                        <td className="p-6">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl flex items-center justify-center text-slate-300 font-bold text-sm group-hover:from-slate-500 group-hover:to-slate-600 transition-all duration-300">
                              {index + 1}
                            </div>
                            <div>
                              <div className="text-white font-semibold text-lg group-hover:text-blue-300 transition-colors duration-200">
                                {question.title}
                              </div>
                              <div className="text-slate-400 text-sm mt-1 flex items-center gap-2">
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
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                  />
                                </svg>
                                {new Date(
                                  question.createdAt
                                ).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Difficulty */}
                        <td className="p-6">
                          <span
                            className={`px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all duration-200 ${getDifficultyColor(
                              question.difficulty
                            )}`}
                          >
                            {question.difficulty}
                          </span>
                        </td>

                        {/* Tags */}
                        <td className="p-6">
                          <div className="flex flex-wrap gap-2">
                            {question.tags?.slice(0, 3).map((tag, tagIndex) => (
                              <span
                                key={tagIndex}
                                className="px-3 py-1.5 bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-300 rounded-lg text-xs font-semibold border border-blue-400/20 hover:border-blue-400/40 transition-all duration-200"
                              >
                                {tag}
                              </span>
                            ))}
                            {question.tags?.length > 3 && (
                              <span className="px-3 py-1.5 bg-slate-600/50 text-slate-400 rounded-lg text-xs font-semibold border border-slate-500/30">
                                +{question.tags.length - 3}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="p-6">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() =>
                                navigate(
                                  `/admin/questions/update/${question._id}`
                                )
                              }
                              className="p-3 text-slate-400 hover:text-amber-400 hover:bg-amber-400/10 rounded-xl border border-transparent hover:border-amber-400/20 transition-all duration-200 group relative"
                              title="Edit Question"
                            >
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                            </button>
                            <button
                              onClick={() => openDeleteModal(question)}
                              className="p-3 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl border border-transparent hover:border-red-400/20 transition-all duration-200 group relative"
                              title="Delete Question"
                            >
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                            <button
                              onClick={() => navigate(`/admin/editorials/${question._id}`)}
                              className="p-3 text-slate-400 hover:text-purple-400 hover:bg-purple-400/10 rounded-xl border border-transparent hover:border-purple-400/20 transition-all duration-200 group relative"
                              title="Manage Editorials"
                            >
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                                />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleView(question._id)}
                              className="p-3 text-slate-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-xl border border-transparent hover:border-blue-400/20 transition-all duration-200 group relative"
                              title="View Details"
                            >
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
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
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-6">
                {filteredAndSortedQuestions.map((question, index) => (
                  <div
                    key={question._id}
                    className="bg-slate-700/30 rounded-2xl p-6 border border-slate-600 hover:border-slate-500 transition-all duration-300 hover:transform hover:-translate-y-2 hover:shadow-2xl group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-slate-600 to-slate-700 rounded-lg flex items-center justify-center text-slate-300 font-bold text-sm">
                          {index + 1}
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-lg text-xs font-bold border ${getDifficultyColor(
                          question.difficulty
                        )}`}
                      >
                        {question.difficulty}
                      </span>
                    </div>

                    <h3 className="text-white font-bold text-lg mb-3 line-clamp-2 group-hover:text-blue-300 transition-colors duration-200">
                      {question.title}
                    </h3>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {question.tags?.slice(0, 3).map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-3 py-1 bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-300 rounded-lg text-xs font-semibold border border-blue-400/20"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-600">
                      <div className="text-slate-400 text-sm flex items-center gap-2">
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
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        {new Date(question.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-slate-400 hover:text-amber-400 hover:bg-amber-400/10 rounded-lg transition-all duration-200">
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
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => openDeleteModal(question)}
                          className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all duration-200"
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
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredAndSortedQuestions.length === 0 && (
          <div className="flex flex-col items-center justify-center min-h-96 bg-slate-800/30 rounded-2xl border border-slate-700/50 text-center p-12">
            <div className="w-24 h-24 bg-slate-700 rounded-2xl flex items-center justify-center mb-6">
              <svg
                className="w-12 h-12 text-slate-400"
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
            <h3 className="text-2xl font-bold text-white mb-3">
              No questions found
            </h3>
            <p className="text-slate-400 text-lg mb-6 max-w-md">
              {filters.search || filters.difficulty
                ? "No questions match your current filters. Try adjusting your search criteria."
                : "Ready to create your first coding challenge? Start building your question bank now."}
            </p>
            <Link to="/admin/questions/create">
              <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-8 py-3.5 rounded-xl font-semibold transition-all duration-300 flex items-center gap-3 shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5">
                <svg
                  className="w-5 h-5"
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
                <span>Create Your First Question</span>
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
