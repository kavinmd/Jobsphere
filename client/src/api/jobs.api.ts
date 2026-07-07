import api from './axios';
import { ApiResponse, Job, PaginatedJobs, ManagerStats } from '../types';

export const jobsApi = {
  getAllJobs: async (params?: {
    keyword?: string;
    location?: string;
    type?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<PaginatedJobs>> => {
    const res = await api.get('/jobs', { params });
    return res.data;
  },

  getJobById: async (id: string): Promise<ApiResponse<{ job: Job }>> => {
    const res = await api.get(`/jobs/${id}`);
    return res.data;
  },

  getMyJobs: async (): Promise<ApiResponse<{ jobs: Job[] }>> => {
    const res = await api.get('/jobs/my');
    return res.data;
  },

  getManagerStats: async (): Promise<ApiResponse<ManagerStats>> => {
    const res = await api.get('/jobs/stats');
    return res.data;
  },

  createJob: async (data: {
    title: string;
    company: string;
    location: string;
    description: string;
    requirements: string;
    salary?: string;
    type: string;
  }): Promise<ApiResponse<{ job: Job }>> => {
    const res = await api.post('/jobs', data);
    return res.data;
  },

  updateJob: async (
    id: string,
    data: Partial<{
      title: string;
      company: string;
      location: string;
      description: string;
      requirements: string;
      salary: string;
      type: string;
      status: string;
    }>
  ): Promise<ApiResponse<{ job: Job }>> => {
    const res = await api.put(`/jobs/${id}`, data);
    return res.data;
  },

  deleteJob: async (id: string): Promise<ApiResponse<null>> => {
    const res = await api.delete(`/jobs/${id}`);
    return res.data;
  },
};
