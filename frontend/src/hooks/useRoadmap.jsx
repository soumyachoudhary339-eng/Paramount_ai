import { useState, useEffect, useCallback } from 'react';
import apiInstance from '../api/apiInstance';

export const useRoadmap = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRoadmap = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiInstance.get('/roadmap/get');
      const roadmapData = response.data?.data?.roadmap;

      if (roadmapData) {
        setData({
          id: roadmapData.id || roadmapData._id,
          role: roadmapData.role || null,
          atsScore: roadmapData.atsScore || 0,
          milestones: (roadmapData.milestones || []).map((m) => ({
            id: m.id || m._id,
            title: m.title,
            description: m.description,
            status: m.status,
            targetDate: m.targetDate,
          })),
          skillGap: (roadmapData.skillGap || []).map((s) => ({
            skillName: s.skillName || s.name,
            name: s.name || s.skillName,
            currentScore: s.currentScore ?? s.currentLevel ?? 0,
            targetScore: s.targetScore ?? s.requiredLevel ?? 100,
            baselineScore: s.baselineScore ?? 0,
            currentLevel: s.currentLevel ?? s.currentScore ?? 0,
            requiredLevel: s.requiredLevel ?? s.targetScore ?? 100,
          })),
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch roadmap.');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateMilestone = async (milestoneId, newStatus) => {
    const previousData = data;

    // Optimistic update for milestones
    setData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        milestones: prev.milestones.map((m) =>
          m.id === milestoneId ? { ...m, status: newStatus } : m
        ),
      };
    });

    try {
      const response = await apiInstance.patch(`/roadmap/milestones/${milestoneId}`, {
        status: newStatus,
      });
      
      // Backend se updated roadmap response aane par state ko puri tarah sync kar dein 
      // taaki progress bars (skill scores) bhi turant update ho jayein.
      const updatedRoadmap = response.data?.data?.roadmap;
      if (updatedRoadmap) {
        setData((prev) => ({
          ...prev,
          skillGap: (updatedRoadmap.skillGap || []).map((s) => ({
            skillName: s.skillName || s.name,
            name: s.name || s.skillName,
            currentScore: s.currentScore ?? s.currentLevel ?? 0,
            targetScore: s.targetScore ?? s.requiredLevel ?? 100,
            baselineScore: s.baselineScore ?? 0,
            currentLevel: s.currentLevel ?? s.currentScore ?? 0,
            requiredLevel: s.requiredLevel ?? s.targetScore ?? 100,
          })),
        }));
      }
    } catch (err) {
      setData(previousData); // Rollback on error
      throw err;
    }
  };

  useEffect(() => {
    fetchRoadmap();
  }, [fetchRoadmap]);

  return { data, loading, error, refetch: fetchRoadmap, updateMilestone };
};