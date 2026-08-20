import { useState } from 'react';
import { useApplications, useSubmitToWereda } from '@/hooks/useApplications';
import PageHeader from '@/components/common/PageHeader';
import DataTable, { Column } from '@/components/common/DataTable';
import StatusBadge from '@/components/common/StatusBadge';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { PageLoader } from '@/components/common/LoadingSpinner';
import { Application } from '@/types';
import { ApplicationStatus } from '@/types/enums';

export default function KebeleSubmittedListPage() {
  const { data: applications, isLoading } = useApplications({ status: ApplicationStatus.KEBELE_ACCEPTED });
  const submitToWereda = useSubmitToWereda();
  const [selected, setSelected] = useState<string[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const toggleAll = () => {
    const allIds = (applications ?? []).map((a) => a.id);
    setSelected(selected.length === allIds.length ? [] : allIds);
  };

  const toggleOne = (id: string) => {
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  const columns: Column<Application>[] = [
    {
      header: '',
      cell: (row) => (
        <input type="checkbox" checked={selected.includes(row.id)}
          onChange={() => toggleOne(row.id)} className="rounded" />
      ),
      className: 'w-8',
    },
    { header: 'Reference', accessor: 'reference_number' },
    { header: 'Status', cell: (row) => <StatusBadge status={row.status} /> },
    { header: 'Created', cell: (row) => new Date(row.created_at).toLocaleDateString() },
  ];

  if (isLoading) return <PageLoader />;

  return (
    <div>
      <PageHeader
        title="Kebele Accepted List"
        subtitle="Select accepted applications to submit to the Wereda"
        actions={
          <div className="flex gap-2">
            <button className="btn-secondary text-sm" onClick={toggleAll}>
              {selected.length === (applications?.length ?? 0) ? 'Deselect All' : 'Select All'}
            </button>
            <button
              className="btn-primary"
              disabled={selected.length === 0}
              onClick={() => setConfirmOpen(true)}
            >
              Submit {selected.length > 0 ? `(${selected.length})` : ''} to Wereda
            </button>
          </div>
        }
      />

      <DataTable columns={columns} data={applications ?? []} keyField="id" />

      <ConfirmDialog
        open={confirmOpen}
        title="Submit to Wereda"
        message={`Submit ${selected.length} accepted application(s) to the Wereda Super Admin for final authorization?`}
        confirmLabel="Submit"
        onConfirm={() => { submitToWereda.mutate(selected); setConfirmOpen(false); setSelected([]); }}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}
