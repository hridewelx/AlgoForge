import ProblemDescription from "./ProblemDescription";
import ProblemSubmissions from "./SubmissionsTab";
import EditorialTab from "./EditorialTab";
import SolutionsTab from "./SolutionsTab";
import ChatAi from "./ChatAi";
import ResultsTab from "./ResultsTab";
import NotesPanel from "./NotesPanel";

const LeftPanel = ({
  splitX,
  activeTab,
  setActiveTab,
  showStickyNotes,
  setShowStickyNotes,
  problem,
  submissionInfo,
  editorialData,
  solutionsData,
  chatMessages,
  setChatMessages,
  getDifficultyColor,
  submissionResults,
  showResultsTab,
  setShowResultsTab,
  isDark = true,
}) => {
  // Tab configuration
  const tabs = [
    { key: "description", label: "Description" },
    { key: "editorial", label: "Editorial" },
    { key: "solutions", label: "Solutions" },
    { key: "submissions", label: "Submissions" },
    { key: "chatai", label: "Forge AI", highlight: true },
  ];

  // Add results tab dynamically
  if (showResultsTab) {
    tabs.push({ key: "results", label: "Results", closable: true });
  }

  return (
    <div
      className={`h-full overflow-hidden flex flex-col ${isDark ? 'bg-slate-900 border-slate-700/50' : 'bg-white border-slate-200'} border-r`}
      style={{ width: `${splitX}%` }}
    >
      {/* Tab Navigation */}
      <div className={`border-b ${isDark ? 'border-slate-700/50 bg-slate-900/50' : 'border-slate-200 bg-slate-50'} flex-shrink-0`}>
        <div className="flex px-2 overflow-x-auto scrollbar-thin scrollbar-thumb-slate-700">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`px-4 py-2.5 font-medium text-sm border-b-2 transition-all duration-200 whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === tab.key
                  ? tab.highlight 
                    ? "border-purple-500 text-purple-400 bg-purple-500/5"
                    : "border-blue-500 text-blue-400 bg-blue-500/5"
                  : isDark 
                    ? "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                    : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100"
              }`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.highlight && (
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
              )}
              {tab.label}
              {tab.closable && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowResultsTab(false);
                    setActiveTab("description");
                  }}
                  className="ml-1 p-0.5 rounded hover:bg-slate-600 text-slate-400 hover:text-white"
                  title="Close"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </button>
          ))}

          {/* Notes Tab - Only shown when active */}
          {showStickyNotes && (
            <button
              className={`px-4 py-2.5 font-medium text-sm border-b-2 transition-all duration-200 flex items-center gap-1.5 ${
                activeTab === "notes"
                  ? "border-amber-500 text-amber-400 bg-amber-500/5"
                  : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
              onClick={() => setActiveTab("notes")}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Notes
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowStickyNotes(false);
                  setActiveTab("description");
                }}
                className="ml-1 p-0.5 rounded hover:bg-slate-600 text-slate-400 hover:text-white"
                title="Close Notes"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </button>
          )}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === "description" && (
          <ProblemDescription
            problem={problem}
            getDifficultyColor={getDifficultyColor}
          />
        )}

        {activeTab === "submissions" && (
          <ProblemSubmissions submissions={submissionInfo} />
        )}

        {activeTab === "editorial" && (
          <EditorialTab problem={problem} editorialData={editorialData} />
        )}

        {activeTab === "solutions" && (
          <SolutionsTab problem={problem} solutionsData={solutionsData} />
        )}

        {activeTab === "chatai" && (
          <ChatAi
            problem={problem}
            messages={chatMessages}
            setMessages={setChatMessages}
          />
        )}

        {activeTab === "results" && submissionResults && (
          <ResultsTab
            submissionResults={submissionResults}
            onClose={() => {
              setShowResultsTab(false);
              setActiveTab("description");
            }}
          />
        )}

        {activeTab === "notes" && showStickyNotes && (
          <NotesPanel
            problemId={problem._id}
            onClose={() => {
              setShowStickyNotes(false);
              setActiveTab("description");
            }}
          />
        )}
      </div>
    </div>
  );
};

export default LeftPanel;
