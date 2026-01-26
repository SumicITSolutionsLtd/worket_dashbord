import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { adminService } from '../services/admin.service';
import { extractErrorMessage } from '../lib/utils';

export function useEmployerApplications(status?: string) {
  return useQuery({
    queryKey: ['adminEmployerApplications', status],
    queryFn: () => adminService.getEmployerApplications(status),
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
