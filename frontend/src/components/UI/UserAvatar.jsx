import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast, Toaster } from "react-hot-toast";
import { userLogout, checkAuthenticatedUser } from "../../authenticationSlicer";
import { NavLink } from "react-router";
import axiosClient from "../../utilities/axiosClient";

const UserAvatar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [avatar, setAvatar] = useState("");
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector(
    (state) => state.authentication
  );

  // Fetch avatar on mount
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

  useEffect(() => {
    if (isAuthenticated && (!user?.firstName || !user?.lastName)) {
      dispatch(checkAuthenticatedUser());
    }
  }, [dispatch, isAuthenticated, user]);

  const handleLogout = () => {
    dispatch(userLogout());
    setShowDropdown(false);
    toast.success("Logout successful!");
  };

  const getInitials = () => {
    return (user?.firstName?.[0]?.toUpperCase() ?? "") +
      (user?.lastName?.[0]?.toUpperCase() ?? "");
  };

  return (
    <div className="dropdown dropdown-end">
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
      <div
        tabIndex={0}
        role="button"
        className="select-none flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white transition-colors duration-200"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        {avatar ? (
          <img
            src={avatar}
            alt={user?.firstName || "User"}
            className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-700 hover:ring-blue-500/50 transition-all"
          />
        ) : (
          <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
            {getInitials()}
          </div>
        )}
        <span className="font-medium">{user?.firstName}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>

      {showDropdown && isAuthenticated && (
        // Dropdown menu
        <ul className="mt-2 p-2 shadow-2xl menu dropdown-content bg-slate-800/90 backdrop-blur-sm rounded-box w-52 border border-slate-700/50 z-50">
          {/* Profile Link */}
          <li>
            <NavLink
              to={user?.username ? `/algoforge/profile/${user.username}` : "/profile"}
              className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors duration-200"
              onClick={() => setShowDropdown(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              Profile
            </NavLink>
          </li>

          {/* Settings Link */}
          <li>
            <NavLink
              to={user?.username ? `/algoforge/${user.username}/settings` : "/settings"}
              className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors duration-200"
              onClick={() => setShowDropdown(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Settings
            </NavLink>
          </li>

          {/* Admin Link */}
          {user.role === "admin" && (
            <li>
              <NavLink
                to="/admin"
                target="_blank"
                className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors duration-200"
                onClick={() => setShowDropdown(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 2l8 4v6c0 5.25-3.75 10-8 12-4.25-2-8-6.75-8-12V6l8-4z"
                  />
                </svg>
                Admin
              </NavLink>
            </li>
          )}

          <li>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Logout
            </button>
          </li>
        </ul>
      )}
    </div>
  );
};

export default UserAvatar;
