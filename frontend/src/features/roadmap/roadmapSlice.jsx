import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getRoadmapAPI,
  createOrUpdateRoadmapAPI,
  updateMilestoneStatusAPI,
} from '../../api/apiRoadmap';

export const fetchRoadmap = createAsyncThunk(
  'roadmap/fetchRoadmap',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getRoadmapAPI();
      return response.data?.data?.roadmap || response.data?.roadmap;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch roadmap');
    }
  }
);

export const updateMilestoneStatus = createAsyncThunk(
  'roadmap/updateMilestoneStatus',
  async ({ milestoneId, status }, { rejectWithValue }) => {
    try {
      const response = await updateMilestoneStatusAPI(milestoneId, status);
      return { milestoneId, status, updatedRoadmap: response.data?.data?.roadmap || response.data?.roadmap };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update milestone status');
    }
  }
);

const roadmapSlice = createSlice({
  name: 'roadmap',
  initialState: {
    data: null,
    loading: false,
    updatingMilestoneId: null,
    error: null,
  },
  reducers: {
    setRoadmapData: (state, action) => {
      state.data = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoadmap.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoadmap.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchRoadmap.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateMilestoneStatus.pending, (state, action) => {
        const { milestoneId, status } = action.meta.arg;
        state.updatingMilestoneId = milestoneId;

        if (state.data && state.data.milestones) {
          const targetMilestone = state.data.milestones.find(
            (m) => (m._id || m.id) === milestoneId
          );

          const oldStatus = (targetMilestone?.status || 'pending').toLowerCase();
          const newStatus = status.toLowerCase();

          if (oldStatus === newStatus) return;

          const milestones = state.data.milestones.map((m) => {
            const mId = m._id || m.id;
            if (mId === milestoneId) {
              return { ...m, status: newStatus };
            }
            return m;
          });

          const milestoneTitle = (targetMilestone?.title || "").toLowerCase();

          const skillGap = (state.data.skillGap || []).map((skill) => {
            const skillName = (skill.skillName || "").toLowerCase();
            
            // Smart Keyword Matching for instant UI update
            const skillKeywords = skillName.split(/[\s\-()\/]+/g).filter(w => w.length > 2);
            const isMatched = milestoneTitle.includes(skillName) || 
                              skillName.includes(milestoneTitle) ||
                              skillKeywords.some(keyword => milestoneTitle.includes(keyword));

            if (isMatched) {
              const target = Number(skill.targetScore);
              const targetVal = isNaN(target) ? 100 : target;
              
              const baseline = Number(skill.baselineScore ?? 0);
              const baselineVal = isNaN(baseline) ? 0 : baseline;

              if (newStatus === 'completed' && oldStatus !== 'completed') {
                return { ...skill, currentScore: targetVal };
              } else if (newStatus === 'pending' && oldStatus === 'completed') {
                return { ...skill, currentScore: baselineVal };
              }
            }
            return skill;
          });

          state.data = {
            ...state.data,
            milestones,
            skillGap,
          };
        }
      })
      .addCase(updateMilestoneStatus.fulfilled, (state, action) => {
        state.updatingMilestoneId = null;
        if (action.payload.updatedRoadmap) {
          state.data = action.payload.updatedRoadmap;
        }
      })
      .addCase(updateMilestoneStatus.rejected, (state, action) => {
        state.updatingMilestoneId = null;
        state.error = action.payload;
      });
  },
});

export const { setRoadmapData } = roadmapSlice.actions;
export default roadmapSlice.reducer;