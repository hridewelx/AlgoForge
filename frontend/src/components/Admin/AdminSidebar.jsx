import { NavLink, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  LayoutDashboard,
  FileQuestion,
  Users,
  BarChart3,
  Settings,
  Plus,
  List,
  Pencil,
  Trash2,
  FileText,
  ChevronLeft,
  ChevronRight,
  X,
  Shield,
  Zap,
  Home,
} from "lucide-react";

const AdminSidebar = ({ isOpen, onClose, collapsed, setCollapsed }) => {
  const location = useLocation();
  const { user } = useSelector((state) => state.authentication);

  const mainNavItems = [
    {
      path: "/admin",
      label: "Dashboard",
      icon: LayoutDashboard,
      end: true,
    },
    {
      path: "/admin/questions",
      label: "Questions",
      icon: FileQuestion,
      end: true,
    },
    {
      path: "/admin/users",
      label: "Users",
      icon: Users,
    },
    {
      path: "/admin/analytics",
      label: "Analytics",
      icon: BarChart3,
    },
    {
      path: "/admin/settings",
      label: "Settings",
      icon: Settings,
    },
  ];

  const quickActions = [
    {
      path: "/admin/questions/create",
      label: "Add Question",
      icon: Plus,
    },
    {
      path: "/admin/questions",
      label: "View All",
      icon: List,
    },
  ];

  const isActivePath = (path, end = false) => {
    if (end) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full bg-slate-900 border-r border-slate-800 transition-all duration-300 ease-in-out flex flex-col
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          lg:translate-x-0
          ${collapsed ? "lg:w-20" : "lg:w-72"}
          w-72
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-800">
          {!collapsed && (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">Admin</h1>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider">Control Panel</p>
              </div>
            </div>
          )}
          
          {collapsed && (
            <div className="w-full flex justify-center">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
            </div>
          )}

          {/* Mobile close button */}
          <button
            onClick={onClose}
            className="lg:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Desktop collapse button */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* User Info (when expanded) */}
        {!collapsed && (
          <div className="px-4 py-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={`${user?.firstName || 'User'}'s avatar`}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-700"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm ring-2 ring-slate-700">
                  {(user?.firstName?.[0] || "A").toUpperCase()}{(user?.lastName?.[0] || "").toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                  Administrator
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Main Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {/* Main Menu */}
          <div className="mb-6">
            {!collapsed && (
              <p className="px-3 mb-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                Main Menu
              </p>
            )}
            <ul className="space-y-1">
              {mainNavItems.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    end={item.end}
                    onClick={onClose}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative
                      ${
                        isActivePath(item.path, item.end)
                          ? "bg-blue-600/20 text-white"
                          : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                      }
                      ${collapsed ? "justify-center" : ""}
                    `}
                    title={collapsed ? item.label : ""}
                  >
                    <item.icon
                      className={`w-5 h-5 flex-shrink-0 ${
                        isActivePath(item.path, item.end) ? "text-blue-400" : ""
                      }`}
                    />
                    {!collapsed && (
                      <span className="flex-1 text-sm font-medium">{item.label}</span>
                    )}
                    {isActivePath(item.path, item.end) && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-r-full" />
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Actions */}
          {!collapsed && (
            <div className="mb-6">
              <p className="px-3 mb-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                Quick Actions
              </p>
              <ul className="space-y-1">
                {quickActions.map((action) => (
                  <li key={action.path + action.label}>
                    <NavLink
                      to={action.path}
                      onClick={onClose}
                      className="flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all duration-200 group"
                    >
                      <action.icon className="w-4 h-4" />
                      <span className="text-sm">{action.label}</span>
                      <Zap className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 text-yellow-400 transition-opacity" />
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800">
          {!collapsed ? (
            <NavLink
              to="/"
              className="flex items-center gap-3 px-3 py-2.5 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors"
            >
              <Home className="w-5 h-5" />
              <span className="text-sm">Back to Site</span>
            </NavLink>
          ) : (
            <NavLink
              to="/"
              className="flex items-center justify-center p-2.5 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors"
              title="Back to Site"
            >
              <Home className="w-5 h-5" />
            </NavLink>
          )}
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
