import db from '../../config/database';
import { UserRole } from '../../types/enums';

type Actor = { id: string; role: UserRole; kebele_id?: string };

/**
 * Multi-field search across persons, households, and applications (SRS §20).
 * Results are scoped by Kebele for non-Super-Admin users.
 */
export async function search(filters: Record<string, unknown>, actor: Actor) {
  const {
    q,            // general full-text term
    national_id,
    fan,
    fin,
    household_id,
    application_id,
    phone,
    kebele_id,
  } = filters as Record<string, string>;

  const query = db('persons as p')
    .leftJoin('household_members as hm', 'p.id', 'hm.person_id')
    .leftJoin('households as h', 'hm.household_id', 'h.id')
    .leftJoin('applications as a', 'h.id', 'a.household_id')
    .leftJoin('kebeles as k', 'h.kebele_id', 'k.id')
    .select(
      'p.id as person_id',
      'p.full_name',
      'p.national_id',
      'p.fan',
      'p.fin',
      'p.phone',
      'h.id as household_id',
      'a.id as application_id',
      'a.reference_number',
      'a.status as application_status',
      'k.name as kebele_name'
    )
    .limit(50);

  // Kebele isolation (SRS §23)
  if (actor.role !== UserRole.SUPER_ADMIN) {
    query.where('h.kebele_id', actor.kebele_id!);
  } else if (kebele_id) {
    query.where('h.kebele_id', kebele_id);
  }

  if (q) query.whereILike('p.full_name', `%${q}%`);
  if (national_id) query.where('p.national_id', national_id);
  if (fan) query.where('p.fan', fan);
  if (fin) query.where('p.fin', fin);
  if (household_id) query.where('h.id', household_id);
  if (application_id) query.where('a.id', application_id);
  if (phone) query.where('p.phone', phone);

  return query;
}
