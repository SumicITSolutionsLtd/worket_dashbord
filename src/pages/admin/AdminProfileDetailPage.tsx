import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Trash } from '@phosphor-icons/react';
import { Button, Card, Badge, Modal, Skeleton } from '../../components/ui';
import { useProfile, useDeleteProfile } from '../../hooks/useAdmin';

const AdminProfileDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const profileId = parseInt(id || '0');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { data: profile, isLoading } = useProfile(profileId);
  const deleteProfile = useDeleteProfile();

  const handleDelete = () => {
    deleteProfile.mutate(profileId, { onSuccess: () => navigate('/admin/profiles') });
  };

  if (isLoading || !profile) {
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
            onClick={() => navigate('/admin/profiles')}
          >
            Back
          </Button>
          <div className="flex items-center gap-3">
            {profile.user?.avatar ? (
              <img
                src={profile.user.avatar}
                alt={profile.user.full_name}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <User weight="bold" className="w-6 h-6 text-gray-400" />
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{profile.user?.full_name ?? 'Profile'}</h1>
              <p className="text-gray-500">{profile.user?.email ?? '—'}</p>
            </div>
          </div>
        </div>
        <Button
          variant="danger"
          size="sm"
          leftIcon={<Trash weight="bold" className="w-4 h-4" />}
          onClick={() => setShowDeleteModal(true)}
        >
          Delete
        </Button>
      </div>

      <Card className="p-6 space-y-6">
        <div className="flex flex-wrap gap-2">
          <Badge variant={profile.is_open_to_work ? 'success' : 'secondary'} dot>
            {profile.is_open_to_work ? 'Open to Work' : 'Not Available'}
          </Badge>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase mb-2">Headline</h2>
          <p className="text-gray-700">{profile.headline || '—'}</p>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase mb-2">Location</h2>
          <p className="text-gray-700">{profile.location || '—'}</p>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase mb-2">Bio</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{profile.bio || '—'}</p>
        </div>
        {profile.skills && profile.skills.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-gray-500 uppercase mb-2">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((s) => (
                <Badge key={s.id} variant="secondary" size="sm">
                  {s.name}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </Card>

      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Delete Profile" size="sm">
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete this profile? This action cannot be undone.
          </p>
          <div className="flex gap-3 pt-4">
            <Button variant="secondary" fullWidth onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" fullWidth isLoading={deleteProfile.isPending} onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminProfileDetailPage;
