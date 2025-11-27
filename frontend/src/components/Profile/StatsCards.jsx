import { Target, Check, Award, Trophy, Flame } from "lucide-react";

const StatsCards = ({ stats }) => {
  const statItems = [
    {
      icon: <Target className="w-5 h-5" />,
      label: "Total Submissions",
      value: stats.totalSubmissions,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
    },
    {
      icon: <Check className="w-5 h-5" />,
      label: "Accepted",
      value: stats.acceptedSubmissions,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
    },
    {
      icon: <Award className="w-5 h-5" />,
      label: "Acceptance Rate",
      value: `${
        stats.totalSubmissions > 0
          ? Math.round(
              (stats.acceptedSubmissions / stats.totalSubmissions) * 100
            )
          : 0
      }%`,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
    },
    {
      icon: <Trophy className="w-5 h-5" />,
      label: "Max Streak",
      value: `${stats.maxStreak} days`,
      color: "text-orange-400",
      bgColor: "bg-orange-500/10",
    },
    {
      icon: <Flame className="w-5 h-5" />,
      label: "Current Streak",
      value: `${stats.currentStreak} days`,
      color: "text-orange-400",
      bgColor: "bg-orange-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {statItems.map((stat, idx) => (
        <div
          key={idx}
          className="bg-gradient-to-br from-slate-900/90 to-slate-800/50 rounded-xl border border-slate-700/50 p-4 backdrop-blur-sm hover:border-slate-600 transition-colors"
        >
          <div
            className={`${stat.bgColor} ${stat.color} w-10 h-10 rounded-lg flex items-center justify-center mb-3`}
          >
            {stat.icon}
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            {stat.value}
          </div>
          <div className="text-xs text-slate-400">{stat.label}</div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
