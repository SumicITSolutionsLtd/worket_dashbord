import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from '@phosphor-icons/react';
import { Card, Badge, Skeleton, SkeletonAvatar } from '../ui';
import { formatRelativeTime, getStatusColor, getInitials } from '../../lib/utils';
import type { RecentApplication } from '../../types/api.types';

interface RecentApplicationsListProps {
  applications?: RecentApplication[];
  isLoading?: boolean;
}

const SkeletonItem = () => (
  <div className="flex items-center gap-3 p-3 border-b border-gray-100 last:border-0">
    <SkeletonAvatar size="md" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-3 w-48" />
    </div>
    <Skeleton className="h-6 w-20 rounded-full" />
  </div>
);

const RecentApplicationsList: React.FC<RecentApplicationsListProps> = ({
  applications,
  isLoading,
}) => {
  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between p-3 border-b border-gray-100">
        <h3 className="font-semibold text-gray-900 text-sm">Recent Applications</h3>
        <Link
          to="/jobs"
          className="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
        >
          View all
          <ArrowRight weight="bold" className="w-4 h-4" />
        </Link>
      </div>

      <div className="divide-y divide-gray-100">
        {isLoading ? (
          [...Array(5)].map((_, i) => <SkeletonItem key={i} />)
        ) : applications && applications.length > 0 ? (
          applications.map((app) => (
            <Link
              key={app.id}
              to={`/jobs/${app.job_id}/applications`}
              className="flex items-center gap-3 p-3 hover:bg-gray-50/80 transition-colors"
            >
              {/* Avatar */}
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                {app.applicant_avatar ? (
                  <img
                    src={app.applicant_avatar}
                    alt={app.applicant_name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-gray-600 text-sm font-medium">
                    {getInitials(app.applicant_name)}
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">
                  {app.applicant_name}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  Applied for {app.job_title}
                </p>
              </div>

              {/* Status & Time */}
              <div className="flex flex-col items-end gap-1">
                <Badge variant={getStatusColor(app.status)} size="sm">
                  {app.status}
                </Badge>
                <span className="text-xs text-gray-400">
                  {formatRelativeTime(app.applied_at)}
                </span>
              </div>
            </Link>
          ))
        ) : (
          <div className="p-8 text-center text-gray-500">
            No recent applications
          </div>
        )}
      </div>
    </Card>
  );
};

export default RecentApplicationsList;
