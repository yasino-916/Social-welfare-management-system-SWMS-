import { Knex } from 'knex';

/**
 * In-app notifications for authorized users (SRS §21).
 * Entity type + entity ID allow the UI to link directly to the related record.
 */
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('notifications', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    t.string('title', 255).notNullable();
    t.text('message').notNullable();
    t.boolean('is_read').notNullable().defaultTo(false);
    t.string('entity_type', 100).nullable(); // e.g. 'application', 'complaint'
    t.uuid('entity_id').nullable();
    t.timestamps(true, true);

    t.index('user_id');
    t.index('is_read');
    t.index(['user_id', 'is_read']); // compound for unread count queries
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('notifications');
}
