import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axiosClient from "../utilities/axiosClient";
import { toast } from "react-hot-toast";
import Navbar from "../components/UI/Navbar";
import { useTheme } from "../contexts/ThemeContext";
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
  const { isDark } = useTheme();

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
    if (count === 0) return isDark ? "bg-slate-800/50" : "bg-slate-200/50";
    if (count === 1) return "bg-emerald-900/70";
    if (count <= 3) return "bg-emerald-700/80";
    if (count <= 5) return "bg-emerald-500";
    return "bg-emerald-400";
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-slate-950' : 'bg-slate-100'} flex items-center justify-center`}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'} font-medium`}>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-slate-950' : 'bg-slate-100'} flex items-center justify-center`}>
        <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Failed to load profile data</p>
      </div>
    );
  }

  const { stats, languageStats, recentAccepted, skills } = profileData;

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-950 text-slate-300' : 'bg-slate-100 text-slate-700'} font-sans selection:bg-blue-500/30`}>
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className={`absolute top-0 left-1/4 w-96 h-96 ${isDark ? 'bg-blue-500/5' : 'bg-blue-500/10'} rounded-full blur-[120px]`} />
        <div className={`absolute bottom-0 right-1/4 w-96 h-96 ${isDark ? 'bg-purple-500/5' : 'bg-purple-500/10'} rounded-full blur-[120px]`} />
        <div className={`absolute top-1/2 left-1/2 w-96 h-96 ${isDark ? 'bg-emerald-500/5' : 'bg-emerald-500/10'} rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2`} />
      </div>
      <Navbar />

      <main className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <ProfileCard
              profileData={profileData}
              stats={stats}
              isOwnProfile={isOwnProfile}
              isDark={isDark}
            />
            <SkillsSection skills={skills} isDark={isDark} />
            <SolvedProblemsCard stats={stats} isDark={isDark} />
            <LanguagesCard languageStats={languageStats} isDark={isDark} />
          </div>

          {/* Right Content */}
          <div className="lg:col-span-8 space-y-6">
            <BadgesSection stats={stats} languageStats={languageStats} isDark={isDark} />
            <ActivityHeatmap
              stats={stats}
              selectedYear={selectedYear}
              setSelectedYear={setSelectedYear}
              availableYears={availableYears}
              profileData={profileData}
              getActivityColor={getActivityColor}
              isDark={isDark}
            />
            <StatsCards stats={stats} isDark={isDark} />
            <RecentSubmissions recentAccepted={recentAccepted} isDark={isDark} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserProfile;
