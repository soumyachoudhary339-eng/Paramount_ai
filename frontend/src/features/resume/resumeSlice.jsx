import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const analyzeResume = createAsyncThunk(
  'resume/analyzeResume',
  async (fileData, { rejectWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      return {
        atsScore: 84,
        matchedSkills: ['React', 'JavaScript', 'Tailwind CSS', 'Redux'],
        missingSkills: ['TypeScript', 'Node.js', 'Docker'],
        feedback: [
          'Add quantifiable achievements under work experience.',
          'Include links to live project deployments.',
        ],
      };
    } catch (error) {
      return rejectWithValue('Failed to analyze resume');
    }
  }
);

const initialState = {
  resumeData: {
    fullName: '',
    email: '',
    phone: '',
    experience: [],
    skills: [],
    education: [],
  },
  analysisResult: null,
  loading: false,
  error: null,
};

const resumeSlice = createSlice({
  name: 'resume',
  initialState,
  reducers: {
    updateResumeField: (state, action) => {
      const { field, value } = action.payload;
      state.resumeData[field] = value;
    },
    resetResume: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(analyzeResume.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(analyzeResume.fulfilled, (state, action) => {
        state.loading = false;
        state.analysisResult = action.payload;
      })
      .addCase(analyzeResume.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { updateResumeField, resetResume } = resumeSlice.actions;
export default resumeSlice.reducer;