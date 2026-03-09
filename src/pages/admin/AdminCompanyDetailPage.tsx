import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Buildings,
  Trash,
  CheckCircle,
  XCircle,
  Star,
} from '@phosphor-icons/react';
import { Button, Card, Badge, Modal, Skeleton } from '../../components/ui';
import { useAdminCompany, useUpdateCompany, useDeleteCompany } from '../../hooks/useAdmin';
import { getDisplayCompanyDescription } from '../../lib/utils';

const AdminCompanyDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const companyId = parseInt(id || '0');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { data: company, isLoading } = useAdminCompany(companyId);
  const updateCompany = useUpdateCompany();
  const deleteCompany = useDeleteCompany();

  const handleToggleVerified = () => {
    if (company) updateCompany.mutate({ id: company.id, data: { is_verified: !company.is_verified } });
  };

  const handleToggleFeatured = () => {
    if (company) updateCompany.mutate({ id: company.id, data: { is_featured: !company.is_featured } });
  };

  const handleDelete = () => {
    deleteCompany.mutate(companyId, { onSuccess: () => navigate('/admin/companies') });
  };

  if (isLoading || !company) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-32 rounded-xl" />
        <Card className="p-6">
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
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
            onClick={() => navigate('/admin/companies')}
          >
            Back
          </Button>
          <div className="flex items-center gap-3">
            {company.logo ? (
              <img src={company.logo} alt={company.name} className="w-12 h-12 rounded-xl object-cover" />
            ) : (
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                <Buildings weight="bold" className="w-6 h-6 text-gray-400" />
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{company.name}</h1>
              <p className="text-gray-500">{company.industry} · {company.location}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="secondary"
            size="sm"
            leftIcon={
              company.is_verified ? (
                <XCircle weight="bold" className="w-4 h-4" />
              ) : (
                <CheckCircle weight="bold" className="w-4 h-4" />
              )
            }
            onClick={handleToggleVerified}
            disabled={updateCompany.isPending}
          >
            {company.is_verified ? 'Unverify' : 'Verify'}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<Star weight={company.is_featured ? 'fill' : 'regular'} className="w-4 h-4" />}
            onClick={handleToggleFeatured}
            disabled={updateCompany.isPending}
          >
            {company.is_featured ? 'Unfeature' : 'Feature'}
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
          <Badge variant={company.is_verified ? 'success' : 'secondary'} dot>
            {company.is_verified ? 'Verified' : 'Unverified'}
          </Badge>
          {company.is_featured && <Badge variant="info">Featured</Badge>}
          <Badge variant="secondary">{company.industry}</Badge>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase mb-2">Description</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{getDisplayCompanyDescription(company.description) || '—'}</p>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase mb-2">Contact</h2>
          <p className="text-gray-700">{company.email}</p>
          {company.website && (
            <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
              {company.website}
            </a>
          )}
        </div>
        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase mb-2">Open Positions</h2>
          <p className="text-gray-700">{company.open_positions_count ?? 0}</p>
        </div>
      </Card>

      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Delete Company" size="sm">
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete this company? This action cannot be undone.
          </p>
          <div className="flex gap-3 pt-4">
            <Button variant="secondary" fullWidth onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" fullWidth isLoading={deleteCompany.isPending} onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminCompanyDetailPage;
