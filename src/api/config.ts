// src/api/config.ts

// Access environment variable for the API base URL
// VITE_ prefix is required for Vite to expose environment variables to client-side code
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

