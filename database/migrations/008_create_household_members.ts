import { Knex } from 'knex';

/**
 * Links persons to households (SRS §6, §31).
 * Supports household transfers over time via joined_at / left_at.
 * is_head flag marks the household head (can be father, mother, guardian, or other — SRS §6).
 */
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('household_members', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.uuid('household_id').notNullable().references('id').inTable('households').onDelete('CASCADE');
    t.uuid('person_id').notNullable().references('id').inTable('persons').onDelete('RESTRICT');
    t.string('relationship_to_head', 100).notNullable();
    t.boolean('is_head').notNullable().defaultTo(false);
    t.date('joined_at').notNullable().defaultTo(knex.fn.now());
    t.date('left_at').nullable(); // null = still in household

    // Vulnerability-specific flags for this member
    t.boolean('has_disability').notNullable().defaultTo(false);
    t.boolean('is_orphan').notNullable().defaultTo(false);
    t.boolean('is_elderly').notNullable().defaultTo(false);
    t.string('education_level', 100).nullable();
    t.string('employment_status', 100).nullable();

    t.index('household_id');
    t.index('person_id');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('household_members');
}
