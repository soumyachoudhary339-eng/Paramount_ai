import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRoadmap, updateMilestoneStatus } from './roadmapSlice';
import { SkillGapChart } from './components/SkillGapChart';
import { MilestoneCard } from './components/MilestoneCard';
import { AIRecommendedCard } from './components/AIRecommendedCard'; // <-- AI Card Import kiya

const RoadmapSkeleton = () => (
  <div className="space-y-6 animate-pulse max-w-5xl mx-auto" aria-hidden="true">
    <div className="h-[150px] w-full rounded-3xl" style={{ background: '#F1F1F8', border: '1px solid #EEEFF7' }} />
    <div className="space-y-3">
      {[0, 1, 2].map((i) => (
        <div key={i} className="h-24 w-full rounded-3xl" style={{ background: '#F1F1F8', border: '1px solid #EEEFF7' }} />
      ))}
    </div>
    <div className="h-40 w-full rounded-3xl" style={{ background: '#F1F1F8', border: '1px solid #EEEFF7' }} />
  </div>
);

export const RoadmapPage = () => {
  const dispatch = useDispatch();
  const { data: roadmap, loading, updatingMilestoneId } = useSelector((state) => state.roadmap);

  useEffect(() => {
    dispatch(fetchRoadmap());
  }, [dispatch]);

  const handleToggleStatus = (milestoneId, currentStatus) => {
    const nextStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    dispatch(updateMilestoneStatus({ milestoneId, status: nextStatus }));
  };

  if (loading) {
    return <RoadmapSkeleton />;
  }

  if (!roadmap) {
    return (
      <div
        className="max-w-4xl mx-auto p-8 text-center rounded-3xl mt-10"
        style={{ background: '#F8F8FD', border: '1px dashed #CBCEEE' }}
      >
        <h2 className="text-base font-bold" style={{ color: '#1B1F3B' }}>
          No active career roadmap found
        </h2>
        <p className="text-xs mt-1" style={{ color: '#5B6178' }}>
          Head over to the Resume Analyzer and scan a PDF to generate your tailored roadmap.
        </p>
      </div>
    );
  }

  const milestones = roadmap.milestones || [];
  const completedCount = milestones.filter((m) => m.status === 'completed').length;
  const progressPercent = milestones.length > 0 ? Math.round((completedCount / milestones.length) * 100) : 0;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Banner Header */}
      <div
        className="p-6 rounded-3xl space-y-4"
        style={{ background: 'linear-gradient(135deg, #F8F8FD 0%, #FFFFFF 70%)', border: '1px solid #E7E8F5' }}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span
              className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
              style={{ background: '#EEF0FD', color: '#4F46E5' }}
            >
              Active learning path
            </span>
            <h1 className="text-xl font-bold tracking-tight mt-1.5" style={{ color: '#1B1F3B' }}>
              Career learning roadmap
            </h1>
            <p className="text-xs" style={{ color: '#5B6178' }}>
              Structured step-by-step path tailored for{' '}
              <span className="font-semibold" style={{ color: '#4F46E5' }}>
                {roadmap.role}
              </span>
            </p>
          </div>

          <div className="text-right">
            <span className="text-2xl font-bold tabular-nums" style={{ color: '#4F46E5' }}>
              {progressPercent}%
            </span>
            <span className="block text-[11px] font-medium" style={{ color: '#9295B8' }}>
              Overall progress
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-medium" style={{ color: '#5B6178' }}>
            <span>
              {completedCount} of {milestones.length} milestones completed
            </span>
            <span>{milestones.length - completedCount} remaining</span>
          </div>
          <div className="w-full h-2.5 rounded-full overflow-hidden p-0.5" style={{ background: '#EEEFF7' }}>
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{
                width: `${progressPercent}%`,
                background: 'linear-gradient(90deg, #4F46E5, #7C6EF6)',
              }}
            />
          </div>
        </div>
      </div>

      {/* Interactive Milestones Section */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold px-1" style={{ color: '#1B1F3B' }}>
          Milestones path
        </h2>
        <div className="space-y-3">
          {milestones.map((milestone, idx) => {
            const mId = milestone._id || milestone.id;
            return (
              <div key={mId || idx} className="transition-transform duration-200 hover:-translate-y-0.5">
                <MilestoneCard
                  milestone={milestone}
                  index={idx}
                  onStatusToggle={handleToggleStatus}
                  updating={updatingMilestoneId === mId}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Recommended Actions Card Integration */}
      <AIRecommendedCard suggestions={roadmap.suggestions} />

      {/* Skill Gap breakdown */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold px-1" style={{ color: '#1B1F3B' }}>
          Skill Gaps & Proficiency
        </h2>
        <SkillGapChart skills={roadmap.skillGap} />
      </div>
    </div>
  );
};

export default RoadmapPage;