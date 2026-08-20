import { useState } from 'react';
import { applicationApi } from '@/services/api/applicationApi';
import StatusBadge from '@/components/common/StatusBadge';
import toast from 'react-hot-toast';

export default function ApplicationStatusPage() {
  const [reference, setReference] = useState('');
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    if (!reference.trim()) return;
    setLoading(true);
    try {
      const data = await applicationApi.checkStatus(reference.trim());
      setResult(data);
    } catch {
      toast.error('Application not found. Check your reference number.');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Check Application Status</h1>
      <p className="text-sm text-gray-500 mb-6">Enter your application reference number to view the current status.</p>

      <div className="card space-y-4">
        <div>
          <label htmlFor="ref" className="label">Application Reference Number</label>
          <input id="ref" type="text" className="input" placeholder="e.g. APP-20260818-A3F9K2"
            value={reference} onChange={(e) => setReference(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCheck()} />
        </div>
        <button className="btn-primary w-full" onClick={handleCheck} disabled={loading}>
          {loading ? 'Searching...' : 'Check Status'}
        </button>
      </div>

      {result && (
        <div className="card mt-6 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Reference</span>
            <span className="font-mono font-medium">{result.reference_number as string}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Status</span>
            <StatusBadge status={result.status as string} />
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Submitted</span>
            <span>{result.submitted_at ? new Date(result.submitted_at as string).toLocaleDateString() : '—'}</span>
          </div>
        </div>
      )}
    </div>
  );
}
