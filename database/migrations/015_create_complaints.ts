import { Knex } from 'knex';

/**
 * Complaints system (SRS §5.3–5.5, FR-22–FR-26, BR-14–BR-17).
 * DELIBERATELY INDEPENDENT from registration.
 * Full lifecycle: SUBMITTED → RECEIVED → ASSIGNED → UNDER_INVESTIGATION
 *                → ESCALATED → ACTION_TAKEN → RESOLVED → CLOSED (SRS §5.4).
 * Accountability rules (SRS §5.5):
 *   - A person cannot investigate their own complaint.
 *   - Complaints against a Kebele Admin escalate to Super Admin.
 */
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('complaint_categories', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.string('name', 255).notNullable().unique();
    t.string('name_am', 255).nullable();
    t.boolean('is_active').defaultTo(true);
    t.timestamps(true, true);
  });

  await knex.schema.createTable('complaints', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.string('complaint_reference', 50).notNullable().unique();
    t.uuid('category_id').nullable().references('id').inTable('complaint_categories').onDelete('SET NULL');
    t.text('description').notNullable();
    t.enu('priority', ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).notNullable().defaultTo('MEDIUM');
    t.boolean('is_anonymous').notNullable().defaultTo(false);
    // Voluntarily provided contact info — protected (SRS §33)
    t.string('contact_name', 255).nullable();
    t.string('contact_phone', 30).nullable();
    // Optional references — not required (SRS §5.3, FR-23)
    t.uuid('application_id').nullable().references('id').inTable('applications').onDelete('SET NULL');
    t.uuid('household_id').nullable().references('id').inTable('households').onDelete('SET NULL');
    t.uuid('person_id').nullable().references('id').inTable('persons').onDelete('SET NULL');
    t.uuid('kebele_id').nullable().references('id').inTable('kebeles').onDelete('SET NULL');
    t.enu('status', [
      'SUBMITTED', 'RECEIVED', 'ASSIGNED', 'UNDER_INVESTIGATION',
      'ESCALATED', 'ACTION_TAKEN', 'RESOLVED', 'CLOSED',
    ]).notNullable().defaultTo('SUBMITTED');
    t.uuid('assigned_to').nullable().references('id').inTable('users').onDelete('SET NULL');
    t.timestamp('submitted_at').notNullable().defaultTo(knex.fn.now());
    t.timestamp('resolved_at').nullable();
    t.timestamp('closed_at').nullable();
    t.timestamps(true, true);

    t.index('complaint_reference');
    t.index('status');
    t.index('priority');
    t.index('kebele_id');
    t.index('assigned_to');
    t.index('submitted_at');
  });

  // Assignment history — who was assigned and when (SRS §5.3)
  await knex.schema.createTable('complaint_assignments', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.uuid('complaint_id').notNullable().references('id').inTable('complaints').onDelete('CASCADE');
    t.uuid('assigned_to').notNullable().references('id').inTable('users').onDelete('RESTRICT');
    t.uuid('assigned_by').notNullable().references('id').inTable('users').onDelete('RESTRICT');
    t.timestamp('assigned_at').notNullable().defaultTo(knex.fn.now());
    t.timestamp('unassigned_at').nullable();

    t.index('complaint_id');
  });

  // Investigation actions, escalation events, and resolution notes (SRS §5.3)
  await knex.schema.createTable('complaint_actions', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.uuid('complaint_id').notNullable().references('id').inTable('complaints').onDelete('CASCADE');
    t.text('action_description').notNullable();
    t.uuid('action_by').notNullable().references('id').inTable('users').onDelete('RESTRICT');
    t.timestamp('action_at').notNullable().defaultTo(knex.fn.now());

    t.index('complaint_id');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('complaint_actions');
  await knex.schema.dropTableIfExists('complaint_assignments');
  await knex.schema.dropTableIfExists('complaints');
  await knex.schema.dropTableIfExists('complaint_categories');
}
