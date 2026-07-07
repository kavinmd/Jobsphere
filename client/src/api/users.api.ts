import api from './axios';
import { ApiResponse, User } from '../types';

export const usersApi = {
  getProfile: async (): Promise<ApiResponse<{ user: User }>> => {
    const res = await api.get('/users/profile');
    return res.data;
  },

  updateProfile: async (data: Partial<User>): Promise<ApiResponse<{ user: User }>> => {
    const res = await api.put('/users/profile', data);
    return res.data;
  },

  changePassword: async (data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<ApiResponse<null>> => {
    const res = await api.put('/users/change-password', data);
    return res.data;
  },
};
