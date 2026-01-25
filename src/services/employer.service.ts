import api, { unwrapResponse } from '../lib/api';
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
    const response = await api.get('/employer/dashboard/stats/');
    return unwrapResponse<DashboardStats>(response.data);
  },

  async getRecentApplications(limit: number = 10): Promise<RecentApplication[]> {
    const response = await api.get(
      `/employer/dashboard/recent-applications/?limit=${limit}`
    );
    return unwrapResponse<RecentApplication[]>(response.data);
  },

  async getTopJobs(limit: number = 5): Promise<TopJob[]> {
    const response = await api.get(`/employer/dashboard/top-jobs/?limit=${limit}`);
    return unwrapResponse<TopJob[]>(response.data);
  },

  // Employer Application (for admin review)
  async getMyApplication(): Promise<EmployerApplication | null> {
    try {
      const response = await api.get('/auth/employer/applications/me/');
      return unwrapResponse<EmployerApplication>(response.data);
    } catch {
      return null;
    }
  },

  async submitApplication(data: FormData): Promise<EmployerApplication> {
    const response = await api.post('/auth/employer/applications/', data);
    return unwrapResponse<EmployerApplication>(response.data);
  },

  // Skills
  async getSkills(): Promise<Skill[]> {
    const response = await api.get('/skills/');
    const data = unwrapResponse<PaginatedResponse<Skill> | Skill[]>(response.data);
    // Handle both paginated and array responses
    if (Array.isArray(data)) {
      return data;
    }
    return data.results;
  },
};

export default employerService;
