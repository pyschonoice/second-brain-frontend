// src/api/tag.ts
import api from './index';
import {  TagApiData, CreateTagPayload, DeleteTagPayload } from '../types';

interface CreateTagResponse {
  success: boolean;
  message: string;
  tag: TagApiData;
}

interface GetTagByTitleResponse {
  success: boolean;
  message: string;
  tag: TagApiData;
}

interface DeleteTagResponse {
  success: boolean;
  message: string;
}

export const createTag = async (data: CreateTagPayload): Promise<CreateTagResponse> => {
  try {
    const response = await api.post<CreateTagResponse>('/tag', data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

// NOTE: This API fetches a *single* tag by its title.
// If you need to fetch *all* tags for the authenticated user (e.g., for filtering in the sidebar),
// a new backend endpoint (e.g., GET /tag without a title parameter) would be needed.
export const getTagByTitle = async (title: string): Promise<GetTagByTitleResponse> => {
  try {
    const response = await api.get<GetTagByTitleResponse>(`/tag/${title}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const deleteTag = async (data: DeleteTagPayload): Promise<DeleteTagResponse> => {
  try {
    const response = await api.delete<DeleteTagResponse>('/tag', { data });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};