import clsx from 'clsx';
import { ApplicationStatus, ComplaintStatus, DocumentStatus } from '@/types/enums';

type Status = ApplicationStatus | ComplaintStatus | DocumentStatus | string;

const colorMap: Record<string, string> = {
  // Application
  DRAFT: 'badge-yellow',
  SUBMITTED: 'badge-blue',
  UNDER_KEBELE_REVIEW: 'badge-blue',
  MORE_INFORMATION_REQUIRED: 'badge-yellow',
  RETURNED_FOR_CORRECTION: 'badge-yellow',
  KEBELE_ACCEPTED: 'badge-green',
  KEBELE_REJECTED: 'badge-red',
  SUBMITTED_TO_WEREDA: 'badge-blue',
  RETURNED_BY_SUPER_ADMIN: 'badge-yellow',
  SUPER_ADMIN_APPROVED: 'badge-green',
  SUPER_ADMIN_REJECTED: 'badge-red',
  ACTIVE_BENEFICIARY: 'badge-green',
  SUSPENDED: 'badge-red',
  CLOSED: 'badge-yellow',
  // Complaint
  ASSIGNED: 'badge-blue',
  UNDER_INVESTIGATION: 'badge-yellow',
  ESCALATED: 'badge-red',
  ACTION_TAKEN: 'badge-blue',
  RESOLVED: 'badge-green',
  // Document
  UPLOADED: 'badge-blue',
  UNDER_REVIEW: 'badge-yellow',
  VERIFIED: 'badge-green',
  REJECTED: 'badge-red',
  EXPIRED: 'badge-yellow',
  REUPLOAD_REQUIRED: 'badge-red',
};

interface Props {
  status: Status;
  className?: string;
}

export default function StatusBadge({ status, className }: Props) {
  const colorClass = colorMap[status] ?? 'badge-yellow';
  const label = status.replace(/_/g, ' ');

  return (
    <span className={clsx(colorClass, className)} role="status">
      {label}
    </span>
  );
}
