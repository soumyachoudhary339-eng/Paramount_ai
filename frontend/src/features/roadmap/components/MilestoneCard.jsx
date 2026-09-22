import { useState } from 'react';
import { getAIMentorPlanAPI } from '../../../api/apiRoadmap';

const STATUS_STYLES = {
  completed: { bg: '#ECFDF5', text: '#059669', border: '#A7F3D0', accent: '#059669' },
  'in progress': { bg: '#EEF0FD', text: '#4F46E5', border: '#C7C9F5', accent: '#4F46E5' },
  pending: { bg: '#F1F1F8', text: '#9295B8', border: '#E2E4F1', accent: '#CBCEEE' },
};

const normalize = (status) => String(status || '').toLowerCase();

const CheckIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

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

export const MilestoneCard = ({
  milestone,
  index,
  onStatusToggle,
  updating = false,
  targetRole = 'Software Engineer',
}) => {
  const key = normalize(milestone.status);
  const style = STATUS_STYLES[key] || STATUS_STYLES.pending;
  const isCompleted = key === 'completed';
  const isInProgress = key === 'in progress';
  const isInteractive = typeof onStatusToggle === 'function';
  const milestoneId = milestone._id || milestone.id;

  // AI Modal States
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiData, setAiData] = useState(null);
  const [selectedQuizAnswers, setSelectedQuizAnswers] = useState({});

  // Handle AI Plan Fetching
  const handleOpenAiMentor = async () => {
    setShowAiModal(true);
    if (aiData) return; // Cached response bypass

    setAiLoading(true);
    try {
      const response = await getAIMentorPlanAPI({
        milestoneTitle: milestone.title,
        subTopics: milestone.subTopics || milestone.skills || [],
        targetRole,
      });

      if (response.data?.success || response.data?.plan) {
        setAiData(response.data.plan || response.data);
      }
    } catch (err) {
      console.error('Failed to load AI Study Plan:', err);
    } finally {
      setAiLoading(false);
    }
  };

  const handleOptionSelect = (qIdx, option) => {
    setSelectedQuizAnswers((prev) => ({ ...prev, [qIdx]: option }));
  };

  // ✨ SMART SUB-TOPICS RESOLVER (Array + String Description Parser)
  const getResolvedSubTopics = () => {
    const rawSubTopics =
      milestone.subTopics ||
      milestone.subtopics ||
      milestone.subTopic ||
      milestone.topics;

    // Direct Array Return
    if (Array.isArray(rawSubTopics) && rawSubTopics.length > 0) {
      return rawSubTopics;
    }

    // Fallback: Parse Description String into Bullet Items
    if (milestone.description && typeof milestone.description === 'string') {
      return milestone.description
        .split(/,|\./)
        .map((item) => item.trim())
        .filter((item) => item.length > 2);
    }

    return [];
  };

  const subTopicsList = getResolvedSubTopics();

  return (
    <div
      className="relative pl-8 pb-8 last:pb-0"
      style={{
        borderLeft: `2px ${isCompleted || isInProgress ? 'solid' : 'dashed'} ${style.accent}`,
      }}
    >
      {/* Circle Badge */}
      <div
        className="absolute -left-[17px] top-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-4"
        style={{
          background: isCompleted || isInProgress ? style.accent : 'white',
          color: isCompleted || isInProgress ? 'white' : style.text,
          borderColor: '#FAFAFD',
          boxShadow: isInProgress ? `0 0 0 3px ${style.border}` : 'none',
        }}
      >
        {isCompleted ? <CheckIcon /> : index + 1}
      </div>

      <div
        className="bg-white p-5 rounded-3xl space-y-3 transition-shadow duration-300 hover:shadow-[0_4px_16px_rgba(27,31,59,0.06)]"
        style={{ border: '1px solid #E7E8F5' }}
      >
        <div className="flex justify-between items-center gap-3">
          <h3 className="font-bold text-sm" style={{ color: '#1B1F3B' }}>
            {milestone.title}
          </h3>

          <div className="flex items-center gap-2 shrink-0">
            {/* ✨ AI Study Plan Action Button */}
            <button
              type="button"
              onClick={handleOpenAiMentor}
              className="text-[10px] font-semibold px-2.5 py-1 rounded-full transition active:scale-[0.97] flex items-center gap-1 cursor-pointer"
              style={{
                background: '#EEF0FD',
                color: '#4F46E5',
                border: '1px solid #C7C9F5',
              }}
            >
              <SparklesIcon size={10} /> AI Study Plan
            </button>

            {/* Mark as Done Toggle Button */}
            {isInteractive ? (
              <button
                type="button"
                disabled={updating}
                onClick={() => onStatusToggle(milestoneId, milestone.status)}
                aria-pressed={isCompleted}
                aria-label={
                  isCompleted
                    ? `Mark "${milestone.title}" as not done`
                    : `Mark "${milestone.title}" as done`
                }
                className="text-[10px] font-semibold px-2.5 py-1 rounded-full transition active:scale-[0.97] disabled:cursor-not-allowed disabled:active:scale-100 flex items-center gap-1.5 cursor-pointer shrink-0"
                style={{
                  background: style.bg,
                  color: style.text,
                  opacity: updating ? 0.7 : 1,
                }}
              >
                {updating ? (
                  <>
                    <Spinner /> Updating…
                  </>
                ) : isCompleted ? (
                  <>
                    <CheckIcon size={11} /> Completed
                  </>
                ) : (
                  'Mark as done'
                )}
              </button>
            ) : (
              <span
                className="text-[10px] font-semibold px-2.5 py-1 rounded-full border shrink-0"
                style={{
                  background: style.bg,
                  color: style.text,
                  borderColor: style.border,
                }}
              >
                {milestone.status}
              </span>
            )}
          </div>
        </div>

        {/* Skills List */}
        {milestone.skills && milestone.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {milestone.skills.map((skill, idx) => (
              <span
                key={idx}
                className="text-[10px] px-2 py-0.5 rounded-md font-medium"
                style={{ background: '#F1F1F8', color: '#5B6178' }}
              >
                {skill}
              </span>
            ))}
          </div>
        )}

        {/* Sub-topics List (Renders from subTopics Array OR auto-parsed Description) */}
        {subTopicsList.length > 0 && (
          <ul className="space-y-1 pt-1">
            {subTopicsList.map((topic, idx) => (
              <li
                key={idx}
                className="text-[11px] flex items-start gap-1.5"
                style={{ color: '#5B6178' }}
              >
                <span
                  className="mt-1 h-1 w-1 rounded-full shrink-0"
                  style={{ background: '#CBCEEE' }}
                  aria-hidden="true"
                />
                {topic}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ========================================================= */}
      {/* ✨ AI MENTOR MODAL DRAWER */}
      {/* ========================================================= */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[85vh] overflow-y-auto p-6 relative shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Close Button */}
            <button
              onClick={() => setShowAiModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-bold text-sm p-2 cursor-pointer"
            >
              ✕
            </button>

            {/* Modal Header */}
            <div>
              <div className="flex items-center gap-1.5 text-indigo-600 font-bold text-xs uppercase tracking-wider">
                <SparklesIcon size={13} /> AI Mentor Plan
              </div>
              <h2
                className="text-base font-bold mt-0.5"
                style={{ color: '#1B1F3B' }}
              >
                {milestone.title}
              </h2>
            </div>

            {aiLoading ? (
              <div className="py-12 flex flex-col items-center justify-center gap-3 text-gray-500">
                <Spinner />
                <p className="text-xs">
                  Generating custom tasks, resources & quiz for you...
                </p>
              </div>
            ) : aiData ? (
              <div className="space-y-5 text-xs text-gray-700">
                {/* 1. Sub-tasks */}
                {aiData.subTasks && (
                  <div className="p-3.5 rounded-2xl bg-indigo-50/50 border border-indigo-100">
                    <h4 className="font-bold text-indigo-950 mb-2">
                      📋 Actionable Micro-Tasks:
                    </h4>
                    <ul className="space-y-1.5">
                      {aiData.subTasks.map((task, tIdx) => (
                        <li key={tIdx} className="flex items-start gap-2">
                          <input
                            type="checkbox"
                            className="mt-0.5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span>{task}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* 2. Curated Resources */}
                {aiData.learningResources && (
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">
                      📚 Learning Resources:
                    </h4>
                    <ul className="space-y-2">
                      {aiData.learningResources.map((res, rIdx) => (
                        <li
                          key={rIdx}
                          className="flex items-center justify-between p-2.5 rounded-xl border border-gray-100 bg-gray-50"
                        >
                          <div>
                            <span className="font-semibold text-gray-800">
                              {res.title}
                            </span>
                            <span className="text-[10px] text-gray-400 block">
                              {res.type}
                            </span>
                          </div>
                          <a
                            href={res.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[10px] font-bold text-indigo-600 hover:underline px-2.5 py-1 rounded-lg bg-white border border-indigo-100"
                          >
                            Open Link ↗
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* 3. Knowledge Check Quiz */}
                {aiData.quickQuiz && (
                  <div className="space-y-3 pt-2 border-t border-gray-100">
                    <h4 className="font-bold text-gray-900">
                      ⚡ 1-Minute Knowledge Quiz:
                    </h4>
                    {aiData.quickQuiz.map((quiz, qIdx) => (
                      <div
                        key={qIdx}
                        className="p-3 bg-gray-50 rounded-2xl border border-gray-100 space-y-2"
                      >
                        <p className="font-medium text-gray-800">
                          {qIdx + 1}. {quiz.question}
                        </p>
                        <div className="grid grid-cols-1 gap-1.5">
                          {quiz.options.map((option, oIdx) => {
                            const isSelected =
                              selectedQuizAnswers[qIdx] === option;
                            const isCorrect = option === quiz.correctAnswer;
                            let btnBg = 'bg-white text-gray-700 border-gray-200';

                            if (isSelected) {
                              btnBg = isCorrect
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                                : 'bg-rose-50 text-rose-700 border-rose-300';
                            }

                            return (
                              <button
                                key={oIdx}
                                type="button"
                                onClick={() =>
                                  handleOptionSelect(qIdx, option)
                                }
                                className={`text-left text-[11px] px-3 py-1.5 rounded-xl border transition cursor-pointer ${btnBg}`}
                              >
                                {option}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-rose-500 py-4 text-center">
                Failed to load AI Study Plan. Please try again.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};