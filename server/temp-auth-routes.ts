import { Router } from 'express';
import { tempUser } from './temp-admin-data';

const router = Router();

// Temporary auth endpoints for testing admin panel
router.post('/login', (req, res) => {
  // Mock successful login for any credentials
  const token = 'temp-admin-token-' + Date.now();
  res.cookie('auth-token', token, {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  });
  
  res.json({
    success: true,
    message: 'Login successful',
    user: tempUser
  });
});

router.post('/register', (req, res) => {
  // Mock successful registration
  const token = 'temp-admin-token-' + Date.now();
  res.cookie('auth-token', token, {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000
  });
  
  res.json({
    success: true,
    message: 'Registration successful',
    user: tempUser
  });
});

router.get('/me', (req, res) => {
  // Always return the temp user as authenticated
  res.json(tempUser);
});

router.post('/logout', (req, res) => {
  res.clearCookie('auth-token');
  res.json({ success: true, message: 'Logged out successfully' });
});

export default router;