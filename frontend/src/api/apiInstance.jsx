import axios from 'axios';

// 1. Base Instance Configuration
const apiInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  withCredentials: true, // Cookies pass aur receive karne ke liye zaroori hai
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Request Interceptor (Har request me Automatically Token Add Karega)
apiInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Ya aapka custom token key name
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiInstance;