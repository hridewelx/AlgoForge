import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "../components/UI/Navbar";
import { useTheme } from "../contexts/ThemeContext.tsx";
import {
  Play,
  Users,
  Infinity,
  ChevronRight,
  ChevronDown,
  Lock,
  Sparkles,
  BarChart3,
  TreePine,
  Network,
  Cpu,
  Server,
  ArrowRight,
  CheckCircle,
  Zap,
  BookOpen,
  GraduationCap,
  Code,
  Layers,
} from "lucide-react";

// Main Course Categories
const mainCourses = [
  {
    id: "dsa-visualizer",
    title: "DSA Visualizer",
    description:
      "Interactive playground to visualize arrays, trees, graphs, and sorting algorithms in real-time.",
    icon: Play,
    gradient: "from-emerald-500 via-cyan-500 to-blue-500",
    bgGradient: "from-emerald-500/10 via-cyan-500/10 to-blue-500/10",
    borderColor: "border-emerald-500/30",
    hoverBorder: "hover:border-emerald-400/50",
    stats: {
      users: "12k+",
      access: "Unlimited",
    },
    path: "/visualizer",
    comingSoon: false,
    featured: true,
    subcourses: [
      {
        id: "sorting",
        title: "Sorting Algorithms",
        description:
          "Visualize how different sorting algorithms organize data. Compare performance and understand their mechanics.",
        topics: ["Bubble Sort", "Selection Sort", "Insertion Sort", "Quick Sort"],
        icon: BarChart3,
        color: "text-cyan-400",
        bgColor: "bg-cyan-500/10",
        hoverBg: "hover:bg-cyan-500/20",
      },
      {
        id: "trees",
        title: "Tree Operations",
        description:
          "Explore Binary Search Trees with insertions, deletions, and traversal animations.",
        topics: [
          "BST Insert",
          "BST Delete",
          "In-Order",
          "Pre-Order",
          "Post-Order",
          "Level-Order",
        ],
        icon: TreePine,
        color: "text-green-400",
        bgColor: "bg-green-500/10",
        hoverBg: "hover:bg-green-500/20",
      },
      {
        id: "graphs",
        title: "Graph Algorithms",
        description:
          "Understand graph traversal and pathfinding algorithms with interactive visualizations.",
        topics: ["BFS", "DFS", "Dijkstra's"],
        icon: Network,
        color: "text-purple-400",
        bgColor: "bg-purple-500/10",
        hoverBg: "hover:bg-purple-500/20",
      },
    ],
  },
  {
    id: "algorithm-patterns",
    title: "Algorithm Patterns",
    description:
      "Master dynamic programming, greedy algorithms, and divide & conquer techniques with structured lessons.",
    icon: Cpu,
    gradient: "from-orange-500 via-amber-500 to-yellow-500",
    bgGradient: "from-orange-500/10 via-amber-500/10 to-yellow-500/10",
    borderColor: "border-orange-500/30",
    hoverBorder: "hover:border-orange-400/50",
    stats: {
      users: "Coming Soon",
      access: "Premium",
    },
    path: "/courses/algorithm-patterns",
    comingSoon: true,
    featured: false,
    subcourses: [
      {
        id: "dp",
        title: "Dynamic Programming",
        description:
          "Learn to solve complex problems by breaking them into simpler subproblems.",
        topics: [
          "Memoization",
          "Tabulation",
          "State Optimization",
          "Classic DP Problems",
        ],
        icon: Layers,
        color: "text-orange-400",
        bgColor: "bg-orange-500/10",
        hoverBg: "hover:bg-orange-500/20",
      },
      {
        id: "greedy",
        title: "Greedy Algorithms",
        description:
          "Master the art of making locally optimal choices for global solutions.",
        topics: [
          "Activity Selection",
          "Huffman Coding",
          "Fractional Knapsack",
        ],
        icon: Zap,
        color: "text-amber-400",
        bgColor: "bg-amber-500/10",
        hoverBg: "hover:bg-amber-500/20",
      },
      {
        id: "divide-conquer",
        title: "Divide & Conquer",
        description:
          "Break down problems into smaller subproblems and combine solutions.",
        topics: ["Merge Sort", "Binary Search", "Strassen's Algorithm"],
        icon: Code,
        color: "text-yellow-400",
        bgColor: "bg-yellow-500/10",
        hoverBg: "hover:bg-yellow-500/20",
      },
    ],
  },
  {
    id: "system-design",
    title: "System Design",
    description:
      "Learn to design scalable distributed systems like Netflix, Twitter, and Uber for senior interviews.",
    icon: Server,
    gradient: "from-violet-500 via-purple-500 to-fuchsia-500",
    bgGradient: "from-violet-500/10 via-purple-500/10 to-fuchsia-500/10",
    borderColor: "border-violet-500/30",
    hoverBorder: "hover:border-violet-400/50",
    stats: {
      users: "Coming Soon",
      access: "Premium",
    },
    path: "/courses/system-design",
    comingSoon: true,
    featured: false,
    subcourses: [
      {
        id: "fundamentals",
        title: "System Design Fundamentals",
        description: "Learn the building blocks of distributed systems.",
        topics: [
          "Load Balancing",
          "Caching",
          "Database Sharding",
          "CAP Theorem",
        ],
        icon: Server,
        color: "text-violet-400",
        bgColor: "bg-violet-500/10",
        hoverBg: "hover:bg-violet-500/20",
      },
      {
        id: "case-studies",
        title: "Case Studies",
        description: "Design real-world systems used by millions.",
        topics: [
          "Design Netflix",
          "Design Twitter",
          "Design Uber",
          "Design WhatsApp",
        ],
        icon: GraduationCap,
        color: "text-purple-400",
        bgColor: "bg-purple-500/10",
        hoverBg: "hover:bg-purple-500/20",
      },
    ],
  },
];

// Subcourse Card Component
const SubcourseCard = ({ subcourse, isComingSoon, onLaunch, isDark }) => {
  const Icon = subcourse.icon;

  return (
    <div
      className={`relative p-5 rounded-xl border transition-all duration-300 ${
        isDark 
          ? 'bg-slate-800/50 border-slate-700/50' 
          : 'bg-white border-slate-200 shadow-sm'
      } ${
        isComingSoon
          ? "opacity-60 cursor-not-allowed"
          : `${isDark ? 'hover:border-slate-600' : 'hover:border-slate-300 hover:shadow-md'} ${subcourse.hoverBg} cursor-pointer group`
      }`}
      onClick={() => !isComingSoon && onLaunch()}
    >
      <div className="flex items-start gap-4">
        <div className={`p-2.5 rounded-lg ${subcourse.bgColor} flex-shrink-0`}>
          <Icon className={`w-5 h-5 ${subcourse.color}`} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className={`font-semibold mb-1 group-hover:text-cyan-500 transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {subcourse.title}
          </h4>
          <p className={`text-sm mb-3 line-clamp-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            {subcourse.description}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {subcourse.topics.map((topic, i) => (
              <span
                key={i}
                className={`px-2 py-0.5 text-xs rounded-md ${isDark ? 'bg-slate-700/50 text-slate-300' : 'bg-slate-100 text-slate-600'}`}
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
        {!isComingSoon && (
          <ChevronRight className={`w-5 h-5 group-hover:text-cyan-500 group-hover:translate-x-1 transition-all flex-shrink-0 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
        )}
      </div>
    </div>
  );
};

// Main Course Card Component
const CourseCard = ({ course, onLaunch, isDark }) => {
  const Icon = course.icon;
  const [expanded, setExpanded] = useState(course.featured);

  return (
    <div
      className={`relative rounded-2xl overflow-hidden border ${course.borderColor} ${course.hoverBorder} bg-gradient-to-br ${course.bgGradient} backdrop-blur-sm transition-all duration-500 ${!isDark && 'shadow-lg'}`}
    >
      {/* Coming Soon Badge */}
      {course.comingSoon && (
        <div className="absolute top-4 right-4 z-10">
          <span className={`px-3 py-1.5 text-amber-400 text-xs font-medium rounded-full border border-amber-500/30 flex items-center gap-1.5 shadow-lg ${isDark ? 'bg-slate-900/90' : 'bg-white/90'}`}>
            <Lock className="w-3 h-3" />
            Coming Soon
          </span>
        </div>
      )}

      {/* Featured Badge */}
      {course.featured && (
        <div className="absolute top-4 right-4 z-10">
          <span className="px-3 py-1.5 bg-emerald-500/20 text-emerald-400 text-xs font-medium rounded-full border border-emerald-500/30 flex items-center gap-1.5 backdrop-blur-sm">
            <Sparkles className="w-3 h-3" />
            Popular
          </span>
        </div>
      )}

      {/* Main Content */}
      <div className="p-6 md:p-8">
        {/* Course Header */}
        <div className="flex flex-col md:flex-row md:items-start gap-6 mb-6">
          {/* Icon */}
          <div
            className={`p-4 rounded-2xl bg-gradient-to-br ${course.gradient} shadow-lg shadow-black/20 flex-shrink-0`}
          >
            <Icon className="w-8 h-8 text-white" />
          </div>

          {/* Title & Description */}
          <div className="flex-1">
            <h2 className={`text-2xl md:text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {course.title}
            </h2>
            <p className={`text-base leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {course.description}
            </p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${isDark ? 'bg-slate-800/60 border-slate-700/50' : 'bg-white/60 border-slate-200'}`}>
            <Users className="w-4 h-4 text-cyan-500" />
            <span className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{course.stats.users}</span>
            <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>users</span>
          </div>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${isDark ? 'bg-slate-800/60 border-slate-700/50' : 'bg-white/60 border-slate-200'}`}>
            <Infinity className="w-4 h-4 text-emerald-500" />
            <span className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{course.stats.access}</span>
          </div>
          {!course.comingSoon && (
            <button
              onClick={() => onLaunch(course.path)}
              className={`ml-auto px-6 py-2.5 bg-gradient-to-r ${course.gradient} text-white font-semibold rounded-xl hover:opacity-90 hover:scale-105 transition-all flex items-center gap-2 shadow-lg`}
            >
              <Play className="w-4 h-4" />
              Launch Visualizer
            </button>
          )}
        </div>

        {/* Subcourses Accordion */}
        {course.subcourses && course.subcourses.length > 0 && (
          <div className={`border-t pt-6 ${isDark ? 'border-slate-700/50' : 'border-slate-200'}`}>
            <button
              onClick={() => setExpanded(!expanded)}
              className={`flex items-center gap-2 transition-colors mb-4 group ${isDark ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}
            >
              <ChevronDown
                className={`w-5 h-5 transition-transform duration-300 ${
                  expanded ? "rotate-180" : ""
                } group-hover:text-cyan-500`}
              />
              <span className="font-medium">
                {course.subcourses.length} Modules Included
              </span>
            </button>

            <div
              className={`grid gap-4 transition-all duration-500 ${
                expanded
                  ? "opacity-100 max-h-[2000px]"
                  : "opacity-0 max-h-0 overflow-hidden"
              }`}
            >
              {course.subcourses.map((subcourse) => (
                <SubcourseCard
                  key={subcourse.id}
                  subcourse={subcourse}
                  isComingSoon={course.comingSoon}
                  onLaunch={() => onLaunch(course.path)}
                  isDark={isDark}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Main Courses Component
const Courses = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.authentication);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const handleLaunch = (path) => {
    navigate(path);
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950' : 'bg-gradient-to-br from-slate-50 via-white to-slate-100'}`}>
      <Navbar />

      {/* Hero Section */}
      <div className="relative pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-cyan-500/8 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-500/8 rounded-full blur-3xl" />
          <div className="absolute top-1/2 right-1/3 w-[300px] h-[300px] bg-emerald-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full mb-6">
              <GraduationCap className="w-4 h-4 text-cyan-400" />
              <span className="text-cyan-400 text-sm font-medium">
                Learning Paths
              </span>
            </div>
            <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Master{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500">
                Data Structures
              </span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-orange-500">
                & Algorithms
              </span>
            </h1>
            <p className={`text-lg md:text-xl max-w-2xl mx-auto leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Choose your learning path and start your journey to becoming a
              better programmer. Interactive visualizations, structured lessons,
              and hands-on practice.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-16">
            <div className={`flex items-center gap-3 px-5 py-3 border rounded-xl transition-colors ${isDark ? 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600' : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'}`}>
              <div className="p-2 bg-cyan-500/10 rounded-lg">
                <BookOpen className="w-5 h-5 text-cyan-500" />
              </div>
              <div>
                <p className={`font-bold text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>3 Courses</p>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Available</p>
              </div>
            </div>
            <div className={`flex items-center gap-3 px-5 py-3 border rounded-xl transition-colors ${isDark ? 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600' : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'}`}>
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <CheckCircle className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <p className={`font-bold text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>12+ Algorithms</p>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>To Learn</p>
              </div>
            </div>
            <div className={`flex items-center gap-3 px-5 py-3 border rounded-xl transition-colors ${isDark ? 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600' : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'}`}>
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Users className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className={`font-bold text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>12k+ Users</p>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Learning</p>
              </div>
            </div>
          </div>

          {/* Course Cards */}
          <div className="space-y-8">
            {mainCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onLaunch={handleLaunch}
                isDark={isDark}
              />
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="mt-20 text-center">
            <div className={`inline-flex flex-col items-center gap-6 p-8 md:p-10 border rounded-3xl backdrop-blur-sm max-w-xl ${isDark ? 'bg-gradient-to-br from-slate-800/60 to-slate-900/60 border-slate-700/50' : 'bg-white border-slate-200 shadow-xl'}`}>
              <div className="p-4 bg-amber-500/10 rounded-2xl">
                <Sparkles className="w-10 h-10 text-amber-500" />
              </div>
              <div>
                <h3 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  More Courses Coming Soon!
                </h3>
                <p className={`leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  We're working hard to bring you more interactive learning
                  experiences. Stay tuned for Algorithm Patterns and System
                  Design courses.
                </p>
              </div>
              <button
                onClick={() => navigate("/visualizer")}
                className="px-8 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-xl hover:opacity-90 hover:scale-105 transition-all flex items-center gap-2 shadow-lg"
              >
                Start with DSA Visualizer
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer spacing */}
      <div className="h-24" />
    </div>
  );
};

export default Courses;
