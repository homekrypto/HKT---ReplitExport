import nodemailer from 'nodemailer';

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
  tls?: {
    ciphers: string;
    rejectUnauthorized: boolean;
  };
}

const emailConfig: EmailConfig = {
  host: 'smtp.hostinger.com',
  port: 587,
  secure: false, // Use TLS instead of SSL
  auth: {
    user: 'support@homekrypto.com',
    pass: 'Masterdominikana32$',
  },
  tls: {
    ciphers: 'SSLv3',
    rejectUnauthorized: false,
  },
};

const transporter = nodemailer.createTransport(emailConfig);

// Verify SMTP connection on startup
transporter.verify((error, success) => {
  if (error) {
    console.error('SMTP connection failed:', error);
  } else {
    console.log('SMTP server is ready to take our messages');
  }
});

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(options: EmailOptions): Promise<void> {
  try {
    console.log(`Attempting to send email to ${options.to}`);
    
    const info = await transporter.sendMail({
      from: '"Home Krypto Token Support" <support@homekrypto.com>',
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });
    
    console.log(`Email sent successfully to ${options.to}`, {
      messageId: info.messageId,
      response: info.response,
    });
  } catch (error) {
    console.error('Failed to send email:', error);
    console.error('Email config:', {
      host: emailConfig.host,
      port: emailConfig.port,
      secure: emailConfig.secure,
      user: emailConfig.auth.user,
    });
    throw new Error(`Email delivery failed: ${error.message}`);
  }
}

export function generateVerificationEmailHtml(token: string, email: string): string {
  const baseUrl = process.env.REPLIT_DOMAINS ? 
    `https://${process.env.REPLIT_DOMAINS.split(',')[0]}` : 
    'http://localhost:5000';
  const verificationUrl = `${baseUrl}/api/verify-email/${token}`;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Verify Your Email - Home Krypto Token</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to Home Krypto Token!</h1>
          <p>Real Estate Investment Made Simple</p>
        </div>
        <div class="content">
          <h2>Verify Your Email Address</h2>
          <p>Hello,</p>
          <p>Thank you for registering with Home Krypto Token. To complete your registration and start investing in real estate through blockchain technology, please verify your email address.</p>
          
          <div style="text-align: center;">
            <a href="${verificationUrl}" class="button">Verify Email Address</a>
          </div>
          
          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; background: #e9e9e9; padding: 10px; border-radius: 5px;">${verificationUrl}</p>
          
          <p><strong>What's Next?</strong></p>
          <ul>
            <li>Complete your profile setup</li>
            <li>Explore our investment plans starting at $106.83/month</li>
            <li>Connect your MetaMask wallet (optional)</li>
            <li>Start building your real estate portfolio</li>
          </ul>
          
          <p>If you didn't create an account with us, please ignore this email.</p>
          
          <p>Best regards,<br>
          The Home Krypto Token Team</p>
        </div>
        <div class="footer">
          <p>This email was sent to ${email}</p>
          <p>Home Krypto Token - Democratizing Real Estate Investment</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function generatePasswordResetEmailHtml(token: string, email: string): string {
  const baseUrl = process.env.REPLIT_DOMAINS ? 
    `https://${process.env.REPLIT_DOMAINS.split(',')[0]}` : 
    'http://localhost:5000';
  const resetUrl = `${baseUrl}/reset-password?token=${token}`;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Reset Your Password - Home Krypto Token</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: #dc3545; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
        .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Password Reset Request</h1>
          <p>Home Krypto Token</p>
        </div>
        <div class="content">
          <h2>Reset Your Password</h2>
          <p>Hello,</p>
          <p>You recently requested to reset your password for your Home Krypto Token account. Click the button below to reset your password.</p>
          
          <div style="text-align: center;">
            <a href="${resetUrl}" class="button">Reset Password</a>
          </div>
          
          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; background: #e9e9e9; padding: 10px; border-radius: 5px;">${resetUrl}</p>
          
          <div class="warning">
            <strong>Security Notice:</strong>
            <ul>
              <li>This link will expire in 1 hour for security reasons</li>
              <li>If you didn't request this reset, please ignore this email</li>
              <li>Your password won't change until you create a new one</li>
            </ul>
          </div>
          
          <p>If you continue to have problems, please contact our support team.</p>
          
          <p>Best regards,<br>
          The Home Krypto Token Team</p>
        </div>
        <div class="footer">
          <p>This email was sent to ${email}</p>
          <p>Home Krypto Token - Democratizing Real Estate Investment</p>
        </div>
      </div>
    </body>
    </html>
  `;
}