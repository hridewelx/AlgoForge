const ActivityHeatmap = ({ 
  stats, 
  selectedYear, 
  setSelectedYear, 
  availableYears, 
  profileData,
  getActivityColor 
}) => {
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  
  // Build month-based data structure
  const monthsData = [];
  
  if (selectedYear === "last365") {
    // Last 365 days: from this date last year to today
    const startDate = new Date(today);
    startDate.setFullYear(startDate.getFullYear() - 1);
    startDate.setDate(startDate.getDate() + 1);
    
    let currentDate = new Date(startDate);
    while (currentDate <= today) {
      const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      const actualStart = currentDate.getDate();
      const actualEnd = monthEnd <= today ? monthEnd.getDate() : today.getDate();
      
      monthsData.push({
        month: currentDate.getMonth(),
        year: currentDate.getFullYear(),
        name: currentDate.toLocaleString('default', { month: 'short' }),
        startDay: actualStart,
        endDay: actualEnd
      });
      
      currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    }
  } else {
    for (let i = 0; i < 12; i++) {
      const daysInMonth = new Date(selectedYear, i + 1, 0).getDate();
      monthsData.push({
        month: i,
        year: selectedYear,
        name: new Date(selectedYear, i, 1).toLocaleString('default', { month: 'short' }),
        startDay: 1,
        endDay: daysInMonth
      });
    }
  }
  
  // Generate weeks for each month
  monthsData.forEach(m => {
    const weeks = [];
    let currentWeek = new Array(7).fill(null);
    
    for (let day = m.startDay; day <= m.endDay; day++) {
      const date = new Date(m.year, m.month, day);
      const dayOfWeek = date.getDay();
      const dateStr = `${m.year}-${String(m.month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      
      if (dayOfWeek === 0 && currentWeek.some(d => d !== null)) {
        weeks.push(currentWeek);
        currentWeek = new Array(7).fill(null);
      }
      
      currentWeek[dayOfWeek] = {
        date: dateStr,
        day: day,
        dayOfWeek,
        count: profileData?.submissionCalendar?.[dateStr] || 0,
        isFuture: date > today
      };
    }
    
    if (currentWeek.some(d => d !== null)) {
      weeks.push(currentWeek);
    }
    
    m.weeks = weeks;
  });

  return (
    <div className="bg-gradient-to-br from-slate-900/90 to-slate-800/50 rounded-2xl border border-slate-700/50 p-6 backdrop-blur-sm">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-white">{stats.totalSubmissions}</span>
          <span className="text-slate-400">submissions</span>
          <select
            value={selectedYear}
            onChange={(e) =>
              setSelectedYear(
                e.target.value === "last365"
                  ? "last365"
                  : Number(e.target.value)
              )
            }
            className="bg-slate-800 border border-slate-700 text-white text-xs rounded-md focus:ring-blue-500 focus:border-blue-500 px-2 py-1 cursor-pointer hover:bg-slate-700 transition-colors ml-2"
          >
            <option value="last365">Last 12 months</option>
            {availableYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-6 text-sm text-slate-400">
          <span>Total active days: <span className="text-white">{stats.activeDays}</span></span>
          <span>Max streak: <span className="text-white">{stats.maxStreak}</span></span>
        </div>
      </div>

      {/* Heatmap Container */}
      <div className="w-full">
        {/* Heatmap with Day Labels */}
        <div className="flex">
          {/* Day Labels */}
          <div className="flex flex-col justify-between pr-2 text-[9px] text-slate-500 flex-shrink-0" style={{ height: '74px' }}>
            <span style={{ height: '10px', lineHeight: '10px' }}>Sun</span>
            <span style={{ height: '10px', lineHeight: '10px' }}></span>
            <span style={{ height: '10px', lineHeight: '10px' }}>Tue</span>
            <span style={{ height: '10px', lineHeight: '10px' }}></span>
            <span style={{ height: '10px', lineHeight: '10px' }}>Thu</span>
            <span style={{ height: '10px', lineHeight: '10px' }}></span>
            <span style={{ height: '10px', lineHeight: '10px' }}>Sat</span>
          </div>
          
          {/* Heatmap Grid */}
          <div className="flex-1 flex gap-[6px]">
            {monthsData.map((monthData, monthIdx) => (
              <div key={`${monthData.year}-${monthData.month}-${monthIdx}`} className="flex flex-col flex-1">
                {/* Weeks in this month */}
                <div className="flex gap-[2px] justify-center">
                  {monthData.weeks.map((week, weekIdx) => (
                    <div key={weekIdx} className="flex flex-col gap-[2px]">
                      {week.map((day, dayIdx) => (
                        <div
                          key={dayIdx}
                          className={`w-[8px] h-[8px] rounded-[2px] ${
                            !day
                              ? "bg-transparent"
                              : day.isFuture
                              ? "bg-slate-800/20"
                              : getActivityColor(day.count)
                          } ${
                            day && !day.isFuture
                              ? "hover:ring-1 hover:ring-white/60 cursor-pointer transition-all"
                              : ""
                          }`}
                          title={
                            day && !day.isFuture
                              ? `${day.date}: ${day.count} submission${day.count !== 1 ? "s" : ""}`
                              : ""
                          }
                        />
                      ))}
                    </div>
                  ))}
                </div>
                
                {/* Month Label */}
                <div className="text-[10px] text-slate-500 text-center mt-1">
                  {monthData.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityHeatmap;
