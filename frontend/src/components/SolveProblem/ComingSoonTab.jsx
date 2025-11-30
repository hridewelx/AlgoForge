import { useTheme } from "../../contexts/ThemeContext";

const ComingSoonTab = ({ tabName }) => {
  const { isDark } = useTheme();

  return (
    <div className={`p-6 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
      <div className="text-center py-8">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-12 w-12 mx-auto mb-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          {tabName.charAt(0).toUpperCase() + tabName.slice(1)} Coming Soon
        </h3>
        <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>
          We're working on adding this content.
        </p>
      </div>
    </div>
  );
};

export default ComingSoonTab;