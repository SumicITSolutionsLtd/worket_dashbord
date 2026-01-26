import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Briefcase } from '@phosphor-icons/react';
import { Button, Card, SkeletonJobCard } from '../components/ui';
import EmployerJobCard from '../components/jobs/EmployerJobCard';
import JobFilters from '../components/jobs/JobFilters';
import { useEmployerJobs, useToggleJobStatus } from '../hooks/useEmployerJobs';
import type { JobFilters as JobFiltersType } from '../types/employer.types';

const JobsPage: React.FC = () => {
  const [filters, setFilters] = useState<JobFiltersType>({
    status: 'all',
    job_type: '',
    search: '',
  });

  const { data, isLoading } = useEmployerJobs(filters);
  const toggleStatus = useToggleJobStatus();

  const jobs = data?.results || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Jobs</h1>
          <p className="text-gray-500">
            Manage your job postings and view applications
          </p>
        </div>
        <Link to="/jobs/create">
          <Button leftIcon={<Plus weight="bold" className="w-4 h-4" />}>
            Create Job
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <JobFilters filters={filters} onFilterChange={setFilters} />

      {/* Jobs List */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <SkeletonJobCard key={i} />
          ))}
        </div>
      ) : jobs.length > 0 ? (
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
                : 'Create your first job posting to start receiving applications'}
            </p>
            <Link to="/jobs/create">
              <Button leftIcon={<Plus weight="bold" className="w-4 h-4" />}>
                Create Job
              </Button>
            </Link>
          </div>
        </Card>
      )}
    </div>
  );
};

export default JobsPage;
