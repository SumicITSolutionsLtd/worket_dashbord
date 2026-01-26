import React from 'react';
import { X, CheckCircle, XCircle, Star, CalendarCheck } from '@phosphor-icons/react';
import { Button } from '../ui';

interface BulkActionBarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onBulkStatusChange: (status: string) => void;
  isUpdating?: boolean;
}

const BulkActionBar: React.FC<BulkActionBarProps> = ({
  selectedCount,
  onClearSelection,
  onBulkStatusChange,
  isUpdating,
}) => {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 glass-card shadow-glass-lg rounded-2xl p-4 flex items-center gap-4 z-40 animate-slide-up">
      <div className="flex items-center gap-2">
        <span className="bg-primary-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">
          {selectedCount}
        </span>
        <span className="text-gray-700 font-medium">selected</span>
        <button
          onClick={onClearSelection}
          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X weight="bold" className="w-4 h-4" />
        </button>
      </div>

      <div className="h-6 w-px bg-gray-200" />

      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onBulkStatusChange('shortlisted')}
          disabled={isUpdating}
          leftIcon={<Star weight="bold" className="w-4 h-4" />}
        >
          Shortlist
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onBulkStatusChange('interview')}
          disabled={isUpdating}
          leftIcon={<CalendarCheck weight="bold" className="w-4 h-4" />}
        >
          Interview
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onBulkStatusChange('accepted')}
          disabled={isUpdating}
          leftIcon={<CheckCircle weight="bold" className="w-4 h-4" />}
        >
          Accept
        </Button>
        <Button
          variant="danger"
          size="sm"
          onClick={() => onBulkStatusChange('rejected')}
          disabled={isUpdating}
          leftIcon={<XCircle weight="bold" className="w-4 h-4" />}
        >
          Reject
        </Button>
      </div>
    </div>
  );
};

export default BulkActionBar;
