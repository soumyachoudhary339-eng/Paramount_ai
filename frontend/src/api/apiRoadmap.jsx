import apiInstance from './apiInstance';

// Fetch active roadmap
export const getRoadmapAPI = () => apiInstance.get('/roadmap/get');

// Save or update roadmap
export const createOrUpdateRoadmapAPI = (payload) =>
  apiInstance.post('/roadmap/create', payload);

// Update single milestone status
export const updateMilestoneStatusAPI = (milestoneId, status) =>
  apiInstance.patch(`/roadmap/milestones/${milestoneId}/status`, { status });

// ✨ Fetch AI Study Plan for a Milestone
export const getAIMentorPlanAPI = (payload) =>
  apiInstance.post('/roadmap/ai-mentor', payload);

// ✨ Fetch AI Strategy & Project Idea for Skill Gap
export const getAISkillAdviceAPI = (payload) =>
  apiInstance.post('/roadmap/ai-skill-advice', payload);