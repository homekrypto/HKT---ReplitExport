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

// Email verification endpoint with URL parameter (alternative)  
router.get('/verify-email/:token', async (req, res) => {
  try {
    const { token } = req.params;

    console.log('=== EMAIL VERIFICATION DEBUG ===');
    console.log('Verification attempt for URL token:', token);
    console.log('Token length:', token?.length);
    console.log('Token type:', typeof token);

    if (!token || typeof token !== 'string') {
      console.log('Invalid token format');
      return res.status(400).json({ message: 'Invalid verification token' });
    }

    // Check if token exists at all
    const allTokensResult = await db
      .select()
      .from(emailVerifications)
      .where(eq(emailVerifications.token, token));
    
    console.log('All tokens matching:', allTokensResult);

    // Find the verification record (active only)
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
    
    console.log('Active verification result:', verificationResult);
    console.log('Current time:', new Date());
    
    const verification = verificationResult[0];

    if (!verification) {
      if (allTokensResult.length > 0) {
        const existingToken = allTokensResult[0];
        console.log('Token exists but conditions not met:');
        console.log('- Verified status:', existingToken.verified);
        console.log('- Expires at:', existingToken.expiresAt);
        console.log('- Current time:', new Date());
        
        if (existingToken.verified) {
          return res.json({ 
            message: 'This email has already been verified. You can log in now.' 
          });
        } else if (existingToken.expiresAt < new Date()) {
          return res.status(400).json({ 
            message: 'Verification token has expired. Please request a new verification email.' 
          });
        }
      }
      
      console.log('Token not found in database');
      return res.status(400).json({ 
        message: 'Invalid verification token' 
      });
    }

    console.log('Processing verification for user:', verification.userId);

    // Update user as verified and mark token as used
    await db
      .update(users)
      .set({ isEmailVerified: true })
      .where(eq(users.id, verification.userId));
      
    await db
      .update(emailVerifications)
      .set({ verified: true })
      .where(eq(emailVerifications.token, token));

    console.log('Email verification completed successfully for user:', verification.userId);

    res.json({ 
      message: 'Email verified successfully! You can now log in.' 
    });

  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ 
      message: 'Email verification failed. Please try again.' 
    });
  }
});

export default router;