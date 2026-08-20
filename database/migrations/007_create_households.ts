import { Knex } from 'knex';

/**
 * Household records — the central registration unit (SRS §6, BR-01, BR-04).
 * A household belongs to a Kebele and may have multiple members.
 * The design does NOT assume every household has a father (SRS §6).
 */
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('households', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.uuid('kebele_id').notNullable().references('id').inTable('kebeles').onDelete('RESTRICT');
    // Head of household — nullable because it may not be confirmed at time of creation
    t.uuid('household_head_person_id').nullable().references('id').inTable('persons').onDelete('SET NULL');
    t.string('village', 255).nullable();
    t.integer('household_size').notNullable().defaultTo(1);
    t.uuid('registration_reason_id').nullable().references('id').inTable('registration_reasons').onDelete('SET NULL');
    t.text('other_reason_description').nullable(); // required when reason is "Other"
    // Income and housing info (SRS §6.1)
    t.string('income_level', 100).nullable();
    t.string('housing_status', 100).nullable();
    t.string('employment_status', 100).nullable();
    // Workflow status mirrors the application status for quick queries
    t.enu('status', [
      'DRAFT', 'SUBMITTED', 'UNDER_KEBELE_REVIEW',
      'MORE_INFORMATION_REQUIRED', 'RETURNED_FOR_CORRECTION',
      'KEBELE_ACCEPTED', 'KEBELE_REJECTED', 'SUBMITTED_TO_WEREDA',
      'RETURNED_BY_SUPER_ADMIN', 'SUPER_ADMIN_APPROVED', 'SUPER_ADMIN_REJECTED',
      'ACTIVE_BENEFICIARY', 'SUSPENDED', 'CLOSED',
    ]).notNullable().defaultTo('DRAFT');
    t.timestamps(true, true);

    t.index('kebele_id');
    t.index('status');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('households');
}
