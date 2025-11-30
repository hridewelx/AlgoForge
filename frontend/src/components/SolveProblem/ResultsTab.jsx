import { useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";

const ResultsTab = ({ submissionResults, onClose }) => {
  const { isDark } = useTheme();
  
  if (!submissionResults) return null;

  const isAccepted = submissionResults.submissionResult?.status === "Accepted";
  
  return (
    <div className={`p-6 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
      {/* Header with Close Button */}
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Submission Result</h2>
        <button
          onClick={onClose}
          className={`p-2 rounded-lg transition-colors duration-200 ${isDark ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'}`}
          title="Close results"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Overall Result Banner */}
      <div className={`p-6 rounded-lg border mb-6 ${
        isAccepted
          ? "bg-green-600/10 border-green-600/30"
          : "bg-red-600/10 border-red-600/30"
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {isAccepted ? (
              <>
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-green-500">Accepted</h3>
                  <p className="text-green-400">All test cases passed successfully!</p>
                </div>
              </>
            ) : (
              <>
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-red-500">{submissionResults.submissionResult?.status}</h3>
                  <p className="text-red-400">{submissionResults.submissionResult?.errorMessage || "Some test cases failed"}</p>
                </div>
              </>
            )}
          </div>
          
          <div className="text-right">
            <div className={`font-semibold text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {submissionResults.submissionResult?.testCasePassed || 0}/{submissionResults.submissionResult?.totalTestCases || 0} Passed
            </div>
            <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Runtime: {submissionResults.submissionResult?.runTime?.toFixed(3)}s | 
              Memory: {submissionResults.submissionResult?.memory}KB
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className={`p-4 rounded-lg border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
          <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {submissionResults.performanceMetrics?.successRate || 0}%
          </div>
          <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Success Rate</div>
        </div>
        <div className={`p-4 rounded-lg border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
          <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {submissionResults.submissionResult?.testCasePassed || 0}/{submissionResults.submissionResult?.totalTestCases || 0}
          </div>
          <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Test Cases</div>
        </div>
        <div className={`p-4 rounded-lg border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
          <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {submissionResults.submissionResult?.runTime?.toFixed(3)}s
          </div>
          <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Runtime</div>
        </div>
        <div className={`p-4 rounded-lg border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
          <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {submissionResults.submissionResult?.memory}KB
          </div>
          <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Memory</div>
        </div>
      </div>

      {/* Content based on submission status */}
      {isAccepted ? (
        <AcceptedView submissionResults={submissionResults} isDark={isDark} />
      ) : (
        <RejectedView submissionResults={submissionResults} isDark={isDark} />
      )}
    </div>
  );
};

const AcceptedView = ({ submissionResults, isDark }) => (
  <div className="space-y-6">
    {/* Celebration Message */}
    <div className="bg-green-600/10 border border-green-600/30 rounded-lg p-6 text-center">
      <div className="flex items-center justify-center gap-3 mb-3">
        <svg className="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        <h3 className="text-xl font-semibold text-green-500">Excellent Work! 🎉</h3>
      </div>
      <p className="text-green-400">
        Your solution passed all test cases efficiently.
      </p>
    </div>

    {/* Tips for Improvement */}
    <div className={`rounded-lg p-6 border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
      <h4 className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>Want to improve further?</h4>
      <ul className={`space-y-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
        <li className="flex items-center gap-2">
          <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          Try optimizing for better runtime performance
        </li>
        <li className="flex items-center gap-2">
          <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Reduce memory usage for more efficient solutions
        </li>
        <li className="flex items-center gap-2">
          <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Explore different approaches to solve the same problem
        </li>
      </ul>
    </div>
  </div>
);

const RejectedView = ({ submissionResults, isDark }) => {
  const [expandedTestCase, setExpandedTestCase] = useState(0);
  
  // Find the first failing test case
  const failingTestCases = submissionResults.testCaseResults?.filter(tc => !tc.passed) || [];
  const firstFailingTestCase = failingTestCases[0];

  return (
    <div className="space-y-6">
      {/* Error Analysis */}
      <div className="bg-red-600/10 border border-red-600/30 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-red-500 mb-3">Error Analysis</h4>
        <div className="space-y-3">
          <p className="text-red-400">
            Your solution failed on <strong>{failingTestCases.length}</strong> test case{failingTestCases.length !== 1 ? 's' : ''}.
          </p>
          
          {submissionResults.submissionResult?.errorMessage && (
            <div className="bg-red-900/20 p-3 rounded border border-red-600/30">
              <p className="text-red-500 font-medium">Error Message:</p>
              <pre className="text-red-400 text-sm mt-1 whitespace-pre-wrap">
                {submissionResults.submissionResult.errorMessage}
              </pre>
            </div>
          )}
        </div>
      </div>

      {/* First Failing Test Case Details */}
      {firstFailingTestCase && (
        <div className="border border-red-600/30 rounded-lg bg-red-600/5">
          <div className="p-4 border-b border-red-600/30">
            <h4 className="text-lg font-semibold text-red-500">
              First Failing Test Case
            </h4>
            <p className="text-red-400 text-sm">
              This is the first test case where your solution produced incorrect output.
            </p>
          </div>

          <div className="p-4 space-y-4">
            {/* Input */}
            <div>
              <label className={`font-medium text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Input</label>
              <pre className={`p-3 rounded text-sm mt-1 whitespace-pre-wrap border ${isDark ? 'bg-slate-900 border-slate-700/50' : 'bg-slate-50 border-slate-200'}`}>
                {firstFailingTestCase.input || "No input provided"}
              </pre>
            </div>

            {/* Expected vs Actual Output */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`font-medium text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Expected Output</label>
                <pre className={`p-3 rounded text-sm mt-1 whitespace-pre-wrap border ${isDark ? 'bg-slate-900 border-slate-700/50' : 'bg-slate-50 border-slate-200'}`}>
                  {firstFailingTestCase.expectedOutput || "No expected output"}
                </pre>
              </div>
              <div>
                <label className={`font-medium text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Your Output</label>
                <pre className="bg-red-900/20 p-3 rounded text-sm mt-1 whitespace-pre-wrap border border-red-600/30 text-red-400">
                  {firstFailingTestCase.actualOutput || "No output"}
                </pre>
              </div>
            </div>

            {/* Error Details */}
            {firstFailingTestCase.error && (
              <div>
                <label className={`font-medium text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Error Details</label>
                <pre className="bg-red-900/20 p-3 rounded text-sm mt-1 whitespace-pre-wrap border border-red-600/30 text-red-400">
                  {firstFailingTestCase.error}
                </pre>
              </div>
            )}

            {/* Runtime Info */}
            {(firstFailingTestCase.runtime || firstFailingTestCase.memory) && (
              <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {firstFailingTestCase.runtime && (
                  <span>Runtime: <span className={isDark ? 'text-white' : 'text-slate-900'}>{firstFailingTestCase.runtime}s</span></span>
                )}
                {firstFailingTestCase.memory && (
                  <span className="ml-4">
                    Memory: <span className={isDark ? 'text-white' : 'text-slate-900'}>{firstFailingTestCase.memory}KB</span>
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Debugging Tips */}
      <div className={`rounded-lg p-6 border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
        <h4 className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>Debugging Tips</h4>
        <ul className={`space-y-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
          <li className="flex items-center gap-2">
            <svg className="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            Check edge cases like empty input, single element, or large values
          </li>
          <li className="flex items-center gap-2">
            <svg className="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            Verify your logic handles all possible scenarios
          </li>
          <li className="flex items-center gap-2">
            <svg className="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
            </svg>
            Test with custom inputs that might break your solution
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ResultsTab;