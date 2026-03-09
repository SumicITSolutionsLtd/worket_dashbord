import React from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Clock,
  Users,
  PencilSimple,
  Brain,
  Eye,
  ToggleLeft,
  ToggleRight,
} from '@phosphor-icons/react';
import { Card, Badge, Button } from '../ui';
import { formatRelativeTime, getJobTypeLabel, getExperienceLevelLabel } from '../../lib/utils';
import type { Job } from '../../types/api.types';

interface EmployerJobCardProps {
  job: Job;
  onToggleStatus?: (id: number, isActive: boolean) => void;
  isToggling?: boolean;
}

const EmployerJobCard: React.FC<EmployerJobCardProps> = ({
  job,
  onToggleStatus,
  isToggling,
}) => {
  return (
    <Card className="p-4" hover>
      <div className="flex gap-4">
        {/* Company Logo */}
        <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
          {job.company.logo ? (
            <img
              src={job.company.logo}
              alt={job.company.name}
              className="w-full h-full rounded-xl object-cover"
            />
          ) : (
            <span className="text-gray-400 font-bold text-lg">
              {job.company.name[0]}
            </span>
          )}
        </div>

        {/* Job Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <h3 className="font-semibold text-gray-900 truncate">{job.title}</h3>
              <p className="text-sm text-gray-500">{job.company.name}</p>
            </div>
            <Badge
              variant={job.is_active ? 'success' : 'default'}
              dot
              pulse={job.is_active}
            >
              {job.is_active ? 'Active' : 'Inactive'}
            </Badge>
          </div>

          {/* Meta info */}
          <div className="flex flex-wrap gap-2 mb-3">
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <MapPin weight="bold" className="w-4 h-4" />
              <span>{job.location}</span>
            </div>
            <Badge variant="glass" size="sm">
              {getJobTypeLabel(job.job_type)}
            </Badge>
            <Badge variant="glass" size="sm">
              {getExperienceLevelLabel(job.experience_level)}
            </Badge>
          </div>

          {job.description?.trim() && (
            <p className="text-sm text-gray-600 line-clamp-2 mt-2 mb-2">
              {job.description.trim()}
            </p>
          )}

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Users weight="bold" className="w-4 h-4" />
              <span>{job.applicants_count} applicants</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock weight="bold" className="w-4 h-4" />
              <span>Posted {formatRelativeTime(job.posted_at)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
        <button
          onClick={() => onToggleStatus?.(job.id, !job.is_active)}
          disabled={isToggling}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50"
        >
          {job.is_active ? (
            <>
              <ToggleRight weight="fill" className="w-5 h-5 text-green-500" />
              <span>Active</span>
            </>
          ) : (
            <>
              <ToggleLeft weight="bold" className="w-5 h-5" />
              <span>Inactive</span>
            </>
          )}
        </button>

        <div className="flex items-center gap-2">
          <Link to={`/jobs/${job.id}/applications`}>
            <Button variant="secondary" size="sm" leftIcon={<Eye weight="bold" className="w-4 h-4" />}>
              View
            </Button>
          </Link>
          <Link to={`/jobs/${job.id}/ai-shortlist`}>
            <Button
              variant="glass"
              size="sm"
              leftIcon={<Brain weight="bold" className="w-4 h-4" />}
              disabled={job.applicants_count === 0}
            >
              AI
            </Button>
          </Link>
          <Link to={`/jobs/${job.id}/edit`}>
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<PencilSimple weight="bold" className="w-4 h-4" />}
            >
              Edit
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default EmployerJobCard;
