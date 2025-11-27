import { Award } from "lucide-react";

const BadgesSection = ({ stats, languageStats }) => {
  return (
    <div className="bg-gradient-to-br from-slate-900/90 to-slate-800/50 rounded-2xl border border-slate-700/50 p-6 backdrop-blur-sm">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <Award className="w-5 h-5 text-yellow-400" />
        Badges
      </h3>
      <div className="flex flex-wrap gap-4">
        {stats.totalSolved >= 1 && (
          <div className="flex flex-col items-center gap-2 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 hover:border-yellow-500/50 transition-colors">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-3xl shadow-lg">
              🎯
            </div>
            <span className="text-sm font-medium text-white">
              First Blood
            </span>
            <span className="text-xs text-slate-500">
              Solved first problem
            </span>
          </div>
        )}
        {stats.currentStreak >= 7 && (
          <div className="flex flex-col items-center gap-2 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 hover:border-orange-500/50 transition-colors">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-3xl shadow-lg">
              🔥
            </div>
            <span className="text-sm font-medium text-white">
              On Fire
            </span>
            <span className="text-xs text-slate-500">7 day streak</span>
          </div>
        )}
        {stats.hardSolved >= 1 && (
          <div className="flex flex-col items-center gap-2 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 hover:border-red-500/50 transition-colors">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center text-3xl shadow-lg">
              💀
            </div>
            <span className="text-sm font-medium text-white">
              Hard Hitter
            </span>
            <span className="text-xs text-slate-500">
              Solved a hard problem
            </span>
          </div>
        )}
        {Object.keys(languageStats).length >= 3 && (
          <div className="flex flex-col items-center gap-2 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 hover:border-purple-500/50 transition-colors">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-3xl shadow-lg">
              🌐
            </div>
            <span className="text-sm font-medium text-white">
              Polyglot
            </span>
            <span className="text-xs text-slate-500">
              3+ languages used
            </span>
          </div>
        )}
        {/* Locked Badge Example */}
        <div className="flex flex-col items-center gap-2 p-4 bg-slate-800/30 rounded-xl border border-slate-700/30 opacity-50">
          <div className="w-16 h-16 rounded-xl bg-slate-800 flex items-center justify-center text-3xl">
            🔒
          </div>
          <span className="text-sm font-medium text-slate-400">
            Speed Demon
          </span>
          <span className="text-xs text-slate-600">
            Solve in &lt;5 min
          </span>
        </div>
      </div>
    </div>
  );
};

export default BadgesSection;
