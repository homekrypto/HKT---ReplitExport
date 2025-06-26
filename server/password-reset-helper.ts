import { Router } from 'express';

const router = Router();

// Simple password reset helper that shows available reset tokens
router.get('/reset-tokens', (req, res) => {
  res.json({
    message: 'Available password reset tokens',
    instructions: 'Use these tokens to reset passwords when email delivery fails',
    tokens: {
      'michael55@interia.pl': 'Use the reset token provided in the forgot-password response',
      'admin@homekrypto.com': 'Use the reset token provided in the forgot-password response',
      'test@homekrypto.com': 'Use the reset token provided in the forgot-password response'
    },
    usage: 'POST /api/auth/reset-password with {"token": "your-token", "password": "new-password"}'
  });
});

export default router;