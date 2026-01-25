import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { jobService } from '../services/job.service';
import { extractErrorMessage } from '../lib/utils';
import type { AIShortlistCriteria } from '../types/api.types';

export function useLatestAISession(jobId: number) {
  return useQuery({
    queryKey: ['latestAISession', jobId],
    queryFn: () => jobService.getLatestAISession(jobId),
    enabled: !!jobId,
    refetchInterval: (query) => {
      // Poll every 2 seconds if session is in progress
      const session = query.state.data;
      if (session && (session.status === 'pending' || session.status === 'processing')) {
        return 2000;
      }
      return false;
    },
  });
}

export function useAIShortlistSession(jobId: number, sessionId: number | null) {
  return useQuery({
    queryKey: ['aiSession', jobId, sessionId],
    queryFn: () => jobService.getAIShortlistSession(jobId, sessionId!),
    enabled: !!jobId && !!sessionId,
    refetchInterval: (query) => {
      // Poll every 2 seconds if session is in progress
      const session = query.state.data;
      if (session && (session.status === 'pending' || session.status === 'processing')) {
        return 2000;
      }
      return false;
    },
  });
}

export function useAIShortlistResults(jobId: number, sessionId: number | null) {
  return useQuery({
    queryKey: ['aiResults', jobId, sessionId],
    queryFn: () => jobService.getAIShortlistResults(jobId, sessionId!),
    enabled: !!jobId && !!sessionId,
  });
}

export function useStartAIShortlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ jobId, criteria }: { jobId: number; criteria: AIShortlistCriteria }) =>
      jobService.startAIShortlist(jobId, criteria),
    onSuccess: (_, { jobId }) => {
      queryClient.invalidateQueries({ queryKey: ['latestAISession', jobId] });
      toast.success('AI analysis started');
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    },
  });
}

export function useApplyAIShortlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      jobId,
      sessionId,
      applicationIds,
    }: {
      jobId: number;
      sessionId: number;
      applicationIds: number[];
    }) => jobService.applyAIShortlist(jobId, sessionId, applicationIds),
    onSuccess: (_, { jobId }) => {
      queryClient.invalidateQueries({ queryKey: ['jobApplications', jobId] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
      toast.success('Shortlist applied successfully');
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    },
  });
}
