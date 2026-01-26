import api, { unwrapResponse } from '../lib/api';
import type { PaginatedResponse, Job, JobApplication, Profile, Company, User } from '../types/api.types';
import type { EmployerApplication, AdminEmployerApplicationFilters, JobFilters, ApplicationFilters } from '../types/employer.types';

export const adminService = {
  // Employer Applications
  async getEmployerApplications(
    filters?: AdminEmployerApplicationFilters
  ): Promise<PaginatedResponse<EmployerApplication>> {
    const params = new URLSearchParams();
    if (filters?.status && filters.status !== 'all') {
      params.append('status', filters.status);
    }
    if (filters?.employer_type && filters.employer_type !== 'all') {
      params.append('employer_type', filters.employer_type);
    }
    if (filters?.is_pilot_employer !== undefined) {
      params.append('is_pilot_employer', filters.is_pilot_employer.toString());
    }
    if (filters?.search) {
      params.append('search', filters.search);
    }
    if (filters?.ordering) {
      params.append('ordering', filters.ordering);
    }
    if (filters?.page) {
      params.append('page', filters.page.toString());
    }
    const response = await api.get(
      `/auth/admin/employer/applications/?${params.toString()}`
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
  ): Promise<void> {
    await api.post(
      `/auth/admin/employer/applications/${id}/approve/`,
      { is_pilot_employer: isPilot }
    );
  },

  async rejectEmployerApplication(
    id: number,
    reason: string
  ): Promise<void> {
    await api.post(
      `/auth/admin/employer/applications/${id}/reject/`,
      { rejection_reason: reason }
    );
  },

  // Admin: View all jobs across all employers
  async getAllJobs(filters?: JobFilters): Promise<PaginatedResponse<Job>> {
    const params = new URLSearchParams();
    if (filters?.status && filters.status !== 'all') {
      params.append('is_active', filters.status === 'active' ? 'true' : 'false');
    }
    if (filters?.job_type) {
      params.append('job_type', filters.job_type);
    }
    if (filters?.search) {
      params.append('search', filters.search);
    }
    try {
      const response = await api.get(`/jobs/?${params.toString()}`);
      // The API returns paginated response directly: { count, next, previous, results }
      // response.data already contains this structure
      const result = response.data as PaginatedResponse<Job>;
      console.log('Admin getAllJobs - Response:', result);
      console.log('Admin getAllJobs - Count:', result.count);
      console.log('Admin getAllJobs - Results length:', result.results?.length);
      return result;
    } catch (error: any) {
      console.error('Admin getAllJobs - Error details:', {
        message: error?.message,
        response: error?.response?.data,
        status: error?.response?.status,
        config: error?.config,
      });
      throw error;
    }
  },

  // Admin: View all applications across all jobs
  async getAllApplications(filters?: ApplicationFilters): Promise<PaginatedResponse<JobApplication>> {
    const params = new URLSearchParams();
    if (filters?.status && filters.status !== 'all') {
      params.append('status', filters.status);
    }
    if (filters?.search) {
      params.append('search', filters.search);
    }
    if (filters?.sort_by) {
      const prefix = filters.sort_order === 'desc' ? '-' : '';
      params.append('ordering', `${prefix}${filters.sort_by}`);
    }
    const response = await api.get(`/jobs/applications/?${params.toString()}`);
    // API returns paginated response directly
    return response.data as PaginatedResponse<JobApplication>;
  },

  // Admin: View all profiles/users
  async getAllProfiles(filters?: { search?: string; ordering?: string; page?: number }): Promise<PaginatedResponse<Profile>> {
    const params = new URLSearchParams();
    if (filters?.search) {
      params.append('search', filters.search);
    }
    if (filters?.ordering) {
      params.append('ordering', filters.ordering);
    }
    if (filters?.page) {
      params.append('page', filters.page.toString());
    }
    const response = await api.get(`/profiles/?${params.toString()}`);
    // API returns paginated response directly
    return response.data as PaginatedResponse<Profile>;
  },

  // Admin: View all companies
  async getAllCompanies(filters?: { search?: string; industry?: string; is_verified?: boolean; is_featured?: boolean; ordering?: string; page?: number }): Promise<PaginatedResponse<Company>> {
    const params = new URLSearchParams();
    if (filters?.search) {
      params.append('search', filters.search);
    }
    if (filters?.industry) {
      params.append('industry', filters.industry);
    }
    if (filters?.is_verified !== undefined) {
      params.append('is_verified', filters.is_verified.toString());
    }
    if (filters?.is_featured !== undefined) {
      params.append('is_featured', filters.is_featured.toString());
    }
    if (filters?.ordering) {
      params.append('ordering', filters.ordering);
    }
    if (filters?.page) {
      params.append('page', filters.page.toString());
    }
    const response = await api.get(`/companies/?${params.toString()}`);
    // API returns paginated response directly
    return response.data as PaginatedResponse<Company>;
  },

  // Admin: View all courses
  async getAllCourses(filters?: { search?: string; ordering?: string; page?: number }): Promise<PaginatedResponse<any>> {
    const params = new URLSearchParams();
    if (filters?.search) {
      params.append('search', filters.search);
    }
    if (filters?.ordering) {
      params.append('ordering', filters.ordering);
    }
    if (filters?.page) {
      params.append('page', filters.page.toString());
    }
    const response = await api.get(`/courses/?${params.toString()}`);
    // API returns paginated response directly
    return response.data as PaginatedResponse<any>;
  },
};

export default adminService;
