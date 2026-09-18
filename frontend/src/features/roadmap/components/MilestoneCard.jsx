import React from 'react';

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

const Spinner = () => (
  <span
    className="h-3 w-3 border-2 rounded-full animate-spin shrink-0"
    style={{ borderColor: '#C7C9F5', borderTopColor: 'transparent' }}
    aria-hidden="true"
  />
);

export const MilestoneCard = ({ milestone, index, onStatusToggle, updating = false }) => {
  const key = normalize(milestone.status);
  const style = STATUS_STYLES[key] || STATUS_STYLES.pending;
  const isCompleted = key === 'completed';
  const isInProgress = key === 'in progress';
  const isInteractive = typeof onStatusToggle === 'function';
  const milestoneId = milestone._id || milestone.id;

  return (
    <div
      className="relative pl-8 pb-8 last:pb-0"
      style={{
        borderLeft: `2px ${isCompleted || isInProgress ? 'solid' : 'dashed'} ${style.accent}`,
      }}
    >
      {/* Circle Badge — filled once reached, outlined while still pending */}
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

          {isInteractive ? (
            <button
              type="button"
              disabled={updating}
              onClick={() => onStatusToggle(milestoneId, milestone.status)}
              aria-pressed={isCompleted}
              aria-label={isCompleted ? `Mark "${milestone.title}" as not done` : `Mark "${milestone.title}" as done`}
              className="text-[10px] font-semibold px-2.5 py-1 rounded-full transition active:scale-[0.97] disabled:cursor-not-allowed disabled:active:scale-100 flex items-center gap-1.5 shrink-0"
              style={{ background: style.bg, color: style.text, opacity: updating ? 0.7 : 1 }}
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
              style={{ background: style.bg, color: style.text, borderColor: style.border }}
            >
              {milestone.status}
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5 pt-1">
          {milestone.skills?.map((skill, idx) => (
            <span
              key={idx}
              className="text-[10px] px-2 py-0.5 rounded-md font-medium"
              style={{ background: '#F1F1F8', color: '#5B6178' }}
            >
              {skill}
            </span>
          ))}
        </div>

        {(() => {
          const subTopics = milestone.subTopics || milestone.subtopics || milestone.subTopic || milestone.topics;
          if (!subTopics || subTopics.length === 0) return null;
          return (
            <ul className="space-y-1 pt-1">
              {subTopics.map((topic, idx) => (
                <li key={idx} className="text-[11px] flex items-start gap-1.5" style={{ color: '#5B6178' }}>
                  <span className="mt-1 h-1 w-1 rounded-full shrink-0" style={{ background: '#CBCEEE' }} aria-hidden="true" />
                  {topic}
                </li>
              ))}
            </ul>
          );
        })()}
      </div>
    </div>
  );
};