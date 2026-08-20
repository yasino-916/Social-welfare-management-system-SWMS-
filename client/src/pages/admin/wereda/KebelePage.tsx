import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Edit, Trash2, X, Save } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import { kebeleApi, Kebele } from '@/services/api/kebeleApi';

export default function KebelePage() {
  const { t } = useTranslation();
  const [kebeles, setKebeles] = useState<Kebele[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingKebele, setEditingKebele] = useState<Kebele | null>(null);
  const [formData, setFormData] = useState({ name: '', code: '' });

  const fetchKebeles = async () => {
    try {
      setLoading(true);
      const data = await kebeleApi.list();
      setKebeles(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch kebeles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKebeles();
  }, []);

  const handleOpenModal = (kebele?: Kebele) => {
    if (kebele) {
      setEditingKebele(kebele);
      setFormData({ name: kebele.name, code: kebele.code });
    } else {
      setEditingKebele(null);
      setFormData({ name: '', code: '' });
    }
    setError('');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingKebele(null);
    setFormData({ name: '', code: '' });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingKebele) {
        await kebeleApi.update(editingKebele.id, formData);
      } else {
        await kebeleApi.create(formData);
      }
      handleCloseModal();
      fetchKebeles();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save kebele');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this Kebele?')) {
      try {
        await kebeleApi.delete(id);
        fetchKebeles();
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to delete kebele');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <PageHeader title="Kebele Management" />
        <button
          onClick={() => handleOpenModal()}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Kebele
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md">
          {error}
        </div>
      )}

      <div className="card p-0">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : kebeles.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No Kebeles found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Code
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {kebeles.map((kebele) => (
                  <tr key={kebele.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {kebele.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {kebele.code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">
                      <button
                        onClick={() => handleOpenModal(kebele)}
                        className="text-primary-600 hover:text-primary-900 mr-4"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(kebele.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">
                {editingKebele ? 'Edit Kebele' : 'Add New Kebele'}
              </h2>
              <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kebele Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field"
                  placeholder="e.g. Kebele 01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kebele Code
                </label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="input-field"
                  placeholder="e.g. K01"
                />
              </div>
              <div className="pt-4 flex justify-end gap-3 border-t">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
