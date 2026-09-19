import axios from 'axios';

// 1. Base Instance Configuration
const apiInstance = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true, // 👈 Cookies automatically pass aur receive karne ke liye zaroori hai
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  },
});

// Note: Agar aap pure HttpOnly cookies use kar rahe hain, toh 
// request interceptor mein Bearer token manually lagane ki zaroorat nahi hai.
// Browser khud withCredentials: true ki wajah se cookie bhej dega.

export default apiInstance;