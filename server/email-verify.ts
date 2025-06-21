import { Router } from 'express';
import { db } from './db';
import { users, emailVerifications } from '@shared/schema';
import { eq, and, gt } from 'drizzle-orm';

const router = Router();

// Email verification endpoint with query parameter
router.get('/verify-email', async (req, res) => {
  try {
    const { token } = req.query;

    if (!token || typeof token !== 'string') {
      return res.status(400).json({ message: 'Invalid verification token' });
    }

    console.log('Verification attempt for token:', token);

    // Find the verification record
    const verificationResult = await db
      .select()
      .from(emailVerifications)
      .where(
        and(
          eq(emailVerifications.token, token),
          eq(emailVerifications.verified, false),
          gt(emailVerifications.expiresAt, new Date())
        )
      );
    
    const verification = verificationResult[0];

    if (!verification) {
      return res.status(400).json({ 
        message: 'Invalid or expired verification token' 
      });
    }

    // Update user as verified and mark token as used
    await db
      .update(users)
      .set({ isEmailVerified: true })
      .where(eq(users.id, verification.userId));
      
    await db
      .update(emailVerifications)
      .set({ verified: true })
      .where(eq(emailVerifications.token, token));

    // Redirect to success page
    res.redirect('/verify-email?status=success');
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ message: 'Verification failed' });
  }
});

export default router;