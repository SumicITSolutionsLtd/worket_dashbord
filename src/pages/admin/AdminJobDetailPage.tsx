import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash, Lightning, Star } from '@phosphor-icons/react';
import { Button, Card, Badge, Modal, Skeleton } from '../../components/ui';
import { useAdminJob, useUpdateJob, useDeleteJob } from '../../hooks/useAdmin';
import { formatDate } from '../../lib/utils';

const AdminJobDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const jobId = parseInt(id || '0');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { data: job, isLoading } = useAdminJob(jobId);
  const updateJob = useUpdateJob();
  const deleteJob = useDeleteJob();

  const handleToggleActive = () => {
    if (job) updateJob.mutate({ id: job.id, data: { is_active: !job.is_active } });
  };

  const handleToggleFeatured = () => {
    if (job) updateJob.mutate({ id: job.id, data: { is_featured: !job.is_featured } });
  };

  const handleDelete = () => {
    deleteJob.mutate(jobId, { onSuccess: () => navigate('/admin/jobs') });
  };

  if (isLoading || !job) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-32 rounded-xl" />
        <Card className="p-6">
          <div className="space-y-4">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-5 w-full" />
            ))}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<ArrowLeft weight="bold" className="w-4 h-4" />}
            onClick={() => navigate('/admin/jobs')}
          >
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
            <p className="text-gray-500">
              {job.company ? job.company.name : ''} · {job.location}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<Lightning weight="bold" className="w-4 h-4" />}
            onClick={handleToggleActive}
            disabled={updateJob.isPending}
          >
            {job.is_active ? 'Deactivate' : 'Activate'}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<Star weight={job.is_featured ? 'fill' : 'regular'} className="w-4 h-4" />}
            onClick={handleToggleFeatured}
            disabled={updateJob.isPending}
          >
            {job.is_featured ? 'Unfeature' : 'Feature'}
          </Button>
          <Button
            variant="danger"
            size="sm"
            leftIcon={<Trash weight="bold" className="w-4 h-4" />}
            onClick={() => setShowDeleteModal(true)}
          >
            Delete
          </Button>
        </div>
      </div>

      <Card className="p-6 space-y-6">
        <div className="flex flex-wrap gap-2">
          <Badge variant={job.is_active ? 'success' : 'secondary'} dot>
            {job.is_active ? 'Active' : 'Inactive'}
          </Badge>
          {job.is_featured && <Badge variant="info">Featured</Badge>}
          <Badge variant="secondary">{job.job_type}</Badge>
          <Badge variant="secondary">{job.experience_level}</Badge>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase mb-2">Description</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{job.description || '—'}</p>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase mb-2">Posted</h2>
          <p className="text-gray-700">{formatDate(job.posted_at)}</p>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase mb-2">Applicants</h2>
          <p className="text-gray-700">{job.applicants_count ?? 0}</p>
        </div>
      </Card>

      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Delete Job" size="sm">
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete this job? This action cannot be undone.
          </p>
          <div className="flex gap-3 pt-4">
            <Button variant="secondary" fullWidth onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" fullWidth isLoading={deleteJob.isPending} onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminJobDetailPage;
