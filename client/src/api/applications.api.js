import api from './axios';

export const applicationsApi = {
  applyToJob: async (data) => {
    const res = await api.post('/applications/', data);
    return res.data;
  },

  getMyApplications: async () => {
    const res = await api.get('/applications/my');
    return res.data;
  },

  getStudentStats: async () => {
    const res = await api.get('/applications/stats');
    return res.data;
  },

  getJobApplicants: async (jobId) => {
    const res = await api.get(`/applications/job/${jobId}`);
    return res.data;
  },

  updateApplicationStatus: async (id, data) => {
    const res = await api.put(`/applications/${id}/status`, data);
    return res.data;
  },
};
