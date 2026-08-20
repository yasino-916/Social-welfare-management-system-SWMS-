import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Roles lookup table
  await knex.schema.createTable('roles', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.string('name', 100).notNullable().unique();
    t.text('description');
    t.timestamps(true, true);
  });

  // Permissions lookup table
  await knex.schema.createTable('permissions', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.string('name', 100).notNullable().unique();
    t.text('description');
    t.timestamps(true, true);
  });

  // Users — authorized administrative personnel only (SRS §4.2)
  // Applicants never get a user account (SRS §BR-05)
  await knex.schema.createTable('users', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.uuid('kebele_id').nullable().references('id').inTable('kebeles').onDelete('SET NULL');
    t.string('full_name', 255).notNullable();
    t.string('username', 100).notNullable().unique();
    t.string('email', 255).nullable().unique();
    t.string('phone', 30).nullable();
    t.string('password_hash', 255).notNullable();
    // Denormalized role for fast JWT/RBAC checks
    t.enu('role', ['SUPER_ADMIN', 'KEBELE_ADMIN', 'KEBELE_FACILITATOR']).notNullable();
    t.boolean('is_active').notNullable().defaultTo(true);
    t.uuid('created_by').nullable().references('id').inTable('users').onDelete('SET NULL');
    t.timestamps(true, true);

    t.index('username');
    t.index('kebele_id');
    t.index('role');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('users');
  await knex.schema.dropTableIfExists('permissions');
  await knex.schema.dropTableIfExists('roles');
}
