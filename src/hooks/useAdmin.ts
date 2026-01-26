import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { adminService } from '../services/admin.service';
import { extractErrorMessage } from '../lib/utils';

import type { AdminEmployerApplicationFilters, ApplicationFilters } from '../types/employer.types';

export function useEmployerApplications(filters?: AdminEmployerApplicationFilters) {
  return useQuery({
    queryKey: ['adminEmployerApplications', filters],
    queryFn: () => adminService.getEmployerApplications(filters),
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
      toast.success('Application approved successfully');
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

// Admin: View all applications across all jobs
export function useAllApplications(filters?: ApplicationFilters) {
  return useQuery({
    queryKey: ['adminAllApplications', filters],
    queryFn: () => adminService.getAllApplications(filters),
    staleTime: 1000 * 30, // 30 seconds
  });
}

// Admin: View all profiles/users
export function useAllProfiles(filters?: { search?: string; ordering?: string; page?: number }) {
  return useQuery({
    queryKey: ['adminAllProfiles', filters],
    queryFn: () => adminService.getAllProfiles(filters),
    staleTime: 1000 * 30, // 30 seconds
  });
}

// Admin: View all companies
export function useAllCompanies(filters?: { search?: string; industry?: string; is_verified?: boolean; is_featured?: boolean; ordering?: string; page?: number }) {
  return useQuery({
    queryKey: ['adminAllCompanies', filters],
    queryFn: () => adminService.getAllCompanies(filters),
    staleTime: 1000 * 30, // 30 seconds
  });
}

// Admin: View all courses
export function useAllCourses(filters?: { search?: string; ordering?: string; page?: number }) {
  return useQuery({
    queryKey: ['adminAllCourses', filters],
    queryFn: () => adminService.getAllCourses(filters),
    staleTime: 1000 * 30, // 30 seconds
  });
}
