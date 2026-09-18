// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { api } from '../../services/api';

// // Async Thunk: Backend / API se Dashboard data load karne ke liye
// export const fetchDashboardData = createAsyncThunk(
//   'dashboard/fetchDashboardData',
//   async (userId, { rejectWithValue }) => {
//     try {
//       // Direct backend API endpoint call
//       const response = await api.get(`/user/${userId}/dashboard`);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message || 'Failed to load dashboard metrics'
//       );
//     }
//   }
// );

// const initialState = {
//   activeTab: 'overview',
//   metrics: {
//     overallProgress: 25,
//     completedModules: 2,
//     totalModules: 8,
//     atsScore: 78,
//   },
//   currentMilestone: {
//     title: 'Foundations & Core Prerequisites',
//     phase: 'Phase 1 (Month 1)',
//     status: 'in-progress',
//   },
//   notifications: [
//     { id: '1', message: 'Complete HTML/CSS assessment to unlock Phase 2', read: false },
//     { id: '2', message: 'New course added by Admin for Full-Stack Track', read: true },
//   ],
//   loading: false,
//   error: null,
// };

// const dashboardSlice = createSlice({
//   name: 'dashboard',
//   initialState,
//   reducers: {
//     // Current active dashboard tab switch karne ke liye
//     setActiveTab: (state, action) => {
//       state.activeTab = action.payload;
//     },
    
//     // User progress locally increment / update karne ke liye
//     updateProgress: (state, action) => {
//       state.metrics.overallProgress = action.payload;
//     },

//     // Notification mark as read handler
//     markNotificationAsRead: (state, action) => {
//       const notification = state.notifications.find((item) => item.id === action.payload);
//       if (notification) {
//         notification.read = true;
//       }
//     },

//     // State reset options
//     resetDashboardState: () => initialState,
//   },
//   extraReducers: (builder) => {
//     builder
//       // Pending state
//       .addCase(fetchDashboardData.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       // Fulfilled state
//       .addCase(fetchDashboardData.fulfilled, (state, action) => {
//         state.loading = false;
//         if (action.payload) {
//           state.metrics = action.payload.metrics || state.metrics;
//           state.currentMilestone = action.payload.currentMilestone || state.currentMilestone;
//           state.notifications = action.payload.notifications || state.notifications;
//         }
//       })
//       // Rejected state
//       .addCase(fetchDashboardData.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   },
// });

// export const {
//   setActiveTab,
//   updateProgress,
//   markNotificationAsRead,
//   resetDashboardState,
// } = dashboardSlice.actions;

// export default dashboardSlice.reducer;

// 
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async Thunk (Backend Mock Simulation)
export const fetchDashboardData = createAsyncThunk(
  'dashboard/fetchDashboardData',
  async (userId, { rejectWithValue }) => {
    try {
      // API call ki jagah mock 500ms delay simulate kar rahe hain
      await new Promise((resolve) => setTimeout(resolve, 500));

      return {
        metrics: {
          overallProgress: 35,
          completedModules: 3,
          totalModules: 8,
          atsScore: 82,
        },
        currentMilestone: {
          title: 'Foundations & Core Prerequisites',
          phase: 'Phase 1 (Month 1)',
          status: 'in-progress',
        },
        notifications: [
          { id: '1', message: 'Complete HTML/CSS assessment to unlock Phase 2', read: false },
          { id: '2', message: 'New course added by Admin for Full-Stack Track', read: true },
        ],
      };
    } catch (error) {
      return rejectWithValue('Failed to load mock dashboard data');
    }
  }
);

const initialState = {
  activeTab: 'overview',
  metrics: {
    overallProgress: 25,
    completedModules: 2,
    totalModules: 8,
    atsScore: 78,
  },
  currentMilestone: {
    title: 'Foundations & Core Prerequisites',
    phase: 'Phase 1 (Month 1)',
    status: 'in-progress',
  },
  notifications: [
    { id: '1', message: 'Complete HTML/CSS assessment to unlock Phase 2', read: false },
    { id: '2', message: 'New course added by Admin for Full-Stack Track', read: true },
  ],
  loading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    updateProgress: (state, action) => {
      state.metrics.overallProgress = action.payload;
    },
    markNotificationAsRead: (state, action) => {
      const notification = state.notifications.find((item) => item.id === action.payload);
      if (notification) {
        notification.read = true;
      }
    },
    resetDashboardState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.metrics = action.payload.metrics || state.metrics;
          state.currentMilestone = action.payload.currentMilestone || state.currentMilestone;
          state.notifications = action.payload.notifications || state.notifications;
        }
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setActiveTab,
  updateProgress,
  markNotificationAsRead,
  resetDashboardState,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;