import React from 'react';
import {
  Briefcase,
  CheckCircle,
  Users,
  Clock,
  Star,
  UserPlus,
} from '@phosphor-icons/react';
import StatsCard from './StatsCard';
import { SkeletonStatsCard } from '../ui';
import type { DashboardStats } from '../../types/api.types';

interface StatsGridProps {
  stats?: DashboardStats;
  isLoading?: boolean;
}

const StatsGrid: React.FC<StatsGridProps> = ({ stats, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => (
          <SkeletonStatsCard key={i} />
        ))}
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      <StatsCard
        title="Total Jobs"
        value={stats.total_jobs}
        icon={<Briefcase weight="bold" className="w-6 h-6" />}
        color="blue"
      />
      <StatsCard
        title="Active Jobs"
        value={stats.active_jobs}
        icon={<CheckCircle weight="bold" className="w-6 h-6" />}
        color="green"
      />
      <StatsCard
        title="Total Applications"
        value={stats.total_applications}
        icon={<Users weight="bold" className="w-6 h-6" />}
        color="purple"
      />
      <StatsCard
        title="Pending"
        value={stats.pending_applications}
        icon={<Clock weight="bold" className="w-6 h-6" />}
        color="amber"
      />
      <StatsCard
        title="Shortlisted"
        value={stats.shortlisted_applications}
        icon={<Star weight="bold" className="w-6 h-6" />}
        color="cyan"
      />
      <StatsCard
        title="Hired"
        value={stats.hired_applications}
        icon={<UserPlus weight="bold" className="w-6 h-6" />}
        color="rose"
      />
    </div>
  );
};

export default StatsGrid;
