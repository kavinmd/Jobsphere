import api from './axios';
import { ApiResponse, ScrapedJob } from '../types';

export const scraperApi = {
  searchJobs: async (params: {
    keyword: string;
    location?: string;
  }): Promise<ApiResponse<{ jobs: ScrapedJob[]; total: number }>> => {
    const res = await api.get('/scraper/search', { params });
    return res.data;
  },
};
