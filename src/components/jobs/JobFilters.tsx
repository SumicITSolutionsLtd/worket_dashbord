import React from 'react';
import { MagnifyingGlass } from '@phosphor-icons/react';
import { Input, Select } from '../ui';
import type { JobFilters as JobFiltersType } from '../../types/employer.types';

interface JobFiltersProps {
  filters: JobFiltersType;
  onFilterChange: (filters: JobFiltersType) => void;
}

const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

const jobTypeOptions = [
  { value: '', label: 'All Types' },
  { value: 'full-time', label: 'Full Time' },
  { value: 'part-time', label: 'Part Time' },
  { value: 'contract', label: 'Contract' },
  { value: 'internship', label: 'Internship' },
  { value: 'remote', label: 'Remote' },
  { value: 'freelance', label: 'Freelance' },
];

const JobFilters: React.FC<JobFiltersProps> = ({ filters, onFilterChange }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="flex-1">
        <Input
          placeholder="Search jobs..."
          value={filters.search || ''}
          onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
          leftIcon={<MagnifyingGlass weight="bold" className="w-4 h-4" />}
        />
      </div>
      <div className="flex gap-3">
        <Select
          options={statusOptions}
          value={filters.status || 'all'}
          onChange={(e) =>
            onFilterChange({
              ...filters,
              status: e.target.value as JobFiltersType['status'],
            })
          }
          fullWidth={false}
          className="w-36"
        />
        <Select
          options={jobTypeOptions}
          value={filters.job_type || ''}
          onChange={(e) =>
            onFilterChange({ ...filters, job_type: e.target.value })
          }
          fullWidth={false}
          className="w-36"
        />
      </div>
    </div>
  );
};

export default JobFilters;
