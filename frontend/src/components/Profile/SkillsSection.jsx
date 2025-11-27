import { useState } from "react";
import { Zap } from "lucide-react";

const SkillsSection = ({ skills }) => {
  const [expandedDifficulty, setExpandedDifficulty] = useState(null);

  const difficultyConfig = [
    {
      key: "Easy",
      label: "Easy",
      color: "bg-emerald-500",
      bgColor: "bg-emerald-500/10",
      textColor: "text-emerald-400",
    },
    {
      key: "Medium",
      label: "Medium",
      color: "bg-yellow-500",
      bgColor: "bg-yellow-500/10",
      textColor: "text-yellow-400",
    },
    {
      key: "Hard",
      label: "Hard",
      color: "bg-red-500",
      bgColor: "bg-red-500/10",
      textColor: "text-red-400",
    },
  ];

  const hasSkills =
    skills &&
    ((skills.Easy && skills.Easy.length > 0) ||
      (skills.Medium && skills.Medium.length > 0) ||
      (skills.Hard && skills.Hard.length > 0));

  return (
    <div className="bg-gradient-to-br from-slate-900/90 to-slate-800/50 rounded-2xl border border-slate-700/50 p-6 backdrop-blur-sm">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <Zap className="w-5 h-5 text-yellow-400" />
        Skills
      </h3>

      {hasSkills ? (
        <div className="space-y-5">
          {difficultyConfig.map(({ key, label, bgColor, textColor }) => {
            const skillsForDifficulty = skills[key] || [];
            if (skillsForDifficulty.length === 0) return null;

            const isExpanded = expandedDifficulty === key;
            const displayCount = isExpanded ? skillsForDifficulty.length : 4;
            const visibleSkills = skillsForDifficulty.slice(0, displayCount);
            const hasMore = skillsForDifficulty.length > 4;

            return (
              <div key={key}>
                <div
                  className={`inline-flex items-center px-3 py-1 rounded-lg ${bgColor} ${textColor} text-xs font-semibold mb-3`}
                >
                  {label}
                </div>
                <div className="flex flex-wrap gap-2">
                  {visibleSkills.map((skill) => (
                    <span
                      key={skill.name}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/50 text-xs text-slate-300 flex items-center gap-1.5 hover:bg-slate-700/80 transition-colors cursor-default"
                    >
                      {skill.name}
                      <span className={`${textColor} font-medium`}>
                        ×{skill.count}
                      </span>
                    </span>
                  ))}
                  {hasMore && (
                    <button
                      onClick={() =>
                        setExpandedDifficulty(isExpanded ? null : key)
                      }
                      className="px-2.5 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-xs text-blue-400 hover:text-blue-300 hover:bg-slate-700/50 transition-colors flex items-center gap-1"
                    >
                      {isExpanded ? (
                        <>Show less</>
                      ) : (
                        <>+{skillsForDifficulty.length - 4} more</>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-slate-500 text-sm text-center py-4">
          Solve problems to see your skills
        </p>
      )}
    </div>
  );
};

export default SkillsSection;
