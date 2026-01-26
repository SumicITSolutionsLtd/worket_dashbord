import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { jobService } from '../services/job.service';
import { adminService } from '../services/admin.service';
import { useAuthStore } from '../stores/authStore';
import { extractErrorMessage } from '../lib/utils';
import type { JobFormData } from '../types/api.types';
import type { JobFilters } from '../types/employer.types';

export function useEmployerJobs(filters?: JobFilters) {
  const { user } = useAuthStore();
  const isAdmin = user?.is_staff ?? false;

  return useQuery({
    queryKey: ['employerJobs', filters, isAdmin],
    queryFn: async () => {
      try {
        const result = isAdmin 
          ? await adminService.getAllJobs(filters)
          : await jobService.getEmployerJobs(filters);
        console.log('Jobs API Response:', result);
        return result;
      } catch (error) {
        console.error('Error fetching jobs:', error);
        throw error;
      }
    },
    staleTime: 1000 * 30, // 30 seconds
    retry: 1,
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
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
      toast.success(isActive ? 'Job activated' : 'Job deactivated');
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    },
  });
}
