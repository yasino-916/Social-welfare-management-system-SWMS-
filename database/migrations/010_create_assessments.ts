import { Knex } from 'knex';

/**
 * Assessment records (SRS §13).
 * Multiple assessments may exist per application to preserve reassessment history.
 * The eligibility_score supports human decision-making but does NOT replace it (SRS §13).
 */
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('assessment_criteria', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.string('name', 255).notNullable();
    t.text('description').nullable();
    t.integer('max_score').defaultTo(10);
    t.boolean('is_active').defaultTo(true);
    t.timestamps(true, true);
  });

  await knex.schema.createTable('assessments', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.uuid('application_id').notNullable().references('id').inTable('applications').onDelete('CASCADE');
    t.uuid('assessed_by').notNullable().references('id').inTable('users').onDelete('RESTRICT');
    // Assessment criteria fields (SRS §13)
    t.string('income_level', 100).nullable();
    t.string('employment_status', 100).nullable();
    t.string('housing_status', 100).nullable();
    t.string('food_security_level', 100).nullable();
    t.boolean('has_disability').notNullable().defaultTo(false);
    t.boolean('has_elderly_members').notNullable().defaultTo(false);
    t.boolean('has_dependent_children').notNullable().defaultTo(false);
    t.enu('vulnerability_level', ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).nullable();
    t.decimal('eligibility_score', 5, 2).nullable();
    t.text('notes').nullable();
    t.timestamp('assessed_at').notNullable().defaultTo(knex.fn.now());
    t.timestamps(true, true);

    t.index('application_id');
  });

  await knex.schema.createTable('assessment_results', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.uuid('assessment_id').notNullable().references('id').inTable('assessments').onDelete('CASCADE');
    t.uuid('criterion_id').notNullable().references('id').inTable('assessment_criteria').onDelete('RESTRICT');
    t.integer('score').nullable();
    t.text('notes').nullable();
    t.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('assessment_results');
  await knex.schema.dropTableIfExists('assessments');
  await knex.schema.dropTableIfExists('assessment_criteria');
}
