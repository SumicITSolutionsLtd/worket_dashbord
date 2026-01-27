import React, { forwardRef, useMemo } from 'react';

let textareaIdCounter = 0;
import { WarningCircle } from '@phosphor-icons/react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      helperText,
      fullWidth = true,
      className = '',
      id,
      rows = 4,
      ...props
    },
    ref
  ) => {
    const textareaId = useMemo(() => id || `textarea-${++textareaIdCounter}`, [id]);

    return (
      <div className={`${fullWidth ? 'w-full' : ''}`}>
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          className={`
            block rounded-xl border bg-white/80 backdrop-blur-sm
            transition-all duration-200 resize-none
            focus:outline-none focus:ring-2 focus:ring-offset-0
            placeholder:text-gray-400
            disabled:bg-gray-50/80 disabled:text-gray-500 disabled:cursor-not-allowed
            px-4 py-2.5 text-sm
            ${
              error
                ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                : 'border-gray-200 focus:border-primary-500 focus:ring-primary-200'
            }
            ${fullWidth ? 'w-full' : ''}
            ${className}
          `}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            error ? `${textareaId}-error` : helperText ? `${textareaId}-helper` : undefined
          }
          {...props}
        />

        {error && (
          <div
            id={`${textareaId}-error`}
            className="flex items-center gap-1.5 mt-1.5 text-red-600"
            role="alert"
          >
            <WarningCircle weight="fill" className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {helperText && !error && (
          <p id={`${textareaId}-helper`} className="mt-1.5 text-sm text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
