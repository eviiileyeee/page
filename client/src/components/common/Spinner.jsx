import React from 'react';
import { cn } from '@/lib/utils';

const Spinner = ({ size = 'medium', color = 'primary', className }) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  const colorClasses = {
    primary: 'border-primary dark:border-primary-light',
    secondary: 'border-secondary dark:border-secondary-light',
    success: 'border-success dark:border-success-light',
    error: 'border-error dark:border-error-light'
  };

  return (
    <div className="flex justify-center items-center">
      <div 
        className={cn(
          sizeClasses[size],
          'border-2',
          'border-t-transparent',
          'rounded-full',
          'animate-spin',
          colorClasses[color],
          'transition-colors duration-200',
          className
        )}
      />
    </div>
  );
};

export default Spinner;