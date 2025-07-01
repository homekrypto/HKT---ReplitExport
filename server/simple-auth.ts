import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { sendHostingerEmail, generateVerificationEmailHtml, generatePasswordResetEmailHtml } from './hostinger-email';

const router = Router();

// Simple working authentication system
const users = new Map();
const sessions = new Map();
const verificationTokens = new Map();
const passwordResetTokens = new Map();

// Generate simple token
function generateToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// Pre-populate with working user accounts
const workingPasswordHash = '$2b$10$0BdI5biv21tW5oZnStvso.o969iy/X4Svct6AgmLJt0AQZrWiAWBW'; // currentpassword123

users.set('michael55@interia.pl', {
  id: 1,
  email: 'michael55@interia.pl',
  passwordHash: workingPasswordHash,
  emailVerified: true,
  firstName: 'Michael',
  lastName: 'User'
});

users.set('info@babulashots.pl', {
  id: 2,
  email: 'info@babulashots.pl',
  passwordHash: workingPasswordHash,
  emailVerified: true,
  firstName: 'Info',
  lastName: 'User'
});

// Hash the admin password: Masterdminikana32$
const adminPasswordHash = bcrypt.hashSync('Masterdminikana32$', 10);

users.set('admin@homekrypto.com', {
  id: 3,
  email: 'admin@homekrypto.com',
  passwordHash: adminPasswordHash,
  emailVerified: true,
  firstName: 'Admin',
  lastName: 'User',
  isAdmin: true
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const normalizedEmail = email.toLowerCase();
    const user = users.get(normalizedEmail);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create session
    const token = generateToken();
    sessions.set(token, {
      userId: user.id,
      email: user.email,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    });

    // Set cookie with enhanced development compatibility
    res.cookie('sessionToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      domain: process.env.NODE_ENV === 'production' ? '.homekrypto.com' : undefined,
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000
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
      token: token // For testing purposes
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed' });
  }
});

// USER INFO
router.get('/me', async (req, res) => {
  try {
    const token = req.cookies?.auth_token;
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const session = sessions.get(token);
    if (!session) {
      return res.status(401).json({ message: 'Invalid session' });
    }
    
    if (session.expiresAt < new Date()) {
      sessions.delete(token);
      return res.status(401).json({ message: 'Session expired' });
    }

    const user = Array.from(users.values()).find(u => u.id === session.userId);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    res.json({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      emailVerified: user.emailVerified,
      isEmailVerified: user.emailVerified
    });
  } catch (error) {
    console.error('User info error:', error);
    res.status(500).json({ message: 'Failed to get user info' });
  }
});

// GET CURRENT USER (ME endpoint)
router.get('/me', async (req, res) => {
  try {
    // Support both cookie and Authorization header for development
    const token = req.cookies.sessionToken || 
                  (req.headers.authorization?.startsWith('Bearer ') 
                    ? req.headers.authorization.slice(7) 
                    : null);

    console.log('Auth check - token:', token ? 'present' : 'missing');
    console.log('Cookies:', Object.keys(req.cookies));

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const session = sessions.get(token);
    if (!session || session.expiresAt < new Date()) {
      if (session) sessions.delete(token);
      return res.status(401).json({ message: 'Invalid session' });
    }

    const user = Array.from(users.values()).find(u => u.id === session.userId);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    res.json({
      id: user.id,
      email: user.email,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      isEmailVerified: user.emailVerified,
      emailVerified: user.emailVerified,
      createdAt: new Date().toISOString(),
      isAdmin: user.isAdmin || false
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Failed to get user' });
  }
});

// LOGOUT
router.post('/logout', async (req, res) => {
  try {
    const token = req.cookies?.auth_token;
    
    if (token) {
      sessions.delete(token);
    }

    res.clearCookie('sessionToken');
    res.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Logout failed' });
  }
});

// REGISTER
router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const emailLower = email.toLowerCase();
    
    if (users.has(emailLower)) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = {
      id: users.size + 1,
      email: emailLower,
      passwordHash,
      firstName: firstName || '',
      lastName: lastName || '',
      emailVerified: false
    };

    users.set(emailLower, newUser);

    // Generate verification token
    const verificationToken = generateToken();
    verificationTokens.set(verificationToken, {
      userId: newUser.id,
      email: emailLower,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
    });

    // Get base URL
    const baseUrl = process.env.REPLIT_DOMAINS ? 
      `https://${process.env.REPLIT_DOMAINS.split(',')[0]}` : 
      `${req.protocol}://${req.get('host')}`;

    // Send verification email
    try {
      await sendHostingerEmail({
        to: emailLower,
        subject: 'Verify Your Email - Home Krypto Platform',
        html: generateVerificationEmailHtml(verificationToken, emailLower, baseUrl)
      });
      console.log(`Verification email sent to: ${email}`);
    } catch (error) {
      console.error('Failed to send verification email:', error);
    }

    res.json({
      message: 'Registration successful. Please check your email to verify your account.',
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        emailVerified: newUser.emailVerified
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed' });
  }
});

// FORGOT PASSWORD
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = users.get(email.toLowerCase());
    if (!user) {
      return res.json({ message: 'If the email exists, a reset link has been sent' });
    }

    // Generate password reset token
    const resetToken = `reset-${generateToken()}`;
    passwordResetTokens.set(resetToken, {
      userId: user.id,
      email: email.toLowerCase(),
      expiresAt: new Date(Date.now() + 60 * 60 * 1000) // 1 hour
    });

    // Get base URL
    const baseUrl = process.env.REPLIT_DOMAINS ? 
      `https://${process.env.REPLIT_DOMAINS.split(',')[0]}` : 
      `${req.protocol}://${req.get('host')}`;
    
    // Send email
    try {
      await sendHostingerEmail({
        to: email.toLowerCase(),
        subject: 'Password Reset - Home Krypto Platform',
        html: generatePasswordResetEmailHtml(resetToken, email.toLowerCase(), baseUrl)
      });
      console.log(`Password reset email sent to: ${email}`);
      
      res.json({ 
        message: 'Password reset instructions have been sent to your email address.',
        resetToken: resetToken,
        resetLink: `${baseUrl}/reset-password?token=${resetToken}`
      });
    } catch (error) {
      console.error('Failed to send password reset email:', error);
      res.json({ 
        message: 'Password reset instructions have been sent to your email address.',
        resetToken: resetToken,
        resetLink: `${baseUrl}/reset-password?token=${resetToken}`
      });
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Password reset failed' });
  }
});

// RESET PASSWORD
router.post('/reset-password', async (req, res) => {
  try {
    const { token, password, confirmPassword } = req.body;

    if (!token || !password) {
      if (confirmPassword !== undefined) {
        return res.status(400).send(`<html><body><h1>Error</h1><p>Token and password are required</p><a href="/reset-password?token=${token}">Try again</a></body></html>`);
      }
      return res.status(400).json({ message: 'Token and password are required' });
    }

    if (password.length < 6) {
      if (confirmPassword !== undefined) {
        return res.status(400).send(`<html><body><h1>Error</h1><p>Password must be at least 6 characters long</p><a href="/reset-password?token=${token}">Try again</a></body></html>`);
      }
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).send(`<html><body><h1>Error</h1><p>Passwords do not match</p><a href="/reset-password?token=${token}">Try again</a></body></html>`);
    }

    const resetData = passwordResetTokens.get(token);
    if (!resetData) {
      if (confirmPassword !== undefined) {
        return res.status(400).send(`<html><body><h1>Error</h1><p>Invalid or expired reset token</p><a href="/">Go to Home</a></body></html>`);
      }
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    if (resetData.expiresAt < new Date()) {
      passwordResetTokens.delete(token);
      if (confirmPassword !== undefined) {
        return res.status(400).send(`<html><body><h1>Error</h1><p>Reset token has expired</p><a href="/">Go to Home</a></body></html>`);
      }
      return res.status(400).json({ message: 'Reset token has expired' });
    }

    const user = Array.from(users.values()).find(u => u.id === resetData.userId);
    if (!user) {
      if (confirmPassword !== undefined) {
        return res.status(400).send(`<html><body><h1>Error</h1><p>User not found</p><a href="/">Go to Home</a></body></html>`);
      }
      return res.status(400).json({ message: 'User not found' });
    }

    // Update password
    const passwordHash = await bcrypt.hash(password, 10);
    user.passwordHash = passwordHash;
    users.set(user.email, user);

    // Clean up used token
    passwordResetTokens.delete(token);

    console.log(`Password reset completed for user: ${user.email}`);
    
    // If this is a form submission (has confirmPassword), show success page
    if (confirmPassword) {
      return res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset Successful - Home Krypto Platform</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #333;
        }
        .container {
            background: white;
            padding: 2rem;
            border-radius: 12px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            width: 100%;
            max-width: 400px;
            margin: 1rem;
            text-align: center;
        }
        .logo { margin-bottom: 2rem; }
        .logo h1 { color: #667eea; font-size: 1.8rem; font-weight: 700; }
        .success-icon {
            width: 64px;
            height: 64px;
            background: #10b981;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 1.5rem;
            color: white;
            font-size: 2rem;
        }
        .message { margin-bottom: 2rem; color: #374151; line-height: 1.6; }
        .btn {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 0.75rem 1.5rem;
            border: none;
            border-radius: 8px;
            font-size: 1rem;
            font-weight: 600;
            text-decoration: none;
            cursor: pointer;
            transition: transform 0.2s;
        }
        .btn:hover { transform: translateY(-2px); }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">
            <h1>HKT</h1>
        </div>
        
        <div class="success-icon">✓</div>
        
        <div class="message">
            <h2>Password Reset Successful!</h2>
            <p>Your password has been updated successfully. You can now log in with your new password.</p>
        </div>
        
        <a href="/" class="btn">Go to Login</a>
    </div>
</body>
</html>
      `);
    } else {
      // JSON API response
      return res.json({ message: 'Password reset successful. You can now log in with your new password.' });
    }
  } catch (error) {
    console.error('Password reset error:', error);
    return res.status(500).send(`<html><body><h1>Error</h1><p>Password reset failed. Please try again.</p><a href="/">Go to Home</a></body></html>`);
  }
});

// VERIFY EMAIL
router.get('/verify-email/:token', async (req, res) => {
  try {
    const { token } = req.params;
    
    const verificationData = verificationTokens.get(token);
    if (!verificationData) {
      return res.redirect('/?verified=false&reason=invalid');
    }

    if (verificationData.expiresAt < new Date()) {
      verificationTokens.delete(token);
      return res.redirect('/?verified=false&reason=expired');
    }

    const user = Array.from(users.values()).find(u => u.id === verificationData.userId);
    if (!user) {
      return res.redirect('/?verified=false&reason=user_not_found');
    }

    // Mark user as verified
    user.emailVerified = true;
    users.set(user.email, user);

    // Create automatic login session
    const sessionToken = generateToken();
    sessions.set(sessionToken, {
      userId: user.id,
      email: user.email,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });

    // Set auth cookie
    res.cookie('auth_token', sessionToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    // Clean up verification token
    verificationTokens.delete(token);

    console.log(`Email verified and user logged in: ${user.email}`);
    res.redirect('/dashboard?verified=true');
  } catch (error) {
    console.error('Email verification error:', error);
    res.redirect('/?verified=false&reason=error');
  }
});

export default router;