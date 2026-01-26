import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { jobService } from '../services/job.service';
import { extractErrorMessage } from '../lib/utils';
import type { AIShortlistCriteria, AICandidate, AIShortlistResult, User } from '../types/api.types';

export function useLatestAISession(jobId: number) {
  return useQuery({
    queryKey: ['latestAISession', jobId],
    queryFn: async () => {
      const session = await jobService.getLatestAISession(jobId);
      // Transform API response to match component expectations
      if (session) {
        return {
          ...session,
          total_candidates: session.total_applications ?? session.total_candidates ?? 0,
          processed_candidates: session.processed_applications ?? session.processed_candidates ?? 0,
          progress: session.progress ?? (session.progress_percentage ? parseFloat(session.progress_percentage) : 0),
        };
      }
      return null;
    },
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
  return useQuery<{ candidates: AICandidate[] }>({
    queryKey: ['aiResults', jobId, sessionId],
    queryFn: async () => {
      if (!sessionId) return { candidates: [] };
      
      const response = await jobService.getAIShortlistResults(jobId, sessionId, {
        ordering: 'rank',
      });
      
      // Transform API response to match component expectations
      // The API returns AIShortlistResult[], but we need AICandidate[]
      // For now, we'll map what we can and handle missing fields gracefully
      const candidates: AICandidate[] = (response.results || []).map((result: AIShortlistResult, index: number) => {
        // Parse scores from detailed_scores or overall_score
        const overallScore = parseFloat(result.overall_score) || 0;
        
        // Try to parse detailed_scores if it's a JSON string
        let skillsScore = 0;
        let experienceScore = 0;
        let educationScore = 0;
        let locationScore = 0;
        
        if (result.detailed_scores) {
          try {
            const scores = typeof result.detailed_scores === 'string' 
              ? JSON.parse(result.detailed_scores) 
              : result.detailed_scores;
            skillsScore = scores.skills || scores.skills_score || 0;
            experienceScore = scores.experience || scores.experience_score || 0;
            educationScore = scores.education || scores.education_score || 0;
            locationScore = scores.location || scores.location_score || 0;
          } catch {
            // If parsing fails, distribute overall score evenly
            skillsScore = overallScore * 0.3;
            experienceScore = overallScore * 0.3;
            educationScore = overallScore * 0.2;
            locationScore = overallScore * 0.2;
          }
        } else {
          // Distribute overall score evenly if no detailed scores
          skillsScore = overallScore * 0.3;
          experienceScore = overallScore * 0.3;
          educationScore = overallScore * 0.2;
          locationScore = overallScore * 0.2;
        }
        
        // Parse strengths and weaknesses
        const strengths = result.strengths 
          ? (typeof result.strengths === 'string' 
              ? (result.strengths.includes('[') ? JSON.parse(result.strengths) : result.strengths.split(','))
              : Array.isArray(result.strengths) ? result.strengths : [])
          : [];
        
        const weaknesses = result.weaknesses
          ? (typeof result.weaknesses === 'string'
              ? (result.weaknesses.includes('[') ? JSON.parse(result.weaknesses) : result.weaknesses.split(','))
              : Array.isArray(result.weaknesses) ? result.weaknesses : [])
          : [];
        
        return {
          application_id: result.application_id,
          applicant: typeof result.applicant === 'string' 
            ? { id: 0, email: '', first_name: '', last_name: '', full_name: result.applicant, is_employer: false, is_job_seeker: true, is_verified: false, is_staff: false, created_at: '' }
            : (result.applicant || { id: 0, email: '', first_name: '', last_name: '', full_name: 'Unknown', is_employer: false, is_job_seeker: true, is_verified: false, is_staff: false, created_at: '' }) as User,
          applicant_profile: undefined,
          overall_score: Math.round(overallScore),
          skills_score: Math.round(skillsScore),
          experience_score: Math.round(experienceScore),
          education_score: Math.round(educationScore),
          location_score: Math.round(locationScore),
          rank: result.rank || index + 1,
          recommendation: result.ai_recommendation,
          strengths: Array.isArray(strengths) ? strengths : [],
          weaknesses: Array.isArray(weaknesses) ? weaknesses : [],
        };
      });
      
      return { candidates };
    },
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
