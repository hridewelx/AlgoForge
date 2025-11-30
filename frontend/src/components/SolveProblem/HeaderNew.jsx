import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import AuthButton from "../UI/AuthButton";
import UserAvatar from "../UI/UserAvatar";
import { 
  Play, 
  CloudUpload, 
  StickyNote, 
  Clock, 
  Pause, 
  RotateCcw,
  X,
  Timer,
  Zap,
  ChevronLeft,
  Code2
} from "lucide-react";

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
}) => {
  const { user } = useSelector((state) => state.authentication);

  return (
    <header className="h-14 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4">
      {/* Left Section - Logo & Navigation */}
      <div className="flex items-center gap-4">
        <NavLink to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/30 transition-all">
            <Code2 className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-bold hidden sm:block">AlgoForge</span>
        </NavLink>

        <div className="h-5 w-px bg-slate-700 hidden sm:block" />

        <NavLink
          to="/problemset"
          className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors text-sm font-medium"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Problem List</span>
        </NavLink>
      </div>

      {/* Center Section - Action Buttons */}
      <div className="flex items-center gap-2">
        {/* Run Button */}
        <button
          onClick={handleRunTests}
          disabled={isRunning}
          className="group flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Play className={`w-4 h-4 text-emerald-400 ${isRunning ? "animate-pulse" : ""}`} />
          <span className="text-sm font-medium text-slate-200 hidden sm:inline">
            {isRunning ? "Running..." : "Run"}
          </span>
        </button>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30"
        >
          <CloudUpload className={`w-4 h-4 text-white ${isSubmitting ? "animate-bounce" : ""}`} />
          <span className="text-sm font-semibold text-white hidden sm:inline">
            {isSubmitting ? "Submitting..." : "Submit"}
          </span>
        </button>

        <div className="h-5 w-px bg-slate-700 mx-1" />

        {/* Notes Button */}
        <button
          onClick={() => {
            setShowStickyNotes(!showStickyNotes);
            if (!showStickyNotes) {
              setActiveTab("notes");
            } else {
              setActiveTab("description");
            }
          }}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
            showStickyNotes
              ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
              : "bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700"
          }`}
          title={showStickyNotes ? "Close Notes" : "Open Notes"}
        >
          <StickyNote className="w-4 h-4" />
          <span className="text-sm font-medium hidden lg:inline">Notes</span>
        </button>
      </div>

      {/* Right Section - Clock & User */}
      <div className="flex items-center gap-3">
        <ClockWidget
          clockMode={clockMode}
          showClockMenu={showClockMenu}
          setShowClockMenu={setShowClockMenu}
          timeValue={timeValue}
          formatTime={formatTime}
          isClockRunning={isClockRunning}
          setIsClockRunning={setIsClockRunning}
          setClockMode={setClockMode}
          setTimeValue={setTimeValue}
        />

        <div className="h-5 w-px bg-slate-700" />

        {user ? <UserAvatar /> : <AuthButton />}
      </div>
    </header>
  );
};

// Clock Widget Component
const ClockWidget = ({
  clockMode,
  showClockMenu,
  setShowClockMenu,
  timeValue,
  isClockRunning,
  setIsClockRunning,
  setClockMode,
  setTimeValue,
}) => {
  const [tempHours, setTempHours] = useState(0);
  const [tempMinutes, setTempMinutes] = useState(25);
  const [tempSeconds, setTempSeconds] = useState(0);

  const formatTimeDisplay = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    if (hours > 0) {
      return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    }
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

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
  };

  return (
    <div className="relative">
      {!clockMode ? (
        <button
          onClick={() => setShowClockMenu(!showClockMenu)}
          className="flex items-center justify-center w-9 h-9 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-all"
          title="Timer / Stopwatch"
        >
          <Clock className="w-4 h-4 text-slate-400" />
        </button>
      ) : (
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${
          clockMode === "timer" && timeValue <= 60 
            ? "bg-red-500/20 border-red-500/30" 
            : "bg-slate-800 border-slate-700"
        }`}>
          <div className="flex items-center gap-2">
            {clockMode === "stopwatch" ? (
              <Zap className="w-4 h-4 text-blue-400" />
            ) : (
              <Timer className={`w-4 h-4 ${timeValue <= 60 ? "text-red-400 animate-pulse" : "text-amber-400"}`} />
            )}
            <span className={`font-mono text-sm font-semibold min-w-[60px] ${
              clockMode === "timer" && timeValue <= 60 ? "text-red-400" : "text-white"
            }`}>
              {formatTimeDisplay(timeValue)}
            </span>
          </div>

          <div className="flex items-center gap-1 border-l border-slate-600 pl-2">
            <button
              onClick={() => setIsClockRunning(!isClockRunning)}
              className={`p-1 rounded transition-colors ${
                isClockRunning 
                  ? "text-amber-400 hover:text-amber-300 hover:bg-amber-500/10" 
                  : "text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10"
              }`}
              title={isClockRunning ? "Pause" : "Resume"}
            >
              {isClockRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={handleCloseClock}
              className="p-1 text-slate-500 hover:text-white hover:bg-slate-600 rounded transition-colors"
              title="Close"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Clock Menu Dropdown */}
      {showClockMenu && !clockMode && (
        <div className="absolute top-full right-0 mt-2 w-72 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl shadow-black/50 z-50 overflow-hidden">
          <div className="p-3 border-b border-slate-700 bg-slate-800/50">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-400" />
              Time Tracker
            </h3>
          </div>

          <div className="p-3 space-y-3">
            {/* Stopwatch Option */}
            <button
              onClick={handleStartStopwatch}
              className="w-full p-3 bg-slate-700/50 hover:bg-blue-500/20 rounded-lg border border-slate-600 hover:border-blue-500/30 transition-all group text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                  <Zap className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">Stopwatch</div>
                  <div className="text-xs text-slate-400">Track time spent coding</div>
                </div>
              </div>
            </button>

            {/* Timer Option */}
            <div className="p-3 bg-slate-700/50 rounded-lg border border-slate-600 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-500/20 rounded-full flex items-center justify-center">
                  <Timer className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">Countdown Timer</div>
                  <div className="text-xs text-slate-400">Set a time limit</div>
                </div>
              </div>

              {/* Time Inputs */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-xs text-slate-400 mb-1 block text-center">Hours</label>
                  <input
                    type="number"
                    value={tempHours}
                    onChange={(e) => setTempHours(Math.max(0, Math.min(23, parseInt(e.target.value) || 0)))}
                    className="w-full bg-slate-800 border border-slate-600 text-white rounded-lg px-2 py-2 text-sm text-center font-mono focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block text-center">Minutes</label>
                  <input
                    type="number"
                    value={tempMinutes}
                    onChange={(e) => setTempMinutes(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                    className="w-full bg-slate-800 border border-slate-600 text-white rounded-lg px-2 py-2 text-sm text-center font-mono focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block text-center">Seconds</label>
                  <input
                    type="number"
                    value={tempSeconds}
                    onChange={(e) => setTempSeconds(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                    className="w-full bg-slate-800 border border-slate-600 text-white rounded-lg px-2 py-2 text-sm text-center font-mono focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
                  />
                </div>
              </div>

              <button
                onClick={handleStartTimer}
                disabled={tempHours === 0 && tempMinutes === 0 && tempSeconds === 0}
                className="w-full py-2 bg-amber-500 hover:bg-amber-400 disabled:bg-slate-600 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4" />
                Start Timer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
