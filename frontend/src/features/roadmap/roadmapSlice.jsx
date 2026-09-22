import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getRoadmapAPI,
  createOrUpdateRoadmapAPI,
  updateMilestoneStatusAPI,
} from '../../api/apiRoadmap';

// 1. Fetch Roadmap Thunk
export const fetchRoadmap = createAsyncThunk(
  'roadmap/fetchRoadmap',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getRoadmapAPI();
      return response.data?.data?.roadmap || response.data?.roadmap || response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch roadmap'
      );
    }
  }
);

// 2. Create or Update Full Roadmap Thunk
export const createOrUpdateRoadmap = createAsyncThunk(
  'roadmap/createOrUpdateRoadmap',
  async (roadmapPayload, { rejectWithValue }) => {
    try {
      const response = await createOrUpdateRoadmapAPI(roadmapPayload);
      return response.data?.data?.roadmap || response.data?.roadmap || response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to generate/update roadmap'
      );
    }
  }
);

// 3. Update Single Milestone Status Thunk (With Optimistic UI)
export const updateMilestoneStatus = createAsyncThunk(
  'roadmap/updateMilestoneStatus',
  async ({ milestoneId, status }, { rejectWithValue }) => {
    try {
      const response = await updateMilestoneStatusAPI(milestoneId, status);
      return {
        milestoneId,
        status,
        updatedRoadmap: response.data?.data?.roadmap || response.data?.roadmap || response.data,
      };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to update milestone status'
      );
    }
  }
);

const initialState = {
  data: null,
  loading: false,
  updatingMilestoneId: null,
  error: null,
};

const roadmapSlice = createSlice({
  name: 'roadmap',
  initialState,
  reducers: {
    setRoadmapData: (state, action) => {
      state.data = action.payload;
    },
    clearRoadmapError: (state) => {
      state.error = null;
    },
    resetRoadmapState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // ==========================================
      // FETCH ROADMAP
      // ==========================================
      .addCase(fetchRoadmap.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoadmap.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(fetchRoadmap.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ==========================================
      // CREATE / UPDATE ROADMAP
      // ==========================================
      .addCase(createOrUpdateRoadmap.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrUpdateRoadmap.fulfilled, (state, action) => {
        state.loading = false;

        const incomingData = action.payload || {};
        const existingSuggestions = state.data?.suggestions || [];

        state.data = {
          ...incomingData,
          suggestions:
            Array.isArray(incomingData.suggestions) && incomingData.suggestions.length > 0
              ? incomingData.suggestions
              : existingSuggestions,
        };

        state.error = null;
      })
      .addCase(createOrUpdateRoadmap.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ==========================================
      // UPDATE MILESTONE STATUS (OPTIMISTIC)
      // ==========================================
      .addCase(updateMilestoneStatus.pending, (state, action) => {
        const { milestoneId, status } = action.meta.arg;
        state.updatingMilestoneId = milestoneId;
        state.error = null;

        if (state.data && Array.isArray(state.data.milestones)) {
          const targetMilestone = state.data.milestones.find(
            (m) => (m._id || m.id) === milestoneId
          );

          const oldStatus = (targetMilestone?.status || 'pending').toLowerCase();
          const newStatus = (status || '').toLowerCase();

          if (oldStatus === newStatus) return;

          // Instant Milestone Status Update
          state.data.milestones = state.data.milestones.map((m) => {
            const mId = m._id || m.id;
            if (mId === milestoneId) {
              return { ...m, status: newStatus };
            }
            return m;
          });

          const milestoneTitle = (targetMilestone?.title || '').toLowerCase();

          // Instant Skill Gap Progress Calculation
          if (Array.isArray(state.data.skillGap)) {
            state.data.skillGap = state.data.skillGap.map((skill) => {
              const skillName = (skill.skillName || skill.name || '').toLowerCase();

              const skillKeywords = skillName
                .split(/[\s\-()\/]+/g)
                .filter((w) => w.length > 2);

              const isMatched =
                (milestoneTitle && skillName.includes(milestoneTitle)) ||
                (skillName && milestoneTitle.includes(skillName)) ||
                skillKeywords.some((keyword) => milestoneTitle.includes(keyword));

              if (isMatched) {
                const target = Number(skill.targetScore ?? skill.requiredLevel);
                const targetVal = isNaN(target) ? 100 : target;

                const baseline = Number(skill.baselineScore ?? 0);
                const baselineVal = isNaN(baseline) ? 0 : baseline;

                if (newStatus === 'completed' && oldStatus !== 'completed') {
                  return { ...skill, currentScore: targetVal, currentLevel: targetVal };
                } else if (newStatus === 'pending' && oldStatus === 'completed') {
                  return { ...skill, currentScore: baselineVal, currentLevel: baselineVal };
                }
              }
              return skill;
            });
          }
        }
      })
      .addCase(updateMilestoneStatus.fulfilled, (state, action) => {
        state.updatingMilestoneId = null;

        if (action.payload?.updatedRoadmap) {
          const updated = action.payload.updatedRoadmap;
          const currentSuggestions = state.data?.suggestions || [];

          // Preserve suggestions array during milestone updates
          state.data = {
            ...updated,
            suggestions:
              Array.isArray(updated.suggestions) && updated.suggestions.length > 0
                ? updated.suggestions
                : currentSuggestions,
          };
        }
      })
      .addCase(updateMilestoneStatus.rejected, (state, action) => {
        state.updatingMilestoneId = null;
        state.error = action.payload;
      });
  },
});

export const { setRoadmapData, clearRoadmapError, resetRoadmapState } =
  roadmapSlice.actions;

export default roadmapSlice.reducer;