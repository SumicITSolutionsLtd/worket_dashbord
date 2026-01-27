import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useAuthStore } from '../stores/authStore';
import { isPlatformAdmin } from '../lib/auth';
import { employerService } from '../services/employer.service';
import { extractErrorMessage } from '../lib/utils';

/** Only run employer dashboard queries when user is employer and not platform admin. */
function useEmployerOnlyEnabled(): boolean {
  const user = useAuthStore((s) => s.user);
  return !!user?.is_employer && !isPlatformAdmin(user);
}

export function useDashboardStats() {
  const enabled = useEmployerOnlyEnabled();
  return useQuery({
    queryKey: ['dashboardStats'],
    queryFn: () => employerService.getDashboardStats(),
    staleTime: 1000 * 60, // 1 minute
    enabled,
  });
}

export function useRecentApplications(limit: number = 10) {
  const enabled = useEmployerOnlyEnabled();
  return useQuery({
    queryKey: ['recentApplications', limit],
    queryFn: () => employerService.getRecentApplications(limit),
    staleTime: 1000 * 30, // 30 seconds
    enabled,
  });
}

export function useTopJobs(limit: number = 5) {
  const enabled = useEmployerOnlyEnabled();
  return useQuery({
    queryKey: ['topJobs', limit],
    queryFn: () => employerService.getTopJobs(limit),
    staleTime: 1000 * 60, // 1 minute
    enabled,
  });
}

export function useSkills() {
  return useQuery({
    queryKey: ['skills'],
    queryFn: () => employerService.getSkills(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useMyEmployerApplication() {
  return useQuery({
    queryKey: ['myEmployerApplication'],
    queryFn: () => employerService.getMyApplication(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useSubmitEmployerApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FormData) => employerService.submitApplication(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myEmployerApplication'] });
      toast.success('Application submitted successfully');
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    },
  });
}

export function useCreateSkill() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ name, category }: { name: string; category?: 'technical' | 'soft' | 'language' | 'other' }) =>
      employerService.createSkill(name, category),
    onSuccess: (newSkill) => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
      toast.success(`Skill "${newSkill.name}" added`);
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    },
  });
}
