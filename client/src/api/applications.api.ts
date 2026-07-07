import api from './axios';
import { ApiResponse, Application, StudentStats } from '../types';

export const applicationsApi = {
  applyToJob: async (data: {
    jobId?: string;
    jobSource: string;
    externalJobData?: object;
    coverLetter?: string;
  }): Promise<ApiResponse<{ application: Application }>> => {
    const res = await api.post('/applications', data);
    return res.data;
  },

  getMyApplications: async (): Promise<ApiResponse<{ applications: Application[] }>> => {
    const res = await api.get('/applications/my');
    return res.data;
  },

  getStudentStats: async (): Promise<ApiResponse<StudentStats>> => {
    const res = await api.get('/applications/stats');
    return res.data;
  },

  getJobApplicants: async (
    jobId: string
  ): Promise<ApiResponse<{ applications: Application[]; job: object }>> => {
    const res = await api.get(`/applications/job/${jobId}`);
    return res.data;
  },

  updateApplicationStatus: async (
    id: string,
    data: { status: string; notes?: string }
  ): Promise<ApiResponse<{ application: Application }>> => {
    const res = await api.put(`/applications/${id}/status`, data);
    return res.data;
  },
};
