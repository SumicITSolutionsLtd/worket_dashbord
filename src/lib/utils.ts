import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-UG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleString('en-UG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const then = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  }

  return formatDate(date);
}

export function formatCurrency(amount: number, currency: string = 'UGX'): string {
  return new Intl.NumberFormat('en-UG', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatSalaryRange(min: number | null, max: number | null, currency: string = 'UGX'): string {
  if (!min && !max) return 'Not specified';
  if (min && !max) return `From ${formatCurrency(min, currency)}`;
  if (!min && max) return `Up to ${formatCurrency(max, currency)}`;
  return `${formatCurrency(min!, currency)} - ${formatCurrency(max!, currency)}`;
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

export function getStatusColor(status: string): 'default' | 'success' | 'warning' | 'danger' | 'info' {
  switch (status.toLowerCase()) {
    case 'accepted':
    case 'approved':
    case 'completed':
      return 'success';
    case 'pending':
    case 'under_review':
    case 'processing':
      return 'warning';
    case 'rejected':
    case 'failed':
      return 'danger';
    case 'shortlisted':
    case 'interview':
      return 'info';
    default:
      return 'default';
  }
}

export function getJobTypeLabel(jobType: string): string {
  const labels: Record<string, string> = {
    'full-time': 'Full Time',
    'part-time': 'Part Time',
    'contract': 'Contract',
    'internship': 'Internship',
    'remote': 'Remote',
    'freelance': 'Freelance',
  };
  return labels[jobType] || jobType;
}

export function getExperienceLevelLabel(level: string): string {
  const labels: Record<string, string> = {
    'entry': 'Entry Level',
    'mid': 'Mid Level',
    'senior': 'Senior Level',
    'executive': 'Executive',
  };
  return labels[level] || level;
}

export function extractErrorMessage(error: unknown): string {
  if (typeof error === 'string') return error;

  if (error && typeof error === 'object') {
    const err = error as Record<string, unknown>;

    // Axios error with response
    if (err.response && typeof err.response === 'object') {
      const response = err.response as Record<string, unknown>;
      const status = response.status as number;
      const data = response.data;

      // Handle common HTTP status codes with friendly messages
      if (status === 404) return 'Resource not found';
      if (status === 401) return 'Please log in to continue';
      if (status === 403) return 'You do not have permission to perform this action';
      if (status === 500) return 'Server error. Please try again later.';

      // Only parse data if it's an object (not HTML string)
      if (data && typeof data === 'object') {
        const dataObj = data as Record<string, unknown>;
        if (typeof dataObj.message === 'string') return dataObj.message;
        if (typeof dataObj.detail === 'string') return dataObj.detail;
        if (typeof dataObj.error === 'string') return dataObj.error;

        // Handle field errors (only if values are strings or arrays)
        const fieldErrors = Object.entries(dataObj)
          .filter(([k, v]) => k !== 'status' && (Array.isArray(v) || typeof v === 'string'))
          .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`)
          .join('; ');
        if (fieldErrors) return fieldErrors;
      }
    }

    if (err.message && typeof err.message === 'string') {
      return err.message;
    }
  }

  return 'An unexpected error occurred';
}
