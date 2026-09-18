import React from 'react';

export const AtsScoreCard = ({ result }) => {
  const { atsScore, matchedSkills, missingSkills, feedback } = result;

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h3 className="text-base font-bold text-gray-800">ATS Optimization Index</h3>
          <p className="text-xs text-gray-500">Based on target industry expectations</p>
        </div>
        <div className="text-2xl font-black text-indigo-600">{atsScore}%</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-green-50 p-4 rounded-xl border border-green-100">
          <h4 className="text-xs font-bold text-green-800 mb-2">Matched Skills</h4>
          <div className="flex flex-wrap gap-1.5">
            {matchedSkills.map((s, idx) => (
              <span key={idx} className="bg-white px-2 py-1 text-[10px] font-semibold text-green-700 rounded-md shadow-xs">
                {s}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-red-50 p-4 rounded-xl border border-red-100">
          <h4 className="text-xs font-bold text-red-800 mb-2">Missing Skills</h4>
          <div className="flex flex-wrap gap-1.5">
            {missingSkills.map((s, idx) => (
              <span key={idx} className="bg-white px-2 py-1 text-[10px] font-semibold text-red-700 rounded-md shadow-xs">
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-xs font-bold text-gray-700 mb-2">Actionable AI Recommendations</h4>
        <ul className="list-disc pl-4 space-y-1 text-xs text-gray-600">
          {feedback.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};