import CodeEditor from "./CodeEditor";
import ResizableSplit from "./ResizableSplit";
import TestCasesPanel from "./TestCasesPanel";

const RightPanel = ({
  splitX,
  splitY,
  splitYRef,
  setIsDraggingY,
  language,
  setLanguage,
  code,
  setCode,
  problem,
  testResults,
  activeTestCaseIndex,
  setActiveTestCaseIndex,
  isDark = true,
}) => {
  return (
    <div
      className={`h-full flex flex-col ${isDark ? 'bg-slate-900' : 'bg-white'}`}
      style={{ width: `${100 - splitX}%` }}
      ref={splitYRef}
    >
      {/* Code Editor Section */}
      <CodeEditor
        language={language}
        setLanguage={setLanguage}
        code={code}
        setCode={setCode}
        splitY={splitY}
        isDark={isDark}
      />

      {/* Horizontal Resizer */}
      <ResizableSplit
        direction="vertical"
        onMouseDown={(e) => {
          e.preventDefault();
          setIsDraggingY(true);
        }}
        isDark={isDark}
      />

      {/* Test Cases Section */}
      <TestCasesPanel
        problem={problem}
        testResults={testResults}
        activeTestCaseIndex={activeTestCaseIndex}
        setActiveTestCaseIndex={setActiveTestCaseIndex}
        splitY={splitY}
        isDark={isDark}
      />
    </div>
  );
};

export default RightPanel;
