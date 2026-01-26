import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Building } from '@phosphor-icons/react';
import { Card, Badge, Button, Select, SkeletonTableRow } from '../../components/ui';
import { useEmployerApplications } from '../../hooks/useAdmin';
import { formatDate, getStatusColor } from '../../lib/utils';
import type { EmployerApplication, AdminEmployerApplicationFilters } from '../../types/employer.types';

const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
];

const EmployerApplicationsPage: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'under_review' | 'approved' | 'rejected'>('pending');
  const filters: AdminEmployerApplicationFilters = {
    status: statusFilter === 'all' ? undefined : statusFilter,
  };
  const { data, isLoading } = useEmployerApplications(filters);

  const applications = data?.results || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employer Applications</h1>
          <p className="text-gray-500">Review and approve employer registrations</p>
        </div>
        <Select
          options={statusOptions}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
          fullWidth={false}
          className="w-40"
        />
      </div>

      {/* Applications Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/80">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Organization
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Applicant
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Industry
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Submitted
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                [...Array(5)].map((_, i) => <SkeletonTableRow key={i} columns={6} />)
              ) : applications.length > 0 ? (
                applications.map((app: EmployerApplication) => (
                  <tr key={app.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Building weight="bold" className="w-5 h-5 text-gray-400" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {app.organization_name}
                          </p>
                          <p className="text-sm text-gray-500 capitalize">
                            {app.employer_type.replace('_', ' ')}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-gray-900">{app.user.full_name}</p>
                      <p className="text-sm text-gray-500">{app.user.email}</p>
                    </td>
                    <td className="px-4 py-4 text-gray-600">{app.industry}</td>
                    <td className="px-4 py-4">
                      <Badge
                        variant={getStatusColor(app.status)}
                        dot
                        pulse={app.status === 'pending'}
                      >
                        {app.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-4 text-gray-500 text-sm">
                      {formatDate(app.created_at)}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <Link to={`/admin/applications/${app.id}`}>
                        <Button
                          variant="secondary"
                          size="sm"
                          leftIcon={<Eye weight="bold" className="w-4 h-4" />}
                        >
                          Review
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center">
                    <Building
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

export default EmployerApplicationsPage;
