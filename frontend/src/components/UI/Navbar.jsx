import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import { userLogout, checkAuthenticatedUser } from "../../authenticationSlicer";
import axiosClient from "../../utilities/axiosClient";
import {
  User,
  Settings,
  LogOut,
  Shield,
  ChevronDown,
  Menu,
  X,
  Code2,
  BookOpen,
  Home,
} from "lucide-react";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const { user, isAuthenticated } = useSelector((state) => state.authentication);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [avatar, setAvatar] = useState("");
  const [scrolled, setScrolled] = useState(false);

  // Fetch user profile for avatar
  useEffect(() => {
    const fetchAvatar = async () => {
      if (isAuthenticated) {
        try {
          const response = await axiosClient.get("/profile/getprofile");
          setAvatar(response.data.user?.avatar || "");
        } catch (error) {
          console.error("Error fetching avatar:", error);
        }
      }
    };
    fetchAvatar();
  }, [isAuthenticated]);

  // Check auth on mount
  useEffect(() => {
    if (isAuthenticated && (!user?.firstName || !user?.lastName)) {
      dispatch(checkAuthenticatedUser());
    }
  }, [dispatch, isAuthenticated, user]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setShowMobileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(userLogout());
    setShowDropdown(false);
    setShowMobileMenu(false);
    toast.success("Logged out successfully!");
    navigate("/");
  };

  const getInitials = () => {
    if (!user) return "?";
    const first = user.firstName?.[0]?.toUpperCase() || "";
    const last = user.lastName?.[0]?.toUpperCase() || "";
    return first + last || user.username?.[0]?.toUpperCase() || "?";
  };

  // Store current location before redirecting to auth pages
  const getAuthLink = (path) => {
    return `${path}?redirect=${encodeURIComponent(location.pathname + location.search)}`;
  };

  const navLinks = [
    { to: "/", label: "Home", icon: Home },
    { to: "/problemset", label: "Problems", icon: Code2 },
    { to: "/courses", label: "Courses", icon: BookOpen },
  ];

  const isActivePath = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 2500,
          style: {
            background: "#1e293b",
            color: "#f1f5f9",
            border: "1px solid #475569",
          },
        }}
      />

      <nav
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-slate-950/95 backdrop-blur-xl shadow-lg shadow-black/20 border-b border-slate-800/50"
            : "bg-slate-950/70 backdrop-blur-md border-b border-white/5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <NavLink to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-all duration-300 group-hover:scale-105">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                    />
                  </svg>
                </div>
                <div className="absolute inset-0 w-9 h-9 rounded-xl bg-blue-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight hidden sm:block">
                AlgoForge
              </span>
            </NavLink>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActivePath(link.to)
                      ? "text-white bg-white/10"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <link.icon className="w-4 h-4" />
                    {link.label}
                  </span>
                  {isActivePath(link.to) && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" />
                  )}
                </NavLink>
              ))}
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                /* User Avatar Dropdown */
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-white/5 transition-all duration-200 group"
                  >
                    {/* Avatar */}
                    <div className="relative">
                      {avatar ? (
                        <img
                          src={avatar}
                          alt={user?.firstName || "User"}
                          className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-700 group-hover:ring-blue-500/50 transition-all duration-200"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold ring-2 ring-slate-700 group-hover:ring-blue-500/50 transition-all duration-200">
                          {getInitials()}
                        </div>
                      )}
                      {/* Online indicator */}
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full ring-2 ring-slate-950" />
                    </div>

                    {/* Name & Arrow (Desktop only) */}
                    <div className="hidden sm:flex items-center gap-1">
                      <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors max-w-[100px] truncate">
                        {user?.firstName || "User"}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${
                          showDropdown ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-64 py-2 bg-slate-900/95 backdrop-blur-xl rounded-xl border border-slate-800 shadow-2xl shadow-black/50 animate-in fade-in slide-in-from-top-2 duration-200">
                      {/* User Info Header */}
                      <div className="px-4 py-3 border-b border-slate-800">
                        <div className="flex items-center gap-3">
                          {avatar ? (
                            <img
                              src={avatar}
                              alt={user?.firstName || "User"}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold">
                              {getInitials()}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white truncate">
                              {user?.firstName} {user?.lastName}
                            </p>
                            <p className="text-xs text-slate-500 truncate">
                              @{user?.username}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        <NavLink
                          to={user?.username ? `/algoforge/profile/${user.username}` : "/profile"}
                          onClick={() => setShowDropdown(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                        >
                          <User className="w-4 h-4" />
                          View Profile
                        </NavLink>

                        <NavLink
                          to={user?.username ? `/algoforge/${user.username}/settings` : "/settings"}
                          onClick={() => setShowDropdown(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                        >
                          <Settings className="w-4 h-4" />
                          Settings
                        </NavLink>

                        {user?.role === "admin" && (
                          <NavLink
                            to="/admin"
                            target="_blank"
                            onClick={() => setShowDropdown(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                          >
                            <Shield className="w-4 h-4" />
                            Admin Panel
                            <span className="ml-auto px-1.5 py-0.5 text-[10px] font-bold bg-amber-500/20 text-amber-400 rounded">
                              ADMIN
                            </span>
                          </NavLink>
                        )}
                      </div>

                      {/* Logout */}
                      <div className="pt-2 border-t border-slate-800">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Auth Buttons */
                <div className="flex items-center gap-2">
                  <NavLink
                    to={getAuthLink("/login")}
                    className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                  >
                    Sign In
                  </NavLink>
                  <NavLink
                    to={getAuthLink("/signup")}
                    className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-lg transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
                  >
                    Get Started
                  </NavLink>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="md:hidden p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                {showMobileMenu ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div
            ref={mobileMenuRef}
            className="md:hidden border-t border-slate-800 bg-slate-950/95 backdrop-blur-xl animate-in slide-in-from-top duration-200"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setShowMobileMenu(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActivePath(link.to)
                      ? "text-white bg-white/10"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <link.icon className="w-5 h-5" />
                  {link.label}
                </NavLink>
              ))}
            </div>

            {isAuthenticated && (
              <div className="px-4 py-4 border-t border-slate-800 space-y-1">
                <NavLink
                  to={user?.username ? `/algoforge/profile/${user.username}` : "/profile"}
                  onClick={() => setShowMobileMenu(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <User className="w-5 h-5" />
                  Profile
                </NavLink>
                <NavLink
                  to={user?.username ? `/algoforge/${user.username}/settings` : "/settings"}
                  onClick={() => setShowMobileMenu(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <Settings className="w-5 h-5" />
                  Settings
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
