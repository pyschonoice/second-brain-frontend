// src/api/index.ts
import axios from 'axios';
import { API_BASE_URL } from './config'; // Import the base URL from config.ts
import { removeAuthToken } from '../utils/auth'; // Import removeAuthToken for logout

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach the JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken'); // Retrieve token from local storage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for global error handling (e.g., token expiration)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized errors (e.g., token expired or invalid)
      console.error('Unauthorized: Token expired or invalid. Please log in again.');
      removeAuthToken(); // Clear the invalid token
      // Optionally, redirect to login page.
      // This is often handled at a higher level (e.g., in App.tsx or a routing context)
      // to avoid direct DOM manipulation or forcing redirects within interceptors.
      // For now, a console error and token removal are sufficient.
    }
    return Promise.reject(error);
  }
);

export default api;