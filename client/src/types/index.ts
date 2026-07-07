export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'student' | 'hiring_manager';
  phone?: string;
  location?: string;
  bio?: string;
  resumeUrl?: string;
  company?: string;
  avatar?: string;
  createdAt?: string;
}

export interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string[];
  salary?: string;
  type: 'full-time' | 'part-time' | 'internship' | 'contract' | 'remote';
  postedBy: User | string;
  source: 'internal';
  status: 'open' | 'closed';
  applicationCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ScrapedJob {
  id: string;
  title: string;
  company: string;
  location: string;
  applyUrl: string;
  source: 'linkedin' | 'naukri' | 'internshala' | 'unstop';
  description?: string;
  salary?: string;
  type?: string;
  postedDate?: string;
}

export interface Application {
  _id: string;
  studentId: User | string;
  jobId?: Job | string;
  jobSource: 'internal' | 'linkedin' | 'naukri' | 'internshala' | 'unstop';
  externalJobData?: {
    title: string;
    company: string;
    location: string;
    applyUrl: string;
    source: string;
    description?: string;
    salary?: string;
  };
  coverLetter?: string;
  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data?: {
    token: string;
    user: User;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface PaginatedJobs {
  jobs: Job[];
  total: number;
  page: number;
  totalPages: number;
}

export interface ManagerStats {
  totalJobs: number;
  openJobs: number;
  totalApplicants: number;
  pendingApplicants: number;
}

export interface StudentStats {
  total: number;
  pending: number;
  shortlisted: number;
  rejected: number;
}
