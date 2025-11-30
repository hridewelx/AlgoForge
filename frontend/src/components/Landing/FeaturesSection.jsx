import { Code2, Zap, BarChart3, Users, Trophy, Brain } from "lucide-react";

const FeatureCard = ({ icon, title, description, stat, delay, isDark }) => (
  <div 
    className={`group relative p-[1px] rounded-2xl ${isDark ? 'bg-gradient-to-b from-slate-700/50 to-slate-800/50 hover:from-blue-500/50 hover:to-purple-500/50' : 'bg-gradient-to-b from-slate-200 to-slate-300 hover:from-blue-400/50 hover:to-purple-400/50'} transition-all duration-500`}
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className={`relative h-full p-6 ${isDark ? 'bg-slate-900/95 border-slate-700/30' : 'bg-white border-slate-200'} rounded-2xl border group-hover:border-transparent transition-all duration-500 overflow-hidden`}>
      {/* Hover glow effect */}
      <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-br from-blue-500/5 to-purple-500/5' : 'bg-gradient-to-br from-blue-500/10 to-purple-500/10'} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
      
      {/* Icon */}
      <div className="relative w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 text-blue-500 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 border border-blue-500/20">
        {icon}
      </div>
      
      {/* Content */}
      <h3 className={`relative text-lg font-bold ${isDark ? 'text-white group-hover:text-blue-100' : 'text-slate-900 group-hover:text-blue-600'} mb-2 transition-colors`}>
        {title}
      </h3>
      <p className={`relative ${isDark ? 'text-slate-400 group-hover:text-slate-300' : 'text-slate-600 group-hover:text-slate-700'} text-sm mb-5 leading-relaxed transition-colors`}>
        {description}
      </p>
      
      {/* Stat Badge */}
      <div className="relative inline-flex items-center gap-2 text-blue-500 text-xs font-bold tracking-wider uppercase px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 group-hover:bg-blue-500/20 transition-all">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
        {stat}
      </div>
    </div>
  </div>
);

const FeaturesSection = ({ stats, isDark = true }) => {
  const features = [
    {
      icon: <Code2 className="w-6 h-6" />,
      title: "Curated Problems",
      description: "Hand-picked challenges from real FAANG interviews, categorized by difficulty and topic.",
      stat: `${stats.totalProblems || 50}+ Problems`,
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Instant Execution",
      description: "Run code in a secure sandbox with support for Python, JavaScript, C++, Java, and more.",
      stat: "< 100ms Latency",
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Progress Analytics",
      description: "Visualize your journey with detailed stats, streaks, and performance insights.",
      stat: "Real-time Stats",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Community",
      description: "Learn from solutions, read editorials, and collaborate with fellow developers.",
      stat: "Active Forums",
    },
    {
      icon: <Trophy className="w-6 h-6" />,
      title: "Achievements",
      description: "Earn badges, maintain streaks, and track your growth with gamified milestones.",
      stat: "20+ Badges",
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: "AI Assistant",
      description: "Get hints, explanations, and personalized guidance powered by AI when you're stuck.",
      stat: "Smart Hints",
    },
  ];

  return (
    <section className="py-24 px-4 sm:px-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-b from-transparent via-blue-500/5 to-transparent' : 'bg-gradient-to-b from-transparent via-blue-500/10 to-transparent'}`} />
      
      <div className="container mx-auto max-w-7xl relative">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${isDark ? 'bg-slate-800/50 border-slate-700/50 text-slate-400' : 'bg-white border-slate-200 text-slate-600 shadow-sm'} border text-sm font-medium`}>
            <Zap className="w-4 h-4 text-yellow-500" />
            Why developers choose us
          </div>
          <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Everything you need to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              succeed
            </span>
          </h2>
          <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'} max-w-2xl mx-auto text-lg`}>
            From practice to placement, we provide the tools and resources to help you land your dream job.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} delay={index * 100} isDark={isDark} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
