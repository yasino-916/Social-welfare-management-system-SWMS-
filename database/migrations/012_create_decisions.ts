import { Knex } from 'knex';

/**
 * Application decision history (SRS §32).
 * The system never relies on a single mutable status — every decision is preserved.
 * Decision levels: KEBELE (local review) and WEREDA (final authorization).
 * Batch decisions link individual decisions back to a shared batch record (SRS §16.1, 16.2).
 */
export async function up(knex: Knex): Promise<void> {
  // Batch decisions — used for Accept All / Reject All (SRS §16.1, 16.2)
  await knex.schema.createTable('decision_batches', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.uuid('kebele_id').notNullable().references('id').inTable('kebeles').onDelete('RESTRICT');
    t.uuid('submitted_by').notNullable().references('id').inTable('users').onDelete('RESTRICT');
    t.enu('decision_type', ['ACCEPT', 'REJECT', 'ACCEPT_ALL', 'REJECT_ALL']).notNullable();
    t.integer('total_count').notNullable().defaultTo(0);
    t.text('reason').nullable();
    t.timestamps(true, true);

    t.index('kebele_id');
  });

  // Individual application decisions
  await knex.schema.createTable('application_decisions', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.uuid('application_id').notNullable().references('id').inTable('applications').onDelete('CASCADE');
    t.uuid('batch_id').nullable().references('id').inTable('decision_batches').onDelete('SET NULL');
    t.enu('decision_level', ['KEBELE', 'WEREDA']).notNullable();
    t.enu('decision_type', [
      'ACCEPT', 'REJECT', 'RETURN', 'MORE_INFO', 'ACCEPT_ALL', 'REJECT_ALL',
    ]).notNullable();
    // Reason is required for rejections and returns (SRS §BR-12)
    t.text('reason').nullable();
    t.uuid('decided_by').notNullable().references('id').inTable('users').onDelete('RESTRICT');
    t.timestamp('decided_at').notNullable().defaultTo(knex.fn.now());

    t.index('application_id');
    t.index('decided_by');
    t.index('decided_at');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('application_decisions');
  await knex.schema.dropTableIfExists('decision_batches');
}
