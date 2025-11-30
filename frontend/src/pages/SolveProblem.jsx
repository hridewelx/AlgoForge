import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axiosClient from "../utilities/axiosClient";
import { toast, Toaster } from "react-hot-toast";
import { useTheme } from "../contexts/ThemeContext";
import {
  Header,
  MainContent,
  ProblemNotFound,
  LoadingSpinner,
} from "../components/SolveProblem";

const SolveProblem = () => {
  const { problemId } = useParams();
  const { user, isAuthenticated } = useSelector((state) => state.authentication);
  const { isDark } = useTheme();

  // Core state
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("python");
  const [activeTab, setActiveTab] = useState("description");
  const [activeTestCaseIndex, setActiveTestCaseIndex] = useState(0);
  
  // UI state
  const [showStickyNotes, setShowStickyNotes] = useState(false);
  const [showResultsTab, setShowResultsTab] = useState(false);
  
  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Data state
  const [problem, setProblem] = useState(null);
  const [testResults, setTestResults] = useState(null);
  const [submissionResults, setSubmissionResults] = useState(null);
  const [submissionInfo, setSubmissionInfo] = useState([]);
  const [editorialData, setEditorialData] = useState(null);
  const [solutionsData, setSolutionsData] = useState([]);
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      text: "Welcome to AlgoForge AI. I'm here to assist you with coding challenges, algorithm design, and technical problem-solving. How can I help you today?",
      sender: "ai",
      timestamp: new Date(),
      type: "text",
    },
  ]);

  // Resizable splits state
  const [splitX, setSplitX] = useState(40);
  const [splitY, setSplitY] = useState(70);
  const [isDraggingX, setIsDraggingX] = useState(false);
  const [isDraggingY, setIsDraggingY] = useState(false);
  const splitXRef = useRef(null);
  const splitYRef = useRef(null);

  // Clock state
  const [showClockMenu, setShowClockMenu] = useState(false);
  const [clockMode, setClockMode] = useState(null);
  const [timeValue, setTimeValue] = useState(0);
  const [isClockRunning, setIsClockRunning] = useState(false);
  const [timerDuration, setTimerDuration] = useState(25 * 60);
  const clockRef = useRef(null);

  // Fetch problem on mount
  useEffect(() => {
    fetchProblem();
  }, [problemId]);

  // Update code when language or problem changes
  useEffect(() => {
    if (problem) {
      updateCodeFromBoilerplate();
    }
  }, [language, problem]);

  // Fetch submissions when authenticated
  useEffect(() => {
    if (problem && isAuthenticated) {
      fetchSubmissions();
    }
  }, [user, problem, isAuthenticated]);

  // Fetch editorial and solutions
  useEffect(() => {
    if (problem) {
      fetchEditorial();
      fetchSolutions();
    }
  }, [problem]);

  // Clock logic
  useEffect(() => {
    if (isClockRunning && clockMode) {
      clockRef.current = setInterval(() => {
        setTimeValue((prev) => {
          if (clockMode === "timer") {
            return prev > 0 ? prev - 1 : 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else if (clockRef.current) {
      clearInterval(clockRef.current);
    }
    return () => {
      if (clockRef.current) clearInterval(clockRef.current);
    };
  }, [isClockRunning, clockMode]);

  // Resizable split handlers
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDraggingX && splitXRef.current) {
        const rect = splitXRef.current.getBoundingClientRect();
        const newSplitX = ((e.clientX - rect.left) / rect.width) * 100;
        setSplitX(Math.min(Math.max(newSplitX, 25), 75));
      }
      if (isDraggingY && splitYRef.current) {
        const rect = splitYRef.current.getBoundingClientRect();
        const newSplitY = ((e.clientY - rect.top) / rect.height) * 100;
        setSplitY(Math.min(Math.max(newSplitY, 20), 80));
      }
    };

    const handleMouseUp = () => {
      setIsDraggingX(false);
      setIsDraggingY(false);
      document.body.style.userSelect = "auto";
      document.body.style.cursor = "auto";
    };

    if (isDraggingX || isDraggingY) {
      document.body.style.userSelect = "none";
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDraggingX, isDraggingY]);

  // API functions
  const fetchProblem = async () => {
    try {
      setIsLoading(true);
      const { data } = await axiosClient.get(`/problems/problemfetchbyid/${problemId}`);
      setProblem(data.problem);
      updateCodeFromBoilerplate(data.problem);
    } catch (error) {
      console.error("Error fetching problem:", error);
      toast.error("Failed to load problem");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSubmissions = async () => {
    try {
      const { data } = await axiosClient.get(`/problems/individualsubmissions/${problemId}`);
      setSubmissionInfo(data.submissions);
    } catch (error) {
      console.error("Error fetching submissions:", error);
    }
  };

  const fetchEditorial = async () => {
    try {
      const { data } = await axiosClient.get(`/editorial/fetch/${problemId}`);
      setEditorialData(data.editorial || { videos: [], approaches: [] });
    } catch (error) {
      setEditorialData({ videos: [], approaches: [] });
    }
  };

  const fetchSolutions = async () => {
    try {
      const { data } = await axiosClient.get(`/submissions/solutions/${problemId}`);
      setSolutionsData(data || []);
    } catch (error) {
      setSolutionsData([]);
    }
  };

  const updateCodeFromBoilerplate = (problemData = problem) => {
    const boilerplate = problemData?.boilerplateCode?.find((bp) => bp.language === language);
    setCode(boilerplate?.code || `// Write your code in ${language}`);
  };

  const handleRunTests = async () => {
    if (!code.trim()) {
      toast.error("Please write some code before running test cases");
      return;
    }

    setIsRunning(true);
    try {
      const { data } = await axiosClient.post(`/submissions/run/${problemId}`, { code, language });
      setTestResults(data);
      
      if (data?.submissionResult?.status === "Accepted") {
        toast.success("All test cases passed!");
      } else {
        toast.error("Some test cases failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Test run failed");
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (!code.trim()) {
      toast.error("Please write some code before submitting");
      return;
    }

    setIsSubmitting(true);
    try {
      const { data } = await axiosClient.post(`/submissions/submit/${problemId}`, { code, language });
      setSubmissionResults(data);
      setShowResultsTab(true);
      setActiveTab("results");

      if (data?.submissionResult?.status === "Accepted") {
        toast.success("All test cases passed! 🎉");
      } else {
        toast.error("Some test cases failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Submission failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Utility functions
  const formatTime = (seconds) => {
    const hours = Math.floor(Math.abs(seconds) / 3600);
    const mins = Math.floor((Math.abs(seconds) % 3600) / 60);
    const secs = Math.abs(seconds) % 60;
    let timeString = `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    if (hours > 0) timeString = `${hours.toString().padStart(2, "0")}:${timeString}`;
    return timeString;
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      easy: "bg-emerald-600/20 text-emerald-400 border-emerald-600/40",
      medium: "bg-amber-600/20 text-amber-400 border-amber-600/40",
      hard: "bg-red-600/20 text-red-400 border-red-600/40",
    };
    return colors[difficulty?.toLowerCase()] || "bg-slate-600/20 text-slate-400 border-slate-600/40";
  };

  const handleClockModeSelect = (mode) => {
    setClockMode(mode);
    setShowClockMenu(false);
    setTimeValue(mode === "timer" ? timerDuration : 0);
  };

  const handleClockReset = () => {
    setIsClockRunning(false);
    setTimeValue(clockMode === "timer" ? timerDuration : 0);
  };

  const handleTimerDurationChange = (minutes) => {
    const newDuration = Math.max(1, minutes) * 60;
    setTimerDuration(newDuration);
    if (clockMode === "timer") setTimeValue(newDuration);
  };

  // Loading & error states
  if (isLoading) return <LoadingSpinner isDark={isDark} />;
  if (!problem) return <ProblemNotFound isDark={isDark} />;

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-950' : 'bg-slate-100'} font-sans`}>
      <Toaster position="top-right" reverseOrder={true} />

      <Header
        handleRunTests={handleRunTests}
        handleSubmit={handleSubmit}
        isRunning={isRunning}
        isSubmitting={isSubmitting}
        showStickyNotes={showStickyNotes}
        setShowStickyNotes={setShowStickyNotes}
        setActiveTab={setActiveTab}
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

      <MainContent
        splitXRef={splitXRef}
        isDraggingX={isDraggingX}
        splitX={splitX}
        splitY={splitY}
        splitYRef={splitYRef}
        setIsDraggingX={setIsDraggingX}
        setIsDraggingY={setIsDraggingY}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        showStickyNotes={showStickyNotes}
        setShowStickyNotes={setShowStickyNotes}
        problem={problem}
        submissionInfo={submissionInfo}
        editorialData={editorialData}
        solutionsData={solutionsData}
        chatMessages={chatMessages}
        setChatMessages={setChatMessages}
        getDifficultyColor={getDifficultyColor}
        submissionResults={submissionResults}
        showResultsTab={showResultsTab}
        setShowResultsTab={setShowResultsTab}
        language={language}
        setLanguage={setLanguage}
        code={code}
        setCode={setCode}
        testResults={testResults}
        activeTestCaseIndex={activeTestCaseIndex}
        setActiveTestCaseIndex={setActiveTestCaseIndex}
        isDark={isDark}
      />
    </div>
  );
};

export default SolveProblem;
