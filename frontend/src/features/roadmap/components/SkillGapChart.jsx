import React, { useState } from 'react';
import { getAISkillAdviceAPI } from '../../../api/apiRoadmap';

const SparklesIcon = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
  </svg>
);

const Spinner = () => (
  <span
    className="h-3 w-3 border-2 rounded-full animate-spin shrink-0"
    style={{ borderColor: '#C7C9F5', borderTopColor: 'transparent' }}
    aria-hidden="true"
  />
);

export const SkillGapChart = ({ skills = [], suggestions = [], targetRole = 'Software Engineer' }) => {
  const [activeSkillModal, setActiveSkillModal] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiAdvice, setAiAdvice] = useState({});

  const hasSkills = Array.isArray(skills) && skills.length > 0;
  const hasSuggestions = Array.isArray(suggestions) && suggestions.length > 0;

  // Fallback view only if both datasets are missing
  if (!hasSkills && !hasSuggestions) {
    return (
      <div className="p-8 text-center bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
        <p className="text-xs text-gray-400 font-medium">No skill gaps analyzed yet.</p>
      </div>
    );
  }

  const handleFetchAiStrategy = async (skillName, gap) => {
    setActiveSkillModal(skillName);

    if (aiAdvice[skillName]) return;

    setAiLoading(true);
    try {
      const response = await getAISkillAdviceAPI({
        skillName,
        gap,
        targetRole,
      });

      if (response.data?.success || response.data?.advice) {
        setAiAdvice((prev) => ({
          ...prev,
          [skillName]: response.data.advice || response.data,
        }));
      }
    } catch (error) {
      console.error('Failed to fetch AI Skill Strategy:', error);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Skill Gap Bars List */}
      {hasSkills && (
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

                  <div className="flex items-center gap-2.5">
                    <span className="text-gray-400 font-medium tabular-nums transition-all duration-500">
                      Current: <strong className="text-gray-700">{current}%</strong> / Target:{' '}
                      <strong className="text-gray-700">{target}%</strong>
                    </span>

                    {/* AI Strategy Button */}
                    {gap > 0 && (
                      <button
                        type="button"
                        onClick={() => handleFetchAiStrategy(skillName, gap)}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-full transition active:scale-[0.97] flex items-center gap-1 cursor-pointer bg-indigo-50 text-indigo-600 border border-indigo-200 hover:bg-indigo-100"
                      >
                        <SparklesIcon size={10} /> AI Strategy
                      </button>
                    )}

                    {/* Gap Percentage Badge */}
                    <span
                      className={`px-2 py-0.5 rounded-full font-bold text-[11px] transition-colors duration-300 ${
                        gap === 0
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                          : 'bg-rose-50 text-rose-600 border border-rose-100'
                      }`}
                    >
                      {gap === 0 ? 'Mastered!' : `${gap}% gap`}
                    </span>
                  </div>
                </div>

                {/* Fixed Progress Bar Container */}
                <div className="w-full h-2.5 rounded-full bg-gray-100 overflow-hidden relative">
                  {/* Target Background Track */}
                  <div
                    className="h-full bg-indigo-50/80 absolute left-0 top-0 transition-all duration-500"
                    style={{ width: `${Math.min(target, 100)}%` }}
                  />
                  {/* Current Progress Fill */}
                  <div
                    className="h-full relative z-10 transition-all duration-700 ease-out group-hover:brightness-110"
                    style={{
                      width: `${Math.min(current, 100)}%`,
                      background:
                        gap === 0
                          ? 'linear-gradient(90deg, #10B981, #34D399)'
                          : 'linear-gradient(90deg, #4F46E5, #7C6EF6)',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* AI Strategic Suggestions Card */}
      {hasSuggestions && (
        <div className="p-5 bg-gradient-to-br from-indigo-50/60 via-purple-50/30 to-white rounded-3xl border border-indigo-100/80 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider">
            <SparklesIcon size={14} /> AI Recommended Actions
          </div>
          <ul className="space-y-2">
            {suggestions.map((item, index) => (
              <li key={index} className="flex items-start gap-2.5 text-xs text-gray-700">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-indigo-500 shrink-0" aria-hidden="true" />
                <span className="leading-relaxed">
                  {/* Handles string items as well as backend object payloads safely */}
                  {typeof item === 'string' ? item : item?.text || item?.suggestion || item?.message || item?.title}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* AI SKILL STRATEGY MODAL */}
      {activeSkillModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 relative shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setActiveSkillModal(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-bold text-sm p-2 cursor-pointer"
            >
              ✕
            </button>

            <div>
              <div className="flex items-center gap-1.5 text-indigo-600 font-bold text-xs uppercase tracking-wider">
                <SparklesIcon size={13} /> AI Skill Gap Solution
              </div>
              <h3 className="text-base font-bold mt-0.5" style={{ color: '#1B1F3B' }}>
                How to close {activeSkillModal} Gap
              </h3>
            </div>

            {aiLoading ? (
              <div className="py-10 flex flex-col items-center justify-center gap-3 text-gray-500">
                <Spinner />
                <p className="text-xs">Generating action steps & project recommendation...</p>
              </div>
            ) : aiAdvice[activeSkillModal] ? (
              <div className="space-y-4 text-xs text-gray-700">
                {aiAdvice[activeSkillModal].steps && (
                  <div className="p-3 bg-indigo-50/60 rounded-2xl border border-indigo-100 space-y-1.5">
                    <h4 className="font-bold text-indigo-950">🎯 Recommended Steps:</h4>
                    <ul className="list-disc pl-4 space-y-1 text-gray-700">
                      {aiAdvice[activeSkillModal].steps.map((step, idx) => (
                        <li key={idx}>{step}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {aiAdvice[activeSkillModal].projectIdea && (
                  <div className="p-3 bg-emerald-50/60 rounded-2xl border border-emerald-100 space-y-1">
                    <h4 className="font-bold text-emerald-950">🛠️ Practical Project Idea:</h4>
                    <p className="text-emerald-900 font-medium">
                      {aiAdvice[activeSkillModal].projectIdea.title}
                    </p>
                    <p className="text-[11px] text-gray-600">
                      {aiAdvice[activeSkillModal].projectIdea.description}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-rose-500 py-4 text-center">
                Failed to load strategy. Please try again.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillGapChart;