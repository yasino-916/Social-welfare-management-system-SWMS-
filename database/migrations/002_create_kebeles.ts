import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('kebeles', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.uuid('wereda_id').notNullable().references('id').inTable('weredas').onDelete('RESTRICT');
    t.string('name', 255).notNullable();
    t.string('code', 50).notNullable();
    t.timestamps(true, true);

    t.unique(['wereda_id', 'code']);

    // Index for lookups by wereda
    t.index('wereda_id');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('kebeles');
}
