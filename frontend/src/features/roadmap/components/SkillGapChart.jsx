import React from 'react';

export const SkillGapChart = ({ skills = [] }) => {
  if (!skills || skills.length === 0) {
    return (
      <div className="p-8 text-center bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
        <p className="text-xs text-gray-400 font-medium">No skill gaps analyzed yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {skills.map((skill, index) => {
        const skillName = skill.skillName || skill.name || skill.skill || 'Skill';
        const current = Number(skill.currentScore ?? skill.currentLevel ?? skill.currentProficiency ?? 0);
        const target = Number(skill.targetScore ?? skill.requiredLevel ?? skill.targetProficiency ?? 100);
        
        const gap = Math.max(0, target - current);

        return (
          <div 
            key={skill._id || skill.id || index} 
            className="p-4 rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:border-indigo-200 hover:shadow-[0_4px_16px_rgba(79,70,229,0.06)] group space-y-2.5"
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                {skillName}
              </span>
              <div className="flex items-center gap-3">
                <span className="text-gray-400 font-medium tabular-nums transition-all duration-500">
                  Current: <strong className="text-gray-700">{current}%</strong> / Target: <strong className="text-gray-700">{target}%</strong>
                </span>
                <span className={`px-2 py-0.5 rounded-full font-bold text-[11px] transition-colors duration-300 ${
                  gap === 0 ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'
                }`}>
                  {gap === 0 ? 'Mastered!' : `${gap}% gap`}
                </span>
              </div>
            </div>

            <div className="w-full h-2.5 rounded-full overflow-hidden bg-gray-100 relative p-0.5">
              <div
                className="h-full rounded-full absolute top-0.5 left-0.5 bg-indigo-50/80 transition-all duration-500"
                style={{ width: `${Math.min(target, 100)}%` }}
              />
              <div
                className="h-full rounded-full absolute top-0.5 left-0.5 transition-all duration-700 ease-out group-hover:brightness-110"
                style={{
                  width: `${Math.min(current, 100)}%`,
                  background: gap === 0 ? 'linear-gradient(90deg, #10B981, #34D399)' : 'linear-gradient(90deg, #4F46E5, #7C6EF6)'
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SkillGapChart;