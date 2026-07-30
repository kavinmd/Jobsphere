import api from './axios';

export const usersApi = {
  getProfile: async () => {
    const res = await api.get('/users/profile');
    return res.data;
  },

  updateProfile: async (data) => {
    const res = await api.put('/users/profile', data);
    return res.data;
  },

  changePassword: async (data) => {
    const res = await api.put('/users/change-password', data);
    return res.data;
  },
};
