import { Knex } from 'knex';

/**
 * Seed: Configurable registration reasons (SRS §9).
 */
export async function seed(knex: Knex): Promise<void> {
  await knex('registration_reasons').del();

  await knex('registration_reasons').insert([
    { code: 'extreme_hardship',    label_en: 'Extreme hardship',                                    label_am: 'ከፍተኛ ችግር',                        requires_description: false, display_order: 1 },
    { code: 'food_insecurity',     label_en: 'Food insecurity',                                     label_am: 'የምግብ ዋስትና ማጣት',                    requires_description: false, display_order: 2 },
    { code: 'unemployment',        label_en: 'Unemployment',                                        label_am: 'ሥራ አጥነት',                           requires_description: false, display_order: 3 },
    { code: 'lack_stable_income',  label_en: 'Lack of stable income',                               label_am: 'የተረጋጋ ገቢ አለመኖር',                  requires_description: false, display_order: 4 },
    { code: 'elderly_no_support',  label_en: 'Elderly person without adequate support',             label_am: 'ድጋፍ የሌላቸው አዛውንት',                 requires_description: false, display_order: 5 },
    { code: 'disability',          label_en: 'Disability-related vulnerability',                    label_am: 'የአካል ጉዳት ተጋላጭነት',                 requires_description: false, display_order: 6 },
    { code: 'orphan_child',        label_en: 'Orphan / vulnerable child',                           label_am: 'ወላጅ አልባ / ተጋላጭ ልጅ',               requires_description: false, display_order: 7 },
    { code: 'female_headed',       label_en: 'Severe economic hardship in a female-headed household', label_am: 'በሴት-ቤተሰብ ራስ ከፍተኛ ኢኮኖሚያዊ ችግር', requires_description: false, display_order: 8 },
    { code: 'homelessness',        label_en: 'Homelessness',                                        label_am: 'መጠለያ አለመኖር',                       requires_description: false, display_order: 9 },
    { code: 'emergency_crisis',    label_en: 'Emergency household crisis',                          label_am: 'አስቸኳይ የቤተሰብ ቀውስ',                 requires_description: false, display_order: 10 },
    { code: 'natural_disaster',    label_en: 'Natural disaster impact',                             label_am: 'የተፈጥሮ አደጋ ተጽዕኖ',                  requires_description: false, display_order: 11 },
    { code: 'displacement',        label_en: 'Displacement',                                        label_am: 'መፈናቀል',                             requires_description: false, display_order: 12 },
    { code: 'loss_of_livelihood',  label_en: 'Loss of livelihood',                                  label_am: 'የኑሮ ምንጭ ማጣት',                      requires_description: false, display_order: 13 },
    { code: 'large_household',     label_en: 'Large household with insufficient income',             label_am: 'ትልቅ ቤተሰብ ከፍቃደኛ ገቢ ጋር',           requires_description: false, display_order: 14 },
    { code: 'other',               label_en: 'Other',                                               label_am: 'ሌላ',                                 requires_description: true,  display_order: 15 },
  ]);

  console.log('✓ Registration reasons seeded');
}
