import React from 'react';

interface LegendProps {
  isDark: boolean;
  items: Array<{
    color: string;
    label: string;
  }>;
}

export const Legend: React.FC<LegendProps> = ({ isDark, items }) => {
  return (
    <div className={`flex flex-wrap gap-3 ${isDark ? '' : ''}`}>
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <div className={`w-4 h-4 ${item.color} rounded-full`} />
          <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
};

export default Legend;
