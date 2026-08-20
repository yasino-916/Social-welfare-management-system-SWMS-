import { Knex } from 'knex';

/**
 * Person identity records (SRS §6.2, §7).
 * system-generated person_id is the PK.
 * National ID, FAN and FIN are stored as attributes — NOT independent entities (SRS §BR-03).
 * Uniqueness constraints apply where an identifier is provided.
 */
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('persons', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.string('full_name', 255).notNullable();
    t.date('date_of_birth').nullable();
    // age is calculated, not stored (SRS §6.2)
    t.enu('gender', ['MALE', 'FEMALE', 'OTHER']).notNullable();
    // Identity attributes (SRS §7)
    t.string('national_id', 100).nullable().unique();
    t.string('fan', 100).nullable().unique();  // Fingerprint Assurance Number
    t.string('fin', 100).nullable().unique();  // Fingerprint Identification Number
    t.string('phone', 30).nullable();
    t.timestamps(true, true);

    // Indexes for duplicate detection (SRS §10) and search (SRS §20)
    t.index('national_id');
    t.index('fan');
    t.index('fin');
    t.index('full_name');
    t.index('phone');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('persons');
}
