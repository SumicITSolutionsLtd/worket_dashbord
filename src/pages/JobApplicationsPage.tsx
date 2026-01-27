import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Brain, Users } from '@phosphor-icons/react';
import { Button, Card, SkeletonApplicationCard } from '../components/ui';
import ApplicantCard from '../components/applications/ApplicantCard';
import ApplicationFilters from '../components/applications/ApplicationFilters';
import ApplicationNotesPanel from '../components/applications/ApplicationNotesPanel';
import BulkActionBar from '../components/applications/BulkActionBar';
import { useJob } from '../hooks/useEmployerJobs';
import {
  useJobApplications,
  useUpdateApplicationStatus,
  useBulkUpdateStatus,
  useAddApplicationNote,
  useApplicationNotes,
} from '../hooks/useEmployerApplications';
import type { ApplicationFilters as ApplicationFiltersType } from '../types/employer.types';

const JobApplicationsPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const jobId = parseInt(id || '0');

  const [filters, setFilters] = useState<ApplicationFiltersType>({
    status: 'all',
    search: '',
  });
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [notesApplicationId, setNotesApplicationId] = useState<number | null>(null);

  const { data: job } = useJob(jobId);
  const { data, isLoading } = useJobApplications(jobId, filters);
  const updateStatus = useUpdateApplicationStatus();
  const bulkUpdate = useBulkUpdateStatus();
  const addNote = useAddApplicationNote();
  const { data: notes, isLoading: isLoadingNotes } = useApplicationNotes(
    jobId,
    notesApplicationId || 0
  );

  const applications = data?.results || [];

  // Calculate counts for filter tabs
  const counts = useMemo(() => {
    if (!data || !data.results) return {};
    const all = data.results.length;
    const byStatus = data.results.reduce((acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return { all, ...byStatus };
  }, [data]);

  const handleSelect = (appId: number) => {
    setSelectedIds((prev) =>
      prev.includes(appId) ? prev.filter((id) => id !== appId) : [...prev, appId]
    );
  };

  const handleStatusChange = (applicationId: number, status: string) => {
    updateStatus.mutate({ jobId, applicationId, status });
  };

  const handleBulkStatusChange = (status: string) => {
    bulkUpdate.mutate(
      { jobId, data: { application_ids: selectedIds, status } },
      { onSuccess: () => setSelectedIds([]) }
    );
  };

  const handleAddNote = (content: string) => {
    if (notesApplicationId) {
      addNote.mutate({ jobId, applicationId: notesApplicationId, content });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/jobs')}
            leftIcon={<ArrowLeft weight="bold" className="w-4 h-4" />}
          >
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Applications</h1>
            <p className="text-gray-500">{job?.title}</p>
          </div>
        </div>
        <Link to={`/jobs/${jobId}/ai-shortlist`}>
          <Button
            variant="secondary"
            leftIcon={<Brain weight="bold" className="w-4 h-4" />}
            disabled={applications.length === 0}
          >
            AI Shortlist
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <ApplicationFilters
        filters={filters}
        onFilterChange={setFilters}
        counts={counts}
      />

      {/* Applications List */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <SkeletonApplicationCard key={i} />
          ))}
        </div>
      ) : applications.length > 0 ? (
        <div className="space-y-4">
          {applications.map((app) => (
            <ApplicantCard
              key={app.id}
              application={app}
              isSelected={selectedIds.includes(app.id)}
              onSelect={handleSelect}
              onStatusChange={handleStatusChange}
              onViewNotes={setNotesApplicationId}
              isUpdating={updateStatus.isPending}
            />
          ))}
        </div>
      ) : (
        <Card className="p-12">
          <div className="text-center">
            <Users weight="light" className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No applications found
            </h3>
            <p className="text-gray-500">
              {filters.search || filters.status !== 'all'
                ? 'Try adjusting your filters'
                : 'No one has applied to this job yet'}
            </p>
          </div>
        </Card>
      )}

      {/* Bulk Action Bar */}
      <BulkActionBar
        selectedCount={selectedIds.length}
        onClearSelection={() => setSelectedIds([])}
        onBulkStatusChange={handleBulkStatusChange}
        isUpdating={bulkUpdate.isPending}
      />

      {/* Notes Panel */}
      {notesApplicationId && (
        <ApplicationNotesPanel
          applicationId={notesApplicationId}
          notes={notes}
          isLoading={isLoadingNotes}
          onClose={() => setNotesApplicationId(null)}
          onAddNote={handleAddNote}
          isAddingNote={addNote.isPending}
        />
      )}
    </div>
  );
};

export default JobApplicationsPage;
