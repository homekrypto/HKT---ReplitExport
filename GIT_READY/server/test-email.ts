import { sendHostingerEmail } from './hostinger-email';

// Test email function to verify Hostinger SMTP is working
export async function testEmailDelivery(testEmail: string): Promise<boolean> {
  try {
    console.log(`Testing email delivery to: ${testEmail}`);
    
    const result = await sendHostingerEmail({
      to: testEmail,
      subject: 'Test Email - Home Krypto Platform',
      html: `
        <h2>Email Test Successful</h2>
        <p>This is a test email to verify that Hostinger SMTP is working correctly.</p>
        <p>Sent at: ${new Date().toISOString()}</p>
        <p>If you received this email, the email system is operational.</p>
      `
    });
    
    if (result) {
      console.log(`✓ Email successfully sent to ${testEmail}`);
      return true;
    } else {
      console.log(`✗ Email failed to send to ${testEmail}`);
      return false;
    }
  } catch (error) {
    console.error('Email test error:', error);
    return false;
  }
}