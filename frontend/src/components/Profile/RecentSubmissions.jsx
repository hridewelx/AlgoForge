import { useNavigate } from "react-router-dom";
import { Clock, Check, ChevronRight, Code2 } from "lucide-react";

const LANGUAGE_NAMES = {
  python: "Python",
  javascript: "JavaScript",
  java: "Java",
  cpp: "C++",
  c: "C",
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)}w ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const RecentSubmissions = ({ recentAccepted }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-br from-slate-900/90 to-slate-800/50 rounded-2xl border border-slate-700/50 backdrop-blur-sm overflow-hidden">
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-400" />
            Recent Accepted Solutions
          </h3>
          <button
            onClick={() => navigate("/problemset")}
            className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center gap-1 transition-colors"
          >
            View all
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {recentAccepted.length > 0 ? (
        <div className="divide-y divide-slate-800/50">
          {recentAccepted.map((submission, idx) => (
            <div
              key={submission._id || idx}
              onClick={() =>
                submission.problemId &&
                navigate(`/problem/${submission.problemId}`)
              }
              className="flex items-center justify-between p-4 hover:bg-slate-800/30 cursor-pointer transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center text-green-400">
                  <Check className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-white font-medium group-hover:text-blue-400 transition-colors truncate max-w-[150px] sm:max-w-[200px] md:max-w-xs">
                    {submission.problemTitle}
                  </h4>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      {LANGUAGE_NAMES[submission.language] || submission.language}
                    </span>
                    <span>•</span>
                    <span>{formatDate(submission.createdAt)}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="text-right">
                  <div className="text-slate-300">
                    {(submission.runTime * 1000).toFixed(0)}ms
                  </div>
                  <div className="text-xs text-slate-500">Runtime</div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-800/50 flex items-center justify-center mx-auto mb-4">
            <Code2 className="w-8 h-8 text-slate-600" />
          </div>
          <h4 className="text-white font-semibold mb-2">
            No submissions yet
          </h4>
          <p className="text-slate-500 text-sm mb-4">
            Start solving problems to see your submissions here
          </p>
          <button
            onClick={() => navigate("/problemset")}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors"
          >
            Browse Problems
          </button>
        </div>
      )}
    </div>
  );
};

export default RecentSubmissions;
