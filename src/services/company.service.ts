import api, { unwrapResponse } from '../lib/api';
import type { Company } from '../types/api.types';

export const companyService = {
  // Get user's companies
  async getMyCompanies(): Promise<Company[]> {
    const response = await api.get('/companies/my_companies/');
    return unwrapResponse<Company[]>(response.data);
  },

  // Get a single company by ID
  async getCompany(id: number): Promise<Company> {
    const response = await api.get(`/companies/${id}/`);
    return unwrapResponse<Company>(response.data);
  },

  // Create a new company
  async createCompany(data: FormData): Promise<Company> {
    const response = await api.post('/companies/', data);
    return unwrapResponse<Company>(response.data);
  },

  // Update a company
  async updateCompany(id: number, data: FormData): Promise<Company> {
    const response = await api.patch(`/companies/${id}/`, data);
    return unwrapResponse<Company>(response.data);
  },

  // Delete a company
  async deleteCompany(id: number): Promise<void> {
    await api.delete(`/companies/${id}/`);
  },
};

export default companyService;
