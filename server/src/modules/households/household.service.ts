import { v4 as uuidv4 } from 'uuid';
import db from '../../config/database';
import { AppError } from '../../middleware/errorHandler';
import { writeAuditLog } from '../../middleware/auditMiddleware';
import { UserRole } from '../../types/enums';

type Actor = { id: string; role: UserRole; kebele_id?: string };

export async function listHouseholds(filters: Record<string, unknown>, actor: Actor) {
  const query = db('households as h')
    .join('kebeles as k', 'h.kebele_id', 'k.id')
    .select('h.*', 'k.name as kebele_name')
    .orderBy('h.created_at', 'desc');

  // Kebele data isolation (SRS §23)
  if (actor.role !== UserRole.SUPER_ADMIN) {
    query.where('h.kebele_id', actor.kebele_id!);
  } else if (filters.kebele_id) {
    query.where('h.kebele_id', filters.kebele_id as string);
  }

  if (filters.status) query.where('h.status', filters.status as string);
  return query;
}

export async function createHousehold(data: Record<string, unknown>, createdBy: string | undefined) {
  const id = uuidv4();
  await db('households').insert({
    id,
    kebele_id: data.kebele_id,
    village: data.village,
    household_size: data.household_size,
    registration_reason_id: data.registration_reason_id,
    other_reason_description: data.other_reason_description,
    status: 'DRAFT',
    created_at: new Date(),
    updated_at: new Date(),
  });

  await writeAuditLog({
    user_id: createdBy,
    action: 'CREATE_HOUSEHOLD',
    entity_type: 'household',
    entity_id: id,
  });

  return db('households').where({ id }).first();
}

export async function getHouseholdById(id: string, actor: Actor) {
  const household = await db('households').where({ id }).first();
  if (!household) throw new AppError('Household not found', 404);

  // Kebele data isolation
  if (actor.role !== UserRole.SUPER_ADMIN && household.kebele_id !== actor.kebele_id) {
    throw new AppError('Access denied', 403);
  }

  return household;
}

export async function updateHousehold(id: string, data: Record<string, unknown>, updatedBy: string) {
  const allowed: Record<string, unknown> = {};
  const fields = ['village', 'household_size', 'registration_reason_id', 'other_reason_description'];
  fields.forEach((f) => { if (data[f] !== undefined) allowed[f] = data[f]; });
  allowed.updated_at = new Date();

  await db('households').where({ id }).update(allowed);
  await writeAuditLog({ user_id: updatedBy, action: 'UPDATE_HOUSEHOLD', entity_type: 'household', entity_id: id });
  return db('households').where({ id }).first();
}

export async function listMembers(householdId: string, actor: Actor) {
  await getHouseholdById(householdId, actor); // enforces access check
  return db('household_members as hm')
    .join('persons as p', 'hm.person_id', 'p.id')
    .select('hm.*', 'p.full_name', 'p.date_of_birth', 'p.gender', 'p.national_id', 'p.phone')
    .where('hm.household_id', householdId)
    .whereNull('hm.left_at');
}

export async function addMember(householdId: string, data: Record<string, unknown>, createdBy: string | undefined) {
  const memberId = uuidv4();
  await db('household_members').insert({
    id: memberId,
    household_id: householdId,
    person_id: data.person_id,
    relationship_to_head: data.relationship_to_head,
    is_head: data.is_head || false,
    joined_at: new Date(),
  });
  await writeAuditLog({
    user_id: createdBy,
    action: 'ADD_HOUSEHOLD_MEMBER',
    entity_type: 'household_member',
    entity_id: memberId,
    new_value: { household_id: householdId, person_id: data.person_id },
  });
  return db('household_members').where({ id: memberId }).first();
}
