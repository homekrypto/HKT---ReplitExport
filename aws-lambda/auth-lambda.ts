// Authentication Lambda Functions
import { APIGatewayProxyHandler, APIGatewayProxyEvent } from 'aws-lambda';
import { userService, sessionService } from './dynamodb-client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
};

// Validation schemas
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// Register user
export const register: APIGatewayProxyHandler = async (event) => {
  try {
    if (event.httpMethod === 'OPTIONS') {
      return { statusCode: 200, headers: CORS_HEADERS, body: '' };
    }

    const body = JSON.parse(event.body || '{}');
    const { email, password, firstName, lastName } = registerSchema.parse(body);

    // Check if user already exists
    const existingUser = await userService.getUserByEmail(email);
    if (existingUser) {
      return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({ error: 'User already exists' }),
      };
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    const user = await userService.createUser({
      email,
      passwordHash,
      firstName,
      lastName,
      emailVerified: false,
      referralCode: generateReferralCode(),
    });

    // Generate JWT token
    const token = jwt.sign({ userId: user.userId }, JWT_SECRET, { expiresIn: '7d' });

    // Create session
    await sessionService.createSession(user.userId, {
      token,
      userAgent: event.headers['User-Agent'] || '',
      ipAddress: event.requestContext.identity?.sourceIp || '',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    });

    return {
      statusCode: 201,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        user: {
          id: user.userId,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
        token,
      }),
    };
  } catch (error) {
    console.error('Registration error:', error);
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};

// Login user
export const login: APIGatewayProxyHandler = async (event) => {
  try {
    if (event.httpMethod === 'OPTIONS') {
      return { statusCode: 200, headers: CORS_HEADERS, body: '' };
    }

    const body = JSON.parse(event.body || '{}');
    const { email, password } = loginSchema.parse(body);

    // Get user
    const user = await userService.getUserByEmail(email);
    if (!user) {
      return {
        statusCode: 401,
        headers: CORS_HEADERS,
        body: JSON.stringify({ error: 'Invalid credentials' }),
      };
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return {
        statusCode: 401,
        headers: CORS_HEADERS,
        body: JSON.stringify({ error: 'Invalid credentials' }),
      };
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.userId }, JWT_SECRET, { expiresIn: '7d' });

    // Create session
    await sessionService.createSession(user.userId, {
      token,
      userAgent: event.headers['User-Agent'] || '',
      ipAddress: event.requestContext.identity?.sourceIp || '',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    });

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        user: {
          id: user.userId,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          primaryWalletAddress: user.primaryWalletAddress,
        },
        token,
      }),
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};

// Get current user
export const me: APIGatewayProxyHandler = async (event) => {
  try {
    if (event.httpMethod === 'OPTIONS') {
      return { statusCode: 200, headers: CORS_HEADERS, body: '' };
    }

    const userId = await verifyToken(event);
    if (!userId) {
      return {
        statusCode: 401,
        headers: CORS_HEADERS,
        body: JSON.stringify({ error: 'Authentication required' }),
      };
    }

    const user = await userService.getUserById(userId);
    if (!user) {
      return {
        statusCode: 404,
        headers: CORS_HEADERS,
        body: JSON.stringify({ error: 'User not found' }),
      };
    }

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        id: user.userId,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        primaryWalletAddress: user.primaryWalletAddress,
        emailVerified: user.emailVerified,
      }),
    };
  } catch (error) {
    console.error('Me endpoint error:', error);
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};

// Logout user
export const logout: APIGatewayProxyHandler = async (event) => {
  try {
    if (event.httpMethod === 'OPTIONS') {
      return { statusCode: 200, headers: CORS_HEADERS, body: '' };
    }

    const userId = await verifyToken(event);
    if (!userId) {
      return {
        statusCode: 401,
        headers: CORS_HEADERS,
        body: JSON.stringify({ error: 'Authentication required' }),
      };
    }

    // Extract session ID from token and delete session
    const token = extractToken(event);
    if (token) {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      if (decoded.sessionId) {
        await sessionService.deleteSession(userId, decoded.sessionId);
      }
    }

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({ message: 'Logged out successfully' }),
    };
  } catch (error) {
    console.error('Logout error:', error);
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};

// Helper functions
async function verifyToken(event: APIGatewayProxyEvent): Promise<string | null> {
  const token = extractToken(event);
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return decoded.userId;
  } catch (error) {
    return null;
  }
}

function extractToken(event: APIGatewayProxyEvent): string | null {
  const authHeader = event.headers.Authorization || event.headers.authorization;
  if (!authHeader) return null;
  
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return null;
  
  return parts[1];
}

function generateReferralCode(): string {
  return Math.random().toString(36).substring(2, 12).toUpperCase();
}