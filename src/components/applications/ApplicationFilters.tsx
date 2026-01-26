import React from 'react';
import { MagnifyingGlass } from '@phosphor-icons/react';
import { Input } from '../ui';
import type { ApplicationFilters as ApplicationFiltersType, ApplicationStatusFilter } from '../../types/employer.types';

interface ApplicationFiltersProps {
  filters: ApplicationFiltersType;
  onFilterChange: (filters: ApplicationFiltersType) => void;
  counts?: Record<string, number>;
}

const statusTabs: { value: ApplicationStatusFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'reviewed', label: 'Reviewed' },
  { value: 'shortlisted', label: 'Shortlisted' },
  { value: 'interview', label: 'Interview' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'rejected', label: 'Rejected' },
];

const ApplicationFilters: React.FC<ApplicationFiltersProps> = ({
  filters,
  onFilterChange,
  counts = {},
}) => {
  return (
    <div className="space-y-4">
      {/* Search */}
      <Input
        placeholder="Search applicants..."
        value={filters.search || ''}
        onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
        leftIcon={<MagnifyingGlass weight="bold" className="w-4 h-4" />}
      />

      {/* Status Tabs */}
      <div className="flex flex-wrap gap-2">
        {statusTabs.map((tab) => {
          const count = tab.value === 'all' ? counts.all : counts[tab.value];
          const isActive = (filters.status || 'all') === tab.value;

          return (
            <button
              key={tab.value}
              onClick={() =>
                onFilterChange({ ...filters, status: tab.value })
              }
              className={`
                px-4 py-2 rounded-xl text-sm font-medium transition-all
                ${
                  isActive
                    ? 'bg-primary-500 text-white shadow-md'
                    : 'bg-white/80 text-gray-600 hover:bg-gray-100/80'
                }
              `}
            >
              {tab.label}
              {count !== undefined && (
                <span
                  className={`ml-1.5 px-1.5 py-0.5 rounded text-xs ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-gray-200/80 text-gray-600'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ApplicationFilters;
