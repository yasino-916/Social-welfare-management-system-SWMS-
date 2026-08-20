import { forwardRef, TextareaHTMLAttributes } from 'react';
import clsx from 'clsx';

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

const TextArea = forwardRef<HTMLTextAreaElement, Props>(
  ({ error, className, rows = 4, ...props }, ref) => (
    <textarea
      ref={ref}
      rows={rows}
      className={clsx('input resize-none', error && 'border-danger-600 focus:ring-danger-600', className)}
      {...props}
    />
  )
);

TextArea.displayName = 'TextArea';
export default TextArea;
