import Editor from "@monaco-editor/react";
import { useTheme } from "../../contexts/ThemeContext";

const CodeEditor = ({ language, setLanguage, code, setCode, splitY }) => {
  const { isDark } = useTheme();
  
  return (
    <div className={`flex flex-col border-b ${isDark ? 'border-slate-700/50' : 'border-slate-200'} min-h-0`} style={{ height: `${splitY}%` }}>
      <EditorHeader language={language} setLanguage={setLanguage} isDark={isDark} />
      <div className="flex-1 min-h-0">
        <Editor
          height="100%"
          language={language}
          value={code}
          onChange={setCode}
          theme={isDark ? "vs-dark" : "light"}
          options={{
            minimap: { enabled: false },
            fontSize: 13,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 4,
            wordWrap: "off",
          }}
        />
      </div>
    </div>
  );
};

const EditorHeader = ({ language, setLanguage, isDark }) => (
  <div className={`flex items-center justify-between p-2 ${isDark ? 'bg-slate-800/70 border-slate-700/50' : 'bg-slate-50 border-slate-200'} border-b flex-shrink-0`}>
    <div className="flex items-center gap-2">
      <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>Code</span>
      <LanguageSelector language={language} setLanguage={setLanguage} isDark={isDark} />
    </div>
    <EditorSettings isDark={isDark} />
  </div>
);

const LanguageSelector = ({ language, setLanguage, isDark }) => (
  <select
    value={language}
    onChange={(e) => setLanguage(e.target.value)}
    className={`${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300 text-slate-900'} border rounded px-2 py-0.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500`}
  >
    <option value="c">C</option>
    <option value="cpp">C++</option>
    <option value="java">Java</option>
    <option value="python">Python3</option>
    <option value="javascript">JavaScript</option>
    <option value="typescript" disabled>TypeScript</option>
    <option value="rust" disabled>Rust</option>
  </select>
);

const EditorSettings = ({ isDark }) => (
  <div className={`flex items-center gap-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
    <button title="Settings" className={`${isDark ? 'hover:text-white' : 'hover:text-slate-900'}`}>
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.44a2 2 0 0 1-2 2H4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h.44a2 2 0 0 1 2 2v.44a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-.44a2 2 0 0 1 2-2h.44a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-.44a2 2 0 0 1-2-2V4a2 2 0 0 0-2-2z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    </button>
  </div>
);

export default CodeEditor;