import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axiosClient from "../../utilities/axiosClient";
import { toast } from "react-hot-toast";
import {
  Users as UsersIcon,
  Search,
  Filter,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Shield,
  ShieldCheck,
  User,
  Mail,
  Calendar,
  Code,
  CheckCircle,
  XCircle,
  Trash2,
  Eye,
  MoreVertical,
  RefreshCw,
  Download,
  TrendingUp,
  Activity,
  X,
  FileCode,
  Award,
} from "lucide-react";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [filters, setFilters] = useState({
    search: "",
    role: "",
    sortBy: "createdAt",
    order: "desc",
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [userToChangeRole, setUserToChangeRole] = useState(null);

  const { user: currentUser, isAuthenticated } = useSelector(
    (state) => state.authentication
  );

  useEffect(() => {
    if (isAuthenticated && currentUser?.role === "admin") {
      fetchUsers();
    }
  }, [isAuthenticated, currentUser, pagination.page, filters]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
        search: filters.search,
        role: filters.role,
        sortBy: filters.sortBy,
        order: filters.order,
      });

      const { data } = await axiosClient.get(`/admin/users?${params}`);
      setUsers(data.users || []);
      setPagination((prev) => ({
        ...prev,
        total: data.pagination.total,
        totalPages: data.pagination.totalPages,
      }));
    } catch (error) {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserDetails = async (userId) => {
    setLoadingDetails(true);
    try {
      const { data } = await axiosClient.get(`/admin/users/${userId}`);
      setUserDetails(data);
    } catch (error) {
      toast.error("Failed to fetch user details");
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
    fetchUserDetails(user._id);
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    setIsDeleting(true);
    try {
      await axiosClient.delete(`/admin/users/${userToDelete._id}`);
      toast.success("User deleted successfully");
      setShowDeleteModal(false);
      setUserToDelete(null);
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete user");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRoleChange = async (newRole) => {
    if (!userToChangeRole) return;
    try {
      await axiosClient.patch(`/admin/users/${userToChangeRole._id}/role`, {
        role: newRole,
      });
      toast.success(`User role updated to ${newRole}`);
      setShowRoleModal(false);
      setUserToChangeRole(null);
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update role");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchUsers();
  };

  const stats = {
    total: pagination.total,
    admins: users.filter((u) => u.role === "admin").length,
    users: users.filter((u) => u.role === "user").length,
    activeToday: users.filter((u) => {
      const today = new Date();
      const created = new Date(u.createdAt);
      return created.toDateString() === today.toDateString();
    }).length,
  };

  if (!isAuthenticated || currentUser?.role !== "admin") {
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            User Management
          </h1>
          <p className="text-slate-400 mt-1">
            Manage platform users and permissions
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchUsers}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Users",
            value: pagination.total,
            icon: UsersIcon,
            color: "blue",
          },
          {
            label: "Administrators",
            value: stats.admins,
            icon: ShieldCheck,
            color: "purple",
          },
          {
            label: "Regular Users",
            value: stats.users,
            icon: User,
            color: "emerald",
          },
          {
            label: "New Today",
            value: stats.activeToday,
            icon: TrendingUp,
            color: "orange",
          },
        ].map((stat, index) => (
          <div
            key={index}
            className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-4 border border-slate-800"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className={`text-2xl font-bold text-${stat.color}-400`}>
                  {stat.value}
                </div>
                <div className="text-xs text-slate-500 mt-1">{stat.label}</div>
              </div>
              <div className={`p-2 bg-${stat.color}-500/10 rounded-lg`}>
                <stat.icon className={`w-5 h-5 text-${stat.color}-400`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-4 border border-slate-800">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search by name, email, or username..."
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg pl-10 pr-4 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              value={filters.search}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, search: e.target.value }))
              }
            />
          </div>
          <select
            className="bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2.5 text-sm focus:border-blue-500"
            value={filters.role}
            onChange={(e) => {
              setFilters((prev) => ({ ...prev, role: e.target.value }));
              setPagination((prev) => ({ ...prev, page: 1 }));
            }}
          >
            <option value="">All Roles</option>
            <option value="admin">Admins</option>
            <option value="user">Users</option>
          </select>
          <select
            className="bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2.5 text-sm focus:border-blue-500"
            value={filters.sortBy}
            onChange={(e) => {
              setFilters((prev) => ({ ...prev, sortBy: e.target.value }));
              setPagination((prev) => ({ ...prev, page: 1 }));
            }}
          >
            <option value="createdAt">Join Date</option>
            <option value="firstName">Name</option>
            <option value="username">Username</option>
          </select>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-lg font-medium transition-colors"
          >
            <Filter className="w-4 h-4 sm:hidden" />
            <span className="hidden sm:inline">Apply</span>
          </button>
        </form>
      </div>

      {/* Users Table */}
      <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-800 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-slate-400 text-sm">Loading users...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-800/50 border-b border-slate-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">
                      User
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase hidden md:table-cell">
                      Role
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase hidden lg:table-cell">
                      Stats
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase hidden sm:table-cell">
                      Joined
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {users.map((user) => (
                    <tr
                      key={user._id}
                      className="hover:bg-slate-800/30 transition-colors"
                    >
                      {/* User Info */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {user.avatar ? (
                            <img
                              src={user.avatar}
                              alt={user.firstName}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                              {(user.firstName?.[0] || "U").toUpperCase()}
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-medium text-white">
                              {user.firstName} {user.lastName}
                            </p>
                            <p className="text-xs text-slate-500">
                              @{user.username}
                            </p>
                            <p className="text-xs text-slate-500 md:hidden">
                              {user.role === "admin" ? (
                                <span className="text-purple-400">Admin</span>
                              ) : (
                                "User"
                              )}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            user.role === "admin"
                              ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                              : "bg-slate-700/50 text-slate-300 border border-slate-600"
                          }`}
                        >
                          {user.role === "admin" ? (
                            <span className="flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3" />
                              Admin
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              User
                            </span>
                          )}
                        </span>
                      </td>

                      {/* Stats */}
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <div className="flex items-center gap-4 text-xs">
                          <div className="flex items-center gap-1 text-slate-400">
                            <FileCode className="w-3 h-3" />
                            <span>{user.totalSubmissions || 0}</span>
                          </div>
                          <div className="flex items-center gap-1 text-emerald-400">
                            <CheckCircle className="w-3 h-3" />
                            <span>{user.problemsSolved || 0}</span>
                          </div>
                        </div>
                      </td>

                      {/* Joined Date */}
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <span className="text-xs text-slate-400">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleViewUser(user)}
                            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setUserToChangeRole(user);
                              setShowRoleModal(true);
                            }}
                            className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
                            title="Change Role"
                          >
                            <Shield className="w-4 h-4" />
                          </button>
                          {user._id !== currentUser._id && (
                            <button
                              onClick={() => {
                                setUserToDelete(user);
                                setShowDeleteModal(true);
                              }}
                              className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                              title="Delete User"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-4 py-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-sm text-slate-400">
                Showing{" "}
                {Math.min(
                  (pagination.page - 1) * pagination.limit + 1,
                  pagination.total
                )}{" "}
                to{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
                of {pagination.total} users
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setPagination((prev) => ({
                      ...prev,
                      page: Math.max(1, prev.page - 1),
                    }))
                  }
                  disabled={pagination.page <= 1}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-sm text-slate-400">
                  Page {pagination.page} of {pagination.totalPages || 1}
                </span>
                <button
                  onClick={() =>
                    setPagination((prev) => ({
                      ...prev,
                      page: Math.min(prev.totalPages, prev.page + 1),
                    }))
                  }
                  disabled={pagination.page >= pagination.totalPages}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}

        {/* Empty State */}
        {!loading && users.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-slate-800 rounded-xl flex items-center justify-center mb-4">
              <UsersIcon className="w-8 h-8 text-slate-500" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              No users found
            </h3>
            <p className="text-slate-400 text-sm">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>

      {/* User Details Modal */}
      {showUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900 rounded-2xl border border-slate-800 w-full max-w-2xl max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-800">
              <h3 className="text-lg font-semibold text-white">User Details</h3>
              <button
                onClick={() => {
                  setShowUserModal(false);
                  setSelectedUser(null);
                  setUserDetails(null);
                }}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 overflow-y-auto max-h-[calc(90vh-60px)]">
              {loadingDetails ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : userDetails ? (
                <div className="space-y-6">
                  {/* User Profile */}
                  <div className="flex items-start gap-4">
                    {userDetails.user.avatar ? (
                      <img
                        src={userDetails.user.avatar}
                        alt={userDetails.user.firstName}
                        className="w-20 h-20 rounded-xl object-cover"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-2xl">
                        {(userDetails.user.firstName?.[0] || "U").toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-white">
                        {userDetails.user.firstName} {userDetails.user.lastName}
                      </h4>
                      <p className="text-slate-400">@{userDetails.user.username}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            userDetails.user.role === "admin"
                              ? "bg-purple-500/10 text-purple-400"
                              : "bg-slate-700/50 text-slate-300"
                          }`}
                        >
                          {userDetails.user.role}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="bg-slate-800/50 rounded-xl p-4 space-y-2">
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-slate-500" />
                      <span className="text-sm text-slate-300">
                        {userDetails.user.emailId}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-slate-500" />
                      <span className="text-sm text-slate-300">
                        Joined {new Date(userDetails.user.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      {
                        label: "Submissions",
                        value: userDetails.stats.totalSubmissions,
                        color: "blue",
                      },
                      {
                        label: "Accepted",
                        value: userDetails.stats.acceptedSubmissions,
                        color: "emerald",
                      },
                      {
                        label: "Problems Solved",
                        value: userDetails.stats.problemsSolved,
                        color: "purple",
                      },
                      {
                        label: "Acceptance",
                        value: `${userDetails.stats.acceptanceRate}%`,
                        color: "orange",
                      },
                    ].map((stat, i) => (
                      <div
                        key={i}
                        className="bg-slate-800/50 rounded-lg p-3 text-center"
                      >
                        <div className={`text-xl font-bold text-${stat.color}-400`}>
                          {stat.value}
                        </div>
                        <div className="text-xs text-slate-500">{stat.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Language Distribution */}
                  {userDetails.stats.languageStats?.length > 0 && (
                    <div>
                      <h5 className="text-sm font-semibold text-slate-400 mb-3">
                        Language Usage
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {userDetails.stats.languageStats.map((lang) => (
                          <span
                            key={lang._id}
                            className="px-3 py-1 bg-slate-800 rounded-lg text-sm text-slate-300"
                          >
                            {lang._id}: {lang.count}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Difficulty Distribution */}
                  {userDetails.stats.difficultyStats?.length > 0 && (
                    <div>
                      <h5 className="text-sm font-semibold text-slate-400 mb-3">
                        Problems by Difficulty
                      </h5>
                      <div className="flex gap-3">
                        {userDetails.stats.difficultyStats.map((diff) => (
                          <div
                            key={diff._id}
                            className={`flex-1 p-3 rounded-lg text-center ${
                              diff._id === "Easy"
                                ? "bg-emerald-500/10 border border-emerald-500/20"
                                : diff._id === "Medium"
                                ? "bg-amber-500/10 border border-amber-500/20"
                                : "bg-red-500/10 border border-red-500/20"
                            }`}
                          >
                            <div
                              className={`text-lg font-bold ${
                                diff._id === "Easy"
                                  ? "text-emerald-400"
                                  : diff._id === "Medium"
                                  ? "text-amber-400"
                                  : "text-red-400"
                              }`}
                            >
                              {diff.count}
                            </div>
                            <div className="text-xs text-slate-400">{diff._id}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recent Submissions */}
                  {userDetails.recentSubmissions?.length > 0 && (
                    <div>
                      <h5 className="text-sm font-semibold text-slate-400 mb-3">
                        Recent Submissions
                      </h5>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {userDetails.recentSubmissions.slice(0, 5).map((sub) => (
                          <div
                            key={sub._id}
                            className="flex items-center justify-between p-2 bg-slate-800/50 rounded-lg"
                          >
                            <div className="flex items-center gap-2">
                              {sub.status === "Accepted" ? (
                                <CheckCircle className="w-4 h-4 text-emerald-400" />
                              ) : (
                                <XCircle className="w-4 h-4 text-red-400" />
                              )}
                              <span className="text-sm text-white truncate max-w-[200px]">
                                {sub.problemId?.title || "Unknown Problem"}
                              </span>
                            </div>
                            <span className="text-xs text-slate-500">
                              {sub.language}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900 rounded-2xl border border-slate-800 w-full max-w-md p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Delete User</h3>
              <p className="text-slate-400 mb-6">
                Are you sure you want to delete{" "}
                <span className="text-white font-medium">
                  {userToDelete.firstName} {userToDelete.lastName}
                </span>
                ? This action cannot be undone.
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setUserToDelete(null);
                  }}
                  disabled={isDeleting}
                  className="flex-1 py-2.5 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteUser}
                  disabled={isDeleting}
                  className="flex-1 py-2.5 text-white bg-red-600 hover:bg-red-500 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  {isDeleting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    "Delete User"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Role Change Modal */}
      {showRoleModal && userToChangeRole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900 rounded-2xl border border-slate-800 w-full max-w-md p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Change User Role</h3>
              <p className="text-slate-400 mb-6">
                Change role for{" "}
                <span className="text-white font-medium">
                  {userToChangeRole.firstName} {userToChangeRole.lastName}
                </span>
              </p>
              <div className="flex flex-col gap-3 mb-6">
                <button
                  onClick={() => handleRoleChange("user")}
                  className={`p-4 rounded-xl border transition-all ${
                    userToChangeRole.role === "user"
                      ? "bg-slate-800 border-slate-600"
                      : "bg-slate-800/50 border-slate-700 hover:border-slate-600"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-slate-400" />
                    <div className="text-left">
                      <p className="text-sm font-medium text-white">User</p>
                      <p className="text-xs text-slate-500">
                        Regular platform access
                      </p>
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => handleRoleChange("admin")}
                  className={`p-4 rounded-xl border transition-all ${
                    userToChangeRole.role === "admin"
                      ? "bg-purple-500/10 border-purple-500/30"
                      : "bg-slate-800/50 border-slate-700 hover:border-purple-500/30"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-purple-400" />
                    <div className="text-left">
                      <p className="text-sm font-medium text-white">Administrator</p>
                      <p className="text-xs text-slate-500">
                        Full platform access and management
                      </p>
                    </div>
                  </div>
                </button>
              </div>
              <button
                onClick={() => {
                  setShowRoleModal(false);
                  setUserToChangeRole(null);
                }}
                className="w-full py-2.5 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
