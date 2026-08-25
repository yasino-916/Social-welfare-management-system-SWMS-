import { useState, useEffect } from 'react';

import { Save } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import { weredaApi } from '@/services/api/weredaApi';
import { Wereda } from '@/types';

export default function WeredaPage() {
  const [, setWereda] = useState<Wereda | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({ name: '', region: '' });

  const fetchWereda = async () => {
    try {
      setLoading(true);
      const data = await weredaApi.get();
      setWereda(data);
      if (data) {
        setFormData({ name: data.name, region: data.region });
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch Wereda config');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWereda();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      setSuccess('');
      const data = await weredaApi.update(formData);
      setWereda(data);
      setSuccess('Wereda configuration updated successfully.');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update Wereda config');
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <PageHeader title="Wereda Configuration" subtitle="Manage the Wereda (District) settings" />

      {error && <div className="bg-red-50 text-red-700 p-4 rounded-md">{error}</div>}
      {success && <div className="bg-green-50 text-green-700 p-4 rounded-md">{success}</div>}

      <div className="card">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Wereda Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field"
                  placeholder="e.g. Addis Ketema"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Region
                </label>
                <input
                  type="text"
                  required
                  value={formData.region}
                  onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                  className="input-field"
                  placeholder="e.g. Addis Ababa"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t">
              <button type="submit" className="btn-primary flex items-center gap-2">
                <Save className="w-4 h-4" /> Save Configuration
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
