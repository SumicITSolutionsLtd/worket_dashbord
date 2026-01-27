import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Eye,
  Buildings,
  Trash,
  MagnifyingGlass,
  CheckCircle,
  XCircle,
  Star,
} from '@phosphor-icons/react';
import { Card, Badge, Button, Input, Select, SkeletonTableRow, Modal } from '../../components/ui';
import { useAdminCompanies, useUpdateCompany, useDeleteCompany } from '../../hooks/useAdmin';

const CompaniesManagementPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [verifiedFilter, setVerifiedFilter] = useState<string>('all');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { data, isLoading } = useAdminCompanies({
    page,
    search: search || undefined,
    is_verified: verifiedFilter === 'all' ? undefined : verifiedFilter === 'verified',
  });
  const updateCompany = useUpdateCompany();
  const deleteCompany = useDeleteCompany();

  const companies = data?.results || [];

  const handleDelete = () => {
    if (deleteId) {
      deleteCompany.mutate(deleteId, {
        onSuccess: () => {
          setShowDeleteModal(false);
          setDeleteId(null);
        },
      });
    }
  };

  const handleToggleVerified = (company: typeof companies[0]) => {
    updateCompany.mutate({
      id: company.id,
      data: { is_verified: !company.is_verified },
    });
  };

  const handleToggleFeatured = (company: typeof companies[0]) => {
    updateCompany.mutate({
      id: company.id,
      data: { is_featured: !company.is_featured },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Companies Management</h1>
          <p className="text-gray-500">Manage all companies on the platform</p>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            placeholder="Search companies by name, industry, or location..."
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
              { value: 'all', label: 'All Companies' },
              { value: 'verified', label: 'Verified' },
              { value: 'unverified', label: 'Unverified' },
            ]}
            value={verifiedFilter}
            onChange={(e) => {
              setVerifiedFilter(e.target.value);
              setPage(1);
            }}
            fullWidth
          />
        </div>
      </Card>

      {/* Companies Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/80">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Company
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Industry
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Jobs
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                [...Array(5)].map((_, i) => <SkeletonTableRow key={i} columns={6} />)
              ) : companies.length > 0 ? (
                companies.map((company) => (
                  <tr key={company.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        {company.logo ? (
                          <img
                            src={company.logo}
                            alt={company.name}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Buildings weight="bold" className="w-5 h-5 text-gray-400" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900">{company.name}</p>
                          <p className="text-sm text-gray-500">{company.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <Badge variant="secondary" size="sm">
                        {company.industry}
                      </Badge>
                    </td>
                    <td className="px-4 py-4 text-gray-600">{company.location}</td>
                    <td className="px-4 py-4 text-gray-600">
                      {company.open_positions_count || 0}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-2">
                        <Badge
                          variant={company.is_verified ? 'success' : 'secondary'}
                          dot
                        >
                          {company.is_verified ? 'Verified' : 'Unverified'}
                        </Badge>
                        {company.is_featured && (
                          <Badge variant="info" size="sm">
                            <Star weight="fill" className="w-3 h-3 mr-1" />
                            Featured
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleVerified(company)}
                          leftIcon={
                            company.is_verified ? (
                              <XCircle weight="bold" className="w-4 h-4" />
                            ) : (
                              <CheckCircle weight="bold" className="w-4 h-4" />
                            )
                          }
                          title={company.is_verified ? 'Unverify' : 'Verify'}
                        >
                          {company.is_verified ? 'Unverify' : 'Verify'}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleFeatured(company)}
                          leftIcon={<Star weight={company.is_featured ? 'fill' : 'regular'} className="w-4 h-4" />}
                          title={company.is_featured ? 'Unfeature' : 'Feature'}
                        >
                          {company.is_featured ? 'Unfeature' : 'Feature'}
                        </Button>
                        <Link to={`/admin/companies/${company.id}`}>
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
                            setDeleteId(company.id);
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
                  <td colSpan={6} className="px-4 py-12 text-center">
                    <Buildings weight="light" className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-gray-500">No companies found</p>
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
              Showing {companies.length} of {data.count} companies
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
        title="Delete Company"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete this company? This action cannot be undone.
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
              isLoading={deleteCompany.isPending}
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

export default CompaniesManagementPage;
