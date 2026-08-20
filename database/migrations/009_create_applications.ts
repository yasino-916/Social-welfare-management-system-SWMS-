import { Knex } from 'knex';

/**
 * Application workflow records (SRS §11).
 * One household can have multiple applications over time (SRS §31).
 * The reference_number is what the public applicant uses for status tracking (SRS §4.1).
 * submitted_by_person_id links to the person who self-registered (no user account).
 * registered_by_user_id links to the authorized employee who did assisted registration.
 */
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('applications', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.string('reference_number', 50).notNullable().unique();
    t.uuid('household_id').notNullable().references('id').inTable('households').onDelete('RESTRICT');
    // Self-registration: person who submitted (no user account needed — SRS §BR-05)
    t.uuid('submitted_by_person_id').nullable().references('id').inTable('persons').onDelete('SET NULL');
    // Assisted registration: authorized employee who registered on behalf (SRS §8)
    t.uuid('registered_by_user_id').nullable().references('id').inTable('users').onDelete('SET NULL');
    t.enu('status', [
      'DRAFT', 'SUBMITTED', 'UNDER_KEBELE_REVIEW',
      'MORE_INFORMATION_REQUIRED', 'RETURNED_FOR_CORRECTION',
      'KEBELE_ACCEPTED', 'KEBELE_REJECTED', 'SUBMITTED_TO_WEREDA',
      'RETURNED_BY_SUPER_ADMIN', 'SUPER_ADMIN_APPROVED', 'SUPER_ADMIN_REJECTED',
      'ACTIVE_BENEFICIARY', 'SUSPENDED', 'CLOSED',
    ]).notNullable().defaultTo('DRAFT');
    t.timestamp('submitted_at').nullable();
    t.timestamps(true, true);

    // Performance indexes (SRS §28.2)
    t.index('reference_number');
    t.index('household_id');
    t.index('status');
    t.index('submitted_at');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('applications');
}
