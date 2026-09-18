import React from 'react';

 const AnalysisResults = ({ analysisResult }) => {
  if (!analysisResult) return null;

  return (
    <div className="space-y-6 mt-8">
      {/* 1. ATS Match Score Badge */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="relative flex flex-col items-center justify-center w-32 h-32 rounded-full border-8 border-red-500">
            <span className="text-3xl font-extrabold text-gray-800">
              {analysisResult.atsScore}%
            </span>
            <span className="text-xs font-bold text-red-500">Needs work</span>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase">Target role</h3>
            <p className="text-xl font-bold text-gray-800">{analysisResult.targetRole}</p>
            <span className="text-xs text-gray-500">ATS match index</span>
          </div>
        </div>
      </div>

      {/* 2. Skill Gaps Progress Section */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Skill gaps against this role</h3>
            <p className="text-xs text-gray-400">Current proficiency vs. target role requirements</p>
          </div>
          <div className="flex items-center space-x-4 text-xs font-medium">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-600"></span> Current</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gray-200"></span> Target</span>
          </div>
        </div>

        {/* Skill Item Bars */}
        <div className="space-y-4">
          {analysisResult.skillGap?.map((item, idx) => {
            const gap = item.target - item.current;
            return (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-gray-700">
                  <span>{item.name}</span>
                  <div className="space-x-2">
                    <span className="text-gray-400">{item.current}% / {item.target}%</span>
                    <span className="text-red-500 font-bold">{gap}% gap</span>
                  </div>
                </div>
                <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden flex">
                  <div 
                    className="bg-indigo-600 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${item.current}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Suggested Roadmap Component */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Suggested learning roadmap</h3>
        
        {analysisResult.roadmap && analysisResult.roadmap.length > 0 ? (
          <div className="space-y-3">
            {analysisResult.roadmap.map((step) => (
              <div key={step.id} className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gray-800 text-sm">{step.title}</h4>
                  <div className="flex gap-2 mt-1">
                    {step.skills?.map((sk, i) => (
                      <span key={i} className="text-[10px] font-medium bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
                <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md">
                  {step.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400">No roadmap milestones were returned for this scan.</p>
        )}
      </div>
    </div>
  );
};

export default AnalysisResults