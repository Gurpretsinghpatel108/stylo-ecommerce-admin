// src/api/api.js

import axios from 'axios';

// API base URL ko environment se load karo (development vs production)
const API_BASE = import.meta.env.VITE_API_BASE || 'https://ecommerce-backend-production-253c.up.railway.app/api';

// Debug ke liye console mein print kar do (remove kar sakte ho baad mein)
console.log('API_BASE used:', API_BASE);

// Axios instance banao (best practice - har call mein baseURL automatically lag jayega)
const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000, // 15 seconds max wait
  headers: {
    'Content-Type': 'application/json',
    // Agar future mein auth token chahiye toh yeh add kar sakte ho
    // 'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
  },
});

// Optional: Request interceptor (har request se pehle kuch karna ho toh)
api.interceptors.request.use(
  (config) => {
    // Example: token add karo agar login hai
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor (error handling better karne ke liye)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Common error handling
    if (error.response) {
      console.error('API Error:', error.response.data);
      // Agar 401 (unauthorized) toh logout kar sakte ho
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        // window.location.href = '/login'; // optional
      }
    } else if (error.request) {
      console.error('No response from server:', error.request);
    } else {
      console.error('Request error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Export kar do taaki har file mein import kar sako
export default api;