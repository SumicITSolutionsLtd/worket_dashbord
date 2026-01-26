import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MagnifyingGlass, Eye, Briefcase } from '@phosphor-icons/react';
import { Card, Input, Select, Badge, SkeletonTableRow } from '../../components/ui';
import { useAllApplications } from '../../hooks/useAdmin';
import { useAuth } from '../../hooks/useAuth';
import { formatDate, getStatusColor } from '../../lib/utils';
import type { ApplicationStatusFilter } from '../../types/employer.types';

const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'pending', label: 'Pending' },
  { value: 'shortlisted', label: 'Shortlisted' },
  { value: 'hired', label: 'Hired' },
  { value: 'rejected', label: 'Rejected' },
];

const AllApplicationsPage: React.FC = () => {
  const { isAdmin } = useAuth();
  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
  });

  const { data, isLoading, error } = useAllApplications({
    status: filters.status !== 'all' ? (filters.status as ApplicationStatusFilter) : undefined,
    search: filters.search || undefined,
  });

  const applications = data?.results || [];

  // For non-admin users, show a message
  if (!isAdmin) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Applications</h1>
          <p className="text-gray-500">View applications for your jobs</p>
        </div>
        <Card className="p-6">
          <div className="text-center text-gray-500">
            <Briefcase weight="light" className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>Please select a job to view its applications.</p>
            <Link to="/jobs" className="mt-4 inline-block">
              <span className="text-primary-600 hover:text-primary-700 font-medium">
                Go to Jobs →
              </span>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Applications</h1>
          <p className="text-gray-500">View and manage all job applications across all jobs</p>
        </div>

        {/* Filters */}
        <Card className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <MagnifyingGlass
                weight="bold"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              />
              <Input
                type="text"
                placeholder="Search by applicant name, job title..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="pl-10"
              />
            </div>
            <Select
              options={statusOptions}
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              fullWidth
            />
          </div>
        </Card>
      </div>

      {/* Error State */}
      {error && (
        <Card className="p-6">
          <div className="text-center text-red-500">
            <p>Error loading applications. Please try again.</p>
          </div>
        </Card>
      )}

      {/* Applications Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/80">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Applicant
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Job
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Company
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Applied
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                [...Array(5)].map((_, i) => <SkeletonTableRow key={i} columns={6} />)
              ) : applications.length > 0 ? (
                applications.map((application) => (
                  <tr key={application.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                          {application.applicant?.avatar ? (
                            <img
                              src={application.applicant.avatar}
                              alt={application.applicant.full_name}
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-gray-400 font-medium">
                              {application.applicant?.first_name?.[0] || ''}
                              {application.applicant?.last_name?.[0] || ''}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {application.applicant?.full_name || 'Unknown'}
                          </p>
                          <p className="text-sm text-gray-500">{application.applicant?.email || '-'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-medium text-gray-900">{application.job?.title || '-'}</p>
                      <p className="text-sm text-gray-500">{application.job?.location || '-'}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-gray-600">{application.job?.company?.name || '-'}</p>
                    </td>
                    <td className="px-4 py-4">
                      <Badge variant={getStatusColor(application.status)}>
                        {application.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-4 text-gray-500 text-sm">
                      {application.applied_at ? formatDate(application.applied_at) : '-'}
                    </td>
                    <td className="px-4 py-4">
                      {application.job?.id ? (
                        <Link
                          to={`/jobs/${application.job.id}/applications`}
                          className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700"
                        >
                          <Eye weight="bold" className="w-4 h-4" />
                          View
                        </Link>
                      ) : (
                        <span className="text-gray-400 text-sm">-</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center">
                    <Briefcase
                      weight="light"
                      className="w-12 h-12 mx-auto mb-3 text-gray-300"
                    />
                    <p className="text-gray-500">No applications found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default AllApplicationsPage;
