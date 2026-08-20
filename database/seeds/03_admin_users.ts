import { Knex } from 'knex';
import bcrypt from 'bcryptjs';

/**
 * Seed: Default administrative users for development and testing.
 *
 * ⚠ NEVER run this seed in production with these default passwords.
 * All passwords must be changed immediately after first login.
 *
 * Credentials (dev only):
 *   super_admin  / SuperAdmin@123
 *   kebele_admin / KebeleAdmin@123
 *   facilitator  / Facilitator@123
 */
export async function seed(knex: Knex): Promise<void> {
  await knex('users').del();

  const hash = (pwd: string) => bcrypt.hash(pwd, 12);

  await knex('users').insert([
    {
      id: '00000000-0000-0000-0000-000000000100',
      full_name: 'Wereda Super Admin',
      username: 'super_admin',
      email: 'superadmin@wereda.gov.et',
      password_hash: await hash('SuperAdmin@123'),
      role: 'SUPER_ADMIN',
      kebele_id: null,
      is_active: true,
    },
    {
      id: '00000000-0000-0000-0000-000000000101',
      full_name: 'Kebele 01 Admin',
      username: 'kebele_admin',
      email: 'k01admin@wereda.gov.et',
      password_hash: await hash('KebeleAdmin@123'),
      role: 'KEBELE_ADMIN',
      kebele_id: '00000000-0000-0000-0000-000000000010', // Kebele 01
      is_active: true,
    },
    {
      id: '00000000-0000-0000-0000-000000000102',
      full_name: 'Kebele 01 Facilitator',
      username: 'facilitator',
      email: 'facilitator@wereda.gov.et',
      password_hash: await hash('Facilitator@123'),
      role: 'KEBELE_FACILITATOR',
      kebele_id: '00000000-0000-0000-0000-000000000010', // Kebele 01
      is_active: true,
    },
  ]);

  console.log('✓ Admin users seeded');
  console.log('  ⚠  Change all default passwords before any real use.');
}
