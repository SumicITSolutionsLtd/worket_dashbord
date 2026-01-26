import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { employerService } from '../services/employer.service';
import { extractErrorMessage } from '../lib/utils';

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboardStats'],
    queryFn: () => employerService.getDashboardStats(),
    staleTime: 1000 * 60, // 1 minute
  });
}

export function useRecentApplications(limit: number = 10) {
  return useQuery({
    queryKey: ['recentApplications', limit],
    queryFn: () => employerService.getRecentApplications(limit),
    staleTime: 1000 * 30, // 30 seconds
  });
}

export function useTopJobs(limit: number = 5) {
  return useQuery({
    queryKey: ['topJobs', limit],
    queryFn: () => employerService.getTopJobs(limit),
    staleTime: 1000 * 60, // 1 minute
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
