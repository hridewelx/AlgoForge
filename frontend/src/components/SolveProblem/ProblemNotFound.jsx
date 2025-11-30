const ProblemNotFound = ({ isDark = true }) => (
  <div className={`min-h-screen ${isDark ? 'bg-slate-900' : 'bg-slate-100'} flex items-center justify-center`}>
    <div className={`${isDark ? 'text-white' : 'text-slate-900'} text-xl`}>Problem not found, Check your server connection!</div>
  </div>
);

export default ProblemNotFound;