const LoadingSpinner = ({ isDark = true }) => (
  <div className={`min-h-screen ${isDark ? 'bg-slate-900' : 'bg-slate-100'} flex items-center justify-center`}>
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
  </div>
);

export default LoadingSpinner;