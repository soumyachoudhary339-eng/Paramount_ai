import { useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchRoadmap,
  createOrUpdateRoadmap as createOrUpdateRoadmapThunk,
  updateMilestoneStatus,
} from '../features/roadmap/roadmapSlice';

export const useRoadmapRedux = () => {
  const dispatch = useDispatch();
  const { data, loading, updatingMilestoneId, error } = useSelector(
    (state) => state.roadmap
  );

  // Prevent multiple initial fetches on component re-renders
  const initialFetchAttempted = useRef(false);

  const getRoadmapData = useCallback(() => {
    return dispatch(fetchRoadmap());
  }, [dispatch]);

  const saveOrUpdateRoadmap = useCallback(
    async (roadmapPayload) => {
      try {
        const result = await dispatch(
          createOrUpdateRoadmapThunk(roadmapPayload)
        ).unwrap();
        return result;
      } catch (err) {
        throw err;
      }
    },
    [dispatch]
  );

  const updateMilestone = useCallback(
    async (milestoneId, newStatus) => {
      try {
        const result = await dispatch(
          updateMilestoneStatus({ milestoneId, status: newStatus })
        ).unwrap();
        return result;
      } catch (err) {
        // Optimistic UI Rollback: Re-fetch roadmap state from server on failure
        dispatch(fetchRoadmap());
        throw err;
      }
    },
    [dispatch]
  );

  useEffect(() => {
    if (!data && !loading && !initialFetchAttempted.current) {
      initialFetchAttempted.current = true;
      getRoadmapData();
    }
  }, [data, loading, getRoadmapData]);

  return {
    data,
    loading,
    updatingMilestoneId,
    error,
    refetch: getRoadmapData,
    saveOrUpdateRoadmap,
    updateMilestone,
  };
};