import { TrendingUp, TrendingDown } from "lucide-react";

const StatsCard = ({ title, value, icon: Icon, color, trend, trendValue, subtitle }) => {
  const colorConfig = {
    blue: {
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
      icon: "text-blue-400",
      gradient: "from-blue-500 to-blue-600",
    },
    green: {
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      icon: "text-emerald-400",
      gradient: "from-emerald-500 to-emerald-600",
    },
    purple: {
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
      icon: "text-purple-400",
      gradient: "from-purple-500 to-purple-600",
    },
    orange: {
      bg: "bg-orange-500/10",
      border: "border-orange-500/20",
      icon: "text-orange-400",
      gradient: "from-orange-500 to-orange-600",
    },
    pink: {
      bg: "bg-pink-500/10",
      border: "border-pink-500/20",
      icon: "text-pink-400",
      gradient: "from-pink-500 to-pink-600",
    },
    cyan: {
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/20",
      icon: "text-cyan-400",
      gradient: "from-cyan-500 to-cyan-600",
    },
  };

  const config = colorConfig[color] || colorConfig.blue;

  return (
    <div
      className={`relative overflow-hidden bg-slate-900/50 backdrop-blur-sm rounded-xl border ${config.border} p-5 hover:bg-slate-800/50 transition-all duration-300 group`}
    >
      {/* Background gradient effect */}
      <div
        className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${config.gradient} opacity-5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:opacity-10 transition-opacity`}
      />

      <div className="relative flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-400 mb-1">{title}</p>
          <p className="text-2xl sm:text-3xl font-bold text-white mb-1">{value}</p>
          
          {/* Trend indicator */}
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              {trend === "up" ? (
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-400" />
              )}
              <span
                className={`text-sm font-medium ${
                  trend === "up" ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {trendValue}
              </span>
              {subtitle && (
                <span className="text-xs text-slate-500 ml-1">{subtitle}</span>
              )}
            </div>
          )}
        </div>

        {/* Icon */}
        <div
          className={`p-3 rounded-xl ${config.bg} ${config.icon} group-hover:scale-110 transition-transform`}
        >
          {Icon && <Icon className="w-6 h-6" />}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;