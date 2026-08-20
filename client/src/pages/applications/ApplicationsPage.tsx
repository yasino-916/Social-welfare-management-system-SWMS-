import { useNavigate } from 'react-router-dom';
import { useApplications } from '@/hooks/useApplications';
import PageHeader from '@/components/common/PageHeader';
import DataTable, { Column } from '@/components/common/DataTable';
import StatusBadge from '@/components/common/StatusBadge';
import { PageLoader } from '@/components/common/LoadingSpinner';
import { Application } from '@/types';

export default function ApplicationsPage() {
  const navigate = useNavigate();
  const { data: applications, isLoading } = useApplications();

  const columns: Column<Application>[] = [
    { header: 'Reference', accessor: 'reference_number' },
    { header: 'Kebele', accessor: 'kebele_name' },
    { header: 'Status', cell: (row) => <StatusBadge status={row.status} /> },
    {
      header: 'Submitted',
      cell: (row) => row.submitted_at ? new Date(row.submitted_at).toLocaleDateString() : '—',
    },
  ];

  if (isLoading) return <PageLoader />;

  return (
    <div>
      <PageHeader title="Applications" subtitle="All household registration applications" />
      <DataTable
        columns={columns}
        data={applications ?? []}
        keyField="id"
        onRowClick={(row) => navigate(`/applications/${row.id}`)}
      />
    </div>
  );
}
