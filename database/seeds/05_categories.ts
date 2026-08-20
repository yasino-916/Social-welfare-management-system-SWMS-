import { Knex } from 'knex';

/**
 * Seed: Feedback and complaint categories.
 */
export async function seed(knex: Knex): Promise<void> {
  await knex('complaint_categories').del();
  await knex('feedback_categories').del();

  await knex('feedback_categories').insert([
    { name: 'Service Quality',       name_am: 'የአገልግሎት ጥራት' },
    { name: 'Staff Behavior',        name_am: 'የሠራተኛ ሥነ ምግባር' },
    { name: 'Registration Process',  name_am: 'የምዝገባ ሂደት' },
    { name: 'Support Distribution',  name_am: 'የድጋፍ ስርጭት' },
    { name: 'Suggestion',            name_am: 'ሀሳብ' },
    { name: 'Other',                 name_am: 'ሌላ' },
  ]);

  await knex('complaint_categories').insert([
    { name: 'Corruption / Bribery',          name_am: 'ሙስና / ጉቦ' },
    { name: 'Unfair Registration Decision',  name_am: 'ኢፍትሃዊ የምዝገባ ውሳኔ' },
    { name: 'Duplicate Registration',        name_am: 'ድጋሚ ምዝገባ' },
    { name: 'Exclusion of Eligible Person',  name_am: 'ብቁ ሰው ማግለል' },
    { name: 'Incorrect Information',         name_am: 'ትክክለኛ ያልሆነ መረጃ' },
    { name: 'Support Not Received',          name_am: 'ድጋፍ አለመቀበል' },
    { name: 'Staff Misconduct',              name_am: 'የሠራተኛ ጥፋት' },
    { name: 'Other',                         name_am: 'ሌላ' },
  ]);

  console.log('✓ Feedback and complaint categories seeded');
}
