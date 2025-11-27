import { useNavigate } from "react-router-dom";
import {
  Edit3,
  MapPin,
  Link as LinkIcon,
  Github,
  Linkedin,
  Twitter,
} from "lucide-react";

// Calculate rank based on problems solved
const getRank = (solved) => {
  if (solved >= 500)
    return {
      title: "Guardian",
      color: "from-red-500 to-orange-500",
      icon: "🏆",
    };
  if (solved >= 200)
    return {
      title: "Knight",
      color: "from-purple-500 to-pink-500",
      icon: "⚔️",
    };
  if (solved >= 100)
    return {
      title: "Specialist",
      color: "from-cyan-500 to-blue-500",
      icon: "💎",
    };
  if (solved >= 50)
    return {
      title: "Apprentice",
      color: "from-green-500 to-emerald-500",
      icon: "🌟",
    };
  if (solved >= 10)
    return {
      title: "Newbie",
      color: "from-slate-500 to-slate-400",
      icon: "🌱",
    };
  return {
    title: "Beginner",
    color: "from-slate-600 to-slate-500",
    icon: "👋",
  };
};

const ProfileCard = ({ profileData, stats, isOwnProfile }) => {
  const navigate = useNavigate();
  const rank = getRank(stats.totalSolved);

  return (
    <div className="bg-gradient-to-br from-slate-900/90 to-slate-800/50 rounded-2xl border border-slate-700/50 overflow-hidden backdrop-blur-sm">
      {/* Profile Header with Gradient */}
      <div className={`h-24 bg-gradient-to-r ${rank.color} relative`}>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute -bottom-12 left-6">
          {profileData.user.avatar ? (
            <img
              src={profileData.user.avatar}
              alt={`${profileData.user.firstName}'s avatar`}
              className="w-24 h-24 rounded-2xl object-cover shadow-xl border-4 border-slate-900"
            />
          ) : (
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-4xl font-bold text-white shadow-xl border-4 border-slate-900">
              {profileData.user.firstName.charAt(0).toUpperCase()}
              {profileData.user.lastName?.charAt(0).toUpperCase() || ""}
            </div>
          )}
        </div>
      </div>

      <div className="pt-16 px-6 pb-6">
        {/* Name and Edit */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              {profileData.user.firstName} {profileData.user.lastName}
              {stats.totalSolved >= 50 && (
                <span className="text-yellow-400" title="Verified">
                  ✓
                </span>
              )}
            </h1>
            <p className="text-slate-400 text-sm">
              @{profileData.user.username || profileData.user.firstName.toLowerCase()}
            </p>
          </div>
          {isOwnProfile && (
            <button
              onClick={() =>
                navigate(`/algoforge/${profileData.user.username}/settings`)
              }
              className="px-3 py-1.5 rounded-lg bg-green-600/10 hover:bg-green-600/20 text-green-500 text-xs font-medium border border-green-600/20 transition-all flex items-center gap-1"
            >
              <Edit3 className="w-3 h-3" />
              Edit Profile
            </button>
          )}
        </div>

        {/* Rank Badge */}
        <div
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r ${rank.color} text-white font-semibold text-sm mb-6 shadow-lg`}
        >
          <span className="text-lg">{rank.icon}</span>
          {rank.title}
        </div>

        {/* Extended Profile Info */}
        <div className="space-y-3 mb-6">
          {profileData.user.location && (
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <MapPin className="w-4 h-4" />
              {profileData.user.location}
            </div>
          )}

          <div className="flex gap-3">
            {profileData.user.website && (
              <a
                href={profileData.user.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-blue-400 transition-colors flex items-center gap-1"
              >
                <LinkIcon className="w-4 h-4" />
                <span>{profileData.user.website}</span>
              </a>
            )}
            {profileData.user.github && (
              <a
                href={`https://github.com/${profileData.user.github}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white transition-colors"
              >
                <Github className="w-4 h-4" />
              </a>
            )}
            {profileData.user.linkedin && (
              <a
                href={`https://linkedin.com/in/${profileData.user.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-blue-500 transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            )}
            {profileData.user.twitter && (
              <a
                href={`https://twitter.com/${profileData.user.twitter}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-blue-400 transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
            )}
          </div>

          {profileData.user.summary && (
            <p className="text-slate-400 text-sm leading-relaxed border-t border-slate-800 pt-3 mt-3">
              {profileData.user.summary}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
