import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const HomeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M4 11l8-7 8 7" stroke="white" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6 10v9a1 1 0 001 1h4v-6h2v6h4a1 1 0 001-1v-9" stroke="white" strokeWidth="1.7" strokeLinejoin="round" />
  </svg>
);

const TrendIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M4 16l5-5 4 4 7-7" stroke="#4F46E5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M15 8h5v5" stroke="#4F46E5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CheckListIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M9 6h11M9 12h11M9 18h11" stroke="#059669" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M4 6l1 1 2-2M4 12l1 1 2-2M4 18l1 1 2-2" stroke="#059669" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const TargetIcon = ({ color }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="8.5" stroke={color} strokeWidth="1.7" />
    <circle cx="12" cy="12" r="4.5" stroke={color} strokeWidth="1.7" />
    <circle cx="12" cy="12" r="1" fill={color} />
  </svg>
);

// Same severity bands used for scores elsewhere in the app.
const scoreBand = (score) => {
  if (score >= 80) return { color: '#059669', wash: '#ECFDF5' };
  if (score >= 55) return { color: '#D97706', wash: '#FFFBEB' };
  return { color: '#E11D48', wash: '#FEF2F2' };
};

const STATUS_STYLES = {
  completed: { bg: '#ECFDF5', text: '#059669', accent: '#059669' },
  'in-progress': { bg: '#EEF0FD', text: '#4F46E5', accent: '#4F46E5' },
  'in progress': { bg: '#EEF0FD', text: '#4F46E5', accent: '#4F46E5' },
  pending: { bg: '#F1F1F8', text: '#9295B8', accent: '#CBCEEE' },
};

const DashboardSkeleton = () => (
  <div className="space-y-6 animate-pulse" aria-hidden="true">
    <div className="h-8 w-48 rounded-full" style={{ background: '#F1F1F8' }} />
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {[0, 1, 2].map((i) => (
        <div key={i} className="h-24 rounded-3xl" style={{ background: '#F1F1F8', border: '1px solid #EEEFF7' }} />
      ))}
    </div>
    <div className="h-72 rounded-3xl" style={{ background: '#F1F1F8', border: '1px solid #EEEFF7' }} />
  </div>
);

const DashboardPage = () => {
  // Safe Redux destructuring from roadmap slice
  const { data: roadmapData, loading } = useSelector((state) => state.roadmap) || {};

  if (loading) {
    return <DashboardSkeleton />;
  }

  // Calculate metrics dynamically from roadmap data
  const milestones = roadmapData?.milestones || [];
  const completedCount = milestones.filter((m) => (m.status || '').toLowerCase() === 'completed').length;
  const totalCount = milestones.length;
  const overallProgress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const atsScore = roadmapData?.atsScore || 0;
  const atsBand = scoreBand(atsScore);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex items-center gap-3">
        <div
          className="h-10 w-10 rounded-2xl flex items-center justify-center shrink-0"
          style={{ background: 'linear-gradient(135deg, #4F46E5, #7C6EF6)' }}
        >
          <HomeIcon />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight" style={{ color: '#1B1F3B' }}>
            Dashboard
          </h1>
          <p className="text-xs" style={{ color: '#5B6178' }}>
            Welcome back to your career prep hub
          </p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-3xl flex items-start justify-between gap-3" style={{ border: '1px solid #E7E8F5' }}>
          <div>
            <p className="text-xs font-medium" style={{ color: '#9295B8' }}>
              Overall progress
            </p>
            <h3 className="text-xl font-bold mt-1 tabular-nums" style={{ color: '#4F46E5' }}>
              {overallProgress}%
            </h3>
          </div>
          <div className="h-8 w-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#EEF0FD' }}>
            <TrendIcon />
          </div>
        </div>

        <div className="bg-white p-4 rounded-3xl flex items-start justify-between gap-3" style={{ border: '1px solid #E7E8F5' }}>
          <div>
            <p className="text-xs font-medium" style={{ color: '#9295B8' }}>
              Completed milestones
            </p>
            <h3 className="text-xl font-bold mt-1 tabular-nums" style={{ color: '#1B1F3B' }}>
              {completedCount} / {totalCount}
            </h3>
          </div>
          <div className="h-8 w-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#ECFDF5' }}>
            <CheckListIcon />
          </div>
        </div>

        <div className="bg-white p-4 rounded-3xl flex items-start justify-between gap-3" style={{ border: '1px solid #E7E8F5' }}>
          <div>
            <p className="text-xs font-medium" style={{ color: '#9295B8' }}>
              ATS resume score (Applicant Tracking System)
            </p>
            <h3 className="text-xl font-bold mt-1 tabular-nums" style={{ color: atsBand.color }}>
              {atsScore}%
            </h3>
          </div>
          <div className="h-8 w-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: atsBand.wash }}>
            <TargetIcon color={atsBand.color} />
          </div>
        </div>
      </div>

      {/* All Milestones Section */}
      <div className="bg-white p-6 rounded-3xl space-y-4" style={{ border: '1px solid #E7E8F5' }}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold" style={{ color: '#1B1F3B' }}>
              All career milestones
            </h2>
            <p className="text-xs" style={{ color: '#5B6178' }}>
              Track your step-by-step learning progression
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span
              className="text-xs font-semibold px-3 py-1 rounded-full"
              style={{ background: '#EEF0FD', color: '#4F46E5' }}
            >
              {completedCount} of {totalCount} completed
            </span>
            {totalCount > 0 && (
              <Link
                to="/roadmap"
                className="text-xs font-semibold transition hover:underline"
                style={{ color: '#4F46E5' }}
              >
                View full roadmap →
              </Link>
            )}
          </div>
        </div>

        {milestones.length === 0 ? (
          <div
            className="text-center py-8 px-6 text-xs rounded-2xl"
            style={{ color: '#5B6178', background: '#F8F8FD', border: '1px dashed #CBCEEE' }}
          >
            No milestones found. Analyze your resume to generate your custom roadmap.
          </div>
        ) : (
          <div className="space-y-3 mt-4">
            {milestones.map((m, index) => {
              const status = (m.status || 'pending').toLowerCase();
              const isCompleted = status === 'completed';
              const style = STATUS_STYLES[status] || STATUS_STYLES.pending;

              return (
                <div
                  key={m._id || m.id || index}
                  className="p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-shadow duration-300 hover:shadow-[0_4px_16px_rgba(27,31,59,0.06)]"
                  style={{ background: isCompleted ? '#F8F8FD' : 'white', border: '1px solid #E7E8F5' }}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5"
                      style={{ background: style.accent, color: 'white' }}
                    >
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold" style={{ color: '#1B1F3B' }}>
                        {m.title}
                      </h3>
                      {m.description && (
                        <p className="text-xs mt-0.5" style={{ color: '#5B6178' }}>
                          {m.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <span
                    className="text-[10px] font-bold px-2.5 py-1 rounded-full capitalize shrink-0"
                    style={{ background: style.bg, color: style.text }}
                  >
                    {m.status || 'Pending'}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;