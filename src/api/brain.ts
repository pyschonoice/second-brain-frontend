
import api from './index'; 
import { ContentApiData } from '../types'; 

interface ShareBrainResponse {
  success: boolean;
  message: string;
  hash?: string; 
}

interface SharedBrainContentResponse {
  success: boolean;
  message?: string;
  username?: string;
  content?: ContentApiData[]; 
}


export const createShareLink = async (shareAction: boolean): Promise<ShareBrainResponse> => {
  try {
    const response = await api.post<ShareBrainResponse>('/brain/share', { share: shareAction });
    return response.data;
  } catch (error: any) {
    console.error('Error creating/deleting share link:', error.response?.data || error.message);
    throw error.response?.data || error; 
  }
};


export const getSharedContent = async (hash: string): Promise<SharedBrainContentResponse> => {
  try {
    const response = await api.get<SharedBrainContentResponse>(`/brain/${hash}`);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching shared content:', error.response?.data || error.message);
    throw error.response?.data || error; 
  }
};