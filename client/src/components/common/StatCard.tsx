import clsx from 'clsx';

interface Props {
  label: string;
  value: string | number;
  sub?: string;
  color?: 'blue' | 'green' | 'yellow' | 'red';
}

const colorMap = {
  blue:   'border-l-primary-500 bg-primary-50',
  green:  'border-l-success-600 bg-green-50',
  yellow: 'border-l-warning-600 bg-yellow-50',
  red:    'border-l-danger-600 bg-red-50',
};

export default function StatCard({ label, value, sub, color = 'blue' }: Props) {
  return (
    <div className={clsx('card border-l-4 py-4', colorMap[color])}>
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
      <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-gray-400">{sub}</p>}
    </div>
  );
}
