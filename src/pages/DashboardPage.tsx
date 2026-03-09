import React, { useState } from 'react';
import { Users, UsersThree, UserPlus } from '@phosphor-icons/react';
import KPICard from '../components/dashboard/KPICard';
import ApplicationsOverviewChart from '../components/dashboard/ApplicationsOverviewChart';
import OpenPositionsDonut from '../components/dashboard/OpenPositionsDonut';
import ScheduleCard from '../components/dashboard/ScheduleCard';
import RecentApplicationsList from '../components/dashboard/RecentApplicationsList';
import TopJobsWidget from '../components/dashboard/TopJobsWidget';
import { SkeletonStatsCard } from '../components/ui';
import {
  useDashboardStats,
  useRecentApplications,
  useTopJobs,
} from '../hooks/useEmployer';
import { useToggleJobStatus } from '../hooks/useEmployerJobs';

const DashboardPage: React.FC = () => {
  const [togglingJobId, setTogglingJobId] = useState<number | null>(null);
  const { data: stats, isLoading: isLoadingStats } = useDashboardStats();
  const { data: recentApplications, isLoading: isLoadingApplications } =
    useRecentApplications(10);
  const { data: topJobs, isLoading: isLoadingJobs } = useTopJobs(5);
  const toggleStatus = useToggleJobStatus();

  const handleToggleStatus = (id: number, isActive: boolean) => {
    setTogglingJobId(id);
    toggleStatus.mutate(
      { id, isActive },
      { onSettled: () => setTogglingJobId(null) }
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="space-y-4">
        {/* Row 1: Three KPI cards + Open Position donut */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {isLoadingStats ? (
            <>
              <SkeletonStatsCard />
              <SkeletonStatsCard />
              <SkeletonStatsCard />
            </>
          ) : (
            <>
              <KPICard
                title="Applicants"
                value={stats?.total_applications}
                icon={<Users weight="bold" className="w-5 h-5" />}
              />
              <KPICard
                title="Interviewed"
                value={stats?.shortlisted_applications}
                icon={<UsersThree weight="bold" className="w-5 h-5" />}
              />
              <KPICard
                title="Hired"
                value={stats?.hired_applications}
                icon={<UserPlus weight="bold" className="w-5 h-5" />}
              />
            </>
          )}
          <OpenPositionsDonut
            jobs={topJobs ?? undefined}
            isLoading={isLoadingJobs}
            compact
          />
        </div>

        {/* Row 2: Overview chart | Schedule */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:items-stretch">
          <div className="lg:col-span-2">
            <ApplicationsOverviewChart stats={stats ?? undefined} />
          </div>
          <div className="lg:col-span-1 flex min-h-0">
            <ScheduleCard
              eventsByDate={{}}
              interviewCount={0}
              meetingCount={0}
              className="w-full flex-1 min-h-0 flex flex-col"
            />
          </div>
        </div>

        {/* Row 3: Recent Applications + Top Jobs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <RecentApplicationsList
            applications={recentApplications ?? undefined}
            isLoading={isLoadingApplications}
          />
          <TopJobsWidget
            jobs={topJobs ?? undefined}
            isLoading={isLoadingJobs}
            onToggleStatus={handleToggleStatus}
            togglingJobId={togglingJobId}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
