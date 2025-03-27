import React from 'react';
import { cn } from '@/lib/utils';

const Alert = ({ type = 'info', message, className }) => {
  const alertStyles = {
    success: 'bg-success-light/20 border-success text-success-dark dark:bg-success/20 dark:border-success-light dark:text-success-light',
    error: 'bg-error-light/20 border-error text-error-dark dark:bg-error/20 dark:border-error-light dark:text-error-light',
    warning: 'bg-warning-light/20 border-warning text-warning-dark dark:bg-warning/20 dark:border-warning-light dark:text-warning-light',
    info: 'bg-primary-light/20 border-primary text-primary-dark dark:bg-primary/20 dark:border-primary-light dark:text-primary-light'
  };

  return (
    <div 
      className={cn(
        'border px-4 py-3 rounded-lg relative mb-4 transition-colors duration-200',
        alertStyles[type],
        className
      )}
      role="alert"
    >
      <span className="block sm:inline">{message}</span>
    </div>
  );
};

export default Alert;