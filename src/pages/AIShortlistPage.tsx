import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Brain } from '@phosphor-icons/react';
import { Button, Card, Skeleton } from '../components/ui';
import CriteriaWeightsForm from '../components/ai-shortlist/CriteriaWeightsForm';
import AIResultsPanel from '../components/ai-shortlist/AIResultsPanel';
import { useJob } from '../hooks/useEmployerJobs';
import {
  useLatestAISession,
  useAIShortlistResults,
  useStartAIShortlist,
  useApplyAIShortlist,
} from '../hooks/useAIShortlist';
import type { AIShortlistCriteria } from '../types/api.types';

const AIShortlistPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const jobId = parseInt(id || '0');

  const [selectedCandidates, setSelectedCandidates] = useState<number[]>([]);

  const { data: job, isLoading: isLoadingJob } = useJob(jobId);
  const { data: session, isLoading: isLoadingSession } = useLatestAISession(jobId);
  const { data: results } = useAIShortlistResults(
    jobId,
    session?.status === 'completed' ? session.id : null
  );
  const startAnalysis = useStartAIShortlist();
  const applyShortlist = useApplyAIShortlist();

  // Pre-select top candidates when results load
  const topCandidateIds = useMemo(() => {
    if (results?.candidates) {
      return results.candidates
        .filter((c) => c.overall_score >= 70)
        .map((c) => c.application_id);
    }
    return [];
  }, [results?.candidates]);

  // Update selected candidates when top candidates change (only once)
  React.useEffect(() => {
    if (topCandidateIds.length > 0 && selectedCandidates.length === 0) {
      setSelectedCandidates([...topCandidateIds]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topCandidateIds.length]);

  const handleStartAnalysis = (criteria: AIShortlistCriteria) => {
    startAnalysis.mutate({ jobId, criteria });
  };

  const handleToggleCandidate = (applicationId: number) => {
    setSelectedCandidates((prev) =>
      prev.includes(applicationId)
        ? prev.filter((id) => id !== applicationId)
        : [...prev, applicationId]
    );
  };

  const handleApplyShortlist = () => {
    if (session && selectedCandidates.length > 0) {
      applyShortlist.mutate(
        { jobId, sessionId: session.id, applicationIds: selectedCandidates },
        { onSuccess: () => navigate(`/jobs/${jobId}/applications`) }
      );
    }
  };

  const showCriteriaForm = !session || session.status === 'failed';
  const showResults = session && (session.status === 'processing' || session.status === 'completed');

  if (isLoadingJob || isLoadingSession) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-24 rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <Card className="p-6">
          <Skeleton className="h-6 w-40 mb-4" />
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => navigate(`/jobs/${jobId}/applications`)}
          leftIcon={<ArrowLeft weight="bold" className="w-4 h-4" />}
        >
          Back
        </Button>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100/80 rounded-xl">
            <Brain weight="bold" className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">AI Shortlist</h1>
            <p className="text-gray-500">{job?.title}</p>
          </div>
        </div>
      </div>

      {/* Info */}
      {job && (typeof job.applicants_count === 'undefined' || Number(job.applicants_count) === 0) && (
        <Card className="p-6">
          <div className="text-center text-gray-500">
            <Brain weight="light" className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No applicants to analyze yet.</p>
            <p className="text-sm">Check back once candidates have applied.</p>
          </div>
        </Card>
      )}

      {/* Criteria Form */}
      {job && typeof job.applicants_count !== 'undefined' && Number(job.applicants_count) > 0 && showCriteriaForm && (
        <div className="max-w-xl">
          <CriteriaWeightsForm
            onSubmit={handleStartAnalysis}
            isSubmitting={startAnalysis.isPending}
            initialCriteria={session?.criteria}
          />
        </div>
      )}

      {/* Results */}
      {showResults && session && (
        <AIResultsPanel
          session={session}
          candidates={results?.candidates}
          selectedCandidates={selectedCandidates}
          onToggleCandidate={handleToggleCandidate}
          onApplyShortlist={handleApplyShortlist}
          isApplying={applyShortlist.isPending}
        />
      )}
    </div>
  );
};

export default AIShortlistPage;
