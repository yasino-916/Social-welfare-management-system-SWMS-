import { Knex } from 'knex';

/**
 * Document management (SRS §12).
 * Each document tracks upload, verification, and version history.
 * Files are stored in secure object/file storage; only the path is kept here (SRS §34).
 */
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('documents', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.uuid('application_id').notNullable().references('id').inTable('applications').onDelete('CASCADE');
    t.uuid('person_id').nullable().references('id').inTable('persons').onDelete('SET NULL');
    t.string('document_type', 100).notNullable(); // e.g. NATIONAL_ID, RESIDENCE, WELFARE_PROOF
    t.string('document_number', 100).nullable();
    t.string('file_path', 512).notNullable();
    t.string('mime_type', 100).notNullable();
    t.enu('status', [
      'UPLOADED', 'UNDER_REVIEW', 'VERIFIED', 'REJECTED', 'EXPIRED', 'REUPLOAD_REQUIRED',
    ]).notNullable().defaultTo('UPLOADED');
    t.uuid('uploaded_by').notNullable().references('id').inTable('users').onDelete('RESTRICT');
    t.timestamp('uploaded_at').notNullable().defaultTo(knex.fn.now());
    t.uuid('verified_by').nullable().references('id').inTable('users').onDelete('SET NULL');
    t.timestamp('verified_at').nullable();
    t.text('rejection_reason').nullable();
    t.timestamps(true, true);

    t.index('application_id');
    t.index('status');
  });

  // Version history — every re-upload creates a new version row (SRS §12)
  await knex.schema.createTable('document_versions', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.uuid('document_id').notNullable().references('id').inTable('documents').onDelete('CASCADE');
    t.integer('version').notNullable();
    t.string('file_path', 512).notNullable();
    t.string('mime_type', 100).notNullable();
    t.uuid('uploaded_by').notNullable().references('id').inTable('users').onDelete('RESTRICT');
    t.timestamp('uploaded_at').notNullable().defaultTo(knex.fn.now());
    t.text('notes').nullable();

    t.index('document_id');
    t.unique(['document_id', 'version']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('document_versions');
  await knex.schema.dropTableIfExists('documents');
}
