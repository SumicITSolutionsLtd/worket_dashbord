import React from 'react';
import { CircleNotch } from '@phosphor-icons/react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline' | 'glass';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-gradient-to-r from-primary-600 to-primary-500 text-white hover:from-primary-700 hover:to-primary-600 shadow-sm hover:shadow-md disabled:from-primary-400 disabled:to-primary-400',
  secondary: 'bg-gray-100/80 text-gray-900 hover:bg-gray-200/80 disabled:bg-gray-100/50 backdrop-blur-sm',
  ghost: 'bg-transparent text-gray-700 hover:bg-gray-100/80',
  danger: 'bg-gradient-to-r from-red-600 to-red-500 text-white hover:from-red-700 hover:to-red-600 shadow-sm hover:shadow-md disabled:from-red-400 disabled:to-red-400',
  outline: 'bg-transparent border-2 border-primary-600 text-primary-600 hover:bg-primary-50/80',
  glass: 'glass-button text-gray-700 hover:text-gray-900',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm min-h-[36px]',
  md: 'px-4 py-2 text-sm min-h-[44px]',
  lg: 'px-6 py-3 text-base min-h-[52px]',
};

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  children,
  disabled,
  className = '',
  ...props
}) => {
  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2
        font-semibold rounded-xl
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:ring-offset-2
        disabled:cursor-not-allowed disabled:opacity-60
        active:scale-[0.98]
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <CircleNotch weight="bold" className="w-4 h-4 animate-spin" />
          <span>Loading...</span>
        </>
      ) : (
        <>
          {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  );
};

export default Button;
