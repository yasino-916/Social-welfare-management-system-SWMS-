import { useState } from 'react';
import { complaintApi } from '@/services/api/complaintApi';
import StatusBadge from '@/components/common/StatusBadge';
import toast from 'react-hot-toast';

export default function ComplaintTrackPage() {
  const [reference, setReference] = useState('');
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);

  const handleTrack = async () => {
    if (!reference.trim()) return;
    setLoading(true);
    try {
      const data = await complaintApi.trackByReference(reference.trim());
      setResult(data);
    } catch {
      toast.error('Complaint not found. Check your reference number.');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Track Your Complaint</h1>
      <p className="text-sm text-gray-500 mb-6">Enter your complaint reference number to check the status.</p>

      <div className="card space-y-4">
        <div>
          <label htmlFor="reference" className="label">Complaint Reference Number</label>
          <input
            id="reference"
            type="text"
            className="input"
            placeholder="e.g. CMP-20260818-A3F9K2"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleTrack()}
          />
        </div>
        <button className="btn-primary w-full" onClick={handleTrack} disabled={loading}>
          {loading ? 'Searching...' : 'Track Complaint'}
        </button>
      </div>

      {result && (
        <div className="card mt-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Reference</span>
            <span className="font-mono font-medium text-gray-900">{result.complaint_reference as string}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Status</span>
            <StatusBadge status={result.status as string} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Priority</span>
            <span className="text-sm font-medium">{result.priority as string}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Submitted</span>
            <span className="text-sm">{new Date(result.submitted_at as string).toLocaleDateString()}</span>
          </div>
        </div>
      )}
    </div>
  );
}
