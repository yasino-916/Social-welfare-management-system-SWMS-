import { Knex } from 'knex';

/**
 * Seed: Initial support programs (SRS §18).
 */
export async function seed(knex: Knex): Promise<void> {
  await knex('support_programs').del();

  await knex('support_programs').insert([
    {
      name: 'Monthly Food Assistance',
      support_type: 'FOOD',
      description: 'Monthly food basket distribution for approved beneficiary households.',
      is_active: true,
      max_distributions_per_year: 12,
    },
    {
      name: 'Emergency Cash Transfer',
      support_type: 'CASH',
      description: 'One-time emergency cash transfer for households in acute crisis.',
      is_active: true,
      max_distributions_per_year: 2,
    },
    {
      name: 'School Fee Support',
      support_type: 'EDUCATIONAL',
      description: 'Annual school fee coverage for children in beneficiary households.',
      is_active: true,
      max_distributions_per_year: 1,
    },
    {
      name: 'Healthcare Assistance',
      support_type: 'HEALTHCARE',
      description: 'Medical expense support for vulnerable household members.',
      is_active: true,
      max_distributions_per_year: 4,
    },
    {
      name: 'Agricultural Input Support',
      support_type: 'AGRICULTURAL',
      description: 'Seeds, fertilizers and tools for farming households.',
      is_active: true,
      max_distributions_per_year: 2,
    },
    {
      name: 'Emergency Disaster Relief',
      support_type: 'EMERGENCY',
      description: 'Immediate assistance for households affected by natural disasters.',
      is_active: true,
      max_distributions_per_year: null, // no limit for emergency
    },
  ]);

  console.log('✓ Support programs seeded');
}
