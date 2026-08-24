import api from './axios';

export const jobsApi = {
  getAllJobs: async (params) => {
    const res = await api.get('/jobs', { params });
    return res.data;
  },

  getJobById: async (id) => {
    const res = await api.get(`/jobs/${id}`);
    return res.data;
  },

  getMyJobs: async () => {
    const res = await api.get('/jobs/my');
    return res.data;
  },

  getManagerStats: async () => {
    const res = await api.get('/jobs/stats');
    return res.data;
  },

  createJob: async (data) => {
    const res = await api.post('/jobs/', data);
    return res.data;
  },

  updateJob: async (id, data) => {
    const res = await api.put(`/jobs/${id}`, data);
    return res.data;
  },

  deleteJob: async (id) => {
    const res = await api.delete(`/jobs/${id}`);
    return res.data;
  },
};
