import { useState, useEffect } from "react";
import { useTheme } from "../../contexts/ThemeContext";

const NotesPanel = ({ problemId, onClose }) => {
  const { isDark } = useTheme();
  const [notes, setNotes] = useState("");

  // Load notes from localStorage when component mounts
  useEffect(() => {
    const savedNotes = localStorage.getItem(`notes_${problemId}`) || "";
    setNotes(savedNotes);
  }, [problemId]);

  const handleNotesChange = (e) => {
    const newNotes = e.target.value;
    setNotes(newNotes);
    localStorage.setItem(`notes_${problemId}`, newNotes);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Notes Header with Close Button */}
      <div className={`flex items-center justify-between p-4 border-b ${isDark ? 'border-slate-700/50 bg-slate-800/50' : 'border-slate-200 bg-slate-50'}`}>
        <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Problem Notes</h3>
        <button
          onClick={onClose}
          className={`p-2 rounded-lg transition-colors duration-200 ${isDark ? 'hover:bg-slate-700 text-slate-400 hover:text-white' : 'hover:bg-slate-200 text-slate-500 hover:text-slate-900'}`}
          title="Close Notes"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Notes Content */}
      <div className="flex-1 p-4">
        <div className={`rounded-lg border h-full ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
          <textarea
            placeholder="Write your notes here...&#10;&#10;• Problem insights&#10;• Solution approaches&#10;• Edge cases to consider&#10;• Time/space complexity analysis&#10;• Related problems"
            value={notes}
            onChange={handleNotesChange}
            className={`w-full h-full bg-transparent border-none resize-none focus:outline-none p-4 text-md leading-relaxed ${isDark ? 'text-slate-300 placeholder-slate-500' : 'text-slate-700 placeholder-slate-400'}`}
            style={{ minHeight: "300px" }}
          />
        </div>
      </div>

      {/* Notes Footer */}
      <div className={`p-4 border-t ${isDark ? 'border-slate-700/50 bg-slate-800/50' : 'border-slate-200 bg-slate-50'}`}>
        <div className={`flex items-center justify-between text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          <span>Notes are automatically saved</span>
          <span>{notes.length} characters</span>
        </div>
      </div>
    </div>
  );
};

export default NotesPanel;