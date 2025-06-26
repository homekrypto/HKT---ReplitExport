import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { sendWorkingEmail, generateVerificationEmailHtml, generatePasswordResetEmailHtml } from './working-email';

const router = Router();

// Temporary in-memory user storage (bypasses database)
const tempUsers = new Map();
const tempSessions = new Map();
const tempVerificationTokens = new Map();
const tempPasswordResetTokens = new Map();

// Mock user for testing
tempUsers.set('admin@homekrypto.com', {
  id: 1,
  email: 'admin@homekrypto.com',
  passwordHash: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // "password"
  emailVerified: true,
  firstName: 'Admin',
  lastName: 'User'
});

tempUsers.set('test@homekrypto.com', {
  id: 2,
  email: 'test@homekrypto.com', 
  passwordHash: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // "password"
  emailVerified: true,
  firstName: 'Test',
  lastName: 'User'
});

// Add the recently registered user with proper password hash
const testPasswordHash = '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'; // "password"
tempUsers.set('michael55@interia.pl', {
  id: 3,
  email: 'michael55@interia.pl',
  passwordHash: testPasswordHash,
  emailVerified: true,
  firstName: 'Michael',
  lastName: 'User'
});

// Generate simple session token
function generateToken(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Temporary login (bypasses database)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = tempUsers.get(email.toLowerCase());
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create session
    const token = generateToken();
    tempSessions.set(token, {
      userId: user.id,
      email: user.email,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    });

    // Set cookie for frontend compatibility
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: 'strict' as const,
    };

    res.cookie('sessionToken', token, cookieOptions);

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
    console.error('Temp login error:', error);
    res.status(500).json({ message: 'Login failed' });
  }
});

// Temporary register (bypasses database)
router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const emailLower = email.toLowerCase();
    
    if (tempUsers.has(emailLower)) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = {
      id: tempUsers.size + 1,
      email: emailLower,
      passwordHash,
      firstName: firstName || '',
      lastName: lastName || '',
      emailVerified: false // Require email verification
    };

    tempUsers.set(emailLower, newUser);

    // Generate verification token
    const verificationToken = generateToken();
    tempVerificationTokens.set(verificationToken, {
      userId: newUser.id,
      email: emailLower,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    });

    // Send verification email
    try {
      await sendWorkingEmail({
        to: emailLower,
        subject: 'Verify Your Email - Home Krypto Platform',
        html: generateVerificationEmailHtml(verificationToken, emailLower)
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
      },
      verificationToken // Include for testing if email fails
    });
  } catch (error) {
    console.error('Temp registration error:', error);
    res.status(500).json({ message: 'Registration failed' });
  }
});

// Temporary user info (bypasses database)
router.get('/me', async (req, res) => {
  try {
    const token = req.cookies?.sessionToken;
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const session = tempSessions.get(token);
    if (!session) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    
    if (session.expiresAt < new Date()) {
      tempSessions.delete(token);
      return res.status(401).json({ message: 'Token expired' });
    }

    const user = Array.from(tempUsers.values()).find(u => u.id === session.userId);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    res.json({
      id: user.id,
      email: user.email,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      emailVerified: user.emailVerified,
      isEmailVerified: user.emailVerified
    });
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({ message: 'Authentication failed' });
  }
});

// Temporary logout (bypasses database)
router.post('/logout', async (req, res) => {
  try {
    const token = req.cookies.sessionToken;
    
    if (token) {
      tempSessions.delete(token);
    }

    res.clearCookie('sessionToken');
    res.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Temp logout error:', error);
    res.status(500).json({ message: 'Logout failed' });
  }
});

// Temporary password reset (simulated)
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = tempUsers.get(email.toLowerCase());
    if (!user) {
      // Don't reveal if user exists or not
      return res.json({ message: 'If the email exists, a reset link has been sent' });
    }

    // Generate password reset token
    const resetToken = `reset-${generateToken()}`;
    tempPasswordResetTokens.set(resetToken, {
      userId: user.id,
      email: email.toLowerCase(),
      expiresAt: new Date(Date.now() + 60 * 60 * 1000) // 1 hour
    });

    // Send password reset email
    try {
      await sendWorkingEmail({
        to: email.toLowerCase(),
        subject: 'Password Reset - Home Krypto Platform',
        html: generatePasswordResetEmailHtml(resetToken, email.toLowerCase())
      });
      console.log(`Password reset email sent to: ${email}`);
      
      res.json({ 
        message: 'Password reset instructions have been sent to your email address.',
        resetToken: resetToken // Include for testing if email fails
      });
    } catch (error) {
      console.error('Failed to send password reset email:', error);
      res.json({ 
        message: 'Password reset email could not be delivered. Please contact support at support@homekrypto.com.',
        resetToken: resetToken,
        resetLink: `${req.protocol}://${req.get('host')}/reset-password?token=${resetToken}`
      });
    }
  } catch (error) {
    console.error('Temp forgot password error:', error);
    res.status(500).json({ message: 'Failed to process password reset request' });
  }
});

// Password reset endpoint
router.post('/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ message: 'Token and password are required' });
    }

    // Check token validity
    const resetData = tempPasswordResetTokens.get(token);
    if (!resetData) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    if (resetData.expiresAt < new Date()) {
      tempPasswordResetTokens.delete(token);
      return res.status(400).json({ message: 'Reset token has expired' });
    }

    const user = Array.from(tempUsers.values()).find(u => u.id === resetData.userId);
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Update password
    const passwordHash = await bcrypt.hash(password, 10);
    user.passwordHash = passwordHash;
    tempUsers.set(user.email, user);

    // Clean up used token
    tempPasswordResetTokens.delete(token);

    console.log(`Password reset completed for user: ${user.email}`);

    res.json({ message: 'Password reset successful. You can now log in with your new password.' });
  } catch (error) {
    console.error('Temp password reset error:', error);
    res.status(500).json({ message: 'Password reset failed' });
  }
});

// Email verification endpoints
router.post('/resend-verification', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = tempUsers.get(email.toLowerCase());
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.emailVerified) {
      return res.json({ message: 'Email already verified' });
    }

    // Generate new verification token
    const verificationToken = generateToken();
    tempVerificationTokens.set(verificationToken, {
      userId: user.id,
      email: email.toLowerCase(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    });

    // Send verification email
    try {
      await sendWorkingEmail({
        to: email.toLowerCase(),
        subject: 'Verify Your Email - Home Krypto Platform',
        html: generateVerificationEmailHtml(verificationToken, email.toLowerCase())
      });
      console.log(`Verification email resent to: ${email}`);
      
      res.json({ 
        message: 'Verification email sent successfully. Please check your inbox.',
        verificationToken: verificationToken // Include for testing if email fails
      });
    } catch (error) {
      console.error('Failed to resend verification email:', error);
      res.json({ 
        message: 'Verification email could not be delivered. Please contact support.',
        verificationToken: verificationToken
      });
    }
  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({ message: 'Failed to resend verification email' });
  }
});

router.get('/verify-email/:token', async (req, res) => {
  try {
    const { token } = req.params;
    
    const verificationData = tempVerificationTokens.get(token);
    if (!verificationData) {
      return res.redirect('/?verified=false&reason=invalid');
    }

    if (verificationData.expiresAt < new Date()) {
      tempVerificationTokens.delete(token);
      return res.redirect('/?verified=false&reason=expired');
    }

    const user = Array.from(tempUsers.values()).find(u => u.id === verificationData.userId);
    if (!user) {
      return res.redirect('/?verified=false&reason=user_not_found');
    }

    // Mark user as verified
    user.emailVerified = true;
    tempUsers.set(user.email, user);

    // Clean up verification token
    tempVerificationTokens.delete(token);

    console.log(`Email verified for user: ${user.email}`);
    res.redirect('/?verified=true');
  } catch (error) {
    console.error('Email verification error:', error);
    res.redirect('/?verified=false&reason=error');
  }
});

export default router;