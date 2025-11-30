import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Rocket, ArrowRight, Sparkles, CheckCircle } from "lucide-react";

const CTASection = ({ isDark = true }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.authentication);

  const benefits = [
    "Access to 50+ curated problems",
    "Real-time code execution",
    "Progress tracking & analytics",
    "Community solutions & hints",
  ];

  return (
    <section className="py-24 px-4 sm:px-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-br from-blue-600/10 via-transparent to-purple-600/10' : 'bg-gradient-to-br from-blue-600/5 via-transparent to-purple-600/5'}`} />
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] ${isDark ? 'bg-blue-500/5' : 'bg-blue-500/3'} rounded-full blur-[150px]`} />
      
      <div className="container mx-auto max-w-5xl relative">
        <div className={`relative ${isDark ? 'bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 border-slate-700/50' : 'bg-white border-slate-200'} border rounded-3xl p-8 sm:p-12 lg:p-16 overflow-hidden shadow-2xl`}>
          {/* Decorative Elements */}
          <div className={`absolute top-0 left-0 w-64 h-64 ${isDark ? 'bg-blue-500/10' : 'bg-blue-500/5'} rounded-full blur-[80px] -translate-x-1/2 -translate-y-1/2`} />
          <div className={`absolute bottom-0 right-0 w-64 h-64 ${isDark ? 'bg-purple-500/10' : 'bg-purple-500/5'} rounded-full blur-[80px] translate-x-1/2 translate-y-1/2`} />
          <div className={`absolute top-0 right-0 w-32 h-32 ${isDark ? 'bg-indigo-500/20' : 'bg-indigo-500/10'} rounded-full blur-[60px]`} />

          {/* Grid Pattern Overlay */}
          <div className={`absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] ${isDark ? '' : 'opacity-50'}`} />

          <div className="relative z-10 text-center space-y-8">
            {/* Badge */}
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${isDark ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20' : 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/30'} border text-blue-500 text-sm font-medium`}>
              <Sparkles className="w-4 h-4" />
              Join 10,000+ developers
            </div>

            {/* Heading */}
            <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold ${isDark ? 'text-white' : 'text-slate-900'} leading-tight`}>
              Ready to level up your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
                coding skills
              </span>
              ?
            </h2>

            {/* Description */}
            <p className={`text-lg sm:text-xl ${isDark ? 'text-slate-400' : 'text-slate-600'} max-w-2xl mx-auto leading-relaxed`}>
              Join thousands of developers who are currently practicing for their next big interview. The compiler is waiting.
            </p>

            {/* Benefits List */}
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 pt-4">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-2 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}
                >
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                  {benefit}
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <button
                onClick={() => navigate(isAuthenticated ? "/problemset" : "/signup")}
                className={`group relative px-10 py-4 ${isDark ? 'bg-white hover:bg-blue-50 text-slate-900 shadow-white/10 hover:shadow-white/20' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-500/25 hover:shadow-blue-500/40'} rounded-xl font-bold text-lg transition-all duration-300 hover:scale-[1.02] shadow-xl overflow-hidden flex items-center justify-center gap-2`}
              >
                <Rocket className="w-5 h-5" />
                {isAuthenticated ? "Continue Practice" : "Get Started Free"}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              {!isAuthenticated && (
                <button
                  onClick={() => navigate("/login")}
                  className={`px-10 py-4 ${isDark ? 'bg-transparent hover:bg-white/5 text-white border-slate-600 hover:border-slate-500' : 'bg-transparent hover:bg-slate-100 text-slate-900 border-slate-300 hover:border-slate-400'} border rounded-xl font-semibold text-lg transition-all duration-300`}
                >
                  Sign In
                </button>
              )}
            </div>

            {/* Trust indicators */}
            <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-500'} pt-4`}>
              No credit card required • Free forever plan available
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
