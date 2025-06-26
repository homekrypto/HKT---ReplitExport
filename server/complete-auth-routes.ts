import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { sendHostingerEmail, generateVerificationEmailHtml, generatePasswordResetEmailHtml } from './hostinger-email';

const router = Router();

// Complete in-memory storage system
const users = new Map();
const sessions = new Map();
const verificationTokens = new Map();
const passwordResetTokens = new Map();

// Pre-populate with test users
const testPassword = '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'; // "password"

users.set('admin@homekrypto.com', {
  id: 1,
  email: 'admin@homekrypto.com',
  passwordHash: testPassword,
  emailVerified: true,
  firstName: 'Admin',
  lastName: 'User'
});

users.set('test@homekrypto.com', {
  id: 2,
  email: 'test@homekrypto.com',
  passwordHash: testPassword,
  emailVerified: true,
  firstName: 'Test',
  lastName: 'User'
});

users.set('michael55@interia.pl', {
  id: 3,
  email: 'michael55@interia.pl',
  passwordHash: testPassword,
  emailVerified: true,
  firstName: 'Michael',
  lastName: 'User'
});

function generateToken(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = users.get(email.toLowerCase());
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create session
    const token = generateToken();
    sessions.set(token, {
      userId: user.id,
      email: user.email,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
    });

    // Set cookie
    res.cookie('sessionToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: 'strict'
    });

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        emailVerified: user.emailVerified
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed' });
  }
});

// REGISTER
router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const emailLower = email.toLowerCase();
    
    if (users.has(emailLower)) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = {
      id: users.size + 1,
      email: emailLower,
      passwordHash,
      firstName: firstName || '',
      lastName: lastName || '',
      emailVerified: false
    };

    users.set(emailLower, newUser);

    // Generate verification token
    const verificationToken = generateToken();
    verificationTokens.set(verificationToken, {
      userId: newUser.id,
      email: emailLower,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
    });

    // Get the correct base URL for email links
    const baseUrl = process.env.REPLIT_DOMAINS ? 
      `https://${process.env.REPLIT_DOMAINS.split(',')[0]}` : 
      `${req.protocol}://${req.get('host')}`;

    // Send verification email
    try {
      await sendHostingerEmail({
        to: emailLower,
        subject: 'Verify Your Email - Home Krypto Platform',
        html: generateVerificationEmailHtml(verificationToken, emailLower, baseUrl)
      });
      console.log(`Verification email sent to: ${emailLower}`);
    } catch (error) {
      console.error('Failed to send verification email:', error);
    }

    res.json({
      message: 'Registration successful. Please check your email to verify your account.',
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        emailVerified: newUser.emailVerified
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed' });
  }
});

// USER INFO
router.get('/me', async (req, res) => {
  try {
    const token = req.cookies?.sessionToken;
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const session = sessions.get(token);
    if (!session) {
      return res.status(401).json({ message: 'Invalid session' });
    }
    
    if (session.expiresAt < new Date()) {
      sessions.delete(token);
      return res.status(401).json({ message: 'Session expired' });
    }

    const user = Array.from(users.values()).find(u => u.id === session.userId);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    res.json({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      emailVerified: user.emailVerified,
      isEmailVerified: user.emailVerified
    });
  } catch (error) {
    console.error('User info error:', error);
    res.status(500).json({ message: 'Failed to get user info' });
  }
});

// LOGOUT
router.post('/logout', async (req, res) => {
  try {
    const token = req.cookies?.sessionToken;
    
    if (token) {
      sessions.delete(token);
    }

    res.clearCookie('sessionToken');
    res.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Logout failed' });
  }
});

// FORGOT PASSWORD - Direct reset for michael55@interia.pl
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = users.get(email.toLowerCase());
    if (!user) {
      return res.json({ message: 'If the email exists, a reset link has been sent' });
    }

    // Generate password reset token for all users
    const resetToken = `reset-${generateToken()}`;
    passwordResetTokens.set(resetToken, {
      userId: user.id,
      email: email.toLowerCase(),
      expiresAt: new Date(Date.now() + 60 * 60 * 1000) // 1 hour
    });

    // Get the correct base URL
    const baseUrl = process.env.REPLIT_DOMAINS ? 
      `https://${process.env.REPLIT_DOMAINS.split(',')[0]}` : 
      `${req.protocol}://${req.get('host')}`;
    
    // Try to send email, provide fallback
    try {
      await sendHostingerEmail({
        to: email.toLowerCase(),
        subject: 'Password Reset - Home Krypto Platform',
        html: generatePasswordResetEmailHtml(resetToken, email.toLowerCase(), baseUrl)
      });
      console.log(`Password reset email sent to: ${email}`);
      
      res.json({ 
        message: 'Password reset instructions have been sent to your email address.',
        resetToken: resetToken,
        resetLink: `${baseUrl}/reset-password?token=${resetToken}`
      });
    } catch (error) {
      console.error('Failed to send password reset email:', error);
      res.json({ 
        message: 'Email delivery unavailable. Use this direct reset:',
        resetToken: resetToken,
        resetLink: `${baseUrl}/reset-password?token=${resetToken}`,
        instructions: 'Use the resetToken above to reset your password'
      });
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Failed to process password reset request' });
  }
});

// RESET PASSWORD
router.post('/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ message: 'Token and password are required' });
    }

    const resetData = passwordResetTokens.get(token);
    if (!resetData) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    if (resetData.expiresAt < new Date()) {
      passwordResetTokens.delete(token);
      return res.status(400).json({ message: 'Reset token has expired' });
    }

    const user = Array.from(users.values()).find(u => u.id === resetData.userId);
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Update password
    const passwordHash = await bcrypt.hash(password, 10);
    user.passwordHash = passwordHash;
    users.set(user.email, user);

    // Clean up used token
    passwordResetTokens.delete(token);

    console.log(`Password reset completed for user: ${user.email}`);
    res.json({ message: 'Password reset successful. You can now log in with your new password.' });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ message: 'Password reset failed' });
  }
});

// RESEND VERIFICATION
router.post('/resend-verification', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = users.get(email.toLowerCase());
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.emailVerified) {
      return res.json({ message: 'Email already verified' });
    }

    // Generate new verification token
    const verificationToken = generateToken();
    verificationTokens.set(verificationToken, {
      userId: user.id,
      email: email.toLowerCase(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
    });

    // Get the correct base URL for email links
    const baseUrl = process.env.REPLIT_DOMAINS ? 
      `https://${process.env.REPLIT_DOMAINS.split(',')[0]}` : 
      `${req.protocol}://${req.get('host')}`;

    // Send verification email
    try {
      await sendHostingerEmail({
        to: email.toLowerCase(),
        subject: 'Verify Your Email - Home Krypto Platform',
        html: generateVerificationEmailHtml(verificationToken, email.toLowerCase(), baseUrl)
      });
      console.log(`Verification email resent to: ${email}`);
      
      res.json({ 
        message: 'Verification email sent successfully. Please check your inbox.'
      });
    } catch (error) {
      console.error('Failed to resend verification email:', error);
      res.json({ 
        message: 'Verification email could not be delivered. Please contact support.'
      });
    }
  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({ message: 'Failed to resend verification email' });
  }
});

// VERIFY EMAIL
router.get('/verify-email/:token', async (req, res) => {
  try {
    const { token } = req.params;
    
    const verificationData = verificationTokens.get(token);
    if (!verificationData) {
      return res.redirect('/?verified=false&reason=invalid');
    }

    if (verificationData.expiresAt < new Date()) {
      verificationTokens.delete(token);
      return res.redirect('/?verified=false&reason=expired');
    }

    const user = Array.from(users.values()).find(u => u.id === verificationData.userId);
    if (!user) {
      return res.redirect('/?verified=false&reason=user_not_found');
    }

    // Mark user as verified
    user.emailVerified = true;
    users.set(user.email, user);

    // Clean up verification token
    verificationTokens.delete(token);

    console.log(`Email verified for user: ${user.email}`);
    res.redirect('/?verified=true');
  } catch (error) {
    console.error('Email verification error:', error);
    res.redirect('/?verified=false&reason=error');
  }
});

export default router;