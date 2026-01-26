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
        const [jobsData, applicationsData] = await Promise.all([
          adminService.getAllJobs(),
          adminService.getAllApplications(),
        ]);

        // Count active jobs
        const activeJobs = jobsData.results.filter((job: any) => job.is_active !== false).length;

        // Count applications by status
        const applications = applicationsData.results;
        const pending = applications.filter((app: any) => app.status === 'pending').length;
        const shortlisted = applications.filter((app: any) => app.status === 'shortlisted').length;
        const hired = applications.filter((app: any) => app.status === 'hired').length;

        return {
          total_jobs_posted: jobsData.count,
          active_jobs: activeJobs,
          total_applications: applicationsData.count,
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
