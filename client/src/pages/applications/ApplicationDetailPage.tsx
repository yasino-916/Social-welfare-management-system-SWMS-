import { useParams, useNavigate } from 'react-router-dom';
import { useApplication, useDecisionHistory } from '@/hooks/useApplications';
import PageHeader from '@/components/common/PageHeader';
import StatusBadge from '@/components/common/StatusBadge';
import { PageLoader } from '@/components/common/LoadingSpinner';
import { usePermissions } from '@/hooks/usePermissions';

export default function ApplicationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: app, isLoading } = useApplication(id!);
  const { data: decisions } = useDecisionHistory(id!);
  const { canMakeKebeleDecision } = usePermissions();

  if (isLoading) return <PageLoader />;
  if (!app) return <p className="text-gray-500">Application not found.</p>;

  return (
    <div>
      <PageHeader
        title={`Application: ${app.reference_number}`}
        actions={
          canMakeKebeleDecision && (
            <button
              className="btn-primary"
              onClick={() => navigate(`/applications/${id}/review`)}
            >
              Review & Decide
            </button>
          )
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card space-y-3">
          <h2 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">Application Info</h2>
          <Row label="Reference" value={app.reference_number} />
          <Row label="Status" value={<StatusBadge status={app.status} />} />
          <Row label="Submitted" value={app.submitted_at ? new Date(app.submitted_at).toLocaleDateString() : '—'} />
          <Row label="Kebele" value={app.kebele_name ?? '—'} />
        </div>

        <div className="card">
          <h2 className="font-semibold text-gray-700 text-sm uppercase tracking-wide mb-3">Decision History</h2>
          {(!decisions || decisions.length === 0) ? (
            <p className="text-sm text-gray-400">No decisions recorded yet.</p>
          ) : (
            <ol className="space-y-3">
              {decisions.map((d) => (
                <li key={d.id} className="text-sm border-l-2 border-gray-200 pl-3">
                  <p className="font-medium text-gray-800">{d.decision_type.replace(/_/g, ' ')}</p>
                  <p className="text-gray-500 text-xs">{d.decision_level} · {new Date(d.decided_at).toLocaleDateString()}</p>
                  {d.reason && <p className="text-gray-600 mt-0.5">{d.reason}</p>}
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-gray-900">{value}</span>
    </div>
  );
}
