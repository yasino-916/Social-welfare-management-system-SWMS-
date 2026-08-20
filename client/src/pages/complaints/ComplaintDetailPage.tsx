import { useParams } from 'react-router-dom';
import { useComplaint, useAssignComplaint, useEscalateComplaint, useResolveComplaint, useCloseComplaint } from '@/hooks/useComplaints';
import PageHeader from '@/components/common/PageHeader';
import StatusBadge from '@/components/common/StatusBadge';
import { PageLoader } from '@/components/common/LoadingSpinner';
import { useState } from 'react';
import TextArea from '@/components/forms/TextArea';

export default function ComplaintDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: complaint, isLoading } = useComplaint(id!);
  const assign = useAssignComplaint();
  const escalate = useEscalateComplaint();
  const resolve = useResolveComplaint();
  const close = useCloseComplaint();

  const [assignTo, setAssignTo] = useState('');
  const [reason, setReason] = useState('');
  const [resolution, setResolution] = useState('');

  if (isLoading) return <PageLoader />;
  if (!complaint) return <p>Complaint not found.</p>;

  return (
    <div className="max-w-2xl">
      <PageHeader title={`Complaint: ${complaint.complaint_reference}`} />

      <div className="card space-y-3 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Status</span>
          <StatusBadge status={complaint.status} />
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Priority</span>
          <span className="font-medium">{complaint.priority}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Anonymous</span>
          <span>{complaint.is_anonymous ? 'Yes' : 'No'}</span>
        </div>
        <div className="text-sm">
          <p className="text-gray-500 mb-1">Description</p>
          <p className="text-gray-800">{complaint.description}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-4">
        {/* Assign */}
        <div className="card space-y-3">
          <h3 className="font-medium text-sm">Assign Complaint</h3>
          <input className="input" placeholder="User ID to assign to" value={assignTo} onChange={(e) => setAssignTo(e.target.value)} />
          <button className="btn-primary text-sm" onClick={() => assign.mutate({ id: id!, assigned_to: assignTo })}>
            Assign
          </button>
        </div>

        {/* Escalate */}
        <div className="card space-y-3">
          <h3 className="font-medium text-sm">Escalate</h3>
          <TextArea rows={3} placeholder="Reason for escalation..." value={reason} onChange={(e) => setReason(e.target.value)} />
          <button className="btn-secondary text-sm" onClick={() => escalate.mutate({ id: id!, reason })}>
            Escalate
          </button>
        </div>

        {/* Resolve */}
        <div className="card space-y-3">
          <h3 className="font-medium text-sm">Resolve</h3>
          <TextArea rows={3} placeholder="Resolution details..." value={resolution} onChange={(e) => setResolution(e.target.value)} />
          <button className="btn-primary text-sm" onClick={() => resolve.mutate({ id: id!, resolution })}>
            Mark Resolved
          </button>
        </div>

        {/* Close */}
        <div className="card">
          <h3 className="font-medium text-sm mb-3">Close Complaint</h3>
          <button className="btn-danger text-sm" onClick={() => close.mutate(id!)}>
            Close Complaint
          </button>
        </div>
      </div>
    </div>
  );
}
