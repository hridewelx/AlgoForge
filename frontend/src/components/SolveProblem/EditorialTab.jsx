import { useState, useEffect } from "react";
import axiosClient from "../../utilities/axiosClient";
import { toast } from "react-hot-toast";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme } from "../../contexts/ThemeContext";

const EditorialTab = ({ problem, editorialData }) => {
  const { isDark } = useTheme();
  const [selectedApproach, setSelectedApproach] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState("python");
  const [approaches, setApproaches] = useState([]);

  const languageIcons = {
    python: "🐍",
    javascript: "📜",
    java: "☕",
    cpp: "⚡",
    c: "🔧"
  };

  useEffect(() => {
    if (editorialData) {
      // Store videos separately
      const videos = editorialData.videos || [];
      
      // Transform approaches to the format expected by the component
      const transformedApproaches = (editorialData.approaches || []).map(approach => ({
        name: approach.name,
        description: approach.description || "",
        timeComplexity: approach.complexity?.time || "",
        spaceComplexity: approach.complexity?.space || "",
        explanation: approach.explanation || "",
        solutions: approach.solutions.reduce((acc, sol) => {
          acc[sol.language] = sol.code;
          return acc;
        }, {}),
        videos: videos.length > 0 ? videos.map(v => ({
          url: v.secureUrl,
          thumbnail: v.thumbnailUrl,
          duration: v.duration,
          title: v.title
        })) : []
      }));
      
      setApproaches(transformedApproaches);
      
      if (transformedApproaches.length > 0 && selectedApproach === null) {
        setSelectedApproach(0);
      }
    }
  }, [editorialData]);

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    toast.success("Code copied to clipboard!");
  };

  if (!editorialData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>Loading editorials...</p>
        </div>
      </div>
    );
  }

  if (approaches.length === 0) {
    return (
      <div className={`p-6 ${isDark ? 'bg-slate-900 text-slate-100' : 'bg-white text-slate-900'} min-h-full`}>
        <div className="text-center py-16">
          <div className={`inline-flex items-center justify-center w-20 h-20 ${isDark ? 'bg-slate-800' : 'bg-slate-100'} rounded-full mb-4`}>
            <svg className={`w-10 h-10 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className={`text-xl font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'} mb-2`}>
            No Editorial Available
          </h3>
          <p className={isDark ? 'text-slate-500' : 'text-slate-400'}>
            Editorial solutions will be available soon
          </p>
        </div>
      </div>
    );
  }

  const currentApproach = approaches[selectedApproach];
  const availableLanguages = Object.keys(currentApproach.solutions);

  return (
    <div className={`p-6 ${isDark ? 'bg-slate-900 text-slate-100' : 'bg-white text-slate-900'} min-h-full`}>
      
      {/* Header */}
      <div className="mb-6">
        <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'} mb-2`}>Editorial Solutions</h2>
        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Comprehensive solutions with detailed explanations
        </p>
      </div>

      {/* Videos */}
      {currentApproach.videos.length > 0 && (
        console.log(currentApproach),
        <div className="mb-6">
          <h4 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'} mb-4 flex items-center gap-2`}>
            <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Video Explanation
          </h4>
          <div className="space-y-4">
            {currentApproach.videos.map((video, index) => (
              <div key={index} className={`${isDark ? 'bg-slate-800/50' : 'bg-slate-50'} border border-yellow-400 rounded-lg overflow-hidden`}>
                <div className={`aspect-video ${isDark ? 'bg-slate-900' : 'bg-slate-100'} relative`}>
                  <video
                    controls
                    className="w-full h-full"
                    poster={video.thumbnail}
                    preload="metadata"
                  >
                    <source src={video.url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Approach Tabs */}
      {approaches.length > 1 && (
        <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
          {approaches.map((approach, index) => (
            <button
              key={index}
              onClick={() => {
                setSelectedApproach(index);
                const langs = Object.keys(approach.solutions);
                if (langs.length > 0 && !langs.includes(selectedLanguage)) {
                  setSelectedLanguage(langs[0]);
                }
              }}
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 whitespace-nowrap ${
                selectedApproach === index
                  ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
                  : isDark 
                    ? "bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700"
                    : "bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200"
              }`}
            >
              {approach.name}
            </button>
          ))}
        </div>
      )}

      {/* Approach Header */}
      <div className={`mb-6 p-6 ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'} border rounded-lg`}>
        <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'} mb-2`}>{currentApproach.name}</h3>
        {currentApproach.description && (
          <p className={`mb-4 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{currentApproach.description}</p>
        )}
        <div className="flex items-center gap-6 text-sm">
          {currentApproach.timeComplexity && (
            <div className="flex items-center gap-2">
              <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Time:</span>
              <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/30 text-blue-500 rounded-lg font-mono">
                {currentApproach.timeComplexity}
              </span>
            </div>
          )}
          {currentApproach.spaceComplexity && (
            <div className="flex items-center gap-2">
              <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Space:</span>
              <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/30 text-purple-500 rounded-lg font-mono">
                {currentApproach.spaceComplexity}
              </span>
            </div>
          )}
        </div>
      </div>

      

      {/* Explanation */}
      {currentApproach.explanation && (
        <div className="mb-6">
          <h4 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'} mb-4 flex items-center gap-2`}>
            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Explanation
          </h4>
          <div className={`${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'} border rounded-lg p-6`}>
            <div className="prose prose-invert max-w-none">
              <p className={`whitespace-pre-wrap leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                {currentApproach.explanation}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Code Solutions */}
      {availableLanguages.length > 0 && (
        <div>
          <h4 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'} mb-4 flex items-center gap-2`}>
            <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            Implementation
          </h4>

          {/* Language Tabs */}
          <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
            {availableLanguages.map((lang) => (
              <button
                key={lang}
                onClick={() => setSelectedLanguage(lang)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 whitespace-nowrap ${
                  selectedLanguage === lang
                    ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white"
                    : isDark
                      ? "bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700"
                      : "bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200"
                }`}
              >
                <span className="text-xl">{languageIcons[lang] || "💻"}</span>
                {lang.charAt(0).toUpperCase() + lang.slice(1)}
              </button>
            ))}
          </div>

          {/* Code Display */}
          <div className={`relative ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'} border rounded-lg overflow-hidden`}>
            <div className="absolute top-4 right-4 z-10">
              <button
                onClick={() => copyCode(currentApproach.solutions[selectedLanguage])}
                className={`px-3 py-1.5 ${isDark ? 'bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-600 hover:text-slate-900'} rounded-lg text-sm font-medium transition-colors flex items-center gap-2`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy
              </button>
            </div>
            <SyntaxHighlighter
              language={selectedLanguage === "cpp" ? "cpp" : selectedLanguage}
              style={isDark ? vscDarkPlus : vs}
              customStyle={{
                margin: 0,
                padding: "1.5rem",
                background: "transparent",
                fontSize: "0.9rem"
              }}
              showLineNumbers
            >
              {currentApproach.solutions[selectedLanguage]}
            </SyntaxHighlighter>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditorialTab;
