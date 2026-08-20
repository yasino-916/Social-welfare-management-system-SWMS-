import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Filter, Eye, Plus } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import { householdApi } from '@/services/api/householdApi';
import { kebeleApi, Kebele } from '@/services/api/kebeleApi';
import { Household } from '@/types';
import { usePermissions } from '@/hooks/usePermissions';

export default function HouseholdsPage() {
  const { t } = useTranslation();
  const { isSuperAdmin } = usePermissions();
  
  const [households, setHouseholds] = useState<Household[]>([]);
  const [kebeles, setKebeles] = useState<Kebele[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [filters, setFilters] = useState({
    kebele_id: '',
    status: ''
  });

  useEffect(() => {
    if (isSuperAdmin) {
      kebeleApi.list().then(setKebeles).catch(console.error);
    }
  }, [isSuperAdmin]);

  useEffect(() => {
    const fetchHouseholds = async () => {
      try {
        setLoading(true);
        const data = await householdApi.list(filters);
        setHouseholds(data);
      } catch (err) {
        console.error('Failed to fetch households:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHouseholds();
  }, [filters]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <PageHeader title={t('nav.households', 'Households')} />
        <Link to="/assisted-registration" className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Register New
        </Link>
      </div>

      {/* Filters */}
      <div className="card bg-white p-4 flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2 text-gray-500 font-medium text-sm">
          <Filter className="w-4 h-4" /> Filters:
        </div>
        
        {isSuperAdmin && (
          <select 
            name="kebele_id" 
            value={filters.kebele_id} 
            onChange={handleFilterChange}
            className="input-field max-w-xs text-sm"
          >
            <option value="">All Kebeles</option>
            {kebeles.map(k => (
              <option key={k.id} value={k.id}>{k.name}</option>
            ))}
          </select>
        )}

        <select 
          name="status" 
          value={filters.status} 
          onChange={handleFilterChange}
          className="input-field max-w-xs text-sm"
        >
          <option value="">All Statuses</option>
          <option value="DRAFT">Draft</option>
          <option value="SUBMITTED">Submitted</option>
          <option value="UNDER_KEBELE_REVIEW">Under Kebele Review</option>
          <option value="KEBELE_ACCEPTED">Kebele Accepted</option>
          <option value="SUPER_ADMIN_APPROVED">Approved Beneficiary</option>
          <option value="SUPER_ADMIN_REJECTED">Rejected</option>
        </select>
      </div>

      {/* Data Grid */}
      <div className="card p-0 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading households...</div>
        ) : households.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No households found matching your criteria.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Household ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Village</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Size</th>
                  {isSuperAdmin && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kebele</th>}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {households.map(hh => (
                  <tr key={hh.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {hh.id.substring(0, 8).toUpperCase()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {hh.village || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {hh.household_size}
                    </td>
                    {isSuperAdmin && (
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {hh.kebele_name || '-'}
                      </td>
                    )}
                    <td className="px-6 py-4">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        hh.status === 'SUPER_ADMIN_APPROVED' ? 'bg-green-100 text-green-800' :
                        hh.status.includes('REJECTED') ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {hh.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium">
                      <Link to={`/households/${hh.id}`} className="text-primary-600 hover:text-primary-900 flex items-center justify-end gap-1">
                        <Eye className="w-4 h-4" /> View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
