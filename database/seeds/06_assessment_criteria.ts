import { Knex } from 'knex';

/**
 * Seed: Default assessment criteria (SRS §13).
 * The eligibility score is calculated from these criteria to support
 * the human decision — it does NOT replace authorized judgment (SRS §13).
 */
export async function seed(knex: Knex): Promise<void> {
  await knex('assessment_criteria').del();

  await knex('assessment_criteria').insert([
    { name: 'Income Level',           description: 'Monthly household income below welfare threshold',    max_score: 20, is_active: true },
    { name: 'Food Security',          description: 'Frequency and adequacy of daily meals',               max_score: 15, is_active: true },
    { name: 'Housing Condition',      description: 'Quality and stability of household shelter',          max_score: 10, is_active: true },
    { name: 'Employment Status',      description: 'Number of employed adults in the household',          max_score: 10, is_active: true },
    { name: 'Household Size',         description: 'Number of dependents relative to earners',            max_score: 10, is_active: true },
    { name: 'Disability',             description: 'Presence of member(s) with disability',              max_score: 10, is_active: true },
    { name: 'Elderly Members',        description: 'Presence of elderly members without income',          max_score: 10, is_active: true },
    { name: 'Dependent Children',     description: 'Number of dependent children under 18',              max_score: 10, is_active: true },
    { name: 'Female-headed household',description: 'Household headed by a woman without male income',    max_score: 5,  is_active: true },
  ]);

  console.log('✓ Assessment criteria seeded');
}
