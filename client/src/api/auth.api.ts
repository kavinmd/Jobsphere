import api from './axios';
import { AuthResponse, ApiResponse, User } from '../types';

export const authApi = {
  register: async (data: {
    name: string;
    email: string;
    password: string;
    role: string;
    company?: string;
  }): Promise<AuthResponse> => {
    const res = await api.post('/auth/register', data);
    return res.data;
  },

  login: async (data: { email: string; password: string }): Promise<AuthResponse> => {
    const res = await api.post('/auth/login', data);
    return res.data;
  },

  getMe: async (): Promise<ApiResponse<{ user: User }>> => {
    const res = await api.get('/auth/me');
    return res.data;
  },
};
