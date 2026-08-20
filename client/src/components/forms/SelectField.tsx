import { forwardRef, SelectHTMLAttributes } from 'react';
import clsx from 'clsx';

interface Option {
  value: string;
  label: string;
}

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  options: Option[];
  placeholder?: string;
  error?: boolean;
}

const SelectField = forwardRef<HTMLSelectElement, Props>(
  ({ options, placeholder, error, className, ...props }, ref) => (
    <select
      ref={ref}
      className={clsx('input', error && 'border-danger-600 focus:ring-danger-600', className)}
      {...props}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  )
);

SelectField.displayName = 'SelectField';
export default SelectField;
