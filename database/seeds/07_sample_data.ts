import { Knex } from 'knex';
import { v4 as uuidv4 } from 'uuid';

/**
 * Seed: Sample household, person, application and complaint data for development.
 * ⚠ Do NOT run in production.
 */
export async function seed(knex: Knex): Promise<void> {
  // Clean up sample data in reverse FK order
  await knex('complaint_actions').del();
  await knex('complaint_assignments').del();
  await knex('complaints').del();
  await knex('feedback').del();
  await knex('application_decisions').del();
  await knex('assessments').del();
  await knex('documents').del();
  await knex('applications').del();
  await knex('household_members').del();
  await knex('households').del();
  await knex('persons').del();

  const kebele01 = '00000000-0000-0000-0000-000000000010';

  // ── Persons ────────────────────────────────────────────────────────────────
  const persons = [
    {
      id: uuidv4(),
      full_name: 'Almaz Tadesse',
      date_of_birth: '1980-03-15',
      gender: 'FEMALE',
      national_id: 'ETH-1001',
      phone: '0911000001',
    },
    {
      id: uuidv4(),
      full_name: 'Bekele Tadesse',
      date_of_birth: '2008-07-22',
      gender: 'MALE',
      national_id: null,
      phone: null,
    },
    {
      id: uuidv4(),
      full_name: 'Chaltu Bekele',
      date_of_birth: '2012-01-10',
      gender: 'FEMALE',
      national_id: null,
      phone: null,
    },
    {
      id: uuidv4(),
      full_name: 'Dawit Girma',
      date_of_birth: '1975-11-05',
      gender: 'MALE',
      national_id: 'ETH-1002',
      phone: '0911000002',
    },
  ];

  await knex('persons').insert(persons);

  // ── Households ─────────────────────────────────────────────────────────────
  const household1Id = uuidv4();
  const household2Id = uuidv4();

  const reasonRow = await knex('registration_reasons').where('code', 'female_headed').first();
  const hardshipReason = await knex('registration_reasons').where('code', 'extreme_hardship').first();

  await knex('households').insert([
    {
      id: household1Id,
      kebele_id: kebele01,
      household_head_person_id: persons[0].id,
      village: 'Kebele 01 Area A',
      household_size: 3,
      registration_reason_id: reasonRow?.id,
      status: 'KEBELE_ACCEPTED',
    },
    {
      id: household2Id,
      kebele_id: kebele01,
      household_head_person_id: persons[3].id,
      village: 'Kebele 01 Area B',
      household_size: 1,
      registration_reason_id: hardshipReason?.id,
      status: 'SUBMITTED',
    },
  ]);

  // ── Household Members ──────────────────────────────────────────────────────
  await knex('household_members').insert([
    { id: uuidv4(), household_id: household1Id, person_id: persons[0].id, relationship_to_head: 'Head',   is_head: true,  joined_at: '2026-01-01' },
    { id: uuidv4(), household_id: household1Id, person_id: persons[1].id, relationship_to_head: 'Child',  is_head: false, joined_at: '2026-01-01' },
    { id: uuidv4(), household_id: household1Id, person_id: persons[2].id, relationship_to_head: 'Child',  is_head: false, joined_at: '2026-01-01' },
    { id: uuidv4(), household_id: household2Id, person_id: persons[3].id, relationship_to_head: 'Head',   is_head: true,  joined_at: '2026-01-01' },
  ]);

  // ── Applications ───────────────────────────────────────────────────────────
  const app1Id = uuidv4();
  const app2Id = uuidv4();

  await knex('applications').insert([
    {
      id: app1Id,
      reference_number: 'APP-20260101-DEMO01',
      household_id: household1Id,
      status: 'KEBELE_ACCEPTED',
      submitted_at: '2026-01-05 08:00:00',
    },
    {
      id: app2Id,
      reference_number: 'APP-20260102-DEMO02',
      household_id: household2Id,
      status: 'SUBMITTED',
      submitted_at: '2026-01-06 09:30:00',
    },
  ]);

  // ── Application Decision (for app1) ───────────────────────────────────────
  const kebeleAdminId = '00000000-0000-0000-0000-000000000101';

  await knex('application_decisions').insert([
    {
      id: uuidv4(),
      application_id: app1Id,
      decision_level: 'KEBELE',
      decision_type: 'ACCEPT',
      reason: null,
      decided_by: kebeleAdminId,
      decided_at: '2026-01-10 10:00:00',
    },
  ]);

  // ── Sample Complaint ───────────────────────────────────────────────────────
  await knex('complaints').insert([
    {
      id: uuidv4(),
      complaint_reference: 'CMP-20260115-DEMO01',
      description: 'My application was rejected without a clear reason.',
      priority: 'HIGH',
      is_anonymous: false,
      contact_name: 'Almaz Tadesse',
      contact_phone: '0911000001',
      application_id: app1Id,
      kebele_id: kebele01,
      status: 'SUBMITTED',
      submitted_at: '2026-01-15 11:00:00',
    },
  ]);

  // ── Sample Feedback ────────────────────────────────────────────────────────
  await knex('feedback').insert([
    {
      id: uuidv4(),
      message: 'The registration process was straightforward and the staff were helpful.',
      rating: 4,
      is_anonymous: true,
      kebele_id: kebele01,
      status: 'SUBMITTED',
      submitted_at: '2026-01-20 09:00:00',
    },
  ]);

  console.log('✓ Sample data seeded');
  console.log('  Households: 2 | Persons: 4 | Applications: 2 | Complaints: 1 | Feedback: 1');
}
