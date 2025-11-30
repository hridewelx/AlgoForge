import { TrendingUp } from "lucide-react";

const ProgressCard = ({ solvedCount, totalCount, isDark = true }) => {
  const completionPercentage =
    totalCount > 0 ? Math.round((solvedCount / totalCount) * 100) : 0;

  return (
    <div className={`${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'} border rounded-2xl p-6 backdrop-blur-sm shadow-xl relative overflow-hidden group`}>
      {/* Decorative glow */}
      <div className={`absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 ${isDark ? 'bg-blue-500/10 group-hover:bg-blue-500/20' : 'bg-blue-500/5 group-hover:bg-blue-500/10'} rounded-full blur-2xl transition-all duration-500`} />

      <div className="flex justify-between items-end mb-3 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-blue-500" />
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'} font-medium uppercase tracking-wider`}>
              Your Progress
            </p>
          </div>
          <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {solvedCount}{" "}
            <span className={`${isDark ? 'text-slate-500' : 'text-slate-400'} text-lg font-normal`}>
              / {totalCount}
            </span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-blue-500">
            {completionPercentage}%
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className={`w-full ${isDark ? 'bg-slate-800' : 'bg-slate-200'} rounded-full h-2.5 overflow-hidden`}>
        <div
          className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2.5 rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${completionPercentage}%` }}
        />
      </div>

      {/* Stats row */}
      <div className={`flex justify-between mt-3 text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
        <span>Keep going! 🚀</span>
        <span>{totalCount - solvedCount} remaining</span>
      </div>
    </div>
  );
};

export default ProgressCard;
