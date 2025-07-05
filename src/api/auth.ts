
import api from './index';
import { SignInPayload, SignUpPayload, AuthResponse, ApiResponse } from '../types';

export const signup = async (data: SignUpPayload): Promise<ApiResponse<AuthResponse>> => {
  try {
    const response = await api.post<ApiResponse<AuthResponse>>('/signup', data);
    return response.data;
  } catch (error: any) {
    
    throw error.response?.data || error.message;
  }
};

export const signin = async (data: SignInPayload): Promise<ApiResponse<AuthResponse>> => {
  try {
    const response = await api.post<ApiResponse<AuthResponse>>('/signin', data);
    return response.data;
  } catch (error: any) {
    
    throw error.response?.data || error.message;
  }
};