import { useNavigate } from 'react-router-dom';
import { useComplaints } from '@/hooks/useComplaints';
import PageHeader from '@/components/common/PageHeader';
import DataTable, { Column } from '@/components/common/DataTable';
import StatusBadge from '@/components/common/StatusBadge';
import { PageLoader } from '@/components/common/LoadingSpinner';
import { Complaint } from '@/types';

const priorityColor: Record<string, string> = {
  LOW: 'text-gray-500',
  MEDIUM: 'text-warning-600',
  HIGH: 'text-orange-600',
  CRITICAL: 'text-danger-600 font-bold',
};

export default function ComplaintsAdminPage() {
  const navigate = useNavigate();
  const { data: complaints, isLoading } = useComplaints();

  const columns: Column<Complaint>[] = [
    { header: 'Reference', accessor: 'complaint_reference' },
    { header: 'Priority', cell: (row) => <span className={priorityColor[row.priority]}>{row.priority}</span> },
    { header: 'Status', cell: (row) => <StatusBadge status={row.status} /> },
    { header: 'Submitted', cell: (row) => new Date(row.submitted_at).toLocaleDateString() },
    { header: 'Assigned To', cell: (row) => row.assigned_to ?? <span className="text-gray-400">Unassigned</span> },
  ];

  if (isLoading) return <PageLoader />;

  return (
    <div>
      <PageHeader title="Complaints" subtitle="Manage citizen complaints" />
      <DataTable
        columns={columns}
        data={complaints ?? []}
        keyField="id"
        onRowClick={(row) => navigate(`/complaints/admin/${row.id}`)}
      />
    </div>
  );
}
