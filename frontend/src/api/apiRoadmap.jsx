import apiInstance from './apiInstance';

// Fetch active roadmap
export const getRoadmapAPI = () => apiInstance.get('/roadmap/get');

// Save or update roadmap
export const createOrUpdateRoadmapAPI = (payload) =>
  apiInstance.post('/roadmap/create', payload);

// Update single milestone status
export const updateMilestoneStatusAPI = (milestoneId, status) =>
  apiInstance.patch(`/roadmap/milestones/${milestoneId}/status`, { status });