import React, { useState } from 'react';
import { MagnifyingGlass, UserCircle } from '@phosphor-icons/react';
import { Card, Input, SkeletonTableRow } from '../../components/ui';
import { useAllProfiles } from '../../hooks/useAdmin';
import { formatDate } from '../../lib/utils';

const AllUsersPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const { data, isLoading } = useAllProfiles({ search });

  const profiles = data?.results || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Users</h1>
          <p className="text-gray-500">View and manage all user profiles</p>
        </div>

        {/* Search */}
        <Card className="p-4">
          <div className="relative">
            <MagnifyingGlass
              weight="bold"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            />
            <Input
              type="text"
              placeholder="Search by name, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </Card>
      </div>

      {/* Users Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/80">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Headline
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                [...Array(5)].map((_, i) => <SkeletonTableRow key={i} columns={5} />)
              ) : profiles.length > 0 ? (
                profiles.map((profile) => (
                  <tr key={profile.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                          {profile.avatar ? (
                            <img
                              src={profile.avatar}
                              alt={profile.user.full_name}
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            <UserCircle weight="bold" className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{profile.user.full_name}</p>
                          <p className="text-sm text-gray-500">
                            {profile.user.is_employer && 'Employer'}
                            {profile.user.is_employer && profile.user.is_job_seeker && ' • '}
                            {profile.user.is_job_seeker && 'Job Seeker'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-gray-600">{profile.user.email}</td>
                    <td className="px-4 py-4 text-gray-600">{profile.headline || '-'}</td>
                    <td className="px-4 py-4 text-gray-600">{profile.location || '-'}</td>
                    <td className="px-4 py-4 text-gray-500 text-sm">
                      {formatDate(profile.user.created_at)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center">
                    <UserCircle
                      weight="light"
                      className="w-12 h-12 mx-auto mb-3 text-gray-300"
                    />
                    <p className="text-gray-500">No users found</p>
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

export default AllUsersPage;
