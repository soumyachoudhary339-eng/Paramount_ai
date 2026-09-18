import apiInstance from "./apiInstance";


export const registerUserApi = async (userData) => {
  const response = await apiInstance.post('/auth/register', userData);
  return response.data;
};

export const loginUserApi = async (credentials) => {
  const response = await apiInstance.post('/auth/login', credentials);
  return response.data;
};