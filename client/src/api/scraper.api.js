import api from './axios';

export const scraperApi = {
  searchJobs: async (params) => {
    const res = await api.get('/scraper/search', { params });
    return res.data;
  },
};
