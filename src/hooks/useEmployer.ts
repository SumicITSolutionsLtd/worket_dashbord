import { useQuery } from '@tanstack/react-query';
import { employerService } from '../services/employer.service';
import { adminService } from '../services/admin.service';
import { useAuthStore } from '../stores/authStore';

export function useDashboardStats() {
  const { user } = useAuthStore();
  const isAdmin = user?.is_staff ?? false;

  return useQuery({
    queryKey: ['dashboardStats', isAdmin],
    queryFn: async () => {
      if (isAdmin) {
        // For admins, calculate stats from all data
        // Get first page of jobs and applications to calculate stats
        // Note: Status counts are approximations from first page
        const [jobsData, applicationsData] = await Promise.all([
          adminService.getAllJobs(),
          adminService.getAllApplications(),
        ]);

        // Count active jobs from first page (approximation)
        // For accurate count, we'd need to fetch all pages, but that's expensive
        // The API should provide these stats, but for now we'll use what we have
        const activeJobs = jobsData.results.filter((job: { is_active?: boolean }) => job.is_active !== false).length;

        // Count applications by status from first page (approximation)
        // The API should provide aggregated stats, but we'll calculate from first page
        const applications = applicationsData.results;
        const pending = applications.filter((app: { status: string }) => app.status === 'pending').length;
        const shortlisted = applications.filter((app: { status: string }) => app.status === 'shortlisted').length;
        const hired = applications.filter((app: { status: string }) => app.status === 'hired' || app.status === 'accepted').length;

        // Use total counts from API for total_jobs_posted and total_applications
        // Status counts are approximations from first page
        return {
          total_jobs_posted: jobsData.count || 0,
          active_jobs: activeJobs,
          total_applications: applicationsData.count || 0,
          pending_applications: pending,
          shortlisted_candidates: shortlisted,
          hired_candidates: hired,
        };
      } else {
        // For employers, use the employer endpoint
        return employerService.getDashboardStats();
      }
    },
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
