import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useAuthStore } from '../stores/authStore';
import { isPlatformAdmin } from '../lib/auth';
import { jobService } from '../services/job.service';
import { extractErrorMessage } from '../lib/utils';
import type { JobFormData } from '../types/api.types';
import type { JobFilters } from '../types/employer.types';

export function useEmployerJobs(filters?: JobFilters) {
  const user = useAuthStore((s) => s.user);
  const enabled = !!user?.is_employer && !isPlatformAdmin(user);
  return useQuery({
    queryKey: ['employerJobs', filters],
    queryFn: () => jobService.getEmployerJobs(filters),
    staleTime: 1000 * 30, // 30 seconds
    enabled,
  });
}

export function useJob(id: number) {
  return useQuery({
    queryKey: ['job', id],
    queryFn: () => jobService.getJob(id),
    enabled: !!id,
  });
}

export function useCreateJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: JobFormData) => jobService.createJob(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employerJobs'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
      toast.success('Job created successfully');
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    },
  });
}

export function useUpdateJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<JobFormData> }) =>
      jobService.updateJob(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['employerJobs'] });
      queryClient.invalidateQueries({ queryKey: ['job', id] });
      toast.success('Job updated successfully');
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    },
  });
}

export function useDeleteJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => jobService.deleteJob(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employerJobs'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
      toast.success('Job deleted successfully');
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    },
  });
}

export function useToggleJobStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) =>
      jobService.toggleJobStatus(id, isActive),
    onSuccess: (_, { id, isActive }) => {
      queryClient.invalidateQueries({ queryKey: ['employerJobs'] });
      queryClient.invalidateQueries({ queryKey: ['job', id] });
      queryClient.invalidateQueries({ queryKey: ['topJobs'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
      toast.success(isActive ? 'Job activated' : 'Job deactivated');
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    },
  });
}
