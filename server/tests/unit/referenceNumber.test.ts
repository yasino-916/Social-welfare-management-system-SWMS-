import { generateReferenceNumber } from '../../src/utils/referenceNumber';

describe('generateReferenceNumber', () => {
  it('generates a reference number with the correct prefix', () => {
    const ref = generateReferenceNumber('APP');
    expect(ref).toMatch(/^APP-\d{8}-[A-Z0-9]{6}$/);
  });

  it('generates unique reference numbers', () => {
    const refs = new Set(Array.from({ length: 100 }, () => generateReferenceNumber('CMP')));
    expect(refs.size).toBe(100);
  });

  it('uses the supplied prefix', () => {
    expect(generateReferenceNumber('CMP')).toMatch(/^CMP-/);
    expect(generateReferenceNumber('FBK')).toMatch(/^FBK-/);
  });
});
