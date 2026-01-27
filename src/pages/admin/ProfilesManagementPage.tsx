import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, User, Trash, MagnifyingGlass } from '@phosphor-icons/react';
import { Card, Badge, Button, Input, SkeletonTableRow, Modal } from '../../components/ui';
import { useProfiles, useDeleteProfile } from '../../hooks/useAdmin';

const ProfilesManagementPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { data, isLoading } = useProfiles({ page, search: search || undefined });
  const deleteProfile = useDeleteProfile();

  const profiles = data?.results || [];

  const handleDelete = () => {
    if (deleteId) {
      deleteProfile.mutate(deleteId, {
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
          <h1 className="text-2xl font-bold text-gray-900">User Profiles</h1>
          <p className="text-gray-500">Manage all user profiles on the platform</p>
        </div>
      </div>

      {/* Search */}
      <Card className="p-4">
        <Input
          placeholder="Search profiles by name, email, or headline..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          leftIcon={<MagnifyingGlass weight="bold" className="w-5 h-5" />}
          fullWidth
        />
      </Card>

      {/* Profiles Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/80">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Headline
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Skills
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
              ) : profiles.length > 0 ? (
                profiles.map((profile) => (
                  <tr key={profile.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                          {profile.user?.avatar ? (
                            <img
                              src={profile.user.avatar}
                              alt={profile.user.full_name}
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            <User weight="bold" className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {profile.user?.full_name || 'N/A'}
                          </p>
                          <p className="text-sm text-gray-500">{profile.user?.email || 'N/A'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-gray-900">{profile.headline || '—'}</p>
                    </td>
                    <td className="px-4 py-4 text-gray-600">{profile.location || '—'}</td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-1">
                        {profile.skills?.slice(0, 2).map((skill) => (
                          <Badge key={skill.id} variant="secondary" size="sm">
                            {skill.name}
                          </Badge>
                        ))}
                        {profile.skills && profile.skills.length > 2 && (
                          <Badge variant="secondary" size="sm">
                            +{profile.skills.length - 2}
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <Badge
                        variant={profile.is_open_to_work ? 'success' : 'secondary'}
                        dot
                      >
                        {profile.is_open_to_work ? 'Open to Work' : 'Not Available'}
                      </Badge>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/admin/profiles/${profile.id}`}>
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
                            setDeleteId(profile.id);
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
                    <User weight="light" className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-gray-500">No profiles found</p>
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
              Showing {profiles.length} of {data.count} profiles
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
        title="Delete Profile"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete this profile? This action cannot be undone.
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
              isLoading={deleteProfile.isPending}
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

export default ProfilesManagementPage;
