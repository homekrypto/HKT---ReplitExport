import nodemailer from 'nodemailer';

// Create working email transporter using Gmail SMTP
const createEmailTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: 'noreply.homekrypto@gmail.com',
      pass: process.env.EMAIL_APP_PASSWORD || 'temp-password'
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendWorkingEmail(options: EmailOptions): Promise<boolean> {
  try {
    const transporter = createEmailTransporter();
    
    const mailOptions = {
      from: '"Home Krypto Platform" <noreply.homekrypto@gmail.com>',
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text
    };

    console.log(`Sending email to: ${options.to}`);
    console.log(`Subject: ${options.subject}`);
    
    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    return true;
  } catch (error) {
    console.error('Email send error:', error);
    // For now, we'll log the error but not fail the request
    console.log('Email delivery failed, but continuing with authentication...');
    return false;
  }
}

export function generateVerificationEmailHtml(token: string, email: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Verify Your Email - Home Krypto</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1a1a1a; color: white; padding: 20px; text-align: center; }
        .content { background: #f9f9f9; padding: 30px; }
        .button { background: #d4af37; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
        .footer { background: #333; color: white; padding: 20px; text-align: center; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>HKT - Home Krypto Token</h1>
          <p>Verify Your Email Address</p>
        </div>
        <div class="content">
          <h2>Welcome to Home Krypto!</h2>
          <p>Thank you for registering with Home Krypto Token platform. To complete your registration and secure your account, please verify your email address.</p>
          
          <p><strong>Your email:</strong> ${email}</p>
          
          <a href="http://localhost:5000/api/auth/verify-email/${token}" class="button">Verify Email Address</a>
          
          <p>Or copy and paste this link in your browser:</p>
          <p>http://localhost:5000/api/auth/verify-email/${token}</p>
          
          <p>This verification link will expire in 24 hours for security reasons.</p>
          
          <p>If you didn't create this account, you can safely ignore this email.</p>
          
          <hr>
          <p><strong>Next steps after verification:</strong></p>
          <ul>
            <li>Complete your profile setup</li>
            <li>Connect your Web3 wallet</li>
            <li>Start investing in HKT tokens</li>
            <li>Access premium property shares</li>
          </ul>
        </div>
        <div class="footer">
          <p>© 2025 Home Krypto Token Platform</p>
          <p>Making global real estate investment accessible to everyone</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function generatePasswordResetEmailHtml(token: string, email: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Password Reset - Home Krypto</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1a1a1a; color: white; padding: 20px; text-align: center; }
        .content { background: #f9f9f9; padding: 30px; }
        .button { background: #d4af37; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
        .footer { background: #333; color: white; padding: 20px; text-align: center; font-size: 14px; }
        .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>HKT - Home Krypto Token</h1>
          <p>Password Reset Request</p>
        </div>
        <div class="content">
          <h2>Reset Your Password</h2>
          <p>We received a request to reset the password for your Home Krypto account.</p>
          
          <p><strong>Your email:</strong> ${email}</p>
          
          <div class="warning">
            <strong>Security Notice:</strong> If you didn't request this password reset, please ignore this email. Your account is still secure.
          </div>
          
          <a href="http://localhost:5000/reset-password?token=${token}" class="button">Reset Password</a>
          
          <p>Or copy and paste this link in your browser:</p>
          <p>http://localhost:5000/reset-password?token=${token}</p>
          
          <p>This reset link will expire in 1 hour for security reasons.</p>
          
          <hr>
          <p><strong>Security tips:</strong></p>
          <ul>
            <li>Use a strong, unique password</li>
            <li>Don't share your password with anyone</li>
            <li>Enable two-factor authentication when available</li>
            <li>Keep your account information up to date</li>
          </ul>
        </div>
        <div class="footer">
          <p>© 2025 Home Krypto Token Platform</p>
          <p>Contact support: support@homekrypto.com</p>
        </div>
      </div>
    </body>
    </html>
  `;
}