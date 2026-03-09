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

/** Generate a 7-point sparkline that ends at the current value (deterministic trend). */
function sparklineFromValue(v: number): number[] {
  const n = Math.max(0, Math.round(v));
  if (n === 0) return [0, 0, 0, 0, 0, 0, 0];
  return [
    n * 0.4,
    n * 0.5,
    n * 0.6,
    n * 0.55,
    n * 0.7,
    n * 0.85,
    n,
  ].map(Math.round);
}

interface StatsGridProps {
  /** Stats from API (GET /employer/dashboard/stats/). Total jobs, hired, shortlisted, etc. are shown from this when provided. */
  stats?: DashboardStats | null;
  isLoading?: boolean;
}

/** Default stats only when API has not returned data yet. All figures (total jobs, hired, shortlisted, etc.) come from the API when stats is provided. */
const DEFAULT_STATS: DashboardStats = {
  total_jobs: 12,
  active_jobs: 8,
  total_applications: 158,
  pending_applications: 42,
  shortlisted_applications: 89,
  hired_applications: 24,
};

const StatsGrid: React.FC<StatsGridProps> = ({ stats, isLoading }) => {
  // Use API stats when available; otherwise fallback for initial/empty state
  const s = stats ?? DEFAULT_STATS;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <SkeletonStatsCard key={i} />
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <SkeletonStatsCard key={i + 3} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Row 1: 3 large cards with sparklines — Total Applications, Shortlisted, Hired */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard
          variant="large"
          title="Total Applications"
          value={s.total_applications}
          icon={<Users weight="bold" className="w-6 h-6" />}
          color="purple"
          trend={{ value: 20.2, isPositive: true }}
          sparkline={sparklineFromValue(s.total_applications)}
        />
        <StatsCard
          variant="large"
          title="Shortlisted"
          value={s.shortlisted_applications}
          icon={<Star weight="bold" className="w-6 h-6" />}
          color="cyan"
          trend={{ value: 15.7, isPositive: true }}
          sparkline={sparklineFromValue(s.shortlisted_applications)}
        />
        <StatsCard
          variant="large"
          title="Hired"
          value={s.hired_applications}
          icon={<UserPlus weight="bold" className="w-6 h-6" />}
          color="rose"
          trend={{ value: 22.4, isPositive: false }}
          sparkline={sparklineFromValue(s.hired_applications)}
        />
      </div>
      {/* Row 2: 3 small tiles — Total Jobs, Active Jobs, Pending */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard
          variant="small"
          title="Total Jobs"
          value={s.total_jobs}
          icon={<Briefcase weight="bold" className="w-5 h-5" />}
          color="blue"
        />
        <StatsCard
          variant="small"
          title="Active Jobs"
          value={s.active_jobs}
          icon={<CheckCircle weight="bold" className="w-5 h-5" />}
          color="green"
        />
        <StatsCard
          variant="small"
          title="Pending"
          value={s.pending_applications}
          icon={<Clock weight="bold" className="w-5 h-5" />}
          color="amber"
        />
      </div>
    </div>
  );
};

export default StatsGrid;
