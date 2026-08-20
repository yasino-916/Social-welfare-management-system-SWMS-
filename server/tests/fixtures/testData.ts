/**
 * Shared test fixtures for integration tests.
 * Import these instead of duplicating test data across test files.
 */

export const testWereda = {
  id: '00000000-0000-0000-0000-000000000001',
  name: 'Test Wereda',
  code: 'TEST-01',
  region: 'Test Region',
};

export const testKebele = {
  id: '00000000-0000-0000-0000-000000000010',
  wereda_id: testWereda.id,
  name: 'Test Kebele 01',
  code: 'KBL-01',
};

export const testSuperAdmin = {
  id: '00000000-0000-0000-0000-000000000100',
  username: 'super_admin',
  password: 'SuperAdmin@123',
  role: 'SUPER_ADMIN',
  full_name: 'Test Super Admin',
};

export const testKebeleAdmin = {
  id: '00000000-0000-0000-0000-000000000101',
  username: 'kebele_admin',
  password: 'KebeleAdmin@123',
  role: 'KEBELE_ADMIN',
  full_name: 'Test Kebele Admin',
  kebele_id: testKebele.id,
};

export const testPerson = {
  full_name: 'Almaz Tadesse',
  date_of_birth: '1980-03-15',
  gender: 'FEMALE',
  national_id: 'ETH-TEST-001',
  phone: '0911000001',
};

export const testHousehold = {
  kebele_id: testKebele.id,
  village: 'Test Village',
  household_size: 3,
};
