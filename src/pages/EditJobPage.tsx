import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from '@phosphor-icons/react';
import { Button, Card, Skeleton } from '../components/ui';
import JobForm from '../components/jobs/JobForm';
import { useJob, useUpdateJob } from '../hooks/useEmployerJobs';
import type { JobFormData } from '../types/api.types';

const EditJobPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const jobId = parseInt(id || '0');

  const { data: job, isLoading } = useJob(jobId);
  const updateJob = useUpdateJob();

  const handleSubmit = async (data: JobFormData) => {
    try {
      await updateJob.mutateAsync({ id: jobId, data });
      navigate('/jobs');
    } catch {
      // Error is handled by the hook
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-24 rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <div className="max-w-3xl space-y-6">
          <Card className="p-6">
            <Skeleton className="h-6 w-40 mb-4" />
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <Card className="p-12 text-center">
        <p className="text-gray-500">Job not found</p>
      </Card>
    );
  }

  const initialData: Partial<JobFormData> = {
    title: job.title,
    description: job.description,
    responsibilities: job.responsibilities,
    requirements: job.requirements,
    nice_to_have: job.nice_to_have,
    benefits: job.benefits,
    location: job.location,
    job_type: job.job_type,
    experience_level: job.experience_level,
    salary_min: job.salary_min,
    salary_max: job.salary_max,
    salary_currency: job.salary_currency,
    skill_ids: job.skills_required.map((s) => s.id),
    is_active: job.is_active,
    expires_at: job.expires_at,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          leftIcon={<ArrowLeft weight="bold" className="w-4 h-4" />}
        >
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Job</h1>
          <p className="text-gray-500">{job.title}</p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-3xl">
        <JobForm
          initialData={initialData}
          onSubmit={handleSubmit}
          isSubmitting={updateJob.isPending}
          submitLabel="Save Changes"
        />
      </div>
    </div>
  );
};

export default EditJobPage;
