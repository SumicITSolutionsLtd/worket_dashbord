import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from '@phosphor-icons/react';
import { Button } from '../components/ui';
import JobForm from '../components/jobs/JobForm';
import { useCreateJob } from '../hooks/useEmployerJobs';
import type { JobFormData } from '../types/api.types';

const CreateJobPage: React.FC = () => {
  const navigate = useNavigate();
  const createJob = useCreateJob();

  const handleSubmit = async (data: JobFormData) => {
    try {
      await createJob.mutateAsync(data);
      navigate('/jobs');
    } catch {
      // Error is handled by the hook
    }
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
          <h1 className="text-2xl font-bold text-gray-900">Create Job</h1>
          <p className="text-gray-500">Post a new job opportunity</p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-3xl">
        <JobForm
          onSubmit={handleSubmit}
          isSubmitting={createJob.isPending}
          submitLabel="Create Job"
        />
      </div>
    </div>
  );
};

export default CreateJobPage;
