import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Briefcase, Trash, MagnifyingGlass, Lightning, Star } from '@phosphor-icons/react';
import { Card, Badge, Button, Input, Select, SkeletonTableRow, Modal } from '../../components/ui';
import { useAdminJobs, useDeleteJob, useUpdateJob } from '../../hooks/useAdmin';
import { formatDate } from '../../lib/utils';
import type { Job } from '../../types/api.types';

const JobsManagementPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { data, isLoading } = useAdminJobs({
    page,
    search: search || undefined,
    is_active: statusFilter === 'all' ? undefined : statusFilter === 'active',
  });
  const deleteJob = useDeleteJob();
  const updateJob = useUpdateJob();
  const jobs = data?.results || [];

  const handleToggleActive = (job: Job) => {
    updateJob.mutate({ id: job.id, data: { is_active: !job.is_active } });
  };

  const handleToggleFeatured = (job: Job) => {
    updateJob.mutate({ id: job.id, data: { is_featured: !job.is_featured } });
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteJob.mutate(deleteId, {
        onSuccess: () => {
          setShowDeleteModal(false);
          setDeleteId(null);
        },
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Jobs Management</h1>
          <p className="text-gray-500">Manage all job postings on the platform</p>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            placeholder="Search jobs by title, company, or location..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            leftIcon={<MagnifyingGlass weight="bold" className="w-5 h-5" />}
            fullWidth
          />
          <Select
            options={[
              { value: 'all', label: 'All Jobs' },
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' },
            ]}
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            fullWidth
          />
        </div>
      </Card>

      {/* Jobs Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/80">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Job Title
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Company
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Applicants
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Posted
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                [...Array(5)].map((_, i) => <SkeletonTableRow key={i} columns={8} />)
              ) : jobs.length > 0 ? (
                jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-4">
                      <p className="font-medium text-gray-900">{job.title}</p>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        {job.company.logo && (
                          <img
                            src={job.company.logo}
                            alt={job.company.name}
                            className="w-6 h-6 rounded object-cover"
                          />
                        )}
                        <p className="text-gray-900">{job.company.name}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-gray-600">{job.location}</td>
                    <td className="px-4 py-4">
                      <Badge variant="secondary" size="sm">
                        {job.job_type}
                      </Badge>
                    </td>
                    <td className="px-4 py-4 text-gray-600">{job.applicants_count || 0}</td>
                    <td className="px-4 py-4">
                      <Badge
                        variant={job.is_active ? 'success' : 'secondary'}
                        dot
                      >
                        {job.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                      {job.is_featured && (
                        <Badge variant="info" size="sm" className="ml-2">
                          Featured
                        </Badge>
                      )}
                    </td>
                    <td className="px-4 py-4 text-gray-500 text-sm">
                      {formatDate(job.posted_at)}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 flex-wrap">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleActive(job)}
                          disabled={updateJob.isPending}
                          leftIcon={<Lightning weight="bold" className="w-4 h-4" />}
                          title={job.is_active ? 'Deactivate' : 'Activate'}
                        >
                          {job.is_active ? 'Deactivate' : 'Activate'}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleFeatured(job)}
                          disabled={updateJob.isPending}
                          leftIcon={<Star weight={job.is_featured ? 'fill' : 'regular'} className="w-4 h-4" />}
                          title={job.is_featured ? 'Unfeature' : 'Feature'}
                        >
                          {job.is_featured ? 'Unfeature' : 'Feature'}
                        </Button>
                        <Link to={`/admin/jobs/${job.id}`}>
                          <Button
                            variant="secondary"
                            size="sm"
                            leftIcon={<Eye weight="bold" className="w-4 h-4" />}
                          >
                            View
                          </Button>
                        </Link>
                        <Button
                          variant="danger"
                          size="sm"
                          leftIcon={<Trash weight="bold" className="w-4 h-4" />}
                          onClick={() => {
                            setDeleteId(job.id);
                            setShowDeleteModal(true);
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center">
                    <Briefcase weight="light" className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-gray-500">No jobs found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {data && (data.next || data.previous) && (
          <div className="px-4 py-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing {jobs.length} of {data.count} jobs
            </p>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={!data.previous}
              >
                Previous
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setPage((p) => p + 1)}
                disabled={!data.next}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Delete Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeleteId(null);
        }}
        title="Delete Job"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete this job? This action cannot be undone.
          </p>
          <div className="flex gap-3 pt-4">
            <Button
              variant="secondary"
              fullWidth
              onClick={() => {
                setShowDeleteModal(false);
                setDeleteId(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              fullWidth
              isLoading={deleteJob.isPending}
              onClick={handleDelete}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default JobsManagementPage;
