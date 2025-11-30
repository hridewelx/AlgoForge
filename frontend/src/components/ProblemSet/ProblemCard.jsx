import { NavLink } from "react-router-dom";
import { CheckCircleIcon, ArrowRightIcon } from "./Icons";
import { getDifficultyColor } from "./constants";

const ProblemCard = ({ problem, isSolved, isDark = true }) => {
  return (
    <div className={`group relative ${isDark ? 'bg-slate-900/60 hover:bg-slate-800/80 border-slate-800 hover:border-blue-500/30' : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-blue-500/30'} backdrop-blur-sm rounded-xl border p-5 transition-all duration-300 hover:shadow-lg hover:shadow-blue-900/10 flex flex-col md:flex-row md:items-center justify-between gap-4`}>
      {/* Left: Content */}
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <h2 className={`text-lg font-bold ${isDark ? 'text-slate-100 group-hover:text-blue-400' : 'text-slate-900 group-hover:text-blue-600'} transition-colors`}>
            <NavLink
              to={`/problem/${problem._id}`}
              className="focus:outline-none hover:underline decoration-blue-400/50 underline-offset-4"
            >
              {problem.title}
            </NavLink>
          </h2>
          {isSolved && (
            <span
              title="Solved"
              className="text-emerald-500 animate-in fade-in zoom-in duration-300"
            >
              <CheckCircleIcon />
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`px-2.5 py-0.5 rounded text-xs font-semibold border ${getDifficultyColor(
              problem.difficulty
            )}`}
          >
            {problem.difficulty}
          </span>

          {/* Tags - limit to first 5 */}
          {problem.tags?.slice(0, 5).map((tag, index) => (
            <span
              key={index}
              className={`text-xs ${isDark ? 'text-slate-500 bg-slate-950 border-slate-800' : 'text-slate-500 bg-slate-100 border-slate-200'} border px-2 py-0.5 rounded`}
            >
              {tag}
            </span>
          ))}
          {problem.tags?.length > 5 && (
            <span className={`text-xs ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
              +{problem.tags.length - 5} more
            </span>
          )}
        </div>
      </div>

      {/* Right: Action */}
      <div className="flex items-center">
        <NavLink
          to={`/problem/${problem._id}`}
          target="_blank"
          className={`flex items-center gap-2 px-5 py-2.5 ${isDark ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-slate-100 text-slate-700 border-slate-200'} hover:bg-blue-600 hover:text-white rounded-lg font-medium transition-all duration-300 border hover:border-blue-500 group-hover:translate-x-1`}
        >
          Solve
          <ArrowRightIcon />
        </NavLink>
      </div>
    </div>
  );
};

export default ProblemCard;
