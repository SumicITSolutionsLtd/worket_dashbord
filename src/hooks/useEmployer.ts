import { useQuery } from '@tanstack/react-query';
import { employerService } from '../services/employer.service';

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
