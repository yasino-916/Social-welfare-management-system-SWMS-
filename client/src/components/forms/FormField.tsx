import { ReactNode } from 'react';
import clsx from 'clsx';

interface Props {
  label: string;
  htmlFor?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}

export default function FormField({ label, htmlFor, error, required, children, className }: Props) {
  return (
    <div className={clsx('space-y-1', className)}>
      <label htmlFor={htmlFor} className="label">
        {label}
        {required && <span className="text-danger-600 ml-0.5" aria-hidden>*</span>}
      </label>
      {children}
      {error && (
        <p role="alert" className="text-xs text-danger-600 mt-1">{error}</p>
      )}
    </div>
  );
}
