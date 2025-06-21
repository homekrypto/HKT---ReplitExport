import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { Request, Response, NextFunction } from 'express';
import { db } from './db';
import { users, emailVerificationTokens, passwordResetTokens, userSessions } from '@shared/schema';
import { eq, and, gt } from 'drizzle-orm';

// JWT configuration
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-super-secret-refresh-key-change-in-production';
const JWT_EXPIRES_IN = '15m';
const JWT_REFRESH_EXPIRES_IN = '7d';

// Email configuration
const emailTransporter = nodemailer.createTransporter({
  host: 'smtp.hostinger.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER || 'support@homekrypto.com',
    pass: process.env.EMAIL_PASS || 'Masterdominikana32$',
  },
});

// Utility functions
export function generateSecureToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateJWT(userId: number, email: string): string {
  return jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function generateRefreshToken(userId: number, email: string): string {
  return jwt.sign({ userId, email }, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRES_IN });
}

export function verifyJWT(token: string): { userId: number; email: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: number; email: string };
  } catch {
    return null;
  }
}

export function verifyRefreshToken(token: string): { userId: number; email: string } | null {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET) as { userId: number; email: string };
  } catch {
    return null;
  }
}

// Email functions
export async function sendVerificationEmail(email: string, token: string): Promise<void> {
  const verificationUrl = `${process.env.APP_URL || 'http://localhost:5000'}/verify-email?token=${token}`;
  
  const mailOptions = {
    from: process.env.EMAIL_FROM || 'support@homekrypto.com',
    to: email,
    subject: 'Verify your HKT account',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1e40af;">Welcome to Home Krypto Token (HKT)</h2>
        <p>Thank you for registering! Please verify your email address by clicking the button below:</p>
        <a href="${verificationUrl}" style="display: inline-block; background-color: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0;">
          Verify Email Address
        </a>
        <p>Or copy and paste this link in your browser:</p>
        <p style="color: #6b7280; word-break: break-all;">${verificationUrl}</p>
        <p style="color: #6b7280; font-size: 14px;">This link will expire in 24 hours. If you didn't create an account, please ignore this email.</p>
      </div>
    `,
  };

  await emailTransporter.sendMail(mailOptions);
}

export async function sendPasswordResetEmail(email: string, token: string): Promise<void> {
  const resetUrl = `${process.env.APP_URL || 'http://localhost:5000'}/reset-password?token=${token}`;
  
  const mailOptions = {
    from: process.env.EMAIL_FROM || 'support@homekrypto.com',
    to: email,
    subject: 'Reset your HKT password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1e40af;">Password Reset Request</h2>
        <p>We received a request to reset your password. Click the button below to create a new password:</p>
        <a href="${resetUrl}" style="display: inline-block; background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0;">
          Reset Password
        </a>
        <p>Or copy and paste this link in your browser:</p>
        <p style="color: #6b7280; word-break: break-all;">${resetUrl}</p>
        <p style="color: #6b7280; font-size: 14px;">This link will expire in 15 minutes. If you didn't request this reset, please ignore this email.</p>
      </div>
    `,
  };

  await emailTransporter.sendMail(mailOptions);
}

// Authentication middleware
export async function authenticateToken(req: Request, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: 'Access token required' });
    return;
  }

  const decoded = verifyJWT(token);
  if (!decoded) {
    res.status(403).json({ message: 'Invalid or expired token' });
    return;
  }

  // Get user from database
  const [user] = await db.select().from(users).where(eq(users.id, decoded.userId));
  if (!user) {
    res.status(403).json({ message: 'User not found' });
    return;
  }

  // Add user to request
  (req as any).user = user;
  next();
}

// Optional authentication (doesn't fail if no token)
export async function optionalAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    const decoded = verifyJWT(token);
    if (decoded) {
      const [user] = await db.select().from(users).where(eq(users.id, decoded.userId));
      if (user) {
        (req as any).user = user;
      }
    }
  }

  next();
}

// Token cleanup functions
export async function cleanupExpiredTokens(): Promise<void> {
  const now = new Date();
  
  // Cleanup expired email verification tokens
  await db.delete(emailVerificationTokens).where(gt(now, emailVerificationTokens.expiresAt));
  
  // Cleanup expired password reset tokens
  await db.delete(passwordResetTokens).where(gt(now, passwordResetTokens.expiresAt));
  
  // Cleanup expired refresh tokens
  await db.delete(userSessions).where(gt(now, userSessions.expiresAt));
}

// Run cleanup every hour
setInterval(cleanupExpiredTokens, 60 * 60 * 1000);