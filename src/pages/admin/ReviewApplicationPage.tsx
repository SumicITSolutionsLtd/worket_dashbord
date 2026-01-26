import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Building,
  EnvelopeSimple,
  Phone,
  MapPin,
  FileText,
  CheckCircle,
  XCircle,
  Sparkle,
} from '@phosphor-icons/react';
import { Button, Card, Badge, Modal, Textarea, Skeleton } from '../../components/ui';
import {
  useEmployerApplication,
  useApproveEmployerApplication,
  useRejectEmployerApplication,
} from '../../hooks/useAdmin';
import { formatDate, getStatusColor } from '../../lib/utils';

// Move InfoRow outside component to avoid creating during render
interface InfoRowProps {
  icon: React.ReactNode;
  label: string;
  value: string | React.ReactNode;
}

const InfoRow: React.FC<InfoRowProps> = ({ icon, label, value }) => (
  <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
    <div className="text-gray-400 mt-0.5">{icon}</div>
    <div className="flex-1">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-medium text-gray-900">{value}</p>
    </div>
  </div>
);

const ReviewApplicationPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const applicationId = parseInt(id || '0');

  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [isPilot, setIsPilot] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  const { data: application, isLoading } = useEmployerApplication(applicationId);
  const approve = useApproveEmployerApplication();
  const reject = useRejectEmployerApplication();

  const handleApprove = () => {
    approve.mutate(
      { id: applicationId, isPilot },
      { onSuccess: () => navigate('/admin/applications') }
    );
  };

  const handleReject = () => {
    if (rejectionReason.trim()) {
      reject.mutate(
        { id: applicationId, reason: rejectionReason },
        { onSuccess: () => navigate('/admin/applications') }
      );
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-24 rounded-xl" />
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="space-y-4">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-6 w-full" />
                ))}
              </div>
            </Card>
          </div>
          <Card className="p-6">
            <Skeleton className="h-6 w-32 mb-4" />
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <Card className="p-12 text-center">
        <p className="text-gray-500">Application not found</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/admin/applications')}
            leftIcon={<ArrowLeft weight="bold" className="w-4 h-4" />}
          >
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {application.organization_name}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge
                variant={getStatusColor(application.status)}
                dot
                pulse={application.status === 'pending'}
              >
                {application.status}
              </Badge>
              {application.is_pilot_employer && (
                <Badge variant="info">
                  <Sparkle weight="fill" className="w-3 h-3 mr-1" />
                  Pilot
                </Badge>
              )}
            </div>
          </div>
        </div>

        {application.status === 'pending' && (
          <div className="flex gap-3">
            <Button
              variant="danger"
              onClick={() => setShowRejectModal(true)}
              leftIcon={<XCircle weight="bold" className="w-4 h-4" />}
            >
              Reject
            </Button>
            <Button
              onClick={() => setShowApproveModal(true)}
              leftIcon={<CheckCircle weight="bold" className="w-4 h-4" />}
            >
              Approve
            </Button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Organization Details */}
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Organization Details</h3>
            <InfoRow
              icon={<Building weight="bold" className="w-5 h-5" />}
              label="Organization Name"
              value={application.organization_name}
            />
            <InfoRow
              icon={<Building weight="bold" className="w-5 h-5" />}
              label="Organization Type"
              value={<span className="capitalize">{application.employer_type.replace('_', ' ')}</span>}
            />
            <InfoRow
              icon={<Building weight="bold" className="w-5 h-5" />}
              label="Industry"
              value={application.industry}
            />
            <InfoRow
              icon={<FileText weight="bold" className="w-5 h-5" />}
              label="Registration Number"
              value={application.registration_number || 'Not provided'}
            />
          </Card>

          {/* Contact Information */}
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Contact Information</h3>
            <InfoRow
              icon={<EnvelopeSimple weight="bold" className="w-5 h-5" />}
              label="Email"
              value={application.business_email}
            />
            <InfoRow
              icon={<Phone weight="bold" className="w-5 h-5" />}
              label="Phone"
              value={application.phone_number}
            />
            <InfoRow
              icon={<MapPin weight="bold" className="w-5 h-5" />}
              label="Address"
              value={`${application.physical_address}, ${application.district}`}
            />
          </Card>

          {/* Reason for Hiring */}
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Reason for Hiring</h3>
            <p className="text-gray-700 whitespace-pre-wrap">
              {application.reason_for_hiring}
            </p>
          </Card>

          {/* Document */}
          {application.business_registration_doc && (
            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Supporting Document</h3>
              <a
                href={application.business_registration_doc}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-primary-600 hover:text-primary-700"
              >
                <FileText weight="bold" className="w-5 h-5" />
                View Document
              </a>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Applicant Info */}
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Applicant</h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-gray-600 font-medium">
                  {application.user.first_name?.[0]}
                  {application.user.last_name?.[0]}
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-900">{application.user.full_name}</p>
                <p className="text-sm text-gray-500">{application.user.email}</p>
              </div>
            </div>
          </Card>

          {/* Timeline */}
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Timeline</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Submitted</span>
                <span className="text-gray-900">{formatDate(application.created_at)}</span>
              </div>
              {application.reviewed_at && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Reviewed</span>
                  <span className="text-gray-900">{formatDate(application.reviewed_at)}</span>
                </div>
              )}
            </div>
          </Card>

          {/* Rejection Reason */}
          {application.status === 'rejected' && application.rejection_reason && (
            <Card className="p-6 border-red-200 bg-red-50/50">
              <h3 className="font-semibold text-red-700 mb-2">Rejection Reason</h3>
              <p className="text-red-600 text-sm">{application.rejection_reason}</p>
            </Card>
          )}
        </div>
      </div>

      {/* Approve Modal */}
      <Modal
        isOpen={showApproveModal}
        onClose={() => setShowApproveModal(false)}
        title="Approve Application"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Approve <strong>{application.organization_name}</strong> as an employer?
          </p>

          <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50">
            <input
              type="checkbox"
              checked={isPilot}
              onChange={(e) => setIsPilot(e.target.checked)}
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <div>
              <p className="font-medium text-gray-900">Pilot Program</p>
              <p className="text-sm text-gray-500">
                Grant extended access and features
              </p>
            </div>
          </label>

          <div className="flex gap-3 pt-4">
            <Button
              variant="secondary"
              fullWidth
              onClick={() => setShowApproveModal(false)}
            >
              Cancel
            </Button>
            <Button
              fullWidth
              isLoading={approve.isPending}
              onClick={handleApprove}
            >
              Approve
            </Button>
          </div>
        </div>
      </Modal>

      {/* Reject Modal */}
      <Modal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        title="Reject Application"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Please provide a reason for rejecting this application.
          </p>

          <Textarea
            label="Rejection Reason"
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Explain why this application is being rejected..."
            rows={4}
            required
          />

          <div className="flex gap-3 pt-4">
            <Button
              variant="secondary"
              fullWidth
              onClick={() => setShowRejectModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              fullWidth
              isLoading={reject.isPending}
              onClick={handleReject}
              disabled={!rejectionReason.trim()}
            >
              Reject
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ReviewApplicationPage;
