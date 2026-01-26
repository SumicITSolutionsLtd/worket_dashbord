import React from 'react';

interface SkeletonProps {
  className?: string;
}

// Base skeleton with shimmer animation
export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => (
  <div
    className={`animate-pulse bg-gray-200 rounded ${className}`}
    aria-hidden="true"
  />
);

// Text line skeleton
interface SkeletonTextProps {
  lines?: number;
  className?: string;
}

export const SkeletonText: React.FC<SkeletonTextProps> = ({ lines = 1, className = '' }) => (
  <div className={`space-y-2 ${className}`} aria-hidden="true">
    {Array.from({ length: lines }).map((_, i) => (
      <div
        key={i}
        className={`animate-pulse bg-gray-200 rounded h-4 ${
          i === lines - 1 && lines > 1 ? 'w-3/4' : 'w-full'
        }`}
      />
    ))}
  </div>
);

// Avatar skeleton
interface SkeletonAvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const avatarSizes = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16',
};

export const SkeletonAvatar: React.FC<SkeletonAvatarProps> = ({ size = 'md', className = '' }) => (
  <div
    className={`animate-pulse bg-gray-200 rounded-full ${avatarSizes[size]} ${className}`}
    aria-hidden="true"
  />
);

// Stats card skeleton
export const SkeletonStatsCard: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div
    className={`bg-white rounded-2xl border border-gray-100 p-6 ${className}`}
    aria-hidden="true"
  >
    <div className="flex items-center justify-between mb-4">
      <Skeleton className="h-10 w-10 rounded-xl" />
      <Skeleton className="h-4 w-16" />
    </div>
    <Skeleton className="h-8 w-20 mb-2" />
    <Skeleton className="h-4 w-32" />
  </div>
);

// Job card skeleton
export const SkeletonJobCard: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div
    className={`bg-white rounded-2xl border border-gray-100 p-4 ${className}`}
    aria-hidden="true"
  >
    <div className="flex gap-4">
      <Skeleton className="w-12 h-12 rounded-xl flex-shrink-0" />
      <div className="flex-1 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
      </div>
    </div>
    <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
      <Skeleton className="h-4 w-24" />
      <div className="flex gap-2">
        <Skeleton className="h-9 w-24 rounded-lg" />
        <Skeleton className="h-9 w-9 rounded-lg" />
      </div>
    </div>
  </div>
);

// Application card skeleton
export const SkeletonApplicationCard: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div
    className={`bg-white rounded-2xl border border-gray-100 p-4 ${className}`}
    aria-hidden="true"
  >
    <div className="flex gap-4">
      <SkeletonAvatar size="lg" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-56" />
        <div className="flex gap-2 items-center">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
      <div className="flex flex-col items-end gap-2">
        <Skeleton className="h-8 w-16 rounded-lg" />
        <Skeleton className="h-4 w-12" />
      </div>
    </div>
  </div>
);

// Table row skeleton
export const SkeletonTableRow: React.FC<{ columns?: number; className?: string }> = ({
  columns = 5,
  className = ''
}) => (
  <tr className={className} aria-hidden="true">
    {Array.from({ length: columns }).map((_, i) => (
      <td key={i} className="px-4 py-3">
        <Skeleton className={`h-4 ${i === 0 ? 'w-32' : 'w-20'}`} />
      </td>
    ))}
  </tr>
);

export default Skeleton;
