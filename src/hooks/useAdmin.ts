import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { adminService } from '../services/admin.service';
import { extractErrorMessage } from '../lib/utils';

// Analytics
export function useAnalyticsDashboard() {
  return useQuery({
    queryKey: ['adminAnalyticsDashboard'],
    queryFn: () => adminService.getAnalyticsDashboard(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useMarketInsights() {
  return useQuery({
    queryKey: ['adminMarketInsights'],
    queryFn: () => adminService.getMarketInsights(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useTrendingSkills() {
  return useQuery({
    queryKey: ['adminTrendingSkills'],
    queryFn: () => adminService.getTrendingSkills(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Employer Applications
export function useEmployerApplications(
  status?: string,
  params?: { page?: number; search?: string; employer_type?: string; is_pilot_employer?: boolean }
) {
  return useQuery({
    queryKey: ['adminEmployerApplications', status, params],
    queryFn: () => adminService.getEmployerApplications(status, params),
    staleTime: 1000 * 30, // 30 seconds
  });
}

export function useEmployerApplication(id: number) {
  return useQuery({
    queryKey: ['adminEmployerApplication', id],
    queryFn: () => adminService.getEmployerApplication(id),
    enabled: !!id,
  });
}

export function useApproveEmployerApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isPilot }: { id: number; isPilot: boolean }) =>
      adminService.approveEmployerApplication(id, isPilot),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['adminEmployerApplications'] });
      queryClient.invalidateQueries({ queryKey: ['adminEmployerApplication', id] });
      toast.success('Application approved');
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    },
  });
}

export function useRejectEmployerApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason: string }) =>
      adminService.rejectEmployerApplication(id, reason),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['adminEmployerApplications'] });
      queryClient.invalidateQueries({ queryKey: ['adminEmployerApplication', id] });
      toast.success('Application rejected');
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    },
  });
}

// Profiles/Users
export function useProfiles(params?: { page?: number; search?: string; ordering?: string }) {
  return useQuery({
    queryKey: ['adminProfiles', params],
    queryFn: () => adminService.getProfiles(params),
    staleTime: 1000 * 30, // 30 seconds
  });
}

export function useProfile(id: number) {
  return useQuery({
    queryKey: ['adminProfile', id],
    queryFn: () => adminService.getProfile(id),
    enabled: !!id,
  });
}

export function useDeleteProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => adminService.deleteProfile(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminProfiles'] });
      toast.success('Profile deleted');
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    },
  });
}

// Jobs
export function useAdminJobs(params?: { page?: number; search?: string; is_active?: boolean; is_featured?: boolean; ordering?: string }) {
  return useQuery({
    queryKey: ['adminJobs', params],
    queryFn: () => adminService.getJobs(params),
    staleTime: 1000 * 30, // 30 seconds
  });
}

export function useAdminJob(id: number) {
  return useQuery({
    queryKey: ['adminJob', id],
    queryFn: () => adminService.getJob(id),
    enabled: !!id,
  });
}

export function useDeleteJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => adminService.deleteJob(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminJobs'] });
      toast.success('Job deleted');
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    },
  });
}

export function useUpdateJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: Partial<Pick<import('../types/api.types').Job, 'is_active' | 'is_featured'>>;
    }) => adminService.updateJob(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['adminJobs'] });
      queryClient.invalidateQueries({ queryKey: ['adminJob', id] });
      toast.success('Job updated');
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    },
  });
}

// Companies
export function useAdminCompanies(params?: { page?: number; search?: string; is_verified?: boolean; is_featured?: boolean; industry?: string; ordering?: string }) {
  return useQuery({
    queryKey: ['adminCompanies', params],
    queryFn: () => adminService.getCompanies(params),
    staleTime: 1000 * 30, // 30 seconds
  });
}

export function useAdminCompany(id: number) {
  return useQuery({
    queryKey: ['adminCompany', id],
    queryFn: () => adminService.getCompany(id),
    enabled: !!id,
  });
}

export function useUpdateCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<import('../types/api.types').Company> }) =>
      adminService.updateCompany(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['adminCompanies'] });
      queryClient.invalidateQueries({ queryKey: ['adminCompany', id] });
      toast.success('Company updated');
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    },
  });
}

export function useDeleteCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => adminService.deleteCompany(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminCompanies'] });
      toast.success('Company deleted');
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    },
  });
}

// Skills
export function useAdminSkills(params?: { page?: number; search?: string; ordering?: string }) {
  return useQuery({
    queryKey: ['adminSkills', params],
    queryFn: () => adminService.getSkills(params),
    staleTime: 1000 * 30, // 30 seconds
  });
}

export function useCreateSkill() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { name: string; category: 'technical' | 'soft' | 'language' | 'other' }) =>
      adminService.createSkill(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminSkills'] });
      toast.success('Skill created');
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    },
  });
}

export function useUpdateSkill() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: Partial<{ name: string; category: 'technical' | 'soft' | 'language' | 'other' }>;
    }) => adminService.updateSkill(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['adminSkills'] });
      queryClient.invalidateQueries({ queryKey: ['adminSkill', id] });
      toast.success('Skill updated');
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    },
  });
}

export function useDeleteSkill() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => adminService.deleteSkill(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminSkills'] });
      toast.success('Skill deleted');
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    },
  });
}
