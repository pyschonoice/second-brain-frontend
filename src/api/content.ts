// src/api/content.ts
import api from './index';
import { ContentApiData, CreateContentPayload, DeleteContentPayload } from '../types';

interface GetContentsResponse {
  success: boolean;
  content: ContentApiData[]; // The API returns an array directly under 'content'
}

interface CreateContentResponse {
  success: boolean;
  message: string;
  contentId: string;
}

interface DeleteContentResponse {
  success: boolean;
  message: string;
}

export const getContents = async (): Promise<GetContentsResponse> => {
  try {
    const response = await api.get<GetContentsResponse>('/content');
    return response.data;
  } catch (error: any) {
    // Re-throw the error for component-specific handling
    throw error.response?.data || error.message;
  }
};

export const createContent = async (data: CreateContentPayload): Promise<CreateContentResponse> => {
  try {
    const response = await api.post<CreateContentResponse>('/content', data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const deleteContent = async (data: DeleteContentPayload): Promise<DeleteContentResponse> => {
  try {
    // For DELETE with a body, use 'data' property
    const response = await api.delete<DeleteContentResponse>('/content', { data });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};