import { Router } from 'express';
import { z } from 'zod';
import { authLimiter, generalLimiter, csrfProtection, xssProtection } from './auth-utils';
import { db, pool } from './db';
import { users, type InsertUser } from '@shared/schema';
import { eq, or, sql } from 'drizzle-orm';
import {
  hashPassword,
  verifyPassword,
  createSession,
  deleteSession,
  deleteAllUserSessions,
  checkLoginAttempts,
  recordFailedLogin,
  recordSuccessfulLogin,
  createPasswordResetToken,
  validatePasswordResetToken,
  usePasswordResetToken,
  createEmailVerificationToken,
  validateEmailVerificationToken,
  markEmailAsVerified,
  generateReferralCode,
  requireAuth,
  type AuthenticatedRequest,
} from './auth';

const router = Router();

// Apply security middleware to all routes
router.use(xssProtection);
router.use(csrfProtection);

// Validation schemas
const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),

  firstName: z.string().optional(),
  lastName: z.string().optional(),
  referralCode: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
});

const updateProfileSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  username: z.string().min(3).optional(),
});

const web3LoginSchema = z.object({
  walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid wallet address'),
  signature: z.string().min(1, 'Signature is required'),
  message: z.string().min(1, 'Message is required'),
});

// Register
router.post('/register', authLimiter, async (req, res) => {
  try {
    const { email, password, firstName, lastName, referralCode } = registerSchema.parse(req.body);

    // Check if user already exists by email
    const existingByEmail = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email));

    if (existingByEmail.length > 0) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }





    // Check referral code if provided
    let referredBy: number | undefined;
    if (referralCode) {
      const [referrer] = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.referralCode, referralCode));

      if (!referrer) {
        return res.status(400).json({ message: 'Invalid referral code' });
      }
      referredBy = referrer.id;
    }

    // Hash password and create user
    const passwordHash = await hashPassword(password);
    const userReferralCode = generateReferralCode();

    const [newUser] = await db
      .insert(users)
      .values({
        email,
        firstName: firstName || null,
        lastName: lastName || null,
        passwordHash,
        referralCode: userReferralCode,
        referredBy: referredBy || null,
        isEmailVerified: false,
        twoFactorEnabled: false,
      })
      .returning({ id: users.id, email: users.email });

    // Create email verification token
    const verificationToken = await createEmailVerificationToken(newUser.id);

    // Send verification email
    try {
      const { sendEmail, generateVerificationEmailHtml } = await import('./email');
      console.log(`Sending verification email to ${email} with token ${verificationToken}`);
      
      await sendEmail({
        to: email,
        subject: 'Verify Your Email - Home Krypto Token',
        html: generateVerificationEmailHtml(verificationToken, email),
        text: `Please verify your email by visiting: ${process.env.REPLIT_DOMAINS ? `https://${process.env.REPLIT_DOMAINS.split(',')[0]}` : 'http://localhost:5000'}/verify-email?token=${verificationToken}`,
      });
      
      console.log(`Verification email sent successfully to ${email}`);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      console.error('Email error details:', {
        message: emailError.message,
        stack: emailError.stack,
      });
      // Continue with registration even if email fails
    }

    res.status(201).json({
      message: 'User registered successfully. Please check your email for verification.',
      user: { id: newUser.id, email: newUser.email },
    });
  } catch (error) {
    console.error('Register error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors[0].message });
    }
    res.status(500).json({ message: 'Registration failed' });
  }
});

// Login
router.post('/login', authLimiter, async (req, res) => {
  try {
    const { email, password, rememberMe } = loginSchema.parse(req.body);

    // Check rate limiting
    const canAttempt = await checkLoginAttempts(email);
    if (!canAttempt) {
      return res.status(429).json({ message: 'Account temporarily locked due to too many failed attempts' });
    }

    // Find user
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (!user || !user.passwordHash) {
      await recordFailedLogin(email);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Verify password
    const validPassword = await verifyPassword(password, user.passwordHash);
    if (!validPassword) {
      await recordFailedLogin(email);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Create session
    const sessionToken = await createSession(
      user.id,
      req.get('User-Agent'),
      req.ip
    );

    await recordSuccessfulLogin(user.id);

    // Set cookie
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000, // 30 days or 1 day
      sameSite: 'strict' as const,
    };

    res.cookie('sessionToken', sessionToken, cookieOptions);

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        walletAddress: user.walletAddress,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors[0].message });
    }
    res.status(500).json({ message: 'Login failed' });
  }
});

// Logout
router.post('/logout', async (req, res) => {
  try {
    const token = req.cookies.sessionToken;
    if (token) {
      await deleteSession(token);
    }
    
    res.clearCookie('sessionToken');
    res.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Logout failed' });
  }
});

// Logout all sessions
router.post('/logout-all', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    await deleteAllUserSessions(req.user!.id);
    res.clearCookie('sessionToken');
    res.json({ message: 'Logged out from all devices' });
  } catch (error) {
    console.error('Logout all error:', error);
    res.status(500).json({ message: 'Logout failed' });
  }
});

// Forgot password
router.post('/forgot-password', generalLimiter, async (req, res) => {
  try {
    const { email } = forgotPasswordSchema.parse(req.body);

    const [user] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email));

    // Always return success for security (don't reveal if email exists)
    if (user) {
      const resetToken = await createPasswordResetToken(user.id);
      
      // TODO: Send password reset email
      console.log(`Password reset token for ${email}: ${resetToken}`);
    }

    res.json({ message: 'If the email exists, a password reset link has been sent' });
  } catch (error) {
    console.error('Forgot password error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors[0].message });
    }
    res.status(500).json({ message: 'Failed to process password reset request' });
  }
});

// Reset password
router.post('/reset-password', generalLimiter, async (req, res) => {
  try {
    const { token, password } = resetPasswordSchema.parse(req.body);

    const userId = await validatePasswordResetToken(token);
    if (!userId) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    const passwordHash = await hashPassword(password);

    await db.transaction(async (tx) => {
      await tx
        .update(users)
        .set({ passwordHash, loginAttempts: 0, lockoutUntil: null })
        .where(eq(users.id, userId));

      await usePasswordResetToken(token);
      await deleteAllUserSessions(userId);
    });

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Reset password error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors[0].message });
    }
    res.status(500).json({ message: 'Password reset failed' });
  }
});

// Change password (authenticated)
router.post('/change-password', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const { currentPassword, newPassword } = changePasswordSchema.parse(req.body);

    const [user] = await db
      .select({ passwordHash: users.passwordHash })
      .from(users)
      .where(eq(users.id, req.user!.id));

    if (!user?.passwordHash) {
      return res.status(400).json({ message: 'Password change not available for this account' });
    }

    const validPassword = await verifyPassword(currentPassword, user.passwordHash);
    if (!validPassword) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    const newPasswordHash = await hashPassword(newPassword);

    await db
      .update(users)
      .set({ passwordHash: newPasswordHash })
      .where(eq(users.id, req.user!.id));

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors[0].message });
    }
    res.status(500).json({ message: 'Password change failed' });
  }
});

// Verify email
router.get('/verify-email/:token', async (req, res) => {
  try {
    const { token } = req.params;

    const userId = await validateEmailVerificationToken(token);
    if (!userId) {
      return res.status(400).json({ message: 'Invalid or expired verification token' });
    }

    await markEmailAsVerified(userId, token);

    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ message: 'Email verification failed' });
  }
});

// Get current user
router.get('/me', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user!.id;
    
    // Direct database query using existing connection
    const userQuery = await db.execute(`
      SELECT id, email, username, first_name, last_name, 
             is_email_verified, created_at, last_login_at, 
             primary_wallet_address
      FROM users 
      WHERE id = ${userId}
    `);

    const user = userQuery.rows[0];
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Format response
    const userData = {
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.first_name,
      lastName: user.last_name,
      isEmailVerified: user.is_email_verified,
      createdAt: user.created_at,
      lastLoginAt: user.last_login_at,
      primaryWalletAddress: user.primary_wallet_address
    };

    res.json(userData);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Failed to fetch user data' });
  }
});

// Update profile
router.put('/profile', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const { firstName, lastName, username } = updateProfileSchema.parse(req.body);

    // Check if username is taken (if provided and different from current)
    if (username) {
      const [existingUser] = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.username, username));

      if (existingUser && existingUser.id !== req.user!.id) {
        return res.status(400).json({ message: 'Username is already taken' });
      }
    }

    const [updatedUser] = await db
      .update(users)
      .set({
        firstName,
        lastName,
        username,
        updatedAt: new Date(),
      })
      .where(eq(users.id, req.user!.id))
      .returning({
        id: users.id,
        email: users.email,
        username: users.username,
        firstName: users.firstName,
        lastName: users.lastName,
      });

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors[0].message });
    }
    res.status(500).json({ message: 'Profile update failed' });
  }
});

// Web3 Login (simplified - you might want to add signature verification)
router.post('/web3-login', authLimiter, async (req, res) => {
  try {
    const { walletAddress, signature, message } = web3LoginSchema.parse(req.body);

    // TODO: Verify signature with the message
    // For now, we'll skip signature verification for simplicity

    // Find or create user with wallet address
    let [user] = await db
      .select()
      .from(users)
      .where(eq(users.walletAddress, walletAddress));

    if (!user) {
      // Create new user with wallet
      const userReferralCode = generateReferralCode();
      
      [user] = await db
        .insert(users)
        .values({
          email: `${walletAddress}@wallet.local`, // Temporary email
          walletAddress,
          referralCode: userReferralCode,
          isEmailVerified: true, // Auto-verify for Web3 users
        })
        .returning();
    }

    // Create session
    const sessionToken = await createSession(
      user.id,
      req.get('User-Agent'),
      req.ip
    );

    await recordSuccessfulLogin(user.id);

    // Set cookie
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      sameSite: 'strict' as const,
    };

    res.cookie('sessionToken', sessionToken, cookieOptions);

    res.json({
      message: 'Web3 login successful',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        walletAddress: user.walletAddress,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (error) {
    console.error('Web3 login error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors[0].message });
    }
    res.status(500).json({ message: 'Web3 login failed' });
  }
});

export default router;