

export const AnalyticsOverview = ({ metrics, degree, targetRole, targetIndustry }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Qualification</span>
        <p className="text-sm font-extrabold text-gray-800 mt-1 truncate">{degree || 'B.Tech CSE / IT'}</p>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Target Role</span>
        <p className="text-sm font-extrabold text-indigo-600 mt-1 truncate">{targetRole || 'Full-Stack Developer'}</p>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Roadmap Progress</span>
        <div className="flex items-center justify-between mt-2">
          <p className="text-sm font-extrabold text-emerald-600">{metrics?.overallProgress || 25}%</p>
          <div className="w-20 bg-gray-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full transition-all duration-300"
              style={{ width: `${metrics?.overallProgress || 25}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Target Industry</span>
        <p className="text-sm font-extrabold text-gray-800 mt-1 truncate">{targetIndustry || 'Software & IT'}</p>
      </div>
    </div>
  );
};