import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Edit, Shield, ShieldOff, Check, X, Save } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import { userApi } from '@/services/api/userApi';
import { kebeleApi, Kebele } from '@/services/api/kebeleApi';
import { User } from '@/types';
import { UserRole } from '@/types/enums';
import clsx from 'clsx';

export default function UsersPage() {
  const { t } = useTranslation();
  const [users, setUsers] = useState<User[]>([]);
  const [kebeles, setKebeles] = useState<Kebele[]>([]);
  const [, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  
  const [formData, setFormData] = useState({
    full_name: '',
    username: '',
    email: '',
    password: '',
    role: UserRole.KEBELE_FACILITATOR as string,
    kebele_id: ''
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersData, kebelesData] = await Promise.all([
        userApi.list(),
        kebeleApi.list()
      ]);
      setUsers(usersData);
      setKebeles(kebelesData);
    } catch (err: any) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        full_name: user.full_name,
        username: user.username,
        email: user.email || '',
        password: '',
        role: user.role,
        kebele_id: user.kebele_id || ''
      });
    } else {
      setEditingUser(null);
      setFormData({ full_name: '', username: '', email: '', password: '', role: UserRole.KEBELE_FACILITATOR, kebele_id: '' });
    }
    setError('');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingUser) {
        // Exclude password if empty during update
        const payload: any = { ...formData };
        if (!payload.password) delete payload.password;
        if (!payload.kebele_id) payload.kebele_id = null;
        await userApi.update(editingUser.id, payload);
      } else {
        const payload: any = { ...formData };
        if (!payload.kebele_id) payload.kebele_id = null;
        await userApi.create(payload);
      }
      handleCloseModal();
      fetchData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save user');
    }
  };

  const handleSuspend = async (id: string) => {
    if (window.confirm('Toggle suspension status for this user?')) {
      try {
        await userApi.suspend(id);
        fetchData();
      } catch (err) {
        setError('Failed to update status');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <PageHeader title={t('nav.users', 'User Management')} />
        <button onClick={() => handleOpenModal()} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add User
        </button>
      </div>

      {error && <div className="bg-red-50 text-red-700 p-4 rounded-md">{error}</div>}

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kebele</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map(user => (
                <tr key={user.id}>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{user.full_name}</div>
                    <div className="text-sm text-gray-500">{user.username}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {kebeles.find(k => k.id === user.kebele_id)?.name || '-'}
                  </td>
                  <td className="px-6 py-4">
                    {user.is_active ? (
                      <span className="flex items-center gap-1 text-green-600 text-sm"><Check className="w-4 h-4"/> Active</span>
                    ) : (
                      <span className="flex items-center gap-1 text-red-600 text-sm"><X className="w-4 h-4"/> Suspended</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <button onClick={() => handleOpenModal(user)} className="text-primary-600 hover:text-primary-900 mr-4">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleSuspend(user.id)} className={clsx(user.is_active ? "text-red-600" : "text-green-600")}>
                      {user.is_active ? <ShieldOff className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">{editingUser ? 'Edit User' : 'Add New User'}</h2>
              <button onClick={handleCloseModal}><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input type="text" required value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                  <input type="text" required value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} className="input-field" disabled={!!editingUser} />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{editingUser ? 'New Password (Optional)' : 'Password'}</label>
                  <input type="password" required={!editingUser} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="input-field" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="input-field">
                    <option value={UserRole.SUPER_ADMIN}>Super Admin</option>
                    <option value={UserRole.KEBELE_ADMIN}>Kebele Admin</option>
                    <option value={UserRole.KEBELE_FACILITATOR}>Kebele Facilitator</option>
                  </select>
                </div>
                {formData.role !== UserRole.SUPER_ADMIN && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Kebele</label>
                    <select required value={formData.kebele_id} onChange={e => setFormData({...formData, kebele_id: e.target.value})} className="input-field">
                      <option value="">Select Kebele</option>
                      {kebeles.map(k => <option key={k.id} value={k.id}>{k.name}</option>)}
                    </select>
                  </div>
                )}
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t">
                <button type="button" onClick={handleCloseModal} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary flex items-center gap-2">
                  <Save className="w-4 h-4" /> Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
