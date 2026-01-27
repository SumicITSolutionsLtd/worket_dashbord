import React from 'react';

type BadgeVariant = 'default' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'outline' | 'glass';
type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
  dot?: boolean;
  pulse?: boolean;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-gray-100/80 text-gray-700 backdrop-blur-sm',
  secondary: 'bg-gray-100/80 text-gray-600 backdrop-blur-sm',
  success: 'bg-green-100/80 text-green-700 backdrop-blur-sm',
  warning: 'bg-amber-100/80 text-amber-700 backdrop-blur-sm',
  danger: 'bg-red-100/80 text-red-700 backdrop-blur-sm',
  info: 'bg-primary-100/80 text-primary-700 backdrop-blur-sm',
  outline: 'bg-transparent border border-gray-300 text-gray-700',
  glass: 'glass-light text-gray-700',
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
  lg: 'px-3 py-1.5 text-sm',
};

const dotColors: Record<BadgeVariant, string> = {
  default: 'bg-gray-500',
  secondary: 'bg-gray-500',
  success: 'bg-green-500',
  warning: 'bg-amber-500',
  danger: 'bg-red-500',
  info: 'bg-primary-500',
  outline: 'bg-gray-500',
  glass: 'bg-gray-500',
};

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  dot = false,
  pulse = false,
}) => {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 font-medium rounded-lg transition-colors
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {dot && (
        <span className="relative flex h-2 w-2">
          {pulse && (
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${dotColors[variant]} opacity-75`} />
          )}
          <span className={`relative inline-flex rounded-full h-2 w-2 ${dotColors[variant]}`} />
        </span>
      )}
      {children}
    </span>
  );
};

export default Badge;
