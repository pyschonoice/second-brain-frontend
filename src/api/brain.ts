// src/api/brain.ts
import api from './index'; // Import the axios instance
import { ContentApiData } from '../types'; // Assuming ContentApiData is sufficient for shared content

interface ShareBrainResponse {
  success: boolean;
  message: string;
  hash?: string; // The shareable hash
}

interface SharedBrainContentResponse {
  success: boolean;
  message?: string;
  username?: string;
  content?: ContentApiData[]; // Array of content data
}

/**
 * Creates or deletes a share link for the current user's brain.
 * @param shareAction - true to create/get link, false to delete link.
 * @returns A promise resolving to ShareBrainResponse.
 */
export const createShareLink = async (shareAction: boolean): Promise<ShareBrainResponse> => {
  try {
    const response = await api.post<ShareBrainResponse>('/brain/share', { share: shareAction });
    return response.data;
  } catch (error: any) {
    console.error('Error creating/deleting share link:', error.response?.data || error.message);
    throw error.response?.data || error; // Re-throw the error for component to handle
  }
};

/**
 * Fetches content for a given share link hash. (Public endpoint, no auth needed, handled by axios instance)
 * @param hash - The share link hash.
 * @returns A promise resolving to SharedBrainContentResponse.
 */
export const getSharedContent = async (hash: string): Promise<SharedBrainContentResponse> => {
  try {
    const response = await api.get<SharedBrainContentResponse>(`/brain/${hash}`);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching shared content:', error.response?.data || error.message);
    throw error.response?.data || error; // Re-throw the error for component to handle
  }
};