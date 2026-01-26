import React from 'react';
import { CheckCircle, Clock, XCircle, SpinnerGap } from '@phosphor-icons/react';
import { Card, Badge, Button } from '../ui';
import CandidateScoreCard from './CandidateScoreCard';
import type { AIShortlistSession, AICandidate } from '../../types/api.types';

interface AIResultsPanelProps {
  session: AIShortlistSession;
  candidates?: AICandidate[];
  selectedCandidates: number[];
  onToggleCandidate: (applicationId: number) => void;
  onApplyShortlist: () => void;
  isApplying?: boolean;
}

const AIResultsPanel: React.FC<AIResultsPanelProps> = ({
  session,
  candidates,
  selectedCandidates,
  onToggleCandidate,
  onApplyShortlist,
  isApplying,
}) => {
  const getStatusIcon = () => {
    switch (session.status) {
      case 'completed':
        return <CheckCircle weight="fill" className="w-6 h-6 text-green-500" />;
      case 'failed':
        return <XCircle weight="fill" className="w-6 h-6 text-red-500" />;
      case 'processing':
        return <SpinnerGap weight="bold" className="w-6 h-6 text-primary-500 animate-spin" />;
      default:
        return <Clock weight="bold" className="w-6 h-6 text-amber-500" />;
    }
  };

  const getStatusLabel = () => {
    switch (session.status) {
      case 'completed':
        return 'Analysis Complete';
      case 'failed':
        return 'Analysis Failed';
      case 'processing':
        return 'Analyzing Candidates...';
      default:
        return 'Pending';
    }
  };

  return (
    <div className="space-y-6">
      {/* Session Status */}
      <Card className="p-6">
        <div className="flex items-center gap-4 mb-4">
          {getStatusIcon()}
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{getStatusLabel()}</h3>
            <p className="text-sm text-gray-500">
              {session.processed_candidates} of {session.total_candidates} candidates
              processed
            </p>
          </div>
          <Badge
            variant={
              session.status === 'completed'
                ? 'success'
                : session.status === 'failed'
                ? 'danger'
                : 'warning'
            }
          >
            {session.status}
          </Badge>
        </div>

        {/* Progress bar */}
        {session.status === 'processing' && (
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${session.progress}%` }}
            />
          </div>
        )}
      </Card>

      {/* Results */}
      {session.status === 'completed' && candidates && (
        <>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">
              Ranked Candidates ({candidates.length})
            </h3>
            <Button
              onClick={onApplyShortlist}
              isLoading={isApplying}
              disabled={selectedCandidates.length === 0}
            >
              Apply Shortlist ({selectedCandidates.length})
            </Button>
          </div>

          <div className="space-y-4">
            {candidates.map((candidate) => (
              <CandidateScoreCard
                key={candidate.application_id}
                candidate={candidate}
                isSelected={selectedCandidates.includes(candidate.application_id)}
                onToggle={() => onToggleCandidate(candidate.application_id)}
              />
            ))}
          </div>
        </>
      )}

      {session.status === 'failed' && (
        <Card className="p-6">
          <div className="text-center text-gray-500">
            <XCircle weight="light" className="w-12 h-12 mx-auto mb-3 text-red-300" />
            <p>The AI analysis failed. Please try again.</p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default AIResultsPanel;
