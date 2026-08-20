import { Knex } from 'knex';

/**
 * Public feedback (SRS §5.2, FR-21, FR-23, BR-13).
 * DELIBERATELY INDEPENDENT from applications and households.
 * A citizen may submit feedback with NO registration, application, or user account.
 * Optional FK fields link feedback to a specific record when the citizen chooses to.
 * No user_id FK is required for anonymous/public submissions (SRS §33).
 */
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('feedback_categories', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.string('name', 255).notNullable().unique();
    t.string('name_am', 255).nullable();
    t.boolean('is_active').defaultTo(true);
    t.timestamps(true, true);
  });

  await knex.schema.createTable('feedback', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.uuid('category_id').nullable().references('id').inTable('feedback_categories').onDelete('SET NULL');
    t.text('message').notNullable();
    t.integer('rating').nullable().checkBetween([1, 5]);
    t.boolean('is_anonymous').notNullable().defaultTo(false);
    // Voluntarily provided contact info — protected (SRS §33)
    t.string('contact_name', 255).nullable();
    t.string('contact_phone', 30).nullable();
    t.string('contact_email', 255).nullable();
    // Optional references — not required (SRS §5.2, FR-23)
    t.uuid('application_id').nullable().references('id').inTable('applications').onDelete('SET NULL');
    t.uuid('household_id').nullable().references('id').inTable('households').onDelete('SET NULL');
    t.uuid('kebele_id').nullable().references('id').inTable('kebeles').onDelete('SET NULL');
    t.enu('status', ['SUBMITTED', 'REVIEWED', 'ADDRESSED', 'CLOSED']).notNullable().defaultTo('SUBMITTED');
    t.timestamp('submitted_at').notNullable().defaultTo(knex.fn.now());
    t.timestamps(true, true);

    t.index('submitted_at');
    t.index('status');
    t.index('kebele_id');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('feedback');
  await knex.schema.dropTableIfExists('feedback_categories');
}
