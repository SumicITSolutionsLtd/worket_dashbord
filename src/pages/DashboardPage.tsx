import React, { useState, useMemo } from 'react';
import { Users, UsersThree, UserPlus } from '@phosphor-icons/react';
import KPICard from '../components/dashboard/KPICard';
import ApplicationsOverviewChart from '../components/dashboard/ApplicationsOverviewChart';
import OpenPositionsDonut from '../components/dashboard/OpenPositionsDonut';
import ScheduleCard from '../components/dashboard/ScheduleCard';
import RecentApplicationsList from '../components/dashboard/RecentApplicationsList';
import TopJobsWidget from '../components/dashboard/TopJobsWidget';
import {
  useDashboardStats,
  useRecentApplications,
  useTopJobs,
} from '../hooks/useEmployer';
import { useToggleJobStatus } from '../hooks/useEmployerJobs';
import {
  DUMMY_KPI,
  DUMMY_OPEN_POSITIONS,
  DUMMY_SCHEDULE_EVENTS,
  DUMMY_SCHEDULE_MONTH,
  DUMMY_SCHEDULE_INTERVIEW_COUNT,
  DUMMY_SCHEDULE_MEETING_COUNT,
} from '../data/dashboardDummyData';
import type { TopJob } from '../types/api.types';
import type { RecentApplication } from '../types/api.types';

const DUMMY_RECENT_APPLICATIONS: RecentApplication[] = [
  {
    id: 1,
    job_title: 'Senior UI Designer',
    job_id: 1,
    applicant_name: 'Jane Doe',
    applicant_avatar: null,
    status: 'pending',
    applied_at: new Date().toISOString(),
  },
  {
    id: 2,
    job_title: 'Marketing Manager',
    job_id: 2,
    applicant_name: 'John Smith',
    applicant_avatar: null,
    status: 'shortlisted',
    applied_at: new Date().toISOString(),
  },
];

/** Map dummy open positions to TopJob shape for the donut. */
function dummyJobsForDonut(): TopJob[] {
  return DUMMY_OPEN_POSITIONS.map(({ id, title, applicants_count }) => ({
    id,
    title,
    applicants_count,
    is_active: true,
    posted_at: new Date().toISOString(),
  }));
}

const DashboardPage: React.FC = () => {
  const [togglingJobId, setTogglingJobId] = useState<number | null>(null);
  const { data: stats } = useDashboardStats();
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

  const kpiApplicants = stats?.total_applications ?? DUMMY_KPI.applicants;
  const kpiInterviewed = stats?.shortlisted_applications ?? DUMMY_KPI.interviewed;
  const kpiHired = stats?.hired_applications ?? DUMMY_KPI.hired;

  const jobsForDonut = useMemo(() => {
    if (topJobs?.length) return topJobs;
    return dummyJobsForDonut();
  }, [topJobs]);

  const applicationsForList =
    recentApplications?.length ? recentApplications : DUMMY_RECENT_APPLICATIONS;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="space-y-4">
        {/* Row 1: Three KPI cards + Open Position donut */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <KPICard
            title="Applicants"
            value={kpiApplicants}
            trend={DUMMY_KPI.trendApplicants}
            icon={<Users weight="bold" className="w-5 h-5" />}
          />
          <KPICard
            title="Interviewed"
            value={kpiInterviewed}
            trend={DUMMY_KPI.trendInterviewed}
            icon={<UsersThree weight="bold" className="w-5 h-5" />}
          />
          <KPICard
            title="Hired"
            value={kpiHired}
            trend={DUMMY_KPI.trendHired}
            icon={<UserPlus weight="bold" className="w-5 h-5" />}
          />
          <OpenPositionsDonut
            jobs={jobsForDonut}
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
              initialMonth={DUMMY_SCHEDULE_MONTH}
              eventsByDate={DUMMY_SCHEDULE_EVENTS}
              interviewCount={DUMMY_SCHEDULE_INTERVIEW_COUNT}
              meetingCount={DUMMY_SCHEDULE_MEETING_COUNT}
              className="w-full flex-1 min-h-0 flex flex-col"
            />
          </div>
        </div>

        {/* Row 3: Recent Applications + Top Jobs (optional, kept for navigation) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <RecentApplicationsList
            applications={applicationsForList}
            isLoading={isLoadingApplications}
          />
          <TopJobsWidget
            jobs={topJobs}
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
