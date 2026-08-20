import { Knex } from 'knex';

/**
 * Seed: Wereda and Kebele configuration.
 * Run this first — users, households and applications all require a Kebele.
 */
export async function seed(knex: Knex): Promise<void> {
  await knex('kebeles').del();
  await knex('weredas').del();

  const [wereda] = await knex('weredas')
    .insert({
      id: '00000000-0000-0000-0000-000000000001',
      name: 'Demo Wereda',
      code: 'DEMO-01',
      region: 'Addis Ababa',
    })
    .returning('id');

  const weredaId = typeof wereda === 'string' ? wereda : wereda.id;

  await knex('kebeles').insert([
    {
      id: '00000000-0000-0000-0000-000000000010',
      wereda_id: weredaId,
      name: 'Kebele 01',
      code: 'KBL-01',
    },
    {
      id: '00000000-0000-0000-0000-000000000011',
      wereda_id: weredaId,
      name: 'Kebele 02',
      code: 'KBL-02',
    },
    {
      id: '00000000-0000-0000-0000-000000000012',
      wereda_id: weredaId,
      name: 'Kebele 03',
      code: 'KBL-03',
    },
  ]);

  console.log('✓ Wereda and Kebeles seeded');
}
