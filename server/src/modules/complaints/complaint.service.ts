import { v4 as uuidv4 } from 'uuid';
import db from '../../config/database';
import { AppError } from '../../middleware/errorHandler';
import { writeAuditLog } from '../../middleware/auditMiddleware';
import { ComplaintStatus, UserRole } from '../../types/enums';
import { generateReferenceNumber } from '../../utils/referenceNumber';

type Actor = { id: string; role: UserRole; kebele_id?: string };

export async function publicSubmit(data: Record<string, unknown>) {
  const id = uuidv4();
  const complaint_reference = generateReferenceNumber('CMP');

  await db('complaints').insert({
    id,
    complaint_reference,
    category_id: data.category_id,
    description: data.description,
    priority: data.priority || 'MEDIUM',
    is_anonymous: data.is_anonymous || false,
    contact_name: data.contact_name,
    contact_phone: data.contact_phone,
    application_id: data.application_id,
    household_id: data.household_id,
    kebele_id: data.kebele_id,
    status: ComplaintStatus.SUBMITTED,
    submitted_at: new Date(),
  });

  return { id, complaint_reference };
}

export async function getByReference(reference: string) {
  const complaint = await db('complaints')
    .where('complaint_reference', reference)
    .select('complaint_reference', 'status', 'priority', 'submitted_at')
    .first();
  if (!complaint) throw new AppError('Complaint not found', 404);
  return complaint;
}

export async function listComplaints(filters: Record<string, unknown>, actor: Actor) {
  const query = db('complaints').select('*').orderBy('submitted_at', 'desc');

  if (actor.role !== UserRole.SUPER_ADMIN && actor.kebele_id) {
    query.where('kebele_id', actor.kebele_id);
  }
  if (filters.status) query.where('status', filters.status as string);
  if (filters.priority) query.where('priority', filters.priority as string);
  return query;
}

export async function getComplaintById(id: string) {
  const complaint = await db('complaints').where({ id }).first();
  if (!complaint) throw new AppError('Complaint not found', 404);
  return complaint;
}

export async function assign(complaintId: string, assignedTo: string, actorId: string) {
  await db('complaints').where({ id: complaintId }).update({
    assigned_to: assignedTo,
    status: ComplaintStatus.ASSIGNED,
  });

  await db('complaint_assignments').insert({
    id: uuidv4(),
    complaint_id: complaintId,
    assigned_to: assignedTo,
    assigned_by: actorId,
    assigned_at: new Date(),
  });

  await writeAuditLog({ user_id: actorId, action: 'ASSIGN_COMPLAINT', entity_type: 'complaint', entity_id: complaintId });
  return getComplaintById(complaintId);
}

export async function addAction(complaintId: string, data: Record<string, unknown>, actorId: string) {
  // Self-investigation prevention (SRS §5.5 / BR-17)
  const complaint = await getComplaintById(complaintId);
  if (complaint.assigned_to === actorId && complaint.submitted_by_user_id === actorId) {
    throw new AppError('You cannot investigate your own complaint', 403);
  }

  const actionId = uuidv4();
  await db('complaint_actions').insert({
    id: actionId,
    complaint_id: complaintId,
    action_description: data.action_description,
    action_by: actorId,
    action_at: new Date(),
  });

  await db('complaints').where({ id: complaintId }).update({ status: ComplaintStatus.UNDER_INVESTIGATION });
  await writeAuditLog({ user_id: actorId, action: 'COMPLAINT_ACTION', entity_type: 'complaint', entity_id: complaintId });
  return { id: actionId };
}

export async function escalate(complaintId: string, reason: string, actorId: string) {
  await db('complaints').where({ id: complaintId }).update({ status: ComplaintStatus.ESCALATED });

  await db('complaint_actions').insert({
    id: uuidv4(),
    complaint_id: complaintId,
    action_description: `ESCALATED: ${reason}`,
    action_by: actorId,
    action_at: new Date(),
  });

  await writeAuditLog({ user_id: actorId, action: 'ESCALATE_COMPLAINT', entity_type: 'complaint', entity_id: complaintId, reason });
  return getComplaintById(complaintId);
}

export async function resolve(complaintId: string, resolution: string, actorId: string) {
  await db('complaints').where({ id: complaintId }).update({
    status: ComplaintStatus.RESOLVED,
    resolved_at: new Date(),
  });

  await db('complaint_actions').insert({
    id: uuidv4(),
    complaint_id: complaintId,
    action_description: `RESOLVED: ${resolution}`,
    action_by: actorId,
    action_at: new Date(),
  });

  await writeAuditLog({ user_id: actorId, action: 'RESOLVE_COMPLAINT', entity_type: 'complaint', entity_id: complaintId });
  return getComplaintById(complaintId);
}

export async function close(complaintId: string, actorId: string) {
  await db('complaints').where({ id: complaintId }).update({
    status: ComplaintStatus.CLOSED,
    closed_at: new Date(),
  });
  await writeAuditLog({ user_id: actorId, action: 'CLOSE_COMPLAINT', entity_type: 'complaint', entity_id: complaintId });
  return getComplaintById(complaintId);
}
