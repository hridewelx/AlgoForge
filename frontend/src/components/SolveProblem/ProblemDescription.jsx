import { useTheme } from "../../contexts/ThemeContext";

const ProblemDescription = ({ problem, getDifficultyColor }) => {
  const { isDark } = useTheme();
  
  return (
    <div className={`p-6 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
      <div className="prose prose-invert max-w-none">
        {/* Problem Title and Tags */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'} leading-tight`}>{problem.title}</h1>
            <span className={`px-2 py-0.5 border rounded text-sm font-medium ${getDifficultyColor(problem.difficulty)}`}>
              {problem.difficulty}
            </span>
          </div>
          <div className="flex gap-2 flex-wrap">
            {problem.tags?.map((tag, index) => (
              <div key={index} className={`px-2 py-0.5 ${isDark ? 'bg-slate-700/50 border-slate-600/50 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'} border rounded text-xs font-medium`}>
                {tag}
              </div>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <p className="text-base leading-relaxed whitespace-pre-line">{problem.description}</p>
        </div>

        {/* Examples */}
        <Examples problem={problem} isDark={isDark} />
        
        {/* Constraints */}
        <Constraints problem={problem} isDark={isDark} />
      </div>
    </div>
  );
};

const Examples = ({ problem, isDark }) => (
  <div className="mb-6 space-y-4">
    <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-slate-900'} mb-4`}>Examples</h3>
    {problem.visibleTestCases?.map((testCase, index) => (
      <ExampleCard key={testCase._id} testCase={testCase} index={index} isDark={isDark} />
    ))}
  </div>
);

const ExampleCard = ({ testCase, index, isDark }) => (
  <div className={`space-y-3 p-4 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'} rounded-lg border`}>
    <p className={`${isDark ? 'text-white' : 'text-slate-900'} font-semibold mb-2`}>Example {index + 1}:</p>
    <TestCaseInputOutput testCase={testCase} isDark={isDark} />
    {testCase.explanation && <Explanation explanation={testCase.explanation} isDark={isDark} />}
  </div>
);

const TestCaseInputOutput = ({ testCase, isDark }) => (
  <>
    <div>
      <p className={`${isDark ? 'text-slate-400' : 'text-slate-500'} font-medium text-sm mb-1`}>Input:</p>
      <pre className={`${isDark ? 'bg-slate-900 text-slate-200 border-slate-700/50' : 'bg-slate-100 text-slate-800 border-slate-200'} p-3 rounded-lg text-sm border`}>{testCase.input}</pre>
    </div>
    <div>
      <p className={`${isDark ? 'text-slate-400' : 'text-slate-500'} font-medium text-sm mb-1`}>Output:</p>
      <pre className={`${isDark ? 'bg-slate-900 text-slate-200 border-slate-700/50' : 'bg-slate-100 text-slate-800 border-slate-200'} p-3 rounded-lg text-sm border`}>{testCase.output}</pre>
    </div>
  </>
);

const Explanation = ({ explanation, isDark }) => (
  <div>
    <p className={`${isDark ? 'text-slate-400' : 'text-slate-500'} font-medium text-sm mb-1`}>Explanation:</p>
    <p className={`${isDark ? 'text-slate-300' : 'text-slate-600'} text-sm break-words`}>{explanation}</p>
  </div>
);

const Constraints = ({ problem, isDark }) => (
  problem.constraints && problem.constraints.length > 0 && (
    <div className="mb-6">
      <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-slate-900'} mb-4`}>Constraints</h3>
      <ul className={`list-disc list-inside space-y-1 ${isDark ? 'text-slate-300' : 'text-slate-600'} pl-4`}>
        {problem.constraints.map((constraint, index) => (
          <li key={index} className="text-sm">{constraint}</li>
        ))}
      </ul>
    </div>
  )
);

export default ProblemDescription;