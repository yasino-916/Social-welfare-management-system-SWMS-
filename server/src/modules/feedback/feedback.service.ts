import { v4 as uuidv4 } from 'uuid';
import db from '../../config/database';
import { AppError } from '../../middleware/errorHandler';
import { FeedbackStatus, UserRole } from '../../types/enums';

type Actor = { id: string; role: UserRole; kebele_id?: string };

export async function publicSubmit(data: Record<string, unknown>) {
  const id = uuidv4();
  await db('feedback').insert({
    id,
    category_id: data.category_id,
    message: data.message,
    rating: data.rating,
    is_anonymous: data.is_anonymous || false,
    contact_name: data.contact_name,
    contact_phone: data.contact_phone,
    contact_email: data.contact_email,
    application_id: data.application_id,
    household_id: data.household_id,
    kebele_id: data.kebele_id,
    status: FeedbackStatus.SUBMITTED,
    submitted_at: new Date(),
  });
  return { id };
}

export async function listFeedback(filters: Record<string, unknown>, actor: Actor) {
  const query = db('feedback').select('*').orderBy('submitted_at', 'desc');
  if (actor.role !== UserRole.SUPER_ADMIN && actor.kebele_id) {
    query.where('kebele_id', actor.kebele_id);
  }
  if (filters.status) query.where('status', filters.status as string);
  return query;
}

export async function getFeedbackById(id: string) {
  const fb = await db('feedback').where({ id }).first();
  if (!fb) throw new AppError('Feedback not found', 404);
  return fb;
}

export async function updateStatus(id: string, status: FeedbackStatus, actorId: string) {
  await db('feedback').where({ id }).update({ status });
  return getFeedbackById(id);
}
