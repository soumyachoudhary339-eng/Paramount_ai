import apiInstance from "./apiInstance";

export const analyzeResumePDFAPI = (formData) =>
  apiInstance.post('/resume/analyze-pdf', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });