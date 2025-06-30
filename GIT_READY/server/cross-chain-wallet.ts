import { Router } from 'express';
import { db } from './db';
import { supportedChains, userWallets, walletVerificationChallenges, users } from '@shared/schema';
import { eq, and, gt } from 'drizzle-orm';
import { requireAuth, type AuthenticatedRequest } from './auth';
import crypto from 'crypto';
import { ethers } from 'ethers';

const router = Router();

// Get supported chains
router.get('/supported-chains', async (req, res) => {
  try {
    const chains = await db
      .select()
      .from(supportedChains)
      .where(eq(supportedChains.isActive, true))
      .orderBy(supportedChains.chainId);

    res.json(chains);
  } catch (error) {
    console.error('Error fetching supported chains:', error);
    res.status(500).json({ message: 'Failed to fetch supported chains' });
  }
});

// Get user's connected wallets
router.get('/user-wallets', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const wallets = await db
      .select({
        id: userWallets.id,
        chainId: userWallets.chainId,
        walletAddress: userWallets.walletAddress,
        walletType: userWallets.walletType,
        isVerified: userWallets.isVerified,
        isPrimary: userWallets.isPrimary,
        lastUsed: userWallets.lastUsed,
        chain: {
          id: supportedChains.id,
          chainId: supportedChains.chainId,
          name: supportedChains.name,
          nativeCurrency: supportedChains.nativeCurrency,
          isTestnet: supportedChains.isTestnet
        }
      })
      .from(userWallets)
      .innerJoin(supportedChains, eq(userWallets.chainId, supportedChains.id))
      .where(eq(userWallets.userId, req.user!.id))
      .orderBy(userWallets.isPrimary, userWallets.lastUsed);

    res.json(wallets);
  } catch (error) {
    console.error('Error fetching user wallets:', error);
    res.status(500).json({ message: 'Failed to fetch user wallets' });
  }
});

// Generate verification challenge for wallet
router.post('/generate-challenge', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const { walletAddress, chainId } = req.body;

    if (!walletAddress || !chainId) {
      return res.status(400).json({ message: 'Wallet address and chain ID are required' });
    }

    // Validate wallet address format
    if (!ethers.isAddress(walletAddress)) {
      return res.status(400).json({ message: 'Invalid wallet address format' });
    }

    // Check if chain is supported
    const chain = await db
      .select()
      .from(supportedChains)
      .where(and(
        eq(supportedChains.chainId, chainId),
        eq(supportedChains.isActive, true)
      ))
      .limit(1);

    if (!chain.length) {
      return res.status(400).json({ message: 'Unsupported chain' });
    }

    // Generate unique challenge message
    const timestamp = Date.now();
    const nonce = crypto.randomBytes(16).toString('hex');
    const challenge = `HKT Platform Wallet Verification\n\nPlease sign this message to verify your wallet ownership.\n\nWallet: ${walletAddress}\nChain: ${chain[0].name}\nTimestamp: ${timestamp}\nNonce: ${nonce}\n\nThis request will not trigger a blockchain transaction or cost any gas fees.`;

    // Store challenge in database
    const [challengeRecord] = await db
      .insert(walletVerificationChallenges)
      .values({
        userId: req.user!.id,
        walletAddress: walletAddress.toLowerCase(),
        chainId: chain[0].id,
        challenge,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
      })
      .returning();

    res.json({
      challengeId: challengeRecord.id,
      challenge,
      expiresAt: challengeRecord.expiresAt
    });
  } catch (error) {
    console.error('Error generating verification challenge:', error);
    res.status(500).json({ message: 'Failed to generate verification challenge' });
  }
});

// Verify wallet signature
router.post('/verify-signature', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const { challengeId, signature, walletType = 'metamask' } = req.body;

    if (!challengeId || !signature) {
      return res.status(400).json({ message: 'Challenge ID and signature are required' });
    }

    // Get challenge from database
    const challenge = await db
      .select()
      .from(walletVerificationChallenges)
      .where(and(
        eq(walletVerificationChallenges.id, challengeId),
        eq(walletVerificationChallenges.userId, req.user!.id),
        eq(walletVerificationChallenges.completed, false),
        gt(walletVerificationChallenges.expiresAt, new Date())
      ))
      .limit(1);

    if (!challenge.length) {
      return res.status(400).json({ message: 'Invalid or expired challenge' });
    }

    const challengeRecord = challenge[0];

    try {
      // Verify signature
      const recoveredAddress = ethers.verifyMessage(challengeRecord.challenge, signature);
      
      if (recoveredAddress.toLowerCase() !== challengeRecord.walletAddress.toLowerCase()) {
        return res.status(400).json({ message: 'Signature verification failed' });
      }

      // Mark challenge as completed
      await db
        .update(walletVerificationChallenges)
        .set({ completed: true })
        .where(eq(walletVerificationChallenges.id, challengeId));

      // Check if wallet already exists for this user
      const existingWallet = await db
        .select()
        .from(userWallets)
        .where(and(
          eq(userWallets.userId, req.user!.id),
          eq(userWallets.walletAddress, challengeRecord.walletAddress),
          eq(userWallets.chainId, challengeRecord.chainId)
        ))
        .limit(1);

      let walletRecord;

      if (existingWallet.length) {
        // Update existing wallet
        [walletRecord] = await db
          .update(userWallets)
          .set({
            isVerified: true,
            walletType,
            verificationSignature: signature,
            verificationMessage: challengeRecord.challenge,
            verificationTimestamp: new Date(),
            lastUsed: new Date()
          })
          .where(eq(userWallets.id, existingWallet[0].id))
          .returning();
      } else {
        // Check if this is the user's first wallet (make it primary)
        const userWalletCount = await db
          .select({ count: userWallets.id })
          .from(userWallets)
          .where(eq(userWallets.userId, req.user!.id));

        const isPrimary = userWalletCount.length === 0;

        // Create new wallet record
        [walletRecord] = await db
          .insert(userWallets)
          .values({
            userId: req.user!.id,
            chainId: challengeRecord.chainId,
            walletAddress: challengeRecord.walletAddress,
            walletType,
            isVerified: true,
            isPrimary,
            verificationSignature: signature,
            verificationMessage: challengeRecord.challenge,
            verificationTimestamp: new Date()
          })
          .returning();

        // Update user's primary wallet address if this is their first verified wallet
        if (isPrimary) {
          await db
            .update(users)
            .set({ primaryWalletAddress: challengeRecord.walletAddress })
            .where(eq(users.id, req.user!.id));
        }
      }

      res.json({
        message: 'Wallet verified successfully',
        wallet: {
          id: walletRecord.id,
          walletAddress: walletRecord.walletAddress,
          chainId: walletRecord.chainId,
          walletType: walletRecord.walletType,
          isVerified: walletRecord.isVerified,
          isPrimary: walletRecord.isPrimary
        }
      });
    } catch (signatureError) {
      console.error('Signature verification error:', signatureError);
      return res.status(400).json({ message: 'Invalid signature' });
    }
  } catch (error) {
    console.error('Error verifying wallet signature:', error);
    res.status(500).json({ message: 'Failed to verify wallet signature' });
  }
});

// Set primary wallet
router.post('/set-primary', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const { walletId } = req.body;

    if (!walletId) {
      return res.status(400).json({ message: 'Wallet ID is required' });
    }

    // Verify wallet belongs to user
    const wallet = await db
      .select()
      .from(userWallets)
      .where(and(
        eq(userWallets.id, walletId),
        eq(userWallets.userId, req.user!.id),
        eq(userWallets.isVerified, true)
      ))
      .limit(1);

    if (!wallet.length) {
      return res.status(404).json({ message: 'Verified wallet not found' });
    }

    // Remove primary flag from all user wallets
    await db
      .update(userWallets)
      .set({ isPrimary: false })
      .where(eq(userWallets.userId, req.user!.id));

    // Set new primary wallet
    await db
      .update(userWallets)
      .set({ isPrimary: true, lastUsed: new Date() })
      .where(eq(userWallets.id, walletId));

    // Update user's primary wallet address
    await db
      .update(users)
      .set({ primaryWalletAddress: wallet[0].walletAddress })
      .where(eq(users.id, req.user!.id));

    res.json({ message: 'Primary wallet updated successfully' });
  } catch (error) {
    console.error('Error setting primary wallet:', error);
    res.status(500).json({ message: 'Failed to set primary wallet' });
  }
});

// Remove wallet
router.delete('/remove-wallet/:walletId', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const { walletId } = req.params;

    // Verify wallet belongs to user
    const wallet = await db
      .select()
      .from(userWallets)
      .where(and(
        eq(userWallets.id, walletId),
        eq(userWallets.userId, req.user!.id)
      ))
      .limit(1);

    if (!wallet.length) {
      return res.status(404).json({ message: 'Wallet not found' });
    }

    const isPrimaryWallet = wallet[0].isPrimary;

    // Delete wallet
    await db
      .delete(userWallets)
      .where(eq(userWallets.id, walletId));

    // If this was the primary wallet, set another verified wallet as primary
    if (isPrimaryWallet) {
      const remainingWallets = await db
        .select()
        .from(userWallets)
        .where(and(
          eq(userWallets.userId, req.user!.id),
          eq(userWallets.isVerified, true)
        ))
        .orderBy(userWallets.lastUsed)
        .limit(1);

      if (remainingWallets.length) {
        await db
          .update(userWallets)
          .set({ isPrimary: true })
          .where(eq(userWallets.id, remainingWallets[0].id));

        await db
          .update(users)
          .set({ primaryWalletAddress: remainingWallets[0].walletAddress })
          .where(eq(users.id, req.user!.id));
      } else {
        // No remaining wallets, clear primary wallet address
        await db
          .update(users)
          .set({ primaryWalletAddress: null })
          .where(eq(users.id, req.user!.id));
      }
    }

    res.json({ message: 'Wallet removed successfully' });
  } catch (error) {
    console.error('Error removing wallet:', error);
    res.status(500).json({ message: 'Failed to remove wallet' });
  }
});

export default router;