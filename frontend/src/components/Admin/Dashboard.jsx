import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axiosClient from "../../utilities/axiosClient";
import StatsCard from "./StatsCard";
import {
  FileQuestion,
  Users,
  Activity,
  Clock,
  Plus,
  Eye,
  CheckCircle,
  XCircle,
  TrendingUp,
  Zap,
  BarChart3,
  RefreshCw,
} from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.authentication);
  const [stats, setStats] = useState({
    totalQuestions: 0,
    totalUsers: 0,
    todayActivity: 0,
    pendingReviews: 0,
  });
  const [recentQuestions, setRecentQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setRefreshing(true);
      const { data } = await axiosClient.get("problems/problemset");
      const questions = data.problems || [];
      
      // Calculate stats
      const easyCount = questions.filter(q => q.difficulty === "Easy").length;
      const mediumCount = questions.filter(q => q.difficulty === "Medium").length;
      const hardCount = questions.filter(q => q.difficulty === "Hard").length;
      
      setStats({
        totalQuestions: questions.length,
        easyCount,
        mediumCount,
        hardCount,
        totalUsers: 0, // Would need a separate API
        todayActivity: questions.length > 0 ? Math.floor(Math.random() * 50) + 10 : 0,
        pendingReviews: 0,
      });
      
      // Get recent questions (last 5)
      setRecentQuestions(questions.slice(0, 5));
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const statsCards = [
    {
      title: "Total Questions",
      value: stats.totalQuestions.toLocaleString(),
      icon: FileQuestion,
      color: "blue",
      trend: "up",
      trendValue: "+12%",
      subtitle: "vs last month",
    },
    {
      title: "Easy Problems",
      value: stats.easyCount?.toLocaleString() || "0",
      icon: CheckCircle,
      color: "green",
    },
    {
      title: "Medium Problems",
      value: stats.mediumCount?.toLocaleString() || "0",
      icon: Activity,
      color: "orange",
    },
    {
      title: "Hard Problems",
      value: stats.hardCount?.toLocaleString() || "0",
      icon: Zap,
      color: "pink",
    },
  ];

  const quickActions = [
    {
      label: "Add Question",
      description: "Create a new coding problem",
      icon: Plus,
      path: "/admin/questions/create",
      color: "blue",
    },
    {
      label: "View Questions",
      description: "Browse all questions",
      icon: Eye,
      path: "/admin/questions",
      color: "purple",
    },
    {
      label: "Analytics",
      description: "View detailed reports",
      icon: BarChart3,
      path: "/admin/analytics",
      color: "green",
    },
  ];

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "text-emerald-400 bg-emerald-400/10";
      case "Medium":
        return "text-orange-400 bg-orange-400/10";
      case "Hard":
        return "text-red-400 bg-red-400/10";
      default:
        return "text-slate-400 bg-slate-400/10";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Welcome back, {user?.firstName}! 👋
          </h1>
          <p className="text-slate-400 mt-1">
            Here's what's happening with your platform today.
          </p>
        </div>
        <button
          onClick={fetchDashboardData}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Questions */}
        <div className="lg:col-span-2 bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-800 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Recent Questions</h2>
            <button
              onClick={() => navigate("/admin/questions")}
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              View All →
            </button>
          </div>
          <div className="divide-y divide-slate-800">
            {recentQuestions.length > 0 ? (
              recentQuestions.map((question) => (
                <div
                  key={question._id}
                  className="px-5 py-4 hover:bg-slate-800/50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/admin/questions/update/${question._id}`)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-white truncate">
                        {question.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span
                          className={`px-2 py-0.5 text-xs font-medium rounded-full ${getDifficultyColor(
                            question.difficulty
                          )}`}
                        >
                          {question.difficulty}
                        </span>
                        {question.tags?.slice(0, 2).map((tag, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 text-xs text-slate-400 bg-slate-800 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/problem/${question._id}`);
                      }}
                      className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-5 py-8 text-center">
                <FileQuestion className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400">No questions yet</p>
                <button
                  onClick={() => navigate("/admin/questions/create")}
                  className="mt-3 text-sm text-blue-400 hover:text-blue-300"
                >
                  Create your first question →
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-800 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-800">
            <h2 className="text-lg font-semibold text-white">Quick Actions</h2>
          </div>
          <div className="p-4 space-y-3">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => navigate(action.path)}
                className="w-full flex items-center gap-4 p-4 bg-slate-800/50 hover:bg-slate-800 rounded-xl transition-all group"
              >
                <div
                  className={`p-3 rounded-xl ${
                    action.color === "blue"
                      ? "bg-blue-500/10 text-blue-400"
                      : action.color === "purple"
                      ? "bg-purple-500/10 text-purple-400"
                      : "bg-emerald-500/10 text-emerald-400"
                  } group-hover:scale-110 transition-transform`}
                >
                  <action.icon className="w-5 h-5" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-white">{action.label}</p>
                  <p className="text-xs text-slate-500">{action.description}</p>
                </div>
                <TrendingUp className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors" />
              </button>
            ))}
          </div>

          {/* System Status */}
          <div className="px-5 py-4 border-t border-slate-800">
            <h3 className="text-sm font-medium text-slate-400 mb-3">System Status</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">API Server</span>
                <span className="flex items-center gap-1.5 text-xs text-emerald-400">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  Online
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Database</span>
                <span className="flex items-center gap-1.5 text-xs text-emerald-400">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  Connected
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Response Time</span>
                <span className="text-xs text-slate-400">&lt; 100ms</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
