import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { users, sessions, passwordResets, emailVerifications } from '@shared/schema';
import { db } from './db';
import { eq, and, gt } from 'drizzle-orm';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const BCRYPT_ROUNDS = 12;
const SESSION_EXPIRY = 30 * 24 * 60 * 60 * 1000; // 30 days
const PASSWORD_RESET_EXPIRY = 60 * 60 * 1000; // 1 hour
const EMAIL_VERIFICATION_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutes

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    username?: string;
    walletAddress?: string;
  };
}

// Password hashing
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Token generation
export function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export function generateJWT(userId: number): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '30d' });
}

export function verifyJWT(token: string): { userId: number } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: number };
  } catch {
    return null;
  }
}

// Session management
export async function createSession(userId: number, userAgent?: string, ipAddress?: string): Promise<string> {
  const token = generateToken();
  const expiresAt = new Date(Date.now() + SESSION_EXPIRY);

  await db.insert(sessions).values({
    userId,
    token,
    expiresAt,
    userAgent,
    ipAddress,
  });

  return token;
}

export async function validateSession(token: string): Promise<number | null> {
  const [session] = await db
    .select({ userId: sessions.userId })
    .from(sessions)
    .where(and(
      eq(sessions.token, token),
      gt(sessions.expiresAt, new Date())
    ));

  if (session) {
    // Update last used timestamp
    await db
      .update(sessions)
      .set({ lastUsedAt: new Date() })
      .where(eq(sessions.token, token));
    
    return session.userId;
  }

  return null;
}

export async function deleteSession(token: string): Promise<void> {
  await db.delete(sessions).where(eq(sessions.token, token));
}

export async function deleteAllUserSessions(userId: number): Promise<void> {
  await db.delete(sessions).where(eq(sessions.userId, userId));
}

// Rate limiting for login attempts
export async function checkLoginAttempts(email: string): Promise<boolean> {
  const [user] = await db
    .select({ loginAttempts: users.loginAttempts, lockoutUntil: users.lockoutUntil })
    .from(users)
    .where(eq(users.email, email));

  if (!user) return true; // Allow attempt for non-existent users

  const now = new Date();
  
  // Check if user is locked out
  if (user.lockoutUntil && user.lockoutUntil > now) {
    return false;
  }

  // Reset lockout if time has passed
  if (user.lockoutUntil && user.lockoutUntil <= now) {
    await db
      .update(users)
      .set({ loginAttempts: 0, lockoutUntil: null })
      .where(eq(users.email, email));
  }

  return true;
}

export async function recordFailedLogin(email: string): Promise<void> {
  const [user] = await db
    .select({ loginAttempts: users.loginAttempts })
    .from(users)
    .where(eq(users.email, email));

  if (!user) return;

  const newAttempts = (user.loginAttempts || 0) + 1;
  const lockoutUntil = newAttempts >= MAX_LOGIN_ATTEMPTS 
    ? new Date(Date.now() + LOCKOUT_TIME) 
    : null;

  await db
    .update(users)
    .set({ 
      loginAttempts: newAttempts,
      lockoutUntil,
    })
    .where(eq(users.email, email));
}

export async function recordSuccessfulLogin(userId: number): Promise<void> {
  await db
    .update(users)
    .set({ 
      loginAttempts: 0,
      lockoutUntil: null,
      lastLoginAt: new Date(),
    })
    .where(eq(users.id, userId));
}

// Password reset tokens
export async function createPasswordResetToken(userId: number): Promise<string> {
  // Delete existing tokens
  await db.delete(passwordResets).where(eq(passwordResets.userId, userId));

  const token = generateToken();
  const expiresAt = new Date(Date.now() + PASSWORD_RESET_EXPIRY);

  await db.insert(passwordResets).values({
    userId,
    token,
    expiresAt,
  });

  return token;
}

export async function validatePasswordResetToken(token: string): Promise<number | null> {
  const [reset] = await db
    .select({ userId: passwordResets.userId })
    .from(passwordResets)
    .where(and(
      eq(passwordResets.token, token),
      eq(passwordResets.used, false),
      gt(passwordResets.expiresAt, new Date())
    ));

  return reset?.userId || null;
}

export async function usePasswordResetToken(token: string): Promise<void> {
  await db
    .update(passwordResets)
    .set({ used: true })
    .where(eq(passwordResets.token, token));
}

// Email verification tokens
export async function createEmailVerificationToken(userId: number): Promise<string> {
  // Delete existing tokens
  await db.delete(emailVerifications).where(eq(emailVerifications.userId, userId));

  const token = generateToken();
  const expiresAt = new Date(Date.now() + EMAIL_VERIFICATION_EXPIRY);

  await db.insert(emailVerifications).values({
    userId,
    token,
    expiresAt,
  });

  return token;
}

export async function validateEmailVerificationToken(token: string): Promise<number | null> {
  const [verification] = await db
    .select({ userId: emailVerifications.userId })
    .from(emailVerifications)
    .where(and(
      eq(emailVerifications.token, token),
      eq(emailVerifications.verified, false),
      gt(emailVerifications.expiresAt, new Date())
    ));

  return verification?.userId || null;
}

export async function markEmailAsVerified(userId: number, token: string): Promise<void> {
  await db.transaction(async (tx) => {
    await tx
      .update(users)
      .set({ isEmailVerified: true })
      .where(eq(users.id, userId));

    await tx
      .update(emailVerifications)
      .set({ verified: true })
      .where(eq(emailVerifications.token, token));
  });
}

// Authentication middleware
export async function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const token = req.cookies.sessionToken || req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    const userId = await validateSession(token);
    if (!userId) {
      res.status(401).json({ message: 'Invalid or expired session' });
      return;
    }

    const [user] = await db
      .select({
        id: users.id,
        email: users.email,
        username: users.username,
        walletAddress: users.walletAddress,
      })
      .from(users)
      .where(eq(users.id, userId));

    if (!user) {
      res.status(401).json({ message: 'User not found' });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ message: 'Authentication error' });
  }
}

// Optional auth middleware (for routes that work with or without auth)
export async function optionalAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const token = req.cookies.sessionToken || req.headers.authorization?.replace('Bearer ', '');

    if (token) {
      const userId = await validateSession(token);
      if (userId) {
        const [user] = await db
          .select({
            id: users.id,
            email: users.email,
            username: users.username,
            walletAddress: users.walletAddress,
          })
          .from(users)
          .where(eq(users.id, userId));

        if (user) {
          req.user = user;
        }
      }
    }

    next();
  } catch (error) {
    console.error('Optional auth middleware error:', error);
    next();
  }
}

// Referral code generation
export function generateReferralCode(): string {
  return crypto.randomBytes(6).toString('hex').toUpperCase();
}