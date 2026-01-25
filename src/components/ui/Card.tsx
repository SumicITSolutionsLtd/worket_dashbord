import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'elevated' | 'outlined';
  hover?: boolean;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'default',
  hover = false,
  onClick,
}) => {
  const baseStyles = 'rounded-2xl overflow-hidden transition-all duration-200';

  const variantStyles = {
    default: 'bg-white border border-gray-100 shadow-card',
    glass: 'glass-card',
    elevated: 'bg-white shadow-glass border border-gray-100/50',
    outlined: 'bg-white/50 border-2 border-gray-200',
  };

  const hoverStyles = hover
    ? 'hover-lift cursor-pointer hover:shadow-glass'
    : '';

  const Component = onClick ? 'button' : 'div';

  return (
    <Component
      className={`${baseStyles} ${variantStyles[variant]} ${hoverStyles} ${className}`}
      onClick={onClick}
    >
      {children}
    </Component>
  );
};

export default Card;
