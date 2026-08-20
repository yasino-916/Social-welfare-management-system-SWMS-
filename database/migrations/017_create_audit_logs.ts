import { Knex } from 'knex';

/**
 * Audit trail for all critical actions (SRS §25, FR-30, BR-19).
 * Answers: WHO, WHAT, WHEN, WHERE (Kebele scope), WHY (reason), WHAT CHANGED (old/new value).
 * user_id is nullable to support system-generated events and public actions.
 * old_value / new_value are JSONB for flexible change tracking (SRS §26).
 */
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('audit_logs', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    // WHO
    t.uuid('user_id').nullable().references('id').inTable('users').onDelete('SET NULL');
    t.string('role', 50).nullable();          // snapshot at time of action
    t.uuid('kebele_id').nullable().references('id').inTable('kebeles').onDelete('SET NULL');
    // WHAT
    t.string('action', 100).notNullable();    // e.g. KEBELE_ACCEPT, LOGIN, UPLOAD_DOCUMENT
    t.string('entity_type', 100).notNullable(); // e.g. application, complaint, user
    t.uuid('entity_id').nullable();
    // CHANGE
    t.jsonb('old_value').nullable();
    t.jsonb('new_value').nullable();
    // WHY
    t.text('reason').nullable();
    // WHERE (network context — optional, SRS §25)
    t.string('ip_address', 45).nullable();
    // WHEN
    t.timestamp('created_at').notNullable().defaultTo(knex.fn.now());

    // Indexes for audit queries and reports (SRS §36)
    t.index('user_id');
    t.index('entity_type');
    t.index('entity_id');
    t.index('action');
    t.index('created_at');
    t.index('kebele_id');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('audit_logs');
}
