import React from 'react';
import { MapPin, Star, FileText, ChatCircle } from '@phosphor-icons/react';
import { Card, Badge } from '../ui';
import ApplicationStatusSelect from './ApplicationStatusSelect';
import { formatRelativeTime, getInitials } from '../../lib/utils';
import type { JobApplication } from '../../types/api.types';

interface ApplicantCardProps {
  application: JobApplication;
  isSelected?: boolean;
  onSelect?: (id: number) => void;
  onStatusChange?: (applicationId: number, status: string) => void;
  onViewNotes?: (applicationId: number) => void;
  isUpdating?: boolean;
}

const ApplicantCard: React.FC<ApplicantCardProps> = ({
  application,
  isSelected,
  onSelect,
  onStatusChange,
  onViewNotes,
  isUpdating,
}) => {
  const { applicant, applicant_profile } = application;

  return (
    <Card className={`p-4 ${isSelected ? 'ring-2 ring-primary-500' : ''}`}>
      <div className="flex gap-4">
        {/* Checkbox */}
        {onSelect && (
          <div className="flex items-start pt-1">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onSelect(application.id)}
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
          </div>
        )}

        {/* Avatar */}
        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
          {applicant.avatar ? (
            <img
              src={applicant.avatar}
              alt={applicant.full_name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span className="text-gray-600 font-medium">
              {getInitials(applicant.full_name)}
            </span>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div>
              <h4 className="font-semibold text-gray-900">{applicant.full_name}</h4>
              {(applicant_profile?.headline || applicant.headline) && (
                <p className="text-sm text-gray-600 truncate">
                  {applicant_profile?.headline || applicant.headline}
                </p>
              )}
            </div>

            {/* AI Score */}
            {application.ai_score !== null && application.ai_score !== undefined && (
              <div className="flex items-center gap-1 bg-amber-100/80 text-amber-700 px-2 py-1 rounded-lg">
                <Star weight="fill" className="w-4 h-4" />
                <span className="font-bold text-sm">{application.ai_score}</span>
              </div>
            )}
          </div>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-3">
            {applicant_profile?.location && (
              <div className="flex items-center gap-1">
                <MapPin weight="bold" className="w-4 h-4" />
                <span>{applicant_profile.location}</span>
              </div>
            )}
            <span>Applied {formatRelativeTime(application.applied_at)}</span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <ApplicationStatusSelect
              value={application.status}
              onChange={(status) => onStatusChange?.(application.id, status)}
              disabled={isUpdating}
            />

            {application.resume && (
              <a
                href={application.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700"
              >
                <FileText weight="bold" className="w-4 h-4" />
                Resume
              </a>
            )}

            {onViewNotes && (
              <button
                onClick={() => onViewNotes(application.id)}
                className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
              >
                <ChatCircle weight="bold" className="w-4 h-4" />
                Notes
              </button>
            )}
          </div>
        </div>
      </div>

      {/* AI Insights */}
      {(application.ai_strengths?.length || application.ai_weaknesses?.length) && (
        <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
          {application.ai_strengths && application.ai_strengths.length > 0 && (
            <div className="flex flex-wrap gap-1">
              <span className="text-xs text-green-600 font-medium">Strengths:</span>
              {application.ai_strengths.map((s, i) => (
                <Badge key={i} variant="success" size="sm">
                  {s}
                </Badge>
              ))}
            </div>
          )}
          {application.ai_weaknesses && application.ai_weaknesses.length > 0 && (
            <div className="flex flex-wrap gap-1">
              <span className="text-xs text-red-600 font-medium">Areas:</span>
              {application.ai_weaknesses.map((w, i) => (
                <Badge key={i} variant="danger" size="sm">
                  {w}
                </Badge>
              ))}
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

export default ApplicantCard;
