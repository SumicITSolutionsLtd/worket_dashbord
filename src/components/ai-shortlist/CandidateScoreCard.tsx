import React from 'react';
import { Star, Trophy, TrendUp, TrendDown } from '@phosphor-icons/react';
import { Card, Badge } from '../ui';
import { getInitials } from '../../lib/utils';
import type { AICandidate } from '../../types/api.types';

interface CandidateScoreCardProps {
  candidate: AICandidate;
  isSelected?: boolean;
  onToggle?: () => void;
}

const getScoreColor = (score: number): string => {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-primary-600';
  if (score >= 40) return 'text-amber-600';
  return 'text-red-600';
};

const getScoreBgColor = (score: number): string => {
  if (score >= 80) return 'bg-green-100/80';
  if (score >= 60) return 'bg-primary-100/80';
  if (score >= 40) return 'bg-amber-100/80';
  return 'bg-red-100/80';
};

const ScoreBar: React.FC<{ label: string; score: number }> = ({ label, score }) => (
  <div className="space-y-1">
    <div className="flex items-center justify-between text-xs">
      <span className="text-gray-500">{label}</span>
      <span className={`font-medium ${getScoreColor(score)}`}>{score}%</span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-1.5">
      <div
        className={`h-1.5 rounded-full transition-all duration-300 ${
          score >= 80
            ? 'bg-green-500'
            : score >= 60
            ? 'bg-primary-500'
            : score >= 40
            ? 'bg-amber-500'
            : 'bg-red-500'
        }`}
        style={{ width: `${score}%` }}
      />
    </div>
  </div>
);

const CandidateScoreCard: React.FC<CandidateScoreCardProps> = ({
  candidate,
  isSelected,
  onToggle,
}) => {
  const { applicant, applicant_profile } = candidate;

  return (
    <Card className={`p-4 ${isSelected ? 'ring-2 ring-primary-500' : ''}`}>
      <div className="flex gap-4">
        {/* Checkbox & Rank */}
        <div className="flex flex-col items-center gap-2">
          {onToggle && (
            <input
              type="checkbox"
              checked={isSelected}
              onChange={onToggle}
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
          )}
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              candidate.rank <= 3 ? 'bg-amber-100/80' : 'bg-gray-100/80'
            }`}
          >
            {candidate.rank <= 3 ? (
              <Trophy
                weight="fill"
                className={`w-5 h-5 ${
                  candidate.rank === 1
                    ? 'text-amber-500'
                    : candidate.rank === 2
                    ? 'text-gray-400'
                    : 'text-amber-700'
                }`}
              />
            ) : (
              <span className="text-gray-600 font-bold">#{candidate.rank}</span>
            )}
          </div>
        </div>

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
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <h4 className="font-semibold text-gray-900">{applicant.full_name}</h4>
              {(applicant_profile?.headline || applicant.headline) && (
                <p className="text-sm text-gray-600 truncate">
                  {applicant_profile?.headline || applicant.headline}
                </p>
              )}
            </div>

            {/* Overall Score */}
            <div
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl ${getScoreBgColor(
                candidate.overall_score
              )}`}
            >
              <Star weight="fill" className={`w-4 h-4 ${getScoreColor(candidate.overall_score)}`} />
              <span className={`font-bold ${getScoreColor(candidate.overall_score)}`}>
                {candidate.overall_score}
              </span>
            </div>
          </div>

          {/* Score breakdown */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <ScoreBar label="Skills" score={candidate.skills_score} />
            <ScoreBar label="Experience" score={candidate.experience_score} />
            <ScoreBar label="Education" score={candidate.education_score} />
            <ScoreBar label="Location" score={candidate.location_score} />
          </div>

          {/* Recommendation */}
          {candidate.recommendation && (
            <p className="text-sm text-gray-600 mb-3">{candidate.recommendation}</p>
          )}

          {/* Strengths & Weaknesses */}
          <div className="flex flex-wrap gap-2">
            {candidate.strengths.slice(0, 3).map((s, i) => (
              <Badge key={i} variant="success" size="sm">
                <TrendUp weight="bold" className="w-3 h-3 mr-1" />
                {s}
              </Badge>
            ))}
            {candidate.weaknesses.slice(0, 2).map((w, i) => (
              <Badge key={i} variant="warning" size="sm">
                <TrendDown weight="bold" className="w-3 h-3 mr-1" />
                {w}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CandidateScoreCard;
