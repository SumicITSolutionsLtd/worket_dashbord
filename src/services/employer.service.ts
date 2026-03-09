import api, { unwrapResponse } from '../lib/api';
import type {
  DashboardStats,
  RecentApplication,
  TopJob,
  Skill,
  PaginatedResponse,
} from '../types/api.types';
import type { EmployerApplication } from '../types/employer.types';

/** Raw dashboard stats shape from backend (before mapping). */
interface RawDashboardStats {
  total_jobs_posted?: number;
  active_jobs?: number;
  total_applications?: number;
  pending_applications?: number;
  shortlisted_candidates?: number;
  hired_candidates?: number;
  application_trend?: Array<{ date: string; count: number }>;
}

/** Raw top job item from backend (uses application_count). */
interface RawTopJob {
  id: number;
  title: string;
  company?: string;
  company_logo?: string | null;
  application_count?: number;
  applicants_count?: number;
  is_active: boolean;
  posted_at: string | null;
}

export const employerService = {
  // Dashboard
  async getDashboardStats(): Promise<DashboardStats> {
    const response = await api.get('/employer/dashboard/stats/');
    const raw = unwrapResponse<RawDashboardStats>(response.data);
    return {
      total_jobs: raw.total_jobs_posted ?? 0,
      active_jobs: raw.active_jobs ?? 0,
      total_applications: raw.total_applications ?? 0,
      pending_applications: raw.pending_applications ?? 0,
      shortlisted_applications: raw.shortlisted_candidates ?? 0,
      hired_applications: raw.hired_candidates ?? 0,
      application_trend: raw.application_trend,
    };
  },

  async getRecentApplications(limit: number = 10): Promise<RecentApplication[]> {
    const response = await api.get(
      `/employer/dashboard/recent-applications/?limit=${limit}`
    );
    return unwrapResponse<RecentApplication[]>(response.data);
  },

  async getTopJobs(limit: number = 5): Promise<TopJob[]> {
    const response = await api.get(`/employer/dashboard/top-jobs/?limit=${limit}`);
    const rawList = unwrapResponse<RawTopJob[]>(response.data);
    return (rawList ?? []).map((job) => ({
      id: job.id,
      title: job.title,
      applicants_count: job.applicants_count ?? job.application_count ?? 0,
      is_active: job.is_active,
      posted_at: job.posted_at ?? new Date().toISOString(),
    }));
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
    const response = await api.get('/profiles/skills/');
    const data = unwrapResponse<PaginatedResponse<Skill> | Skill[]>(response.data);
    // Handle both paginated and array responses
    if (Array.isArray(data)) {
      return data;
    }
    return data.results;
  },

  async createSkill(name: string, category: Skill['category'] = 'technical'): Promise<Skill> {
    const response = await api.post('/profiles/skills/', { name, category });
    return unwrapResponse<Skill>(response.data);
  },
};

export default employerService;
