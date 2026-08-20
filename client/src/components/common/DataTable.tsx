import { ReactNode } from 'react';
import clsx from 'clsx';

export interface Column<T> {
  header: string;
  accessor?: keyof T;
  cell?: (row: T) => ReactNode;
  className?: string;
}

interface Props<T> {
  columns: Column<T>[];
  data: T[];
  keyField: keyof T;
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
}

export default function DataTable<T>({ columns, data, keyField, onRowClick, emptyMessage = 'No records found' }: Props<T>) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col) => (
              <th
                key={col.header}
                className={clsx('px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide', col.className)}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-gray-400">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr
                key={String(row[keyField])}
                onClick={() => onRowClick?.(row)}
                className={clsx('transition-colors', onRowClick && 'cursor-pointer hover:bg-gray-50')}
              >
                {columns.map((col) => (
                  <td key={col.header} className={clsx('px-4 py-3 text-gray-700', col.className)}>
                    {col.cell ? col.cell(row) : col.accessor ? String(row[col.accessor] ?? '—') : null}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
