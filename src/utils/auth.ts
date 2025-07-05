// src/utils/auth.ts

/**
 * Retrieves the authentication token from localStorage.
 * @returns The JWT token string or null if not found.
 */
export const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

/**
 * Stores the authentication token in localStorage.
 * @param token The JWT token string to store.
 */
export const setAuthToken = (token: string): void => {
  localStorage.setItem('authToken', token);
};

/**
 * Removes the authentication token from localStorage.
 */
export const removeAuthToken = (): void => {
  localStorage.removeItem('authToken');
};