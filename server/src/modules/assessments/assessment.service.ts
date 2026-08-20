import { v4 as uuidv4 } from 'uuid';
import db from '../../config/database';
import { writeAuditLog } from '../../middleware/auditMiddleware';

export async function getByApplication(applicationId: string) {
  return db('assessments').where({ application_id: applicationId }).orderBy('assessed_at', 'desc');
}

export async function createAssessment(data: Record<string, unknown>, assessedBy: string) {
  const id = uuidv4();
  await db('assessments').insert({
    id,
    application_id: data.application_id,
    assessed_by: assessedBy,
    income_level: data.income_level,
    employment_status: data.employment_status,
    housing_status: data.housing_status,
    food_security_level: data.food_security_level,
    has_disability: data.has_disability || false,
    has_elderly_members: data.has_elderly_members || false,
    has_dependent_children: data.has_dependent_children || false,
    vulnerability_level: data.vulnerability_level,
    eligibility_score: data.eligibility_score,
    notes: data.notes,
    assessed_at: new Date(),
  });

  await writeAuditLog({ user_id: assessedBy, action: 'CREATE_ASSESSMENT', entity_type: 'assessment', entity_id: id });
  return db('assessments').where({ id }).first();
}

export async function updateAssessment(id: string, data: Record<string, unknown>, updatedBy: string) {
  const allowed = { ...data, updated_at: new Date() };
  delete allowed.id;
  delete allowed.application_id;
  await db('assessments').where({ id }).update(allowed);
  await writeAuditLog({ user_id: updatedBy, action: 'UPDATE_ASSESSMENT', entity_type: 'assessment', entity_id: id });
  return db('assessments').where({ id }).first();
}
