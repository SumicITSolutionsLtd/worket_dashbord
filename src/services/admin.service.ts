import api, { unwrapResponse } from '../lib/api';
import type {
  PaginatedResponse,
  Profile,
  Job,
  Company,
  Skill,
} from '../types/api.types';
import type { EmployerApplication } from '../types/employer.types';

// Analytics types
export interface AnalyticsDashboard {
  total_jobs: number;
  total_skills: number;
  total_users: number;
  total_companies: number;
  trending_skills: Array<{
    id: number;
    skill: Skill;
    growth_percentage: string;
    job_count: number;
    period_start: string;
    period_end: string;
  }>;
}

export interface MarketInsight {
  id: number;
  skill_category: string;
  demand_score: number;
  average_salary_min: string;
  average_salary_max: string;
  salary_range: string;
  job_openings: number;
  period_start: string;
  period_end: string;
}

export const adminService = {
  // Analytics
  async getAnalyticsDashboard(): Promise<AnalyticsDashboard> {
    const response = await api.get('/analytics/dashboard/');
    return unwrapResponse<AnalyticsDashboard>(response.data);
  },

  async getMarketInsights(): Promise<MarketInsight[]> {
    const response = await api.get('/analytics/market-insights/');
    return unwrapResponse<MarketInsight[]>(response.data);
  },

  async getTrendingSkills(): Promise<Skill[]> {
    const response = await api.get('/analytics/trending-skills/');
    return unwrapResponse<Skill[]>(response.data);
  },

  // Employer Applications
  async getEmployerApplications(
    status?: string,
    params?: { page?: number; search?: string; employer_type?: string; is_pilot_employer?: boolean }
  ): Promise<PaginatedResponse<EmployerApplication>> {
    const queryParams = new URLSearchParams();
    if (status && status !== 'all') {
      queryParams.append('status', status);
    }
    if (params?.page) {
      queryParams.append('page', params.page.toString());
    }
    if (params?.search) {
      queryParams.append('search', params.search);
    }
    if (params?.employer_type) {
      queryParams.append('employer_type', params.employer_type);
    }
    if (params?.is_pilot_employer !== undefined) {
      queryParams.append('is_pilot_employer', params.is_pilot_employer.toString());
    }
    const response = await api.get(
      `/auth/admin/employer/applications/?${queryParams.toString()}`
    );
    return unwrapResponse<PaginatedResponse<EmployerApplication>>(response.data);
  },

  async getEmployerApplication(id: number): Promise<EmployerApplication> {
    const response = await api.get(
      `/auth/admin/employer/applications/${id}/`
    );
    return unwrapResponse<EmployerApplication>(response.data);
  },

  async approveEmployerApplication(
    id: number,
    isPilot: boolean = false
  ): Promise<EmployerApplication> {
    const response = await api.post(
      `/auth/admin/employer/applications/${id}/approve/`,
      { is_pilot_employer: isPilot }
    );
    return unwrapResponse<EmployerApplication>(response.data);
  },

  async rejectEmployerApplication(
    id: number,
    reason: string
  ): Promise<EmployerApplication> {
    const response = await api.post(
      `/auth/admin/employer/applications/${id}/reject/`,
      { rejection_reason: reason }
    );
    return unwrapResponse<EmployerApplication>(response.data);
  },

  // Profiles/Users Management
  async getProfiles(params?: { page?: number; search?: string; ordering?: string }): Promise<PaginatedResponse<Profile>> {
    const queryParams = new URLSearchParams();
    if (params?.page) {
      queryParams.append('page', params.page.toString());
    }
    if (params?.search) {
      queryParams.append('search', params.search);
    }
    if (params?.ordering) {
      queryParams.append('ordering', params.ordering);
    }
    const response = await api.get(`/profiles/?${queryParams.toString()}`);
    return unwrapResponse<PaginatedResponse<Profile>>(response.data);
  },

  async getProfile(id: number): Promise<Profile> {
    const response = await api.get(`/profiles/${id}/`);
    return unwrapResponse<Profile>(response.data);
  },

  async deleteProfile(id: number): Promise<void> {
    await api.delete(`/profiles/${id}/`);
  },

  // Jobs Management
  async getJobs(params?: { page?: number; search?: string; is_active?: boolean; is_featured?: boolean; ordering?: string }): Promise<PaginatedResponse<Job>> {
    const queryParams = new URLSearchParams();
    if (params?.page) {
      queryParams.append('page', params.page.toString());
    }
    if (params?.search) {
      queryParams.append('search', params.search);
    }
    if (params?.is_active !== undefined) {
      queryParams.append('is_active', params.is_active.toString());
    }
    if (params?.is_featured !== undefined) {
      queryParams.append('is_featured', params.is_featured.toString());
    }
    if (params?.ordering) {
      queryParams.append('ordering', params.ordering);
    }
    const response = await api.get(`/jobs/?${queryParams.toString()}`);
    return unwrapResponse<PaginatedResponse<Job>>(response.data);
  },

  async getJob(id: number): Promise<Job> {
    const response = await api.get(`/jobs/${id}/`);
    return unwrapResponse<Job>(response.data);
  },

  async deleteJob(id: number): Promise<void> {
    await api.delete(`/jobs/${id}/`);
  },

  async updateJob(
    id: number,
    data: Partial<Pick<Job, 'is_active' | 'is_featured'>>
  ): Promise<Job> {
    const response = await api.patch(`/jobs/${id}/`, data);
    return unwrapResponse<Job>(response.data);
  },

  // Companies Management
  async getCompanies(params?: { page?: number; search?: string; is_verified?: boolean; is_featured?: boolean; industry?: string; ordering?: string }): Promise<PaginatedResponse<Company>> {
    const queryParams = new URLSearchParams();
    if (params?.page) {
      queryParams.append('page', params.page.toString());
    }
    if (params?.search) {
      queryParams.append('search', params.search);
    }
    if (params?.is_verified !== undefined) {
      queryParams.append('is_verified', params.is_verified.toString());
    }
    if (params?.is_featured !== undefined) {
      queryParams.append('is_featured', params.is_featured.toString());
    }
    if (params?.industry) {
      queryParams.append('industry', params.industry);
    }
    if (params?.ordering) {
      queryParams.append('ordering', params.ordering);
    }
    const response = await api.get(`/companies/?${queryParams.toString()}`);
    return unwrapResponse<PaginatedResponse<Company>>(response.data);
  },

  async getCompany(id: number): Promise<Company> {
    const response = await api.get(`/companies/${id}/`);
    return unwrapResponse<Company>(response.data);
  },

  async updateCompany(id: number, data: Partial<Company>): Promise<Company> {
    const response = await api.patch(`/companies/${id}/`, data);
    return unwrapResponse<Company>(response.data);
  },

  async deleteCompany(id: number): Promise<void> {
    await api.delete(`/companies/${id}/`);
  },

  // Skills Management
  async getSkills(params?: { page?: number; search?: string; ordering?: string }): Promise<PaginatedResponse<Skill>> {
    const queryParams = new URLSearchParams();
    if (params?.page) {
      queryParams.append('page', params.page.toString());
    }
    if (params?.search) {
      queryParams.append('search', params.search);
    }
    if (params?.ordering) {
      queryParams.append('ordering', params.ordering);
    }
    const response = await api.get(`/profiles/skills/?${queryParams.toString()}`);
    return unwrapResponse<PaginatedResponse<Skill>>(response.data);
  },

  async createSkill(data: { name: string; category: 'technical' | 'soft' | 'language' | 'other' }): Promise<Skill> {
    const response = await api.post('/profiles/skills/', data);
    return unwrapResponse<Skill>(response.data);
  },

  async updateSkill(
    id: number,
    data: Partial<{ name: string; category: 'technical' | 'soft' | 'language' | 'other' }>
  ): Promise<Skill> {
    const response = await api.patch(`/profiles/skills/${id}/`, data);
    return unwrapResponse<Skill>(response.data);
  },

  async deleteSkill(id: number): Promise<void> {
    await api.delete(`/profiles/skills/${id}/`);
  },
};

export default adminService;
