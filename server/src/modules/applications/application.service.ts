import { v4 as uuidv4 } from 'uuid';
import db from '../../config/database';
import { AppError } from '../../middleware/errorHandler';
import { writeAuditLog } from '../../middleware/auditMiddleware';
import { ApplicationStatus, DecisionLevel, DecisionType, UserRole } from '../../types/enums';
import { generateReferenceNumber } from '../../utils/referenceNumber';

type Actor = { id: string; role: UserRole; kebele_id?: string };

export async function publicSubmit(data: Record<string, unknown>) {
  const applicationId = uuidv4();
  const reference_number = generateReferenceNumber('APP');

  await db('applications').insert({
    id: applicationId,
    reference_number,
    household_id: data.household_id,
    status: ApplicationStatus.SUBMITTED,
    submitted_at: new Date(),
    created_at: new Date(),
    updated_at: new Date(),
  });

  return { id: applicationId, reference_number };
}

export async function checkStatus(reference: string, phone: string) {
  if (!reference) throw new AppError('Reference number is required', 400);

  const app = await db('applications as a')
    .join('households as h', 'a.household_id', 'h.id')
    .where('a.reference_number', reference)
    .select('a.reference_number', 'a.status', 'a.submitted_at')
    .first();

  if (!app) throw new AppError('Application not found', 404);
  return app;
}

export async function listApplications(filters: Record<string, unknown>, actor: Actor) {
  const query = db('applications as a')
    .join('households as h', 'a.household_id', 'h.id')
    .join('kebeles as k', 'h.kebele_id', 'k.id')
    .select('a.*', 'k.name as kebele_name', 'k.id as kebele_id')
    .orderBy('a.created_at', 'desc');

  if (actor.role !== UserRole.SUPER_ADMIN) {
    query.where('h.kebele_id', actor.kebele_id!);
  } else if (filters.kebele_id) {
    query.where('h.kebele_id', filters.kebele_id as string);
  }

  if (filters.status) query.where('a.status', filters.status as string);
  return query;
}

export async function getApplicationById(id: string, actor: Actor) {
  const app = await db('applications as a')
    .join('households as h', 'a.household_id', 'h.id')
    .where('a.id', id)
    .select('a.*', 'h.kebele_id')
    .first();

  if (!app) throw new AppError('Application not found', 404);

  if (actor.role !== UserRole.SUPER_ADMIN && app.kebele_id !== actor.kebele_id) {
    throw new AppError('Access denied', 403);
  }

  return app;
}

export async function kebeleDecision(
  applicationId: string,
  body: Record<string, unknown>,
  actor: Actor
) {
  const app = await getApplicationById(applicationId, actor);

  // Conflict of interest check (SRS §35 / BR-16)
  if (app.submitted_by_person_id === actor.id) {
    throw new AppError('You cannot decide on your own application', 403);
  }

  const statusMap: Record<string, ApplicationStatus> = {
    ACCEPT: ApplicationStatus.KEBELE_ACCEPTED,
    REJECT: ApplicationStatus.KEBELE_REJECTED,
    RETURN: ApplicationStatus.RETURNED_FOR_CORRECTION,
    MORE_INFO: ApplicationStatus.MORE_INFORMATION_REQUIRED,
  };

  const newStatus = statusMap[body.decision_type as string];
  await db('applications').where({ id: applicationId }).update({
    status: newStatus,
    updated_at: new Date(),
  });

  const decisionId = uuidv4();
  await db('application_decisions').insert({
    id: decisionId,
    application_id: applicationId,
    decision_level: DecisionLevel.KEBELE,
    decision_type: body.decision_type,
    reason: body.reason,
    decided_by: actor.id,
    decided_at: new Date(),
  });

  await writeAuditLog({
    user_id: actor.id,
    role: actor.role,
    kebele_id: actor.kebele_id,
    action: `KEBELE_${body.decision_type}`,
    entity_type: 'application',
    entity_id: applicationId,
    reason: body.reason as string,
  });

  return { application_id: applicationId, status: newStatus };
}

export async function submitToWereda(applicationIds: string[], actor: Actor) {
  const batchId = uuidv4();

  await db('applications')
    .whereIn('id', applicationIds)
    .update({ status: ApplicationStatus.SUBMITTED_TO_WEREDA, updated_at: new Date() });

  await db('decision_batches').insert({
    id: batchId,
    kebele_id: actor.kebele_id,
    submitted_by: actor.id,
    decision_type: DecisionType.ACCEPT,
    total_count: applicationIds.length,
    created_at: new Date(),
  });

  await writeAuditLog({
    user_id: actor.id,
    role: actor.role,
    action: 'SUBMIT_TO_WEREDA',
    entity_type: 'batch',
    entity_id: batchId,
    new_value: { count: applicationIds.length },
  });

  return { batch_id: batchId, submitted: applicationIds.length };
}

export async function batchDecision(body: Record<string, unknown>, actorId: string) {
  const { decision_type, kebele_id, reason } = body as {
    decision_type: string;
    kebele_id: string;
    reason?: string;
  };

  const applications = await db('applications as a')
    .join('households as h', 'a.household_id', 'h.id')
    .where('h.kebele_id', kebele_id)
    .where('a.status', ApplicationStatus.SUBMITTED_TO_WEREDA)
    .select('a.id');

  const ids = applications.map((a: { id: string }) => a.id);
  if (ids.length === 0) throw new AppError('No submitted applications found for this Kebele', 400);

  const newStatus =
    decision_type === 'ACCEPT_ALL'
      ? ApplicationStatus.SUPER_ADMIN_APPROVED
      : ApplicationStatus.SUPER_ADMIN_REJECTED;

  const batchId = uuidv4();
  await db('applications').whereIn('id', ids).update({ status: newStatus, updated_at: new Date() });

  await db('decision_batches').insert({
    id: batchId,
    kebele_id,
    submitted_by: actorId,
    decision_type,
    total_count: ids.length,
    reason,
    created_at: new Date(),
  });

  await writeAuditLog({
    user_id: actorId,
    role: UserRole.SUPER_ADMIN,
    action: decision_type,
    entity_type: 'batch',
    entity_id: batchId,
    reason,
    new_value: { count: ids.length, kebele_id },
  });

  return { batch_id: batchId, affected: ids.length };
}

export async function weredaDecision(
  applicationId: string,
  body: Record<string, unknown>,
  actorId: string
) {
  const statusMap: Record<string, ApplicationStatus> = {
    ACCEPT: ApplicationStatus.SUPER_ADMIN_APPROVED,
    REJECT: ApplicationStatus.SUPER_ADMIN_REJECTED,
    RETURN: ApplicationStatus.RETURNED_BY_SUPER_ADMIN,
  };

  const newStatus = statusMap[body.decision_type as string];
  await db('applications').where({ id: applicationId }).update({ status: newStatus, updated_at: new Date() });

  await db('application_decisions').insert({
    id: uuidv4(),
    application_id: applicationId,
    decision_level: DecisionLevel.WEREDA,
    decision_type: body.decision_type,
    reason: body.reason,
    decided_by: actorId,
    decided_at: new Date(),
  });

  await writeAuditLog({
    user_id: actorId,
    role: UserRole.SUPER_ADMIN,
    action: `WEREDA_${body.decision_type}`,
    entity_type: 'application',
    entity_id: applicationId,
    reason: body.reason as string,
  });

  return { application_id: applicationId, status: newStatus };
}
