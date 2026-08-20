/**
 * SMS notification service.
 * Integrate with an Ethiopian SMS gateway provider.
 */
export async function sendSms(phone: string, message: string): Promise<void> {
  if (process.env.SMS_ENABLED !== 'true') {
    console.log('[sms] SMS disabled. Would have sent to:', phone, ':', message);
    return;
  }
  // TODO: integrate SMS gateway provider here
}
