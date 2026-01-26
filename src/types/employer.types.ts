import type { User, Company } from './api.types';

export interface EmployerApplication {
  id: number;
  user: User;
  company?: Company;
  organization_name: string;
  organization_type: 'company' | 'ngo' | 'government' | 'startup' | 'other';
  industry: string;
  registration_number: string;
  phone: string;
  email: string;
  address: string;
  district: string;
  document: string | null;
  reason_for_hiring: string;
  status: 'pending' | 'approved' | 'rejected';
  is_pilot: boolean;
  rejection_reason: string | null;
  submitted_at: string;
  reviewed_at: string | null;
  reviewed_by: User | null;
}

export interface EmployerApplicationFormData {
  organization_name: string;
  organization_type: EmployerApplication['organization_type'];
  industry: string;
  registration_number: string;
  phone: string;
  email: string;
  address: string;
  district: string;
  document?: File;
  reason_for_hiring: string;
}

export interface EmployerProfile {
  id: number;
  user: User;
  company: Company;
  application: EmployerApplication;
  is_active: boolean;
  created_at: string;
}

export type ApplicationStatusFilter = 'all' | 'pending' | 'reviewed' | 'shortlisted' | 'interview' | 'accepted' | 'rejected';

export interface JobFilters {
  status?: 'all' | 'active' | 'inactive';
  job_type?: string;
  search?: string;
}

export interface ApplicationFilters {
  status?: ApplicationStatusFilter;
  search?: string;
  sort_by?: 'date' | 'name' | 'ai_score';
  sort_order?: 'asc' | 'desc';
}

export interface BulkStatusUpdate {
  application_ids: number[];
  status: string;
}
