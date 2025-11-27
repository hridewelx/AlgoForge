import { useState, useEffect } from "react";
import { useNavigate, NavLink, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axiosClient from "../utilities/axiosClient";
import { toast } from "react-hot-toast";
import { Code2 } from "lucide-react";
import UserAvatar from "../components/UI/UserAvatar";
import AuthButton from "../components/UI/AuthButton";
import {
  ProfileCard,
  SkillsSection,
  SolvedProblemsCard,
  LanguagesCard,
  BadgesSection,
  ActivityHeatmap,
  StatsCards,
  RecentSubmissions,
} from "../components/Profile";

const UserProfile = () => {
  const navigate = useNavigate();
  const { username } = useParams();
  const { user, isAuthenticated } = useSelector(
    (state) => state.authentication
  );

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState("last365");
  const [availableYears, setAvailableYears] = useState([]);

  const isOwnProfile = !username || (user && user.username === username);

  useEffect(() => {
    if (!isAuthenticated && !username) {
      navigate("/login");
      return;
    }
    fetchProfile(selectedYear);
  }, [isAuthenticated, navigate, username, selectedYear]);

  const fetchProfile = async (year) => {
    try {
      const yearParam = year === "last365" ? "" : year;
      const url = `/profile/getprofile?username=${username || ""}${
        yearParam ? `&year=${yearParam}` : ""
      }`;

      const response = await axiosClient.get(url);
      setProfileData(response.data);

      // Set available years based on submission dates
      if (availableYears.length === 0 && response.data.submissionCalendar) {
        const submissionDates = Object.keys(response.data.submissionCalendar);
        const yearsWithSubmissions = new Set();

        submissionDates.forEach((date) => {
          const yearFromDate = new Date(date).getFullYear();
          yearsWithSubmissions.add(yearFromDate);
        });

        const currentYear = new Date().getFullYear();
        yearsWithSubmissions.add(currentYear);

        const years = Array.from(yearsWithSubmissions).sort((a, b) => b - a);
        setAvailableYears(years);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile");
      if (username) {
        navigate("/problemset");
      }
    } finally {
      setLoading(false);
    }
  };

  const getActivityColor = (count) => {
    if (count === 0) return "bg-slate-800/50";
    if (count === 1) return "bg-emerald-900/70";
    if (count <= 3) return "bg-emerald-700/80";
    if (count <= 5) return "bg-emerald-500";
    return "bg-emerald-400";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <p className="text-slate-400">Failed to load profile data</p>
      </div>
    );
  }

  const { stats, languageStats, recentAccepted, skills } = profileData;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans selection:bg-blue-500/30">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-emerald-500/5 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">
              AlgoForge
            </span>
          </div>

          <div className="flex items-center gap-8">
            <div className="hidden md:flex items-center gap-6 text-sm font-medium">
              <NavLink
                to="/problemset"
                className={({ isActive }) =>
                  `hover:text-white transition-colors ${
                    isActive ? "text-white" : "text-slate-400"
                  }`
                }
              >
                Problems
              </NavLink>
              <NavLink
                to={
                  user?.username
                    ? `/algoforge/profile/${user.username}`
                    : "/profile"
                }
                className={({ isActive }) =>
                  `hover:text-white transition-colors ${
                    isActive ? "text-white" : "text-slate-400"
                  }`
                }
              >
                Profile
              </NavLink>
            </div>
            <div className="pl-6 border-l border-white/10">
              {isAuthenticated ? <UserAvatar /> : <AuthButton />}
            </div>
          </div>
        </div>
      </nav>

      <main className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <ProfileCard
              profileData={profileData}
              stats={stats}
              isOwnProfile={isOwnProfile}
            />
            <SkillsSection skills={skills} />
            <SolvedProblemsCard stats={stats} />
            <LanguagesCard languageStats={languageStats} />
          </div>

          {/* Right Content */}
          <div className="lg:col-span-8 space-y-6">
            <BadgesSection stats={stats} languageStats={languageStats} />
            <ActivityHeatmap
              stats={stats}
              selectedYear={selectedYear}
              setSelectedYear={setSelectedYear}
              availableYears={availableYears}
              profileData={profileData}
              getActivityColor={getActivityColor}
            />
            <StatsCards stats={stats} />
            <RecentSubmissions recentAccepted={recentAccepted} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserProfile;
