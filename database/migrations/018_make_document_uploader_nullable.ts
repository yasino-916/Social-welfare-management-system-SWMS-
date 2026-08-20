import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('documents', (t) => {
    t.uuid('uploaded_by').nullable().alter();
  });
  
  await knex.schema.alterTable('document_versions', (t) => {
    t.uuid('uploaded_by').nullable().alter();
  });
}

export async function down(knex: Knex): Promise<void> {
  // It's not safe to revert this to notNullable if public documents exist
  // but we provide the down migration for completeness
  await knex.schema.alterTable('documents', (t) => {
    t.uuid('uploaded_by').notNullable().alter();
  });
  
  await knex.schema.alterTable('document_versions', (t) => {
    t.uuid('uploaded_by').notNullable().alter();
  });
}
