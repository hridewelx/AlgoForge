import LeftPanel from "./LeftPanel";
import RightPanel from "./RightPanel";
import ResizableSplit from "./ResizableSplit";

const MainContent = ({
  splitXRef,
  isDraggingX,
  splitX,
  splitY,
  splitYRef,
  setIsDraggingX,
  setIsDraggingY,
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
  language,
  setLanguage,
  code,
  setCode,
  testResults,
  activeTestCaseIndex,
  setActiveTestCaseIndex,
  isDark = true,
}) => {
  return (
    <div
      ref={splitXRef}
      className="flex h-[calc(100vh-56px)]"
      style={{ cursor: isDraggingX ? "col-resize" : "default" }}
    >
      {/* Left Panel - Problem Description & Tabs */}
      <LeftPanel
        splitX={splitX}
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
        isDark={isDark}
      />

      {/* Vertical Resizer */}
      <ResizableSplit
        direction="horizontal"
        onMouseDown={(e) => {
          e.preventDefault();
          setIsDraggingX(true);
        }}
        isDark={isDark}
      />

      {/* Right Panel - Code Editor & Test Cases */}
      <RightPanel
        splitX={splitX}
        splitY={splitY}
        splitYRef={splitYRef}
        setIsDraggingY={setIsDraggingY}
        language={language}
        setLanguage={setLanguage}
        code={code}
        setCode={setCode}
        problem={problem}
        testResults={testResults}
        activeTestCaseIndex={activeTestCaseIndex}
        setActiveTestCaseIndex={setActiveTestCaseIndex}
        isDark={isDark}
      />
    </div>
  );
};

export default MainContent;
