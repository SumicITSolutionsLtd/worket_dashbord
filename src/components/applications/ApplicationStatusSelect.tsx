import React from 'react';
import { Select } from '../ui';

interface ApplicationStatusSelectProps {
  value: string;
  onChange: (status: string) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const statusOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'reviewed', label: 'Reviewed' },
  { value: 'shortlisted', label: 'Shortlisted' },
  { value: 'interview', label: 'Interview' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'rejected', label: 'Rejected' },
];

const ApplicationStatusSelect: React.FC<ApplicationStatusSelectProps> = ({
  value,
  onChange,
  disabled,
  size = 'sm',
}) => {
  return (
    <Select
      options={statusOptions}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      size={size}
      fullWidth={false}
      className="w-32"
    />
  );
};

export default ApplicationStatusSelect;
