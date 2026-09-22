import React from 'react';

const SparklesIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
  </svg>
);

export const AIRecommendedCard = ({ suggestions = [], title = "AI Recommended Actions" }) => {
  const hasSuggestions = Array.isArray(suggestions) && suggestions.length > 0;

  if (!hasSuggestions) return null;

  return (
    <div className="p-5 bg-gradient-to-br from-indigo-50/60 via-purple-50/30 to-white rounded-3xl border border-indigo-100/80 shadow-xs space-y-3">
      <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider">
        <SparklesIcon size={14} /> {title}
      </div>
      <ul className="space-y-2.5">
        {suggestions.map((suggestion, index) => (
          <li key={index} className="flex items-start gap-2.5 text-xs text-gray-700">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-indigo-500 shrink-0" aria-hidden="true" />
            <span className="leading-relaxed font-medium">
              {typeof suggestion === 'string' ? suggestion : (suggestion?.text || suggestion?.suggestion || '')}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AIRecommendedCard;