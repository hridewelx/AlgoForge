import { Target } from "lucide-react";

const SolvedProblemsCard = ({ stats }) => {
  return (
    <div className="bg-gradient-to-br from-slate-900/90 to-slate-800/50 rounded-2xl border border-slate-700/50 p-6 backdrop-blur-sm">
      <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
        <Target className="w-5 h-5 text-blue-400" />
        Solved Problems
      </h3>

      {/* Circular Progress */}
      <div className="flex justify-center mb-6">
        <div className="relative w-40 h-40">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="80"
              cy="80"
              r="70"
              fill="none"
              stroke="rgba(51, 65, 85, 0.5)"
              strokeWidth="12"
            />
            <circle
              cx="80"
              cy="80"
              r="70"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={`${
                (stats.totalSolved / stats.totalProblems) * 440
              } 440`}
            />
            <defs>
              <linearGradient
                id="gradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold text-white">
              {stats.totalSolved}
            </span>
            <span className="text-slate-500 text-sm">
              / {stats.totalProblems}
            </span>
            <span className="text-xs text-slate-400 mt-1">Solved</span>
          </div>
        </div>
      </div>

      {/* Difficulty Breakdown */}
      <div className="space-y-4">
        {[
          {
            label: "Easy",
            solved: stats.easySolved,
            total: stats.totalEasy,
            color: "bg-emerald-500",
            bgColor: "bg-emerald-500/10",
            textColor: "text-emerald-400",
          },
          {
            label: "Medium",
            solved: stats.mediumSolved,
            total: stats.totalMedium,
            color: "bg-yellow-500",
            bgColor: "bg-yellow-500/10",
            textColor: "text-yellow-400",
          },
          {
            label: "Hard",
            solved: stats.hardSolved,
            total: stats.totalHard,
            color: "bg-red-500",
            bgColor: "bg-red-500/10",
            textColor: "text-red-400",
          },
        ].map((diff) => (
          <div key={diff.label} className="flex items-center gap-4">
            <div
              className={`px-3 py-1 rounded-lg ${diff.bgColor} ${diff.textColor} text-xs font-semibold min-w-[70px] text-center`}
            >
              {diff.label}
            </div>
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-300">
                  {diff.solved}/{diff.total}
                </span>
                <span className="text-slate-500">
                  {diff.total > 0
                    ? Math.round((diff.solved / diff.total) * 100)
                    : 0}
                  %
                </span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full ${diff.color} rounded-full transition-all duration-500`}
                  style={{
                    width: `${
                      diff.total > 0
                        ? (diff.solved / diff.total) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SolvedProblemsCard;
