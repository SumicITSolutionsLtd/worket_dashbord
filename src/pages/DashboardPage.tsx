import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Briefcase } from '@phosphor-icons/react';
import { Button } from '../components/ui';
import StatsGrid from '../components/dashboard/StatsGrid';
import RecentApplicationsList from '../components/dashboard/RecentApplicationsList';
import TopJobsWidget from '../components/dashboard/TopJobsWidget';
import {
  useDashboardStats,
  useRecentApplications,
  useTopJobs,
} from '../hooks/useEmployer';

const DashboardPage: React.FC = () => {
  const { data: stats, isLoading: isLoadingStats } = useDashboardStats();
  const { data: recentApplications, isLoading: isLoadingApplications } =
    useRecentApplications(10);
  const { data: topJobs, isLoading: isLoadingJobs } = useTopJobs(5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">
            Welcome back! Here's an overview of your hiring activity.
          </p>
        </div>
        <div className="flex gap-3">
          <Link to="/jobs">
            <Button
              variant="secondary"
              leftIcon={<Briefcase weight="bold" className="w-4 h-4" />}
            >
              View Jobs
            </Button>
          </Link>
          <Link to="/jobs/create">
            <Button leftIcon={<Plus weight="bold" className="w-4 h-4" />}>
              Create Job
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <StatsGrid stats={stats} isLoading={isLoadingStats} />

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentApplicationsList
          applications={recentApplications}
          isLoading={isLoadingApplications}
        />
        <TopJobsWidget jobs={topJobs} isLoading={isLoadingJobs} />
      </div>
    </div>
  );
};

export default DashboardPage;
