import React, { useState } from 'react';
import { MapPin, Star, FileText, ChatCircle, CaretDown, CaretUp, Briefcase, GraduationCap } from '@phosphor-icons/react';
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
  const [isExpanded, setIsExpanded] = useState(false);

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
            {application.ai_score && (
              <div className="flex items-center gap-1 bg-amber-100/80 text-amber-700 px-2 py-1 rounded-lg">
                <Star weight="fill" className="w-4 h-4" />
                <span className="font-bold text-sm">
                  {typeof application.ai_score === 'object'
                    ? application.ai_score.overall_score
                    : application.ai_score}
                </span>
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

            {/* Document links */}
            {application.documents && application.documents.length > 0 ? (
              application.documents.map((doc) => (
                <a
                  key={doc.id}
                  href={doc.document}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700"
                  title={doc.original_filename}
                >
                  <FileText weight="bold" className="w-4 h-4" />
                  {doc.document_type === 'cv' ? 'CV' : doc.document_type === 'cover_letter' ? 'Cover Letter' : doc.original_filename}
                </a>
              ))
            ) : application.resume ? (
              <a
                href={application.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700"
              >
                <FileText weight="bold" className="w-4 h-4" />
                Resume
              </a>
            ) : null}

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

      {/* Expand/Collapse Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full mt-4 pt-3 border-t border-gray-100 flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-gray-700"
      >
        {isExpanded ? (
          <>
            <CaretUp weight="bold" className="w-4 h-4" />
            Hide Details
          </>
        ) : (
          <>
            <CaretDown weight="bold" className="w-4 h-4" />
            View Full Profile
          </>
        )}
      </button>

      {/* Expanded Profile Details */}
      {isExpanded && applicant_profile && (
        <div className="mt-4 pt-4 border-t border-gray-100 space-y-6">
          {/* Cover Letter */}
          {application.cover_letter && (
            <div>
              <h5 className="text-sm font-semibold text-gray-700 mb-2">Cover Letter</h5>
              <p className="text-sm text-gray-600 whitespace-pre-wrap bg-gray-50 p-3 rounded-lg">
                {application.cover_letter}
              </p>
            </div>
          )}

          {/* Attached Documents */}
          {application.documents && application.documents.length > 0 && (
            <div>
              <h5 className="text-sm font-semibold text-gray-700 mb-2">Attached Documents</h5>
              <div className="space-y-2">
                {application.documents.map((doc) => (
                  <a
                    key={doc.id}
                    href={doc.document}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                  >
                    <FileText weight="bold" className="w-5 h-5 text-primary-600 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{doc.original_filename}</p>
                      <p className="text-xs text-gray-500">
                        {doc.document_type === 'cv' ? 'CV/Resume' : doc.document_type === 'cover_letter' ? 'Cover Letter' : 'Supporting Document'}
                        {' \u00b7 '}
                        {doc.file_size < 1024 * 1024
                          ? `${(doc.file_size / 1024).toFixed(0)}KB`
                          : `${(doc.file_size / (1024 * 1024)).toFixed(1)}MB`}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {applicant_profile.skills && applicant_profile.skills.length > 0 && (
            <div>
              <h5 className="text-sm font-semibold text-gray-700 mb-2">Skills</h5>
              <div className="flex flex-wrap gap-2">
                {applicant_profile.skills.map((skill) => (
                  <Badge key={skill.id} variant="glass" size="sm">
                    {skill.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Work Experience */}
          {applicant_profile.work_experiences && applicant_profile.work_experiences.length > 0 && (
            <div>
              <h5 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Briefcase weight="bold" className="w-4 h-4" />
                Work Experience
              </h5>
              <div className="space-y-3">
                {applicant_profile.work_experiences.map((exp) => (
                  <div key={exp.id} className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">{exp.title}</p>
                        <p className="text-sm text-gray-600">{exp.company_name}</p>
                      </div>
                      <span className="text-xs text-gray-500">
                        {exp.start_date} - {exp.is_current ? 'Present' : exp.end_date}
                      </span>
                    </div>
                    {exp.description && (
                      <p className="text-sm text-gray-600 mt-2">{exp.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {applicant_profile.educations && applicant_profile.educations.length > 0 && (
            <div>
              <h5 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <GraduationCap weight="bold" className="w-4 h-4" />
                Education
              </h5>
              <div className="space-y-3">
                {applicant_profile.educations.map((edu) => (
                  <div key={edu.id} className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">{edu.degree}</p>
                        <p className="text-sm text-gray-600">{edu.institution}</p>
                        {edu.field_of_study && (
                          <p className="text-sm text-gray-500">{edu.field_of_study}</p>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">
                        {edu.start_date} - {edu.is_current ? 'Present' : edu.end_date}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bio */}
          {applicant_profile.bio && (
            <div>
              <h5 className="text-sm font-semibold text-gray-700 mb-2">About</h5>
              <p className="text-sm text-gray-600 whitespace-pre-wrap">
                {applicant_profile.bio}
              </p>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

export default ApplicantCard;
