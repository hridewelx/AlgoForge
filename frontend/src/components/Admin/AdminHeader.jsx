import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { checkAuthenticatedUser, userLogout } from "../../authenticationSlicer";
import axiosClient from "../../utilities/axiosClient";
import {
  Menu,
  Bell,
  Search,
  User,
  Settings,
  LogOut,
  ChevronDown,
  Home,
  ExternalLink,
  UserPlus,
  CheckCircle,
  XCircle,
  RefreshCw,
} from "lucide-react";

const AdminHeader = ({ onMenuClick, sidebarCollapsed }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.authentication);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Check auth
  useEffect(() => {
    if (isAuthenticated && (!user?.firstName || !user?.lastName)) {
      dispatch(checkAuthenticatedUser());
    }
  }, [dispatch, isAuthenticated, user]);

  // Fetch notifications
  useEffect(() => {
    if (isAuthenticated && user?.role === "admin") {
      fetchNotifications();
      // Refresh notifications every 30 seconds
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, user]);

  const fetchNotifications = async () => {
    try {
      setLoadingNotifications(true);
      const { data } = await axiosClient.get("/admin/notifications");
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoadingNotifications(false);
    }
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(userLogout());
    setShowUserMenu(false);
    navigate("/");
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/admin") return "Dashboard";
    if (path.includes("/admin/questions/create")) return "Create Question";
    if (path.includes("/admin/questions/update")) return "Update Question";
    if (path.includes("/admin/questions")) return "Question Management";
    if (path.includes("/admin/users")) return "User Management";
    if (path.includes("/admin/analytics")) return "Analytics";
    if (path.includes("/admin/settings")) return "Settings";
    if (path.includes("/admin/editorials")) return "Editorial Management";
    return "Admin Panel";
  };

  const getBreadcrumbs = () => {
    const path = location.pathname;
    const parts = path.split("/").filter(Boolean);
    return parts.map((part, index) => ({
      label: part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, " "),
      path: "/" + parts.slice(0, index + 1).join("/"),
      isLast: index === parts.length - 1,
    }));
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "user_registered":
        return <UserPlus className="w-4 h-4 text-blue-400" />;
      case "submission_accepted":
        return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case "submission_failed":
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return <Bell className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-xl border-b border-slate-800">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Page Title & Breadcrumb */}
          <div className="hidden sm:block">
            <h1 className="text-lg font-semibold text-white">{getPageTitle()}</h1>
            <nav className="flex items-center gap-1 text-xs text-slate-500">
              {getBreadcrumbs().map((crumb, index) => (
                <span key={crumb.path} className="flex items-center gap-1">
                  {index > 0 && <span>/</span>}
                  {crumb.isLast ? (
                    <span className="text-slate-400">{crumb.label}</span>
                  ) : (
                    <NavLink
                      to={crumb.path}
                      className="hover:text-white transition-colors"
                    >
                      {crumb.label}
                    </NavLink>
                  )}
                </span>
              ))}
            </nav>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Search (Desktop) */}
          <div className="hidden md:flex items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 lg:w-64 pl-9 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-300 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          {/* Date & Time */}
          <div className="hidden lg:flex flex-col items-end text-right px-3 py-1 bg-slate-800/50 rounded-lg">
            <span className="text-sm font-medium text-white">
              {formatTime(currentTime)}
            </span>
            <span className="text-xs text-slate-400">
              {formatDate(currentTime)}
            </span>
          </div>

          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                  <h3 className="font-semibold text-white">Notifications</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">
                      {unreadCount} unread
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        fetchNotifications();
                      }}
                      className="p-1 text-slate-400 hover:text-white rounded transition-colors"
                      title="Refresh"
                    >
                      <RefreshCw className={`w-3 h-3 ${loadingNotifications ? "animate-spin" : ""}`} />
                    </button>
                  </div>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {loadingNotifications && notifications.length === 0 ? (
                    <div className="px-4 py-8 text-center">
                      <RefreshCw className="w-5 h-5 text-slate-500 animate-spin mx-auto mb-2" />
                      <p className="text-sm text-slate-500">Loading...</p>
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="px-4 py-8 text-center">
                      <Bell className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                      <p className="text-sm text-slate-500">No notifications yet</p>
                      <p className="text-xs text-slate-600 mt-1">Activity will appear here</p>
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`px-4 py-3 hover:bg-slate-800/50 cursor-pointer transition-colors ${
                          notification.unread ? "bg-blue-500/5" : ""
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-0.5">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-slate-300">
                              {notification.text}
                            </p>
                            {notification.subtext && (
                              <p className="text-xs text-slate-500 truncate">
                                {notification.subtext}
                              </p>
                            )}
                            <p className="text-xs text-slate-500 mt-1">
                              {notification.timeAgo}
                            </p>
                          </div>
                          {notification.unread && (
                            <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="px-4 py-3 border-t border-slate-800">
                  <button className="w-full text-center text-sm text-blue-400 hover:text-blue-300 transition-colors">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1.5 hover:bg-slate-800 rounded-xl transition-colors"
            >
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={`${user?.firstName || 'User'}'s avatar`}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-700"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm ring-2 ring-slate-700">
                  {(user?.firstName?.[0] || "A").toUpperCase()}{(user?.lastName?.[0] || "").toUpperCase()}
                </div>
              )}
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-white truncate max-w-[100px]">
                  {user?.firstName}
                </p>
                <p className="text-xs text-emerald-400">Admin</p>
              </div>
              <ChevronDown
                className={`hidden sm:block w-4 h-4 text-slate-500 transition-transform ${
                  showUserMenu ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* User Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-800">
                  <p className="text-sm font-medium text-white">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-slate-400 truncate">
                    {user?.emailId}
                  </p>
                </div>

                <div className="py-2">
                  <NavLink
                    to={`/algoforge/profile/${user?.username}`}
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    <User className="w-4 h-4" />
                    View Profile
                    <ExternalLink className="w-3 h-3 ml-auto" />
                  </NavLink>

                  <NavLink
                    to={`/algoforge/${user?.username}/settings`}
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </NavLink>

                  <NavLink
                    to="/"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    <Home className="w-4 h-4" />
                    Back to Site
                  </NavLink>
                </div>

                <div className="py-2 border-t border-slate-800">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;