export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  is_employer: boolean;
  is_job_seeker: boolean;
  is_verified: boolean;
  /** Set by backend for staff/super-admin; Worket API login/me may not include it yet */
  is_staff?: boolean;
  created_at: string;
  avatar?: string | null;
  headline?: string | null;
}

export interface Skill {
  id: number;
  name: string;
  category: 'technical' | 'soft' | 'language' | 'other';
}

export interface Company {
  id: number;
  owner?: User;
  name: string;
  description: string;
  website: string;
  logo: string | null;
  cover_image: string | null;
  location: string;
  industry: string;
  employee_count: string;
  founded_year: number | null;
  is_verified: boolean;
  is_featured: boolean;
  email: string;
  phone: string;
  linkedin_url: string;
  twitter_url: string;
  followers_count: number;
  open_positions_count: number;
  created_at: string;
  updated_at: string;
}

export interface Job {
  id: number;
  company: Company;
  posted_by?: User;
  title: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  nice_to_have: string[];
  benefits: string[];
  location: string;
  job_type: 'full-time' | 'part-time' | 'contract' | 'internship' | 'remote' | 'freelance';
  experience_level: 'entry' | 'mid' | 'senior' | 'executive';
  salary_min: number | null;
  salary_max: number | null;
  salary_currency: 'UGX' | 'USD' | 'EUR' | 'GBP';
  salary_range: string;
  skills_required: Skill[];
  is_active: boolean;
  is_featured: boolean;
  applicants_count: number;
  is_saved?: boolean;
  has_applied?: boolean;
  posted_at: string;
  expires_at: string | null;
  updated_at: string;
}

export interface WorkExperience {
  id: number;
  title: string;
  company_name: string;
  location: string;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  description: string;
}

export interface Education {
  id: number;
  institution: string;
  degree: string;
  field_of_study: string;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  description: string;
}

export interface Profile {
  id: number;
  user?: User;
  headline: string;
  bio: string;
  location: string;
  avatar: string | null;
  cover_image?: string | null;
  is_open_to_work?: boolean;
  website?: string;
  linkedin_url?: string;
  github_url?: string;
  skills: Skill[];
  work_experiences?: WorkExperience[];
  educations?: Education[];
  profile_views_count?: number;
  profile_strength?: string;
  profile_strength_percentage?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ApplicationDocument {
  id: number;
  document: string;
  document_type: 'cv' | 'cover_letter' | 'supporting';
  original_filename: string;
  file_size: number;
  uploaded_at: string;
}

export interface JobApplication {
  id: number;
  job: Job;
  applicant: User;
  applicant_profile?: Profile;
  cover_letter: string;
  resume: string | null;
  documents?: ApplicationDocument[];
  status: 'pending' | 'reviewed' | 'shortlisted' | 'interview' | 'accepted' | 'rejected';
  ai_score?: number | { overall_score: number; rank: number; recommendation: string } | null;
  ai_strengths?: string[];
  ai_weaknesses?: string[];
  notes?: ApplicationNote[];
  applied_at: string;
  updated_at: string;
}

export interface ApplicationNote {
  id: number;
  author: User;
  content: string;
  created_at: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ApiResponse<T> {
  status: 'success' | 'error';
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// Dashboard types
export interface DashboardStats {
  total_jobs: number;
  active_jobs: number;
  total_applications: number;
  pending_applications: number;
  shortlisted_applications: number;
  hired_applications: number;
  /** Daily application counts (date ISO string, count). Used for chart and optional trend. */
  application_trend?: Array<{ date: string; count: number }>;
}

export interface RecentApplication {
  id: number;
  job_title: string;
  job_id: number;
  applicant_name: string;
  applicant_avatar: string | null;
  status: string;
  applied_at: string;
}

export interface TopJob {
  id: number;
  title: string;
  applicants_count: number;
  is_active: boolean;
  posted_at: string;
}

// AI Shortlist types
export interface AIShortlistCriteria {
  skills_match_weight: number;
  experience_weight: number;
  education_weight: number;
  location_weight: number;
  custom_criteria?: string;
}

export interface AIShortlistSession {
  id: number;
  job: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  criteria: AIShortlistCriteria;
  progress: number;
  total_candidates: number;
  processed_candidates: number;
  created_at: string;
  completed_at: string | null;
}

export interface AICandidate {
  application_id: number;
  applicant: User;
  applicant_profile?: Profile;
  overall_score: number;
  skills_score: number;
  experience_score: number;
  education_score: number;
  location_score: number;
  strengths: string[];
  weaknesses: string[];
  recommendation: string;
  rank: number;
}

export interface AIShortlistResults {
  session: AIShortlistSession;
  candidates: AICandidate[];
}

// Company Member types
export type CompanyMemberRole = 'owner' | 'admin' | 'recruiter' | 'member';

export interface CompanyMember {
  id: number | null;
  user: User;
  role: CompanyMemberRole;
  invited_by: User | null;
  can_post_jobs: boolean;
  can_manage_members: boolean;
  created_at: string;
}

export interface InviteMemberData {
  email: string;
  role: CompanyMemberRole;
}

// Job form types
export interface JobFormData {
  title: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  nice_to_have: string[];
  benefits: string[];
  location: string;
  job_type: Job['job_type'];
  experience_level: Job['experience_level'];
  salary_min: number | null;
  salary_max: number | null;
  salary_currency: Job['salary_currency'];
  skill_ids: number[];
  is_active: boolean;
  expires_at: string | null;
}

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
