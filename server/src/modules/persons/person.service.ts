import { v4 as uuidv4 } from 'uuid';
import db from '../../config/database';
import { AppError } from '../../middleware/errorHandler';
import { writeAuditLog } from '../../middleware/auditMiddleware';

export async function checkDuplicate(data: Record<string, unknown>) {
  // SRS §10 — strong match on National ID / FAN / FIN, soft match on name + DOB
  const hasStrongId = !!(data.national_id || data.fan || data.fin);
  const hasSoftId = !!(data.full_name && data.date_of_birth);

  if (!hasStrongId && !hasSoftId) {
    return { possible_duplicates: [], has_duplicates: false };
  }

  const matches = await db('persons').where(function () {
    if (hasStrongId) {
      if (data.national_id) this.orWhere('national_id', data.national_id as string);
      if (data.fan) this.orWhere('fan', data.fan as string);
      if (data.fin) this.orWhere('fin', data.fin as string);
    } else if (hasSoftId) {
      this.where('full_name', data.full_name as string).andWhere('date_of_birth', data.date_of_birth as string);
    }
  }).select('id', 'full_name', 'date_of_birth', 'national_id', 'fan', 'fin');

  return {
    possible_duplicates: matches,
    has_duplicates: matches.length > 0,
  };
}

export async function listPersons(filters: Record<string, unknown>) {
  const query = db('persons').select('*').orderBy('full_name');
  if (filters.national_id) query.where('national_id', filters.national_id as string);
  if (filters.fan) query.where('fan', filters.fan as string);
  if (filters.fin) query.where('fin', filters.fin as string);
  return query;
}

export async function createPerson(data: Record<string, unknown>, createdBy: string | undefined) {
  const duplicate = await checkDuplicate(data);
  if (duplicate.has_duplicates) {
    throw new AppError('Possible duplicate person detected. Please review before creating.', 409);
  }

  const id = uuidv4();
  await db('persons').insert({
    id,
    full_name: data.full_name,
    date_of_birth: data.date_of_birth,
    gender: data.gender,
    national_id: data.national_id,
    fan: data.fan,
    fin: data.fin,
    phone: data.phone,
    created_at: new Date(),
    updated_at: new Date(),
  });

  await writeAuditLog({ user_id: createdBy, action: 'CREATE_PERSON', entity_type: 'person', entity_id: id });
  return db('persons').where({ id }).first();
}

export async function getPersonById(id: string) {
  const person = await db('persons').where({ id }).first();
  if (!person) throw new AppError('Person not found', 404);
  return person;
}

export async function updatePerson(id: string, data: Record<string, unknown>, updatedBy: string) {
  const old = await getPersonById(id);
  const allowed: Record<string, unknown> = {};
  const fields = ['full_name', 'date_of_birth', 'gender', 'national_id', 'fan', 'fin', 'phone'];
  fields.forEach((f) => { if (data[f] !== undefined) allowed[f] = data[f]; });
  allowed.updated_at = new Date();

  await db('persons').where({ id }).update(allowed);
  await writeAuditLog({
    user_id: updatedBy,
    action: 'UPDATE_PERSON',
    entity_type: 'person',
    entity_id: id,
    old_value: old as Record<string, unknown>,
    new_value: allowed,
  });
  return db('persons').where({ id }).first();
}
