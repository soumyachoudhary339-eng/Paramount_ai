import apiInstance from "./apiInstance";


export const registerUserApi = async (userData) => {
  const response = await apiInstance.post('/auth/register', userData);
  return response.data;
};

export const loginUserApi = async (credentials) => {
  const response = await apiInstance.post('/auth/login', credentials);
  return response.data;
};

// Session verify karne ke liye function
export const getCurrentUserApi = async () => {
  const response = await apiInstance.get('/auth/me');
  return response.data; // Yeh { success: true, user: {...} } return karega
};

export const logoutUserApi = async ()=>{
    const response = await apiInstance.post("auth/logout",)
    return response.data
}