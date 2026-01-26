import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { jobService } from '../services/job.service';
import { extractErrorMessage } from '../lib/utils';
import type { ApplicationFilters, BulkStatusUpdate } from '../types/employer.types';

export function useJobApplications(jobId: number, filters?: ApplicationFilters) {
  return useQuery({
    queryKey: ['jobApplications', jobId, filters],
    queryFn: () => jobService.getJobApplications(jobId, filters),
    enabled: !!jobId,
    staleTime: 1000 * 30, // 30 seconds
  });
}

export function useApplication(jobId: number, applicationId: number) {
  return useQuery({
    queryKey: ['application', jobId, applicationId],
    queryFn: () => jobService.getApplication(jobId, applicationId),
    enabled: !!jobId && !!applicationId,
  });
}

export function useUpdateApplicationStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      jobId,
      applicationId,
      status,
    }: {
      jobId: number;
      applicationId: number;
      status: string;
    }) => jobService.updateApplicationStatus(jobId, applicationId, status),
    onSuccess: (_, { jobId, applicationId }) => {
      queryClient.invalidateQueries({ queryKey: ['jobApplications', jobId] });
      queryClient.invalidateQueries({ queryKey: ['application', jobId, applicationId] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
      queryClient.invalidateQueries({ queryKey: ['recentApplications'] });
      toast.success('Application status updated');
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    },
  });
}

export function useBulkUpdateStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ jobId, data }: { jobId: number; data: BulkStatusUpdate }) =>
      jobService.bulkUpdateApplicationStatus(jobId, data),
    onSuccess: (_, { jobId }) => {
      queryClient.invalidateQueries({ queryKey: ['jobApplications', jobId] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
      queryClient.invalidateQueries({ queryKey: ['recentApplications'] });
      toast.success('Applications updated');
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    },
  });
}

export function useAddApplicationNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      jobId,
      applicationId,
      content,
    }: {
      jobId: number;
      applicationId: number;
      content: string;
    }) => jobService.addApplicationNote(jobId, applicationId, content),
    onSuccess: (_, { jobId, applicationId }) => {
      queryClient.invalidateQueries({ queryKey: ['application', jobId, applicationId] });
      queryClient.invalidateQueries({ queryKey: ['applicationNotes', jobId, applicationId] });
      toast.success('Note added');
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    },
  });
}

export function useApplicationNotes(jobId: number, applicationId: number) {
  return useQuery({
    queryKey: ['applicationNotes', jobId, applicationId],
    queryFn: () => jobService.getApplicationNotes(jobId, applicationId),
    enabled: !!jobId && !!applicationId,
  });
}
