import { v4 as uuidv4 } from 'uuid';
import db from '../../config/database';
import { writeAuditLog } from '../../middleware/auditMiddleware';
import { UserRole } from '../../types/enums';

type Actor = { id: string; role: UserRole; kebele_id?: string };

export async function listPrograms() {
  return db('support_programs').where({ is_active: true }).orderBy('name');
}

export async function createProgram(data: Record<string, unknown>) {
  const id = uuidv4();
  await db('support_programs').insert({ id, ...data, is_active: true, created_at: new Date() });
  return db('support_programs').where({ id }).first();
}

export async function listDistributions(filters: Record<string, unknown>, actor: Actor) {
  const query = db('support_distributions as sd')
    .join('support_programs as sp', 'sd.support_program_id', 'sp.id')
    .join('households as h', 'sd.household_id', 'h.id')
    .select('sd.*', 'sp.name as program_name', 'sp.support_type')
    .orderBy('sd.distributed_at', 'desc');

  if (actor.role !== UserRole.SUPER_ADMIN && actor.kebele_id) {
    query.where('h.kebele_id', actor.kebele_id);
  }
  return query;
}

export async function recordDistribution(data: Record<string, unknown>, recordedBy: string) {
  const id = uuidv4();
  await db('support_distributions').insert({
    id,
    household_id: data.household_id,
    person_id: data.person_id,
    support_program_id: data.support_program_id,
    amount: data.amount,
    quantity: data.quantity,
    unit: data.unit,
    distributed_at: data.distributed_at,
    location: data.location,
    distributed_by: recordedBy,
    notes: data.notes,
  });

  await writeAuditLog({ user_id: recordedBy, action: 'RECORD_SUPPORT', entity_type: 'support_distribution', entity_id: id });
  return db('support_distributions').where({ id }).first();
}

export async function getHouseholdHistory(householdId: string) {
  return db('support_distributions as sd')
    .join('support_programs as sp', 'sd.support_program_id', 'sp.id')
    .where('sd.household_id', householdId)
    .select('sd.*', 'sp.name as program_name', 'sp.support_type')
    .orderBy('sd.distributed_at', 'desc');
}
