import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axiosClient from "../utilities/axiosClient";
import Navbar from "../components/UI/Navbar";
import { useTheme } from "../contexts/ThemeContext";
import {
  HeroSection,
  FeaturesSection,
  CoursesSection,
  CTASection,
  Footer,
} from "../components/Landing";

const Homepage = () => {
  const { isDark } = useTheme();
  const { user, isAuthenticated } = useSelector(
    (state) => state.authentication
  );

  const [stats, setStats] = useState({
    totalProblems: 0,
    solvedProblems: 0,
    easyCount: 0,
    mediumCount: 0,
    hardCount: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [animatedStats, setAnimatedStats] = useState({
    totalProblems: 0,
    solvedProblems: 0,
  });

  // Data Fetching
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [problemsRes, solvedRes] = await Promise.all([
          axiosClient.get("/problems/problemset"),
          isAuthenticated
            ? axiosClient.get("/problems/individualsolved")
            : Promise.resolve({ data: { problems: [] } }),
        ]);

        const problems = problemsRes.data.problems || [];
        const solved = solvedRes.data.problems || [];

        setStats({
          totalProblems: problems.length,
          solvedProblems: solved.length,
          easyCount: problems.filter((p) => p.difficulty === "Easy").length,
          mediumCount: problems.filter((p) => p.difficulty === "Medium").length,
          hardCount: problems.filter((p) => p.difficulty === "Hard").length,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [user, isAuthenticated]);

  // Animation for stats counting
  useEffect(() => {
    if (!isLoading) {
      const duration = 2000;
      const steps = 60;
      const stepDuration = duration / steps;

      Object.keys(animatedStats).forEach((key) => {
        const target = stats[key];
        let current = 0;
        const increment = target / steps;

        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          setAnimatedStats((prev) => ({ ...prev, [key]: Math.floor(current) }));
        }, stepDuration);
      });
    }
  }, [isLoading, stats]);

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-950 text-slate-300' : 'bg-slate-50 text-slate-700'} selection:bg-blue-500/30 selection:text-blue-200 overflow-x-hidden`}>
      {/* Global Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className={`absolute top-0 left-1/4 w-[500px] h-[500px] ${isDark ? 'bg-blue-500/10' : 'bg-blue-500/5'} rounded-full blur-[150px]`} />
        <div className={`absolute bottom-0 right-1/4 w-[500px] h-[500px] ${isDark ? 'bg-purple-500/10' : 'bg-purple-500/5'} rounded-full blur-[150px]`} />
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] ${isDark ? 'bg-indigo-500/5' : 'bg-indigo-500/3'} rounded-full blur-[200px]`} />
        {/* Noise texture overlay */}
        <div className={`absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')] ${isDark ? 'opacity-50' : 'opacity-30'}`} />
      </div>

      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <main className="relative z-10">
        <HeroSection animatedStats={animatedStats} isDark={isDark} />
        <FeaturesSection stats={stats} isDark={isDark} />
        <CoursesSection isDark={isDark} />
        <CTASection isDark={isDark} />
      </main>

      {/* Footer */}
      <Footer isDark={isDark} />

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes draw {
          0% { stroke-dasharray: 0 200; }
          100% { stroke-dasharray: 200 0; }
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        
        .animate-draw {
          animation: draw 1.5s ease-out forwards;
          stroke-dasharray: 0 200;
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        /* Smooth scroll */
        html {
          scroll-behavior: smooth;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: #0f172a;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #334155;
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: #475569;
        }
      `}</style>
    </div>
  );
};

export default Homepage;
