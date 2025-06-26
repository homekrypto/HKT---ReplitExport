import { Router } from 'express';
import bcrypt from 'bcryptjs';

const router = Router();

// Temporary in-memory user storage (bypasses database)
const tempUsers = new Map();
const tempSessions = new Map();

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

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        emailVerified: user.emailVerified
      },
      token
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
      emailVerified: true // Auto-verify for testing
    };

    tempUsers.set(emailLower, newUser);

    res.json({
      message: 'Registration successful',
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        emailVerified: newUser.emailVerified
      }
    });
  } catch (error) {
    console.error('Temp registration error:', error);
    res.status(500).json({ message: 'Registration failed' });
  }
});

// Temporary user info (bypasses database)
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const session = tempSessions.get(token);
    if (!session || session.expiresAt < new Date()) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    const user = Array.from(tempUsers.values()).find(u => u.id === session.userId);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    res.json({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      emailVerified: user.emailVerified
    });
  } catch (error) {
    console.error('Temp user info error:', error);
    res.status(500).json({ message: 'Failed to get user info' });
  }
});

// Temporary logout (bypasses database)
router.post('/logout', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (token) {
      tempSessions.delete(token);
    }

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

    console.log(`[TEMP] Password reset requested for: ${email}`);
    console.log(`[TEMP] Reset link: http://localhost:5000/reset-password?token=temp-reset-${user.id}`);

    res.json({ message: 'If the email exists, a reset link has been sent' });
  } catch (error) {
    console.error('Temp forgot password error:', error);
    res.status(500).json({ message: 'Failed to process password reset request' });
  }
});

export default router;