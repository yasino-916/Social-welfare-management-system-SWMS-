import { useState, useEffect } from 'react';

import { RefreshCw } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import DataTable, { Column } from '@/components/common/DataTable';
import { auditApi } from '@/services/api/auditApi';
import { userApi } from '@/services/api/userApi';
import { AuditLog, User } from '@/types';
import { format } from 'date-fns';

export default function AuditPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [filters, setFilters] = useState({
    user_id: '',
    entity_type: '',
    action: ''
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      const [auditData, usersData] = await Promise.all([
        auditApi.list(filters),
        userApi.list()
      ]);
      setLogs(auditData);
      setUsers(usersData);
    } catch (err: any) {
      setError('Failed to fetch audit logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters]);

  const columns: Column<AuditLog>[] = [
    {
      header: 'Date & Time',
      accessor: 'created_at',
      cell: (row) => format(new Date(row.created_at), 'MMM d, yyyy HH:mm:ss')
    },
    {
      header: 'User',
      accessor: 'user_id',
      cell: (row) => {
        const user = users.find(u => u.id === row.user_id);
        return user ? user.full_name : row.user_id || 'System';
      }
    },
    { header: 'Role', accessor: 'role' },
    {
      header: 'Action',
      accessor: 'action',
      cell: (row) => (
        <span className="px-2 py-1 text-xs rounded-full bg-gray-100 font-medium">
          {row.action}
        </span>
      )
    },
    { header: 'Entity Type', accessor: 'entity_type' },
    { header: 'Entity ID', accessor: 'entity_id', cell: (row) => <span className="text-xs text-gray-500">{row.entity_id || '-'}</span> },
    { header: 'Reason', accessor: 'reason', cell: (row) => <span className="text-sm truncate max-w-xs block" title={row.reason}>{row.reason || '-'}</span> }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <PageHeader title="Audit Trail" subtitle="System activity logs" />
        <button onClick={fetchData} className="btn-secondary flex items-center gap-2">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {error && <div className="bg-red-50 text-red-700 p-4 rounded-md">{error}</div>}

      <div className="card space-y-4">
        <div className="flex gap-4 mb-4">
          <select 
            value={filters.user_id} 
            onChange={(e) => setFilters(f => ({ ...f, user_id: e.target.value }))}
            className="input-field text-sm"
          >
            <option value="">All Users</option>
            {users.map(u => <option key={u.id} value={u.id}>{u.full_name}</option>)}
          </select>
          
          <select 
            value={filters.entity_type} 
            onChange={(e) => setFilters(f => ({ ...f, entity_type: e.target.value }))}
            className="input-field text-sm"
          >
            <option value="">All Entities</option>
            <option value="user">User</option>
            <option value="household">Household</option>
            <option value="application">Application</option>
            <option value="document">Document</option>
            <option value="decision">Decision</option>
            <option value="support">Support</option>
          </select>

          <select 
            value={filters.action} 
            onChange={(e) => setFilters(f => ({ ...f, action: e.target.value }))}
            className="input-field text-sm"
          >
            <option value="">All Actions</option>
            <option value="CREATE">CREATE</option>
            <option value="UPDATE">UPDATE</option>
            <option value="DELETE">DELETE</option>
            <option value="STATUS_CHANGE">STATUS_CHANGE</option>
            <option value="LOGIN">LOGIN</option>
            <option value="VERIFY">VERIFY</option>
          </select>
        </div>

        {loading && logs.length === 0 ? (
          <div className="p-8 text-center text-gray-500">Loading audit logs...</div>
        ) : (
          <DataTable columns={columns} data={logs} keyField="id" />
        )}
      </div>
    </div>
  );
}
