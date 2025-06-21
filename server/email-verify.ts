import { Router } from 'express';
import { db } from './db';
import { users, emailVerifications } from '@shared/schema';
import { eq, and, gt } from 'drizzle-orm';

const router = Router();

// Email verification endpoint
router.get('/verify-email', async (req, res) => {
  try {
    const { token } = req.query;

    if (!token || typeof token !== 'string') {
      return res.status(400).json({ message: 'Invalid verification token' });
    }

    // Find the verification record
    const [verification] = await db
      .select()
      .from(emailVerifications)
      .where(
        and(
          eq(emailVerifications.token, token),
          eq(emailVerifications.used, false),
          gt(emailVerifications.expiresAt, new Date())
        )
      );

    if (!verification) {
      return res.status(400).json({ 
        message: 'Invalid or expired verification token' 
      });
    }

    // Update user as verified and mark token as used
    await Promise.all([
      db
        .update(users)
        .set({ isEmailVerified: true })
        .where(eq(users.id, verification.userId)),
      db
        .update(emailVerifications)
        .set({ used: true })
        .where(eq(emailVerifications.id, verification.id))
    ]);

    // Redirect to success page or login
    res.redirect('/?verified=true');
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ message: 'Verification failed' });
  }
});

export default router;