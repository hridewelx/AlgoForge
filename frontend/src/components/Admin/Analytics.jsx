import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axiosClient from "../../utilities/axiosClient";
import { toast } from "react-hot-toast";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Users,
  FileCode,
  CheckCircle,
  XCircle,
  Clock,
  Activity,
  Zap,
  Code,
  Trophy,
  RefreshCw,
  Shield,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Database,
  Server,
  BarChart3,
  PieChart as PieChartIcon,
  Target,
} from "lucide-react";

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [realTimeStats, setRealTimeStats] = useState(null);
  const [systemHealth, setSystemHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("30");
  const [refreshing, setRefreshing] = useState(false);

  const { user, isAuthenticated } = useSelector((state) => state.authentication);

  useEffect(() => {
    if (isAuthenticated && user?.role === "admin") {
      fetchAllData();
    }
  }, [isAuthenticated, user, timeRange]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [analyticsRes, realtimeRes, healthRes] = await Promise.all([
        axiosClient.get(`/admin/analytics?timeRange=${timeRange}`),
        axiosClient.get("/admin/analytics/realtime"),
        axiosClient.get("/admin/health"),
      ]);

      console.log("Analytics API Response:", analyticsRes.data);
      console.log("Overview data:", analyticsRes.data?.overview);
      console.log("Charts data:", analyticsRes.data?.charts);

      setAnalytics(analyticsRes.data);
      setRealTimeStats(realtimeRes.data);
      setSystemHealth(healthRes.data);
    } catch (error) {
      console.error("Analytics fetch error:", error);
      toast.error("Failed to fetch analytics data");
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await fetchAllData();
    setRefreshing(false);
    toast.success("Data refreshed");
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num?.toString() || "0";
  };

  // Chart colors
  const DIFFICULTY_COLORS = {
    Easy: "#10b981",
    Medium: "#f59e0b",
    Hard: "#ef4444",
  };

  const LANGUAGE_COLORS = {
    python: "#3776ab",
    javascript: "#f7df1e",
    cpp: "#00599C",
    java: "#f89820",
    c: "#555555",
  };

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 shadow-xl">
          <p className="text-slate-300 text-sm font-medium mb-1">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Empty state component
  const EmptyState = ({ icon: Icon, title, description }) => (
    <div className="flex flex-col items-center justify-center h-48 text-center">
      <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mb-3">
        <Icon className="w-6 h-6 text-slate-500" />
      </div>
      <p className="text-slate-400 font-medium">{title}</p>
      <p className="text-slate-500 text-sm mt-1">{description}</p>
    </div>
  );

  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-slate-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-slate-400">Administrator privileges required</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading analytics...</p>
        </div>
      </div>
    );
  }

  // Process data for charts
  const submissionTrendsData = analytics?.charts?.submissionTrends?.map((item) => ({
    date: new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    total: item.total,
    accepted: item.accepted,
    failed: item.failed,
  })) || [];

  const userGrowthData = analytics?.charts?.userGrowth?.map((item) => ({
    date: new Date(item._id).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    users: item.count,
  })) || [];

  const difficultyData = analytics?.charts?.problemsByDifficulty?.map((item) => ({
    name: item._id,
    value: item.count,
    color: DIFFICULTY_COLORS[item._id] || "#3b82f6",
  })) || [];

  const languageData = analytics?.charts?.languageDistribution?.map((item) => ({
    name: item._id.charAt(0).toUpperCase() + item._id.slice(1),
    value: item.count,
    color: LANGUAGE_COLORS[item._id] || "#3b82f6",
  })) || [];

  const statusData = analytics?.charts?.statusDistribution?.slice(0, 5).map((item) => ({
    name: item._id,
    value: item.count,
  })) || [];

  const activityByHourData = analytics?.charts?.activityByHour?.map((item) => ({
    hour: `${item._id}:00`,
    submissions: item.count,
  })) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Analytics Dashboard
          </h1>
          <p className="text-slate-400 mt-1">
            Real-time platform insights and metrics
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
          <button
            onClick={refreshData}
            disabled={refreshing}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            title="Refresh data"
          >
            <RefreshCw className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-5 border border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Users</p>
              <p className="text-3xl font-bold text-white mt-1">
                {formatNumber(analytics?.overview?.totalUsers || 0)}
              </p>
              <div className="flex items-center gap-1 mt-2">
                {parseFloat(analytics?.overview?.userGrowthRate || 0) >= 0 ? (
                  <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-red-400" />
                )}
                <span className={`text-sm ${parseFloat(analytics?.overview?.userGrowthRate || 0) >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                  {analytics?.overview?.userGrowthRate || 0}%
                </span>
                <span className="text-slate-500 text-xs">vs last period</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-5 border border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Submissions</p>
              <p className="text-3xl font-bold text-white mt-1">
                {formatNumber(analytics?.overview?.totalSubmissions || 0)}
              </p>
              <div className="flex items-center gap-1 mt-2">
                {parseFloat(analytics?.overview?.submissionGrowthRate || 0) >= 0 ? (
                  <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-red-400" />
                )}
                <span className={`text-sm ${parseFloat(analytics?.overview?.submissionGrowthRate || 0) >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                  {analytics?.overview?.submissionGrowthRate || 0}%
                </span>
                <span className="text-slate-500 text-xs">vs last period</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center">
              <FileCode className="w-6 h-6 text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-5 border border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Acceptance Rate</p>
              <p className="text-3xl font-bold text-white mt-1">
                {analytics?.overview?.acceptanceRate || 0}%
              </p>
              <p className="text-slate-500 text-sm mt-2">
                {formatNumber(analytics?.overview?.acceptedSubmissions || 0)} accepted
              </p>
            </div>
            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-5 border border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Problems</p>
              <p className="text-3xl font-bold text-white mt-1">
                {formatNumber(analytics?.overview?.totalProblems || 0)}
              </p>
              <p className="text-slate-500 text-sm mt-2">Active challenges</p>
            </div>
            <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center">
              <Code className="w-6 h-6 text-orange-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Today's Activity */}
      {realTimeStats && (
        <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-5 border border-slate-800">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <h3 className="text-lg font-semibold text-white">Today's Activity</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-800/50 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <FileCode className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="text-2xl font-bold text-white">{realTimeStats.today?.submissions || 0}</p>
                  <p className="text-slate-500 text-sm">Submissions</p>
                </div>
              </div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <div>
                  <p className="text-2xl font-bold text-white">{realTimeStats.today?.accepted || 0}</p>
                  <p className="text-slate-500 text-sm">Accepted</p>
                </div>
              </div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-purple-400" />
                <div>
                  <p className="text-2xl font-bold text-white">{realTimeStats.today?.newUsers || 0}</p>
                  <p className="text-slate-500 text-sm">New Users</p>
                </div>
              </div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <Activity className="w-5 h-5 text-orange-400" />
                <div>
                  <p className="text-2xl font-bold text-white">{realTimeStats.today?.activeUsers || 0}</p>
                  <p className="text-slate-500 text-sm">Active Users</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Charts Row 1 */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Submission Trends */}
        <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-5 border border-slate-800">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Submission Trends</h3>
            <BarChart3 className="w-5 h-5 text-slate-500" />
          </div>
          {submissionTrendsData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={submissionTrendsData}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorAccepted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ paddingTop: "20px" }} />
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorTotal)"
                  name="Total"
                />
                <Area
                  type="monotone"
                  dataKey="accepted"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorAccepted)"
                  name="Accepted"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState
              icon={BarChart3}
              title="No submission data yet"
              description="Submissions will appear here once users start solving problems"
            />
          )}
        </div>

        {/* User Growth */}
        <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-5 border border-slate-800">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">User Growth</h3>
            <TrendingUp className="w-5 h-5 text-slate-500" />
          </div>
          {userGrowthData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="users" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="New Users" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState
              icon={Users}
              title="No user registrations yet"
              description="New user registrations will appear here"
            />
          )}
        </div>
      </div>

      {/* Charts Row 2 - Distribution Charts */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Problems by Difficulty */}
        <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-5 border border-slate-800">
          <h3 className="text-lg font-semibold text-white mb-6">Problems by Difficulty</h3>
          {difficultyData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={difficultyData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {difficultyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                {difficultyData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-400 text-sm">{item.name}: {item.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <EmptyState
              icon={PieChartIcon}
              title="No problems yet"
              description="Add problems to see distribution"
            />
          )}
        </div>

        {/* Language Distribution */}
        <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-5 border border-slate-800">
          <h3 className="text-lg font-semibold text-white mb-6">Language Usage</h3>
          {languageData.length > 0 ? (
            <div className="space-y-4">
              {languageData.map((lang) => {
                const total = languageData.reduce((sum, l) => sum + l.value, 0);
                const percentage = ((lang.value / total) * 100).toFixed(1);
                return (
                  <div key={lang.name}>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-slate-300">{lang.name}</span>
                      <span className="text-slate-500">{lang.value} ({percentage}%)</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%`, backgroundColor: lang.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState
              icon={Code}
              title="No submissions yet"
              description="Language stats will appear here"
            />
          )}
        </div>

        {/* Submission Status */}
        <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-5 border border-slate-800">
          <h3 className="text-lg font-semibold text-white mb-6">Submission Status</h3>
          {statusData.length > 0 ? (
            <div className="space-y-3">
              {statusData.map((status) => {
                const total = statusData.reduce((sum, s) => sum + s.value, 0);
                const percentage = ((status.value / total) * 100).toFixed(1);
                return (
                  <div
                    key={status.name}
                    className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      {status.name === "Accepted" ? (
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-400" />
                      )}
                      <span className="text-slate-300 text-sm truncate max-w-[120px]">
                        {status.name}
                      </span>
                    </div>
                    <span className="text-slate-500 text-sm">{percentage}%</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState
              icon={CheckCircle}
              title="No submissions yet"
              description="Status distribution will appear here"
            />
          )}
        </div>
      </div>

      {/* Top Data Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Solved Problems */}
        <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-5 border border-slate-800">
          <div className="flex items-center gap-2 mb-6">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-semibold text-white">Most Solved Problems</h3>
          </div>
          {analytics?.topData?.topSolvedProblems?.length > 0 ? (
            <div className="space-y-3">
              {analytics.topData.topSolvedProblems.map((item, index) => (
                <div
                  key={item._id}
                  className="flex items-center gap-4 p-3 bg-slate-800/50 rounded-lg"
                >
                  <span className="text-xl font-bold text-slate-500 w-8">#{index + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">{item.problem?.title}</p>
                    <p className="text-slate-500 text-sm">{item.count} solutions</p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded ${
                      item.problem?.difficulty === "Easy"
                        ? "bg-emerald-500/10 text-emerald-400"
                        : item.problem?.difficulty === "Medium"
                        ? "bg-amber-500/10 text-amber-400"
                        : "bg-red-500/10 text-red-400"
                    }`}
                  >
                    {item.problem?.difficulty}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Trophy}
              title="No solved problems yet"
              description="Top problems will appear when users start solving"
            />
          )}
        </div>

        {/* Most Active Users */}
        <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-5 border border-slate-800">
          <div className="flex items-center gap-2 mb-6">
            <Activity className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Most Active Users</h3>
          </div>
          {analytics?.topData?.mostActiveUsers?.length > 0 ? (
            <div className="space-y-3">
              {analytics.topData.mostActiveUsers.map((item, index) => (
                <div
                  key={item._id}
                  className="flex items-center gap-4 p-3 bg-slate-800/50 rounded-lg"
                >
                  <span className="text-xl font-bold text-slate-500 w-8">#{index + 1}</span>
                  {item.user?.avatar ? (
                    <img
                      src={item.user.avatar}
                      alt={item.user.firstName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                      {(item.user?.firstName?.[0] || "U").toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">
                      {item.user?.firstName} {item.user?.lastName}
                    </p>
                    <p className="text-slate-500 text-sm">@{item.user?.username}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-blue-400 font-semibold">{item.submissions}</p>
                    <p className="text-slate-500 text-xs">submissions</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Users}
              title="No active users yet"
              description="Active users will appear here"
            />
          )}
        </div>
      </div>

      {/* Peak Activity Hours */}
      <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-5 border border-slate-800">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-semibold text-white">Peak Activity Hours</h3>
          </div>
          <p className="text-slate-500 text-sm">24-hour distribution (UTC)</p>
        </div>
        {activityByHourData.length > 0 ? (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={activityByHourData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="hour" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="submissions" fill="#8b5cf6" radius={[2, 2, 0, 0]} name="Submissions" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <EmptyState
            icon={Clock}
            title="No activity data yet"
            description="Peak hours will show once users start submitting"
          />
        )}
      </div>

      {/* System Health */}
      {systemHealth && (
        <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-5 border border-slate-800">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Server className="w-5 h-5 text-emerald-400" />
              <h3 className="text-lg font-semibold text-white">System Health</h3>
            </div>
            <span
              className={`px-3 py-1 text-sm font-medium rounded-full ${
                systemHealth.status === "healthy"
                  ? "bg-emerald-500/10 text-emerald-400"
                  : "bg-red-500/10 text-red-400"
              }`}
            >
              {systemHealth.status === "healthy" ? "All Systems Operational" : "Issues Detected"}
            </span>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-800/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Database className="w-4 h-4 text-blue-400" />
                <span className="text-slate-400 text-sm">Database</span>
              </div>
              <p className="text-white font-medium">
                {systemHealth.database?.connected ? "Connected" : "Disconnected"}
              </p>
              <p className="text-slate-500 text-sm">{systemHealth.database?.dataSize}</p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-purple-400" />
                <span className="text-slate-400 text-sm">Memory</span>
              </div>
              <p className="text-white font-medium">{systemHealth.memoryUsage?.heapUsed}</p>
              <p className="text-slate-500 text-sm">of {systemHealth.memoryUsage?.heapTotal}</p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-400 text-sm">Uptime</span>
              </div>
              <p className="text-white font-medium">
                {Math.floor(systemHealth.uptime / 3600)}h {Math.floor((systemHealth.uptime % 3600) / 60)}m
              </p>
              <p className="text-slate-500 text-sm">{Math.floor(systemHealth.uptime % 60)}s</p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Server className="w-4 h-4 text-orange-400" />
                <span className="text-slate-400 text-sm">Runtime</span>
              </div>
              <p className="text-white font-medium">Node.js</p>
              <p className="text-slate-500 text-sm">{systemHealth.nodeVersion}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;
