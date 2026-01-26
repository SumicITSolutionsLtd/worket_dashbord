import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Briefcase } from '@phosphor-icons/react';
import { Button, Card, SkeletonJobCard } from '../components/ui';
import EmployerJobCard from '../components/jobs/EmployerJobCard';
import JobFilters from '../components/jobs/JobFilters';
import { useEmployerJobs, useToggleJobStatus } from '../hooks/useEmployerJobs';
import { useAuth } from '../hooks/useAuth';
import type { JobFilters as JobFiltersType } from '../types/employer.types';

const JobsPage: React.FC = () => {
  const { isAdmin } = useAuth();
  const [filters, setFilters] = useState<JobFiltersType>({
    status: 'all',
    job_type: '',
    search: '',
  });

  const { data, isLoading, error } = useEmployerJobs(filters);
  const toggleStatus = useToggleJobStatus();

  const jobs = data?.results || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isAdmin ? 'All Jobs' : 'Jobs'}
          </h1>
          <p className="text-gray-500">
            {isAdmin 
              ? 'View and manage all job postings across all employers'
              : 'Manage your job postings and view applications'}
          </p>
        </div>
        {!isAdmin && (
          <Link to="/jobs/create">
            <Button leftIcon={<Plus weight="bold" className="w-4 h-4" />}>
              Create Job
            </Button>
          </Link>
        )}
      </div>

      {/* Filters */}
      <JobFilters filters={filters} onFilterChange={setFilters} />

      {/* Error Display */}
      {error && (
        <Card className="p-6 border-red-200 bg-red-50/50">
          <div className="text-center">
            <p className="text-red-600 font-medium mb-2">Error loading jobs</p>
            <p className="text-red-500 text-sm">
              {error instanceof Error ? error.message : 'An unexpected error occurred'}
            </p>
            <p className="text-xs text-red-400 mt-2">
              Check browser console for details
            </p>
          </div>
        </Card>
      )}

      {/* Jobs List */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <SkeletonJobCard key={i} />
          ))}
        </div>
      ) : jobs.length > 0 ? (
        <>
          {/* Results count */}
          {data && data.count > 0 && (
            <div className="text-sm text-gray-500 mb-4">
              Showing {jobs.length} of {data.count} {data.count === 1 ? 'job' : 'jobs'}
              {data.next && ' (more pages available)'}
            </div>
          )}
          <div className="space-y-4">
            {jobs.map((job) => (
              <EmployerJobCard
                key={job.id}
                job={job}
                onToggleStatus={(id, isActive) =>
                  toggleStatus.mutate({ id, isActive })
                }
                isToggling={toggleStatus.isPending}
              />
            ))}
          </div>
        </>
      ) : (
        <Card className="p-12">
          <div className="text-center">
            <Briefcase
              weight="light"
              className="w-16 h-16 mx-auto mb-4 text-gray-300"
            />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No jobs found
            </h3>
            <p className="text-gray-500 mb-6">
              {filters.search || filters.job_type || filters.status !== 'all'
                ? 'Try adjusting your filters'
                : isAdmin
                ? 'No jobs found across all employers'
                : 'Create your first job posting to start receiving applications'}
            </p>
            {!isAdmin && (
              <Link to="/jobs/create">
                <Button leftIcon={<Plus weight="bold" className="w-4 h-4" />}>
                  Create Job
                </Button>
              </Link>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default JobsPage;
