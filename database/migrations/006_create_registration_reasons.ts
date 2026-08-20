import { Knex } from 'knex';

/**
 * Configurable registration reasons (SRS §9).
 * Stored as a lookup table so reasons can be added/edited without code changes.
 */
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('registration_reasons', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.string('code', 100).notNullable().unique();
    t.string('label_en', 255).notNullable();
    t.string('label_am', 255).nullable(); // Amharic label (SRS §28.4)
    t.boolean('requires_description').notNullable().defaultTo(false); // true for "Other"
    t.boolean('is_active').notNullable().defaultTo(true);
    t.integer('display_order').defaultTo(0);
    t.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('registration_reasons');
}
