import api from '../lib/api';
import type {
  DashboardStats,
  RecentApplication,
  TopJob,
  Skill,
  PaginatedResponse,
} from '../types/api.types';
import type { EmployerApplication } from '../types/employer.types';

export const employerService = {
  // Dashboard
  async getDashboardStats(): Promise<DashboardStats> {
    const response = await api.get<DashboardStats>('/employer/dashboard/stats/');
    return response.data;
  },

  async getRecentApplications(limit: number = 10): Promise<RecentApplication[]> {
    const response = await api.get<RecentApplication[]>(
      `/employer/dashboard/recent-applications/?limit=${limit}`
    );
    return response.data;
  },

  async getTopJobs(limit: number = 5): Promise<TopJob[]> {
    const response = await api.get<TopJob[]>(`/employer/dashboard/top-jobs/?limit=${limit}`);
    return response.data;
  },

  // Employer Application (for admin review)
  async getMyApplication(): Promise<EmployerApplication | null> {
    try {
      const response = await api.get<EmployerApplication>('/auth/employer/applications/me/');
      return response.data;
    } catch {
      return null;
    }
  },

  async submitApplication(data: FormData): Promise<EmployerApplication> {
    const response = await api.post<EmployerApplication>('/auth/employer/applications/', data);
    return response.data;
  },

  // Skills
  async getSkills(): Promise<Skill[]> {
    const response = await api.get<PaginatedResponse<Skill>>('/skills/');
    return response.data.results;
  },
};

export default employerService;
