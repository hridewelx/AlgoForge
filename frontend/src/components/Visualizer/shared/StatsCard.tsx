import React from 'react';
import { Clock, TrendingUp, Layers } from 'lucide-react';

interface StatsCardProps {
  isDark: boolean;
  label: string;
  value: string;
  type: 'best' | 'worst' | 'space' | 'average';
}

export const StatsCard: React.FC<StatsCardProps> = ({ isDark, label, value, type }) => {
  const configs = {
    best: {
      gradient: isDark 
        ? 'bg-gradient-to-br from-green-900/30 to-green-800/20 border border-green-700/30'
        : 'bg-gradient-to-br from-green-50 to-green-100 border border-green-200',
      icon: Clock,
      iconColor: 'text-green-500',
      valueColor: isDark ? 'text-green-400' : 'text-green-600',
    },
    worst: {
      gradient: isDark 
        ? 'bg-gradient-to-br from-red-900/30 to-red-800/20 border border-red-700/30'
        : 'bg-gradient-to-br from-red-50 to-red-100 border border-red-200',
      icon: TrendingUp,
      iconColor: 'text-red-500',
      valueColor: isDark ? 'text-red-400' : 'text-red-600',
    },
    space: {
      gradient: isDark 
        ? 'bg-gradient-to-br from-purple-900/30 to-purple-800/20 border border-purple-700/30'
        : 'bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200',
      icon: Layers,
      iconColor: 'text-purple-500',
      valueColor: isDark ? 'text-purple-400' : 'text-purple-600',
    },
    average: {
      gradient: isDark 
        ? 'bg-gradient-to-br from-yellow-900/30 to-yellow-800/20 border border-yellow-700/30'
        : 'bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200',
      icon: Clock,
      iconColor: 'text-yellow-500',
      valueColor: isDark ? 'text-yellow-400' : 'text-yellow-600',
    },
  };

  const config = configs[type];
  const Icon = config.icon;

  return (
    <div className={`rounded-lg p-3 text-center ${config.gradient}`}>
      <Icon className={`w-4 h-4 mx-auto mb-1 ${config.iconColor}`} />
      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>{label}</p>
      <p className={`text-sm font-bold ${config.valueColor}`}>{value}</p>
    </div>
  );
};

export default StatsCard;
