import { Code2 } from "lucide-react";

const LANGUAGE_NAMES = {
  python: "Python",
  javascript: "JavaScript",
  java: "Java",
  cpp: "C++",
  c: "C",
};

const LanguagesCard = ({ languageStats }) => {
  return (
    <div className="bg-gradient-to-br from-slate-900/90 to-slate-800/50 rounded-2xl border border-slate-700/50 p-6 backdrop-blur-sm">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <Code2 className="w-5 h-5 text-purple-400" />
        Languages
      </h3>

      {Object.keys(languageStats).length > 0 ? (
        <div className="space-y-3">
          {Object.entries(languageStats)
            .sort(([, a], [, b]) => b - a)
            .map(([lang, count]) => {
              const total = Object.values(languageStats).reduce(
                (a, b) => a + b,
                0
              );
              const percentage = Math.round((count / total) * 100);

              return (
                <div
                  key={lang}
                  className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-xl hover:bg-slate-800/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-white">
                        {LANGUAGE_NAMES[lang] || lang}
                      </span>
                      <span className="text-xs text-slate-400">
                        {count} solved
                      </span>
                    </div>
                    <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      ) : (
        <p className="text-slate-500 text-sm text-center py-4">
          No problems solved yet
        </p>
      )}
    </div>
  );
};

export default LanguagesCard;
