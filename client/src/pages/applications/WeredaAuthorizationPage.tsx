import { useState } from 'react';
import { useApplications, useBatchDecision, useWeredaDecision } from '@/hooks/useApplications';
import PageHeader from '@/components/common/PageHeader';
import DataTable, { Column } from '@/components/common/DataTable';
import StatusBadge from '@/components/common/StatusBadge';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { PageLoader } from '@/components/common/LoadingSpinner';
import { Application } from '@/types';
import { ApplicationStatus } from '@/types/enums';

export default function WeredaAuthorizationPage() {
  const { data: applications, isLoading } = useApplications({ status: ApplicationStatus.SUBMITTED_TO_WEREDA });
  const batchDecision = useBatchDecision();
  const weredaDecision = useWeredaDecision();
  const [selected, setSelected] = useState<string[]>([]);
  const [confirmAction, setConfirmAction] = useState<'ACCEPT_ALL' | 'REJECT_ALL' | null>(null);

  const toggleSelect = (id: string) => {
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  const columns: Column<Application>[] = [
    {
      header: '',
      cell: (row) => (
        <input type="checkbox" checked={selected.includes(row.id)}
          onChange={() => toggleSelect(row.id)} className="rounded" />
      ),
      className: 'w-8',
    },
    { header: 'Reference', accessor: 'reference_number' },
    { header: 'Kebele', accessor: 'kebele_name' },
    { header: 'Status', cell: (row) => <StatusBadge status={row.status} /> },
    {
      header: 'Actions',
      cell: (row) => (
        <div className="flex gap-2">
          <button className="text-xs btn-primary py-1 px-2"
            onClick={() => weredaDecision.mutate({ id: row.id, payload: { decision_type: 'ACCEPT' } })}>
            Approve
          </button>
          <button className="text-xs btn-danger py-1 px-2"
            onClick={() => weredaDecision.mutate({ id: row.id, payload: { decision_type: 'REJECT', reason: 'Rejected by Wereda' } })}>
            Reject
          </button>
        </div>
      ),
    },
  ];

  if (isLoading) return <PageLoader />;

  const kebeleId = applications?.[0]?.kebele_id;

  return (
    <div>
      <PageHeader
        title="Wereda Authorization"
        subtitle="Review and authorize submitted Kebele lists"
        actions={
          <div className="flex gap-2">
            <button className="btn-primary"
              onClick={() => setConfirmAction('ACCEPT_ALL')}
              disabled={!kebeleId}>
              Accept All
            </button>
            <button className="btn-danger"
              onClick={() => setConfirmAction('REJECT_ALL')}
              disabled={!kebeleId}>
              Reject All
            </button>
          </div>
        }
      />

      <DataTable columns={columns} data={applications ?? []} keyField="id" />

      <ConfirmDialog
        open={confirmAction === 'ACCEPT_ALL'}
        title="Accept All Applications"
        message={`Approve all ${applications?.length ?? 0} submitted applications from this Kebele?`}
        confirmLabel="Accept All"
        onConfirm={() => {
          batchDecision.mutate({ decision_type: 'ACCEPT_ALL', kebele_id: kebeleId! });
          setConfirmAction(null);
        }}
        onCancel={() => setConfirmAction(null)}
      />

      <ConfirmDialog
        open={confirmAction === 'REJECT_ALL'}
        title="Reject All Applications"
        message="Reject all submitted applications from this Kebele?"
        confirmLabel="Reject All"
        variant="danger"
        onConfirm={() => {
          batchDecision.mutate({ decision_type: 'REJECT_ALL', kebele_id: kebeleId!, reason: 'Batch rejected by Wereda Super Admin' });
          setConfirmAction(null);
        }}
        onCancel={() => setConfirmAction(null)}
      />
    </div>
  );
}
