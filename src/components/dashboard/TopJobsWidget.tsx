import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Briefcase, Users } from '@phosphor-icons/react';
import { Card, Badge, Skeleton } from '../ui';
import { formatRelativeTime } from '../../lib/utils';
import type { TopJob } from '../../types/api.types';

interface TopJobsWidgetProps {
  jobs?: TopJob[];
  isLoading?: boolean;
}

const SkeletonItem = () => (
  <div className="flex items-center gap-3 p-4 border-b border-gray-100 last:border-0">
    <Skeleton className="w-10 h-10 rounded-xl" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-4 w-40" />
      <Skeleton className="h-3 w-24" />
    </div>
    <Skeleton className="h-6 w-16 rounded-lg" />
  </div>
);

const TopJobsWidget: React.FC<TopJobsWidgetProps> = ({ jobs, isLoading }) => {
  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <h3 className="font-semibold text-gray-900">Top Performing Jobs</h3>
        <Link
          to="/jobs"
          className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
        >
          All jobs
          <ArrowRight weight="bold" className="w-4 h-4" />
        </Link>
      </div>

      <div className="divide-y divide-gray-100">
        {isLoading ? (
          [...Array(5)].map((_, i) => <SkeletonItem key={i} />)
        ) : jobs && jobs.length > 0 ? (
          jobs.map((job, index) => (
            <Link
              key={job.id}
              to={`/jobs/${job.id}/applications`}
              className="flex items-center gap-3 p-4 hover:bg-gray-50/80 transition-colors"
            >
              {/* Rank */}
              <div className="w-10 h-10 bg-primary-100/80 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-primary-600 font-bold">#{index + 1}</span>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-gray-900 truncate">
                    {job.title}
                  </p>
                  {!job.is_active && (
                    <Badge variant="default" size="sm">Inactive</Badge>
                  )}
                </div>
                <p className="text-sm text-gray-500">
                  Posted {formatRelativeTime(job.posted_at)}
                </p>
              </div>

              {/* Applicants count */}
              <div className="flex items-center gap-1 text-gray-600 bg-gray-100/80 px-3 py-1.5 rounded-lg">
                <Users weight="bold" className="w-4 h-4" />
                <span className="font-medium">{job.applicants_count}</span>
              </div>
            </Link>
          ))
        ) : (
          <div className="p-8 text-center text-gray-500">
            <Briefcase weight="light" className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No jobs posted yet</p>
            <Link
              to="/jobs/create"
              className="text-primary-600 hover:text-primary-700 font-medium text-sm"
            >
              Create your first job
            </Link>
          </div>
        )}
      </div>
    </Card>
  );
};

export default TopJobsWidget;
