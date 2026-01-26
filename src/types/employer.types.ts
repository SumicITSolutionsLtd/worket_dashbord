import type { User, Company } from './api.types';

export interface EmployerApplication {
  id: number;
  user: User;
  reviewed_by?: User | null;
  organization_name: string;
  employer_type: 'company' | 'recruitment_agency' | 'ngo' | 'government';
  registration_number?: string;
  industry: string;
  phone_number: string;
  business_email: string;
  physical_address: string;
  district: string;
  business_registration_doc?: string | null;
  reason_for_hiring: string;
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  rejection_reason?: string | null;
  reviewed_at?: string | null;
  is_pilot_employer: boolean;
  created_at: string;
  updated_at: string;
}

export interface EmployerApplicationFormData {
  organization_name: string;
  organization_type: EmployerApplication['employer_type'];
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

export interface AdminEmployerApplicationFilters {
  status?: 'all' | 'pending' | 'under_review' | 'approved' | 'rejected';
  employer_type?: 'all' | 'company' | 'recruitment_agency' | 'ngo' | 'government';
  is_pilot_employer?: boolean;
  search?: string;
  ordering?: string;
  page?: number;
}
