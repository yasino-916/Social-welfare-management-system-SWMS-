/**
 * Generates a human-readable reference number.
 * Format: PREFIX-YYYYMMDD-RANDOM6
 * Example: APP-20260818-A3F9K2
 */
export function generateReferenceNumber(prefix: string): string {
  const date = new Date();
  const datePart = date.toISOString().slice(0, 10).replace(/-/g, '');
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}-${datePart}-${randomPart}`;
}
