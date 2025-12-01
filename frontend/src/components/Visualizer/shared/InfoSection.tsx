import React from 'react';

interface InfoSectionProps {
  isDark: boolean;
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  variant?: 'default' | 'highlight' | 'gradient';
  gradientFrom?: string;
  gradientTo?: string;
}

export const InfoSection: React.FC<InfoSectionProps> = ({
  isDark,
  title,
  icon,
  children,
  variant = 'default',
  gradientFrom = 'cyan',
  gradientTo = 'blue',
}) => {
  const getContainerClass = () => {
    if (variant === 'gradient') {
      return isDark
        ? `bg-gradient-to-br from-${gradientFrom}-900/20 to-${gradientTo}-900/20 border border-${gradientFrom}-800/30`
        : `bg-gradient-to-br from-${gradientFrom}-50 to-${gradientTo}-50 border border-${gradientFrom}-200`;
    }
    return isDark ? 'bg-gray-700/50' : 'bg-slate-50 border border-slate-200';
  };

  return (
    <div className={`rounded-xl p-4 ${getContainerClass()}`}>
      <h4 className={`text-sm font-semibold mb-3 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
        {icon}
        {title}
      </h4>
      {children}
    </div>
  );
};

interface FunFactProps {
  isDark: boolean;
  fact: string;
}

export const FunFact: React.FC<FunFactProps> = ({ isDark, fact }) => {
  return (
    <div className={`rounded-xl p-4 ${isDark ? 'bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-800/30' : 'bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200'}`}>
      <h4 className={`text-sm font-semibold mb-2 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
        💡 Did You Know?
      </h4>
      <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>
        {fact}
      </p>
    </div>
  );
};

export default InfoSection;
