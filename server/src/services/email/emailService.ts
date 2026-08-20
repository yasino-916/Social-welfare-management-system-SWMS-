/**
 * Email notification service.
 * Implement with nodemailer or a transactional email provider (e.g. SendGrid).
 */
export interface EmailMessage {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export async function sendEmail(message: EmailMessage): Promise<void> {
  if (process.env.EMAIL_ENABLED !== 'true') {
    console.log('[email] Email disabled. Would have sent:', message.subject, '→', message.to);
    return;
  }
  // TODO: integrate nodemailer/sendgrid here
}
