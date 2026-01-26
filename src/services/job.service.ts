import api, { unwrapResponse } from '../lib/api';
import type {
  Job,
  JobApplication,
  ApplicationNote,
  PaginatedResponse,
  JobFormData,
  AIShortlistSession,
  AIShortlistResults,
  AIShortlistCriteria,
} from '../types/api.types';
import type { JobFilters, ApplicationFilters, BulkStatusUpdate } from '../types/employer.types';

export const jobService = {
  // Jobs
  async getEmployerJobs(filters?: JobFilters): Promise<PaginatedResponse<Job>> {
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
    const response = await api.get(`/employer/jobs/?${params.toString()}`);
    // API returns paginated response directly: { count, next, previous, results }
    return response.data as PaginatedResponse<Job>;
  },

  async getJob(id: number): Promise<Job> {
    const response = await api.get(`/employer/jobs/${id}/`);
    return unwrapResponse<Job>(response.data);
  },

  async createJob(data: JobFormData): Promise<Job> {
    const response = await api.post('/employer/jobs/', data);
    return unwrapResponse<Job>(response.data);
  },

  async updateJob(id: number, data: Partial<JobFormData>): Promise<Job> {
    const response = await api.patch(`/employer/jobs/${id}/`, data);
    return unwrapResponse<Job>(response.data);
  },

  async deleteJob(id: number): Promise<void> {
    await api.delete(`/employer/jobs/${id}/`);
  },

  async toggleJobStatus(id: number, isActive: boolean): Promise<Job> {
    const response = await api.patch(`/employer/jobs/${id}/`, { is_active: isActive });
    return unwrapResponse<Job>(response.data);
  },

  // Applications
  async getJobApplications(
    jobId: number,
    filters?: ApplicationFilters
  ): Promise<PaginatedResponse<JobApplication>> {
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
    const response = await api.get(
      `/employer/jobs/${jobId}/applications/?${params.toString()}`
    );
    return unwrapResponse<PaginatedResponse<JobApplication>>(response.data);
  },

  async getApplication(jobId: number, applicationId: number): Promise<JobApplication> {
    const response = await api.get(
      `/employer/jobs/${jobId}/applications/${applicationId}/`
    );
    return unwrapResponse<JobApplication>(response.data);
  },

  async updateApplicationStatus(
    jobId: number,
    applicationId: number,
    status: string
  ): Promise<JobApplication> {
    const response = await api.patch(
      `/employer/jobs/${jobId}/applications/${applicationId}/status/`,
      { status }
    );
    return unwrapResponse<JobApplication>(response.data);
  },

  async bulkUpdateApplicationStatus(jobId: number, data: BulkStatusUpdate): Promise<void> {
    await api.post(`/employer/jobs/${jobId}/applications/bulk-status/`, data);
  },

  // Notes
  async addApplicationNote(
    jobId: number,
    applicationId: number,
    content: string
  ): Promise<ApplicationNote> {
    const response = await api.post(
      `/employer/jobs/${jobId}/applications/${applicationId}/notes/`,
      { content }
    );
    return unwrapResponse<ApplicationNote>(response.data);
  },

  async getApplicationNotes(jobId: number, applicationId: number): Promise<ApplicationNote[]> {
    const response = await api.get(
      `/employer/jobs/${jobId}/applications/${applicationId}/notes/`
    );
    return unwrapResponse<ApplicationNote[]>(response.data);
  },

  // AI Shortlisting
  async startAIShortlist(jobId: number, criteria: AIShortlistCriteria): Promise<AIShortlistSession> {
    const response = await api.post(
      `/employer/jobs/${jobId}/ai-shortlist/`,
      criteria
    );
    return unwrapResponse<AIShortlistSession>(response.data);
  },

  async getAIShortlistSessions(jobId: number): Promise<PaginatedResponse<AIShortlistSession>> {
    const response = await api.get(
      `/employer/jobs/${jobId}/ai-shortlist/sessions/`
    );
    return unwrapResponse<PaginatedResponse<AIShortlistSession>>(response.data);
  },

  async getAIShortlistSession(jobId: number, sessionId: number): Promise<AIShortlistSession> {
    const response = await api.get(
      `/employer/jobs/${jobId}/ai-shortlist/sessions/${sessionId}/`
    );
    return unwrapResponse<AIShortlistSession>(response.data);
  },

  async getAIShortlistResults(
    jobId: number,
    sessionId: number,
    filters?: { ordering?: string; page?: number; search?: string }
  ): Promise<PaginatedResponse<any>> {
    const params = new URLSearchParams();
    if (filters?.ordering) params.append('ordering', filters.ordering);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.search) params.append('search', filters.search);
    const response = await api.get(
      `/employer/jobs/${jobId}/ai-shortlist/sessions/${sessionId}/results/?${params.toString()}`
    );
    return unwrapResponse<PaginatedResponse<any>>(response.data);
  },

  async applyAIShortlist(
    jobId: number,
    sessionId: number,
    topN: number,
    updateStatus: string = 'shortlisted'
  ): Promise<void> {
    await api.post(`/employer/jobs/${jobId}/ai-shortlist/sessions/${sessionId}/apply/`, {
      top_n: topN,
      update_status: updateStatus,
    });
  },
};

export default jobService;
