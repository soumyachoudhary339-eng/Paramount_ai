import { useSelector, useDispatch } from 'react-redux';
import { analyzeResume, updateResumeField, resetResume } from '../features/resume/resumeSlice';

export const useResume = () => {
  const dispatch = useDispatch();
  const { resumeData, analysisResult, loading, error } = useSelector((state) => state.resume || {});

  const runAnalysis = (file) => dispatch(analyzeResume(file));
  const setField = (field, value) => dispatch(updateResumeField({ field, value }));
  const clearResume = () => dispatch(resetResume());

  return {
    resumeData,
    analysisResult,
    loading,
    error,
    runAnalysis,
    setField,
    clearResume,
  };
};