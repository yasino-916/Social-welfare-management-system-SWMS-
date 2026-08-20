import { Knex } from 'knex';

/**
 * Employee assignment history (SRS §24).
 * Preserves a full record of who was assigned to which Kebele and when,
 * so that decisions can be traced back to the responsible employee.
 */
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('user_kebele_assignments', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    t.uuid('kebele_id').notNullable().references('id').inTable('kebeles').onDelete('CASCADE');
    t.uuid('assigned_by').nullable().references('id').inTable('users').onDelete('SET NULL');
    t.date('active_from').notNullable();
    t.date('active_to').nullable(); // null = currently active

    t.index('user_id');
    t.index('kebele_id');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('user_kebele_assignments');
}
