import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router";
import { userLogout } from "../../authenticationSlicer";
import { useState, useRef, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
import AuthButton from "../UI/AuthButton";
import UserAvatar from "../UI/UserAvatar";
import { useTheme } from "../../contexts/ThemeContext";

const Header = ({
  handleRunTests,
  handleSubmit,
  isRunning,
  isSubmitting,
  showStickyNotes,
  setShowStickyNotes,
  setActiveTab,
  clockMode,
  showClockMenu,
  setShowClockMenu,
  timeValue,
  formatTime,
  isClockRunning,
  setIsClockRunning,
  handleClockReset,
  timerDuration,
  handleTimerDurationChange,
  setClockMode,
  setTimeValue,
  handleClockModeSelect,
  isDark = true,
}) => {
  const { user } = useSelector((state) => state.authentication);

  return (
    <div className={`h-[50px] ${isDark ? 'bg-slate-800 border-slate-700/50' : 'bg-white border-slate-200 shadow-sm'} border-b flex items-center justify-between px-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
      {/* Left Section */}
      <div className="flex items-center">
        <NavLink to="/">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center mr-3 cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
              />
            </svg>
          </div>
        </NavLink>
        <NavLink
          to="/problemset"
          className="text-lg font-semibold text-blue-400 hover:text-blue-500 transition-colors"
        >
          Problem Sets
        </NavLink>
      </div>

      {/* Center Section */}
      <div className="flex items-center gap-4 justify-center flex-grow">
        <button
          onClick={handleRunTests}
          disabled={isRunning}
          className={`px-3 py-1.5 ${isDark ? 'bg-slate-700 hover:bg-slate-600 border-slate-600/50' : 'bg-slate-100 hover:bg-slate-200 border-slate-300'} ${isDark ? 'text-white' : 'text-slate-700'} rounded transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm border`}
        >
          <span className="flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
            {isRunning ? "Running" : "Run Code"}
          </span>
        </button>

        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="px-3 py-1.5 bg-yellow-500 hover:bg-yellow-600 text-white rounded transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm border border-yellow-700/50"
        >
          <span className="flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z"
              />
            </svg>
            {isSubmitting ? "Submitting" : "Submit"}
          </span>
        </button>

        <button
          onClick={() => {
            setShowStickyNotes(!showStickyNotes);
            if (!showStickyNotes) {
              setActiveTab("notes");
            } else {
              setActiveTab("description");
            }
          }}
          className={`px-3 py-1.5 rounded transition-colors duration-200 font-medium text-sm border ${
            showStickyNotes
              ? "bg-blue-500 hover:bg-blue-600 text-white border-blue-700/50"
              : isDark 
                ? "bg-slate-700 hover:bg-slate-600 text-white border-slate-600/50"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300"
          }`}
          title={showStickyNotes ? "Close Notes" : "Open Notes"}
        >
          <span className="flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M11 4H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-5M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            {showStickyNotes ? "Close Notes" : "Notes"}
          </span>
        </button>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4 flex-shrink-0">
        <ThemeToggle isDark={isDark} />
        
        <ClockComponent
          clockMode={clockMode}
          showClockMenu={showClockMenu}
          setShowClockMenu={setShowClockMenu}
          timeValue={timeValue}
          formatTime={formatTime}
          isClockRunning={isClockRunning}
          setIsClockRunning={setIsClockRunning}
          handleClockReset={handleClockReset}
          timerDuration={timerDuration}
          handleTimerDurationChange={handleTimerDurationChange}
          setClockMode={setClockMode}
          setTimeValue={setTimeValue}
          handleClockModeSelect={handleClockModeSelect}
          isDark={isDark}
        />

        <div className={`h-5 w-[1px] ${isDark ? 'bg-slate-700' : 'bg-slate-300'}`}></div>

        {/* Show UserAvatar if logged in, Login button if logged out */}
        {user ? <UserAvatar /> : <AuthButton  />}
      </div>
    </div>
  );
};

const ClockComponent = ({
  clockMode,
  showClockMenu,
  setShowClockMenu,
  timeValue,
  formatTime,
  isClockRunning,
  setIsClockRunning,
  setClockMode,
  setTimeValue,
  isDark,
}) => {
  const [tempHours, setTempHours] = useState(0);
  const [tempMinutes, setTempMinutes] = useState(0);
  const [tempSeconds, setTempSeconds] = useState(0);
  const clockMenuRef = useRef(null);

  // Handle click outside to close menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (clockMenuRef.current && !clockMenuRef.current.contains(event.target)) {
        setShowClockMenu(false);
      }
    };

    if (showClockMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showClockMenu, setShowClockMenu]);

  const handleStartStopwatch = () => {
    setClockMode("stopwatch");
    setTimeValue(0);
    setIsClockRunning(true);
    setShowClockMenu(false);
  };

  const handleStartTimer = () => {
    const totalSeconds = tempHours * 3600 + tempMinutes * 60 + tempSeconds;
    if (totalSeconds > 0) {
      setClockMode("timer");
      setTimeValue(totalSeconds);
      setIsClockRunning(true);
      setShowClockMenu(false);
    }
  };

  const handleCloseClock = () => {
    setClockMode(null);
    setIsClockRunning(false);
    setTimeValue(0);
    setTempHours(0);
    setTempMinutes(0);
    setTempSeconds(0);
  };

  // Utility function to format time for stopwatch or timer
  function formatTime(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`;
  }

  return (
    <div className="relative" ref={clockMenuRef}>
      {!clockMode ? (
        // Clock icon button - same height as other buttons
        <button
          onClick={() => setShowClockMenu(!showClockMenu)}
          className={`flex items-center justify-center w-9 h-9 rounded-lg border transition-colors duration-200 ${isDark ? 'bg-slate-700/50 border-slate-600 hover:bg-slate-600' : 'bg-slate-100 border-slate-300 hover:bg-slate-200'}`}
          title="Clock"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>
      ) : (
        // Active clock display - compact and aligned
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border h-9 ${isDark ? 'bg-slate-700/50 border-slate-600' : 'bg-slate-100 border-slate-300'}`}>
          <div
            className={`flex items-center gap-1 ${
              clockMode === "timer" && timeValue <= 300
                ? "text-red-400"
                : isDark ? "text-slate-300" : "text-slate-600"
            }`}
          >
            {clockMode === "stopwatch" ? (
              // Stopwatch icon
              <svg
                className="w-4 h-4 text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            ) : (
              // Timer icon
              <svg
                className="w-4 h-4 text-yellow-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            )}
            <span className="font-mono text-sm font-medium min-w-[65px]">
              {formatTime(timeValue)}
            </span>
          </div>

          {/* Clock pause/play buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsClockRunning(!isClockRunning)}
              className={`p-1 rounded transition-colors duration-200 ${
                isClockRunning
                  ? "text-yellow-400 hover:text-yellow-300"
                  : "text-green-400 hover:text-green-300"
              }`}
              title={isClockRunning ? "Pause" : "Start"}
            >
              {isClockRunning ? (
                <svg
                  className="w-3 h-3"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M6 4h4v16H6zM14 4h4v16h-4z" />
                </svg>
              ) : (
                <svg
                  className="w-3 h-3"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            <button
              onClick={handleCloseClock}
              className="p-1 text-slate-400 hover:text-white transition-colors duration-200"
              title="Close"
            >
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Clock Mode Selection */}
      {showClockMenu && !clockMode && (
        <div className="absolute top-full right-0 mt-2 bg-slate-800 border border-slate-700 rounded-lg shadow-2xl z-50 w-64">
          {/* Header */}
          <div className="p-3 border-b border-slate-700">
            <h3 className="text-sm font-semibold text-white">Clock</h3>
          </div>

          <div className="p-3 space-y-4">
            {/* Stopwatch Section */}
            <button
              onClick={handleStartStopwatch}
              className="w-full p-3 bg-slate-700/50 hover:bg-slate-600 rounded-lg border border-slate-600 transition-colors duration-200 flex items-center gap-3 text-left"
            >
              <div className="w-8 h-8 bg-blue-600/20 rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <div className="text-sm font-medium text-white">Stopwatch</div>
                <div className="text-xs text-slate-400">
                  Counts up from 00:00:00
                </div>
              </div>
            </button>

            {/* Timer Section */}
            <div className="space-y-3 pt-3 border-t border-slate-700">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-yellow-600/20 rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-yellow-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-medium text-white">Timer</div>
                  <div className="text-xs text-slate-400">
                    Set countdown duration
                  </div>
                </div>
              </div>

              {/* Time Inputs */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">
                    Hrs
                  </label>
                  <input
                    type="number"
                    value={tempHours}
                    onChange={(e) =>
                      setTempHours(
                        Math.max(0, Math.min(99, parseInt(e.target.value) || 0))
                      )
                    }
                    min="0"
                    max="99"
                    className="w-full bg-slate-700 border border-slate-600 text-white rounded px-2 py-1 text-sm text-center focus:outline-none focus:ring-1 focus:ring-yellow-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">
                    Min
                  </label>
                  <input
                    type="number"
                    value={tempMinutes}
                    onChange={(e) =>
                      setTempMinutes(
                        Math.max(0, Math.min(59, parseInt(e.target.value) || 0))
                      )
                    }
                    min="0"
                    max="59"
                    className="w-full bg-slate-700 border border-slate-600 text-white rounded px-2 py-1 text-sm text-center focus:outline-none focus:ring-1 focus:ring-yellow-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">
                    Sec
                  </label>
                  <input
                    type="number"
                    value={tempSeconds}
                    onChange={(e) =>
                      setTempSeconds(
                        Math.max(0, Math.min(59, parseInt(e.target.value) || 0))
                      )
                    }
                    min="0"
                    max="59"
                    className="w-full bg-slate-700 border border-slate-600 text-white rounded px-2 py-1 text-sm text-center focus:outline-none focus:ring-1 focus:ring-yellow-500"
                  />
                </div>
              </div>

              {/* Duration Preview */}
              <div className="flex items-center justify-between text-xs px-1">
                <span className="text-slate-400">Duration:</span>
                <span className="text-slate-300 font-mono">
                  {String(tempHours).padStart(2, "0")}:
                  {String(tempMinutes).padStart(2, "0")}:
                  {String(tempSeconds).padStart(2, "0")}
                </span>
              </div>

              {/* Start Timer Button */}
              <button
                onClick={handleStartTimer}
                disabled={
                  tempHours === 0 && tempMinutes === 0 && tempSeconds === 0
                }
                className="w-full px-3 py-2 bg-red-600 hover:bg-red-600/95 disabled:bg-red-600/50 disabled:cursor-not-allowed text-white text-sm font-bold rounded transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <svg
                  className="w-3 h-3"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
                Start Timer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Theme Toggle Component
const ThemeToggle = ({ isDark }) => {
  const { theme, setTheme } = useTheme();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  const themes = [
    { value: 'light', label: 'Light', icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    )},
    { value: 'dark', label: 'Dark', icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
      </svg>
    )},
    { value: 'system', label: 'System', icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    )},
  ];

  const currentTheme = themes.find(t => t.value === theme) || themes[2];

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setShowMenu(!showMenu)}
        className={`flex items-center justify-center w-9 h-9 rounded-lg border transition-colors duration-200 ${isDark ? 'bg-slate-700/50 border-slate-600 hover:bg-slate-600' : 'bg-slate-100 border-slate-300 hover:bg-slate-200'}`}
        title={`Theme: ${currentTheme.label}`}
      >
        <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>
          {currentTheme.icon}
        </span>
      </button>

      {showMenu && (
        <div className={`absolute top-full right-0 mt-2 rounded-lg shadow-xl z-50 w-36 overflow-hidden border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
          {themes.map((t) => (
            <button
              key={t.value}
              onClick={() => {
                setTheme(t.value);
                setShowMenu(false);
              }}
              className={`w-full px-3 py-2 flex items-center gap-3 text-sm transition-colors ${
                theme === t.value
                  ? isDark ? 'bg-blue-600/20 text-blue-400' : 'bg-blue-50 text-blue-600'
                  : isDark ? 'text-slate-300 hover:bg-slate-700' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span className={theme === t.value ? (isDark ? 'text-blue-400' : 'text-blue-600') : (isDark ? 'text-slate-400' : 'text-slate-500')}>
                {t.icon}
              </span>
              {t.label}
              {theme === t.value && (
                <svg className="w-4 h-4 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Header;
