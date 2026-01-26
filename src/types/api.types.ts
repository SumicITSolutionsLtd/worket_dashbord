export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  is_employer: boolean;
  is_job_seeker: boolean;
  is_verified: boolean;
  is_staff: boolean;
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
  responsibilities?: string;
  requirements?: string;
  nice_to_have?: string;
  benefits?: string;
  location: string;
  job_type: 'full-time' | 'part-time' | 'contract' | 'internship' | 'remote' | 'freelance';
  experience_level?: 'entry' | 'mid' | 'senior' | 'executive';
  salary_min?: string | number | null;
  salary_max?: string | number | null;
  salary_currency?: 'UGX' | 'USD' | 'EUR' | 'GBP';
  salary_range?: string;
  skills_required?: Skill[];
  is_active?: boolean;
  is_featured?: boolean;
  applicants_count?: number | string;
  is_saved?: boolean | string;
  has_applied?: boolean | string;
  posted_at?: string;
  expires_at?: string | null;
  updated_at?: string;
}

export interface Profile {
  id: number;
  user: User;
  headline: string;
  bio: string;
  location: string;
  avatar: string | null;
  cover_image: string | null;
  is_open_to_work: boolean;
  website: string;
  linkedin_url: string;
  github_url: string;
  skills: Skill[];
  profile_views_count: number;
  profile_strength: string;
  profile_strength_percentage: number;
  created_at: string;
  updated_at: string;
}

export interface JobApplication {
  id: number;
  job: Job;
  applicant: User;
  applicant_profile?: Profile;
  cover_letter?: string;
  resume?: string | null;
  status: 'pending' | 'reviewed' | 'shortlisted' | 'interview' | 'accepted' | 'rejected';
  ai_score?: number | string | null;
  ai_strengths?: string[];
  ai_weaknesses?: string[];
  notes?: ApplicationNote[];
  applied_at?: string;
  updated_at?: string;
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
  total_jobs_posted: number;
  active_jobs: number;
  total_applications: number;
  pending_applications: number;
  shortlisted_candidates: number;
  hired_candidates: number;
  application_trend?: Record<string, unknown>[];
  top_performing_jobs?: Record<string, unknown>[];
  companies?: Record<string, unknown>[];
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
  required_skills_weight?: number;
  experience_weight?: number;
  education_weight?: number;
  cover_letter_weight?: number;
  must_have_skills?: string[];
  top_candidates_to_shortlist?: number;
  custom_criteria?: string;
}

export interface AIShortlistSession {
  id: number;
  job: number;
  job_title?: string;
  initiated_by?: User;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  custom_criteria?: string;
  criteria?: AIShortlistCriteria;
  total_applications?: number;
  total_candidates?: number;
  processed_applications?: number;
  processed_candidates?: number;
  progress_percentage?: string;
  progress?: number;
  results_summary?: string;
  error_message?: string;
  created_at: string;
  completed_at?: string | null;
}

export interface AIShortlistResult {
  id: number;
  application_id: number;
  applicant?: string;
  overall_score: string;
  detailed_scores?: string;
  strengths?: string;
  weaknesses?: string;
  ai_recommendation?: string;
  rank: number;
  created_at: string;
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
  rank: number;
  recommendation?: string;
  strengths: string[];
  weaknesses: string[];
}

export interface AIShortlistResults {
  session: AIShortlistSession;
  results: PaginatedResponse<AIShortlistResult>;
}

// Job form types
export interface JobFormData {
  company: number;
  title: string;
  description: string;
  responsibilities?: string;
  requirements?: string;
  nice_to_have?: string;
  benefits?: string;
  location: string;
  job_type: Job['job_type'];
  experience_level?: Job['experience_level'];
  salary_min?: string | number | null;
  salary_max?: string | number | null;
  salary_currency?: Job['salary_currency'];
  skill_ids?: number[];
  expires_at?: string | null;
}
