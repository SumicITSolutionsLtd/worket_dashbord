import api from '../lib/api';
import type { PaginatedResponse } from '../types/api.types';
import type { EmployerApplication } from '../types/employer.types';

export const adminService = {
  // Employer Applications
  async getEmployerApplications(
    status?: string
  ): Promise<PaginatedResponse<EmployerApplication>> {
    const params = new URLSearchParams();
    if (status && status !== 'all') {
      params.append('status', status);
    }
    const response = await api.get<PaginatedResponse<EmployerApplication>>(
      `/auth/admin/employer/applications/?${params.toString()}`
    );
    return response.data;
  },

  async getEmployerApplication(id: number): Promise<EmployerApplication> {
    const response = await api.get<EmployerApplication>(
      `/auth/admin/employer/applications/${id}/`
    );
    return response.data;
  },

  async approveEmployerApplication(
    id: number,
    isPilot: boolean = false
  ): Promise<EmployerApplication> {
    const response = await api.post<EmployerApplication>(
      `/auth/admin/employer/applications/${id}/approve/`,
      { is_pilot: isPilot }
    );
    return response.data;
  },

  async rejectEmployerApplication(
    id: number,
    reason: string
  ): Promise<EmployerApplication> {
    const response = await api.post<EmployerApplication>(
      `/auth/admin/employer/applications/${id}/reject/`,
      { rejection_reason: reason }
    );
    return response.data;
  },
};

export default adminService;
