import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Sparkles, Play, ArrowRight } from "lucide-react";

const HeroSection = ({ animatedStats, isDark = true }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.authentication);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left;
    const y = e.clientY - box.top;
    const centerX = box.width / 2;
    const centerY = box.height / 2;
    const rotateX = (centerY - y) / 25;
    const rotateY = (x - centerX) / 25;
    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  return (
    <section className="relative pt-12 sm:pt-20 pb-24 sm:pb-32 px-4 sm:px-6 overflow-hidden">
      {/* Animated gradient orbs */}
      <div className={`absolute top-20 left-10 w-72 h-72 ${isDark ? 'bg-blue-500/20' : 'bg-blue-500/10'} rounded-full blur-[100px] animate-pulse`} />
      <div className={`absolute bottom-20 right-10 w-96 h-96 ${isDark ? 'bg-purple-500/15' : 'bg-purple-500/10'} rounded-full blur-[120px] animate-pulse delay-1000`} />
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] ${isDark ? 'bg-indigo-500/10' : 'bg-indigo-500/5'} rounded-full blur-[150px]`} />

      <div className="container mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8 relative z-10 text-center lg:text-left">
            {/* Badge */}
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${isDark ? 'bg-blue-500/10 border-blue-500/20' : 'bg-blue-500/10 border-blue-500/30'} border text-blue-500 text-sm font-medium animate-fade-in`}>
              <Sparkles className="w-4 h-4" />
              <span>Trusted by 10,000+ developers</span>
            </div>

            {/* Main Heading */}
            <h1 className={`text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold ${isDark ? 'text-white' : 'text-slate-900'} leading-[1.1] tracking-tight`}>
              Forge Your{" "}
              <span className="relative">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 animate-gradient">
                  Coding Legacy
                </span>
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 200 8"
                  fill="none"
                >
                  <path
                    d="M1 5.5C47 2 77 2 99.5 3.5C122 5 152 7 199 3"
                    stroke="url(#gradient)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    className="animate-draw"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#60A5FA" />
                      <stop offset="100%" stopColor="#A78BFA" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
            </h1>

            {/* Description */}
            <p className={`text-lg sm:text-xl ${isDark ? 'text-slate-400' : 'text-slate-600'} max-w-xl mx-auto lg:mx-0 leading-relaxed`}>
              The ultimate platform to master algorithms, ace technical
              interviews, and elevate your engineering career with real-world
              challenges.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                onClick={() => navigate("/problemset")}
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02] shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <Play className="w-5 h-5" />
                  Start Solving
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>

              <button
                onClick={() => navigate(isAuthenticated ? `/problemset` : "/signup")}
                className={`group px-8 py-4 ${isDark ? 'bg-slate-800/80 hover:bg-slate-700/80 text-white border-slate-700 hover:border-slate-600' : 'bg-white hover:bg-slate-50 text-slate-900 border-slate-200 hover:border-slate-300 shadow-sm'} border rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2`}
              >
                {isAuthenticated ? "View Problems" : "Get Started Free"}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Stats Row */}
            <div className={`flex items-center justify-center lg:justify-start gap-8 sm:gap-12 pt-8 border-t ${isDark ? 'border-slate-800/50' : 'border-slate-200'}`}>
              {[
                { label: "Problems", value: animatedStats.totalProblems || "50+" },
                { label: "Active Users", value: "10K+" },
                { label: "Success Rate", value: "94%" },
              ].map((stat, i) => (
                <div key={i} className="text-center lg:text-left">
                  <div className={`text-2xl sm:text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {stat.value}
                  </div>
                  <div className={`text-xs sm:text-sm ${isDark ? 'text-slate-500' : 'text-slate-500'} uppercase tracking-wider font-medium`}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Code Editor Card */}
          <div className="relative perspective-1000 mt-8 lg:mt-0">
            {/* Glow Effect */}
            <div className={`absolute -inset-4 bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-purple-500/20 rounded-3xl blur-2xl ${isDark ? 'opacity-60' : 'opacity-40'} animate-pulse`} />

            {/* 3D Tilt Container */}
            <div
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{
                transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale3d(1, 1, 1)`,
                transition: "transform 0.15s ease-out",
              }}
              className={`relative ${isDark ? 'bg-slate-900/90' : 'bg-white'} backdrop-blur-sm border ${isDark ? 'border-slate-700/50' : 'border-slate-200'} rounded-2xl shadow-2xl overflow-hidden transform-gpu`}
            >
              {/* Editor Header */}
              <div className={`flex items-center justify-between px-4 py-3 ${isDark ? 'bg-slate-800/80 border-slate-700/50' : 'bg-slate-100 border-slate-200'} border-b`}>
                <div className="flex items-center gap-3">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors cursor-pointer" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-500 transition-colors cursor-pointer" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-500 transition-colors cursor-pointer" />
                  </div>
                </div>
                <div className={`flex items-center gap-2 px-3 py-1 ${isDark ? 'bg-slate-700/50' : 'bg-slate-200'} rounded-md`}>
                  <svg className="w-4 h-4 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14.25.18l.9.2.73.26.59.3.45.32.34.34.25.34.16.33.1.3.04.26.02.2-.01.13V8.5l-.05.63-.13.55-.21.46-.26.38-.3.31-.33.25-.35.19-.35.14-.33.1-.3.07-.26.04-.21.02H8.77l-.69.05-.59.14-.5.22-.41.27-.33.32-.27.35-.2.36-.15.37-.1.35-.07.32-.04.27-.02.21v3.06H3.17l-.21-.03-.28-.07-.32-.12-.35-.18-.36-.26-.36-.36-.35-.46-.32-.59-.28-.73-.21-.88-.14-1.05-.05-1.23.06-1.22.16-1.04.24-.87.32-.71.36-.57.4-.44.42-.33.42-.24.4-.16.36-.1.32-.05.24-.01h.16l.06.01h8.16v-.83H6.18l-.01-2.75-.02-.37.05-.34.13-.31.2-.28.25-.26.31-.24.38-.2.44-.18.51-.15.58-.12.64-.1.71-.06.77-.04h3.87l.75.04.69.08.61.13.53.18.43.23.34.28zM22.46 9.75l.05.24.05.32.05.36.02.36v3.06l-.01.13-.04.26-.1.3-.16.33-.25.34-.34.34-.45.32-.59.3-.73.26-.9.2h-3.53v.83h5.69v2.75l.01.28-.02.37-.05.34-.13.31-.2.28-.25.26-.31.24-.38.2-.44.18-.51.15-.58.12-.64.1-.72.06-.76.04h-3.87l-.75-.04-.69-.08-.61-.13-.53-.18-.43-.23-.34-.28-.25-.31-.18-.33-.1-.34-.04-.33v-3.06l.02-.21.04-.27.07-.32.1-.35.15-.37.2-.36.27-.35.33-.32.41-.27.5-.22.59-.14.69-.05h5.46l.21-.02.26-.04.3-.07.33-.1.35-.14.35-.19.33-.25.3-.31.26-.38.21-.46.13-.55.05-.63V9.75h1.61z" />
                  </svg>
                  <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'} font-mono`}>solution.py</span>
                </div>
                <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Python 3.11</div>
              </div>

              {/* Code Content */}
              <div className="p-6 font-mono text-sm leading-relaxed overflow-x-auto">
                <div className="flex">
                  {/* Line Numbers */}
                  <div className={`pr-4 ${isDark ? 'text-slate-600' : 'text-slate-400'} select-none text-right`}>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                      <div key={n}>{n}</div>
                    ))}
                  </div>
                  {/* Code */}
                  <div className="flex-1 space-y-0">
                    <div><span className="text-purple-400">def</span> <span className="text-blue-400">max_sub_array</span>(<span className="text-orange-400">nums</span>):</div>
                    <div className="pl-4"><span className={isDark ? 'text-slate-500' : 'text-slate-400'}># Kadane's Algorithm - O(n)</span></div>
                    <div className="pl-4"><span className={isDark ? 'text-slate-300' : 'text-slate-700'}>current_sum</span> = nums[<span className="text-green-400">0</span>]</div>
                    <div className="pl-4"><span className={isDark ? 'text-slate-300' : 'text-slate-700'}>max_sum</span> = nums[<span className="text-green-400">0</span>]</div>
                    <div className="pl-4">&nbsp;</div>
                    <div className="pl-4"><span className="text-purple-400">for</span> <span className={isDark ? 'text-white' : 'text-slate-900'}>num</span> <span className="text-purple-400">in</span> nums[<span className="text-green-400">1</span>:]:</div>
                    <div className="pl-8"><span className={isDark ? 'text-slate-300' : 'text-slate-700'}>current_sum</span> = <span className="text-yellow-400">max</span>(num, current_sum + num)</div>
                    <div className="pl-8"><span className={isDark ? 'text-slate-300' : 'text-slate-700'}>max_sum</span> = <span className="text-yellow-400">max</span>(max_sum, current_sum)</div>
                    <div className="pl-4">&nbsp;</div>
                    <div className="pl-4"><span className="text-purple-400">return</span> <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>max_sum</span></div>
                  </div>
                </div>
              </div>

              {/* Editor Footer */}
              <div className={`flex items-center justify-between px-4 py-2 ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-slate-100 border-slate-200'} border-t text-xs`}>
                <div className={`flex items-center gap-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  <span className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    Ready
                  </span>
                  <span>Ln 10, Col 16</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-400">✓ All tests passed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
