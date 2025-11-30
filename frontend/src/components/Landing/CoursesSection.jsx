import { useNavigate } from "react-router-dom";
import { Binary, Workflow, Network, Database, Lock, ArrowRight, Clock, Users } from "lucide-react";

const CourseCard = ({ course, index, isDark }) => {
  const navigate = useNavigate();
  const isAvailable = course.status === "active";

  const handleClick = () => {
    if (isAvailable && course.link) {
      navigate(course.link);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`group relative flex flex-col rounded-2xl overflow-hidden transition-all duration-500 
        ${isAvailable 
          ? isDark
            ? "bg-slate-900/80 border border-slate-700/50 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2 cursor-pointer" 
            : "bg-white border border-slate-200 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2 cursor-pointer"
          : isDark
            ? "bg-slate-900/40 border border-slate-800/50"
            : "bg-slate-100/50 border border-slate-200/50"
        }`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Coming Soon Overlay */}
      {!isAvailable && (
        <div className={`absolute inset-0 ${isDark ? 'bg-slate-950/50' : 'bg-white/50'} backdrop-blur-[1px] z-10 flex items-center justify-center`}>
          <div className={`px-4 py-2 ${isDark ? 'bg-slate-800 border-slate-700 text-slate-400' : 'bg-slate-100 border-slate-300 text-slate-500'} rounded-full border text-sm font-medium flex items-center gap-2`}>
            <Lock className="w-4 h-4" />
            Coming Soon
          </div>
        </div>
      )}

      <div className="p-6 flex-grow relative">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${course.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500`}>
            {course.icon}
          </div>
          {isAvailable && (
            <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-green-500/10 text-green-400 border border-green-500/20 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              LIVE
            </span>
          )}
        </div>

        {/* Content */}
        <h3 className={`text-xl font-bold mb-2 ${isAvailable ? (isDark ? "text-white group-hover:text-blue-100" : "text-slate-900 group-hover:text-blue-600") : (isDark ? "text-slate-400" : "text-slate-500")} transition-colors`}>
          {course.title}
        </h3>
        <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'} text-sm mb-6 leading-relaxed`}>
          {course.description}
        </p>

        {/* Stats */}
        {isAvailable && (
          <div className={`flex items-center gap-4 text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'} font-medium`}>
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4" />
              {course.students}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {course.duration}
            </span>
          </div>
        )}
      </div>

      {/* Footer */}
      {isAvailable && (
        <div className={`p-4 border-t ${isDark ? 'border-slate-700/50 bg-slate-800/30' : 'border-slate-200 bg-slate-50'}`}>
          <button className="w-full py-3 px-4 rounded-xl text-sm font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-300 flex items-center justify-center gap-2 group/btn">
            {course.cta}
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </div>
      )}
    </div>
  );
};

const CoursesSection = ({ isDark = true }) => {
  const navigate = useNavigate();

  const courses = [
    {
      title: "DSA Visualizer",
      description: "Interactive playground to visualize arrays, trees, graphs, and sorting algorithms in real-time.",
      duration: "Unlimited",
      students: "12k+ users",
      icon: <Binary className="w-6 h-6 text-white" />,
      color: "from-blue-600 to-violet-600",
      status: "active",
      cta: "Launch Visualizer",
      link: "/visualizer",
    },
    {
      title: "Algorithm Patterns",
      description: "Master dynamic programming, greedy algorithms, and divide & conquer techniques with structured lessons.",
      duration: "4 weeks",
      students: "1.8k",
      icon: <Workflow className="w-6 h-6 text-white" />,
      color: "from-pink-600 to-rose-600",
      status: "coming_soon",
      cta: "Notify Me",
    },
    {
      title: "System Design",
      description: "Learn to design scalable distributed systems like Netflix, Twitter, and Uber for senior interviews.",
      duration: "8 weeks",
      students: "1.2k",
      icon: <Network className="w-6 h-6 text-white" />,
      color: "from-orange-500 to-amber-500",
      status: "coming_soon",
      cta: "Notify Me",
    },
    {
      title: "SQL Mastery",
      description: "Deep dive into relational databases, complex queries, optimization, and database design patterns.",
      duration: "3 weeks",
      students: "3.1k",
      icon: <Database className="w-6 h-6 text-white" />,
      color: "from-emerald-500 to-teal-500",
      status: "coming_soon",
      cta: "Notify Me",
    },
  ];

  return (
    <section className={`py-24 px-4 sm:px-6 ${isDark ? 'bg-gradient-to-b from-slate-900/50 to-slate-950 border-slate-800/50' : 'bg-gradient-to-b from-slate-100/50 to-slate-50 border-slate-200'} border-y`}>
      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-6">
          <div className="space-y-4">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${isDark ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' : 'bg-purple-500/10 border-purple-500/30 text-purple-600'} border text-sm font-medium`}>
              <Binary className="w-4 h-4" />
              Interactive Learning
            </div>
            <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Learn by{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                doing
              </span>
            </h2>
            <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'} max-w-lg text-lg`}>
              Start with our visualizer today. Structured courses with hands-on projects are coming soon.
            </p>
          </div>
          
          <button
            onClick={() => navigate("/courses")}
            className={`group flex items-center gap-2 ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'} font-semibold transition-colors whitespace-nowrap`}
          >
            Browse all courses
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Courses Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map((course, index) => (
            <CourseCard key={index} course={course} index={index} isDark={isDark} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoursesSection;
