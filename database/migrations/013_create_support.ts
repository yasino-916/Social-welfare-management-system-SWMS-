import { Knex } from 'knex';

/**
 * Support programs and distribution records (SRS §18).
 * An approved beneficiary can receive multiple support events across programs.
 * Prior support history is checked against program rules to prevent duplicate distribution (SRS §18).
 */
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('support_programs', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.string('name', 255).notNullable().unique();
    t.enu('support_type', [
      'FOOD', 'CASH', 'EDUCATIONAL', 'HEALTHCARE',
      'HOUSING', 'EMPLOYMENT', 'AGRICULTURAL', 'EMERGENCY',
      'SOCIAL_PROTECTION', 'OTHER',
    ]).notNullable();
    t.text('description').nullable();
    t.boolean('is_active').notNullable().defaultTo(true);
    t.integer('max_distributions_per_year').nullable(); // configurable program rule
    t.timestamps(true, true);
  });

  await knex.schema.createTable('support_distributions', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    // Primary beneficiary is the household (SRS §18 / BR-22)
    t.uuid('household_id').notNullable().references('id').inTable('households').onDelete('RESTRICT');
    // Optional: specific person within the household
    t.uuid('person_id').nullable().references('id').inTable('persons').onDelete('SET NULL');
    t.uuid('support_program_id').notNullable().references('id').inTable('support_programs').onDelete('RESTRICT');
    t.decimal('amount', 12, 2).nullable();
    t.string('quantity', 100).nullable();
    t.string('unit', 50).nullable();
    t.timestamp('distributed_at').notNullable();
    t.string('location', 255).nullable();
    t.uuid('distributed_by').notNullable().references('id').inTable('users').onDelete('RESTRICT');
    t.text('notes').nullable();
    t.timestamps(true, true);

    t.index('household_id');
    t.index('support_program_id');
    t.index('distributed_at');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('support_distributions');
  await knex.schema.dropTableIfExists('support_programs');
}
