// Investment Management Lambda Functions
import { APIGatewayProxyHandler, APIGatewayProxyEvent } from 'aws-lambda';
import { investmentService, userService } from './dynamodb-client';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
};

// Validation schemas
const createInvestmentSchema = z.object({
  walletAddress: z.string(),
  monthlyAmount: z.number().positive(),
});

const updateInvestmentSchema = z.object({
  monthlyAmount: z.number().positive().optional(),
  status: z.enum(['active', 'paused', 'completed']).optional(),
  hktBalance: z.number().min(0).optional(),
  propertyShares: z.number().min(0).optional(),
});

// Create investment
export const createInvestment: APIGatewayProxyHandler = async (event) => {
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

    const body = JSON.parse(event.body || '{}');
    const { walletAddress, monthlyAmount } = createInvestmentSchema.parse(body);

    // Check if user already has an investment
    const existingInvestments = await investmentService.getUserInvestments(userId);
    if (existingInvestments.length > 0) {
      return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({ error: 'User already has an active investment' }),
      };
    }

    // Create investment
    const investment = await investmentService.createInvestment(userId, {
      walletAddress,
      monthlyAmount,
      totalInvested: 0,
      currentValue: 0,
      hktBalance: 0,
      propertyShares: 0,
      startDate: new Date().toISOString(),
      status: 'active',
    });

    return {
      statusCode: 201,
      headers: CORS_HEADERS,
      body: JSON.stringify(investment),
    };
  } catch (error) {
    console.error('Create investment error:', error);
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};

// Get user investments
export const getUserInvestments: APIGatewayProxyHandler = async (event) => {
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

    const investments = await investmentService.getUserInvestments(userId);

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify(investments),
    };
  } catch (error) {
    console.error('Get investments error:', error);
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};

// Update investment
export const updateInvestment: APIGatewayProxyHandler = async (event) => {
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

    const investmentId = event.pathParameters?.investmentId;
    if (!investmentId) {
      return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({ error: 'Investment ID required' }),
      };
    }

    const body = JSON.parse(event.body || '{}');
    const updates = updateInvestmentSchema.parse(body);

    // Verify investment belongs to user
    const existingInvestment = await investmentService.getInvestmentById(userId, investmentId);
    if (!existingInvestment) {
      return {
        statusCode: 404,
        headers: CORS_HEADERS,
        body: JSON.stringify({ error: 'Investment not found' }),
      };
    }

    // Update investment
    const updatedInvestment = await investmentService.updateInvestment(userId, investmentId, updates);

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify(updatedInvestment),
    };
  } catch (error) {
    console.error('Update investment error:', error);
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};

// Calculate investment projections
export const calculateProjections: APIGatewayProxyHandler = async (event) => {
  try {
    if (event.httpMethod === 'OPTIONS') {
      return { statusCode: 200, headers: CORS_HEADERS, body: '' };
    }

    const queryParams = event.queryStringParameters;
    const monthlyAmount = parseFloat(queryParams?.monthlyAmount || '0');
    const months = parseInt(queryParams?.months || '36');
    const hktPrice = parseFloat(queryParams?.hktPrice || '0.10');

    if (!monthlyAmount || monthlyAmount <= 0) {
      return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({ error: 'Valid monthly amount required' }),
      };
    }

    // Calculate projections
    const projections = calculateInvestmentProjections(monthlyAmount, months, hktPrice);

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify(projections),
    };
  } catch (error) {
    console.error('Calculate projections error:', error);
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};

// Get investment dashboard data
export const getDashboardData: APIGatewayProxyHandler = async (event) => {
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

    // Get user investments
    const investments = await investmentService.getUserInvestments(userId);
    
    // Calculate totals
    const totalInvested = investments.reduce((sum, inv) => sum + inv.totalInvested, 0);
    const totalHktBalance = investments.reduce((sum, inv) => sum + inv.hktBalance, 0);
    const totalPropertyShares = investments.reduce((sum, inv) => sum + inv.propertyShares, 0);
    const currentValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0);

    // Calculate performance
    const performance = totalInvested > 0 ? ((currentValue - totalInvested) / totalInvested) * 100 : 0;

    const dashboardData = {
      totalInvested,
      currentValue,
      totalHktBalance,
      totalPropertyShares,
      performance,
      activeInvestments: investments.filter(inv => inv.status === 'active').length,
      investments: investments.slice(0, 5), // Latest 5 investments
    };

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify(dashboardData),
    };
  } catch (error) {
    console.error('Get dashboard data error:', error);
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

function calculateInvestmentProjections(monthlyAmount: number, months: number, hktPrice: number) {
  const projections = [];
  let totalInvested = 0;
  let totalHktTokens = 0;
  
  for (let month = 1; month <= months; month++) {
    totalInvested += monthlyAmount;
    const tokensThisMonth = monthlyAmount / hktPrice;
    totalHktTokens += tokensThisMonth;
    
    // Assume 15% annual appreciation (1.25% monthly)
    const appreciatedPrice = hktPrice * Math.pow(1.0125, month);
    const currentValue = totalHktTokens * appreciatedPrice;
    const roi = totalInvested > 0 ? ((currentValue - totalInvested) / totalInvested) * 100 : 0;
    
    projections.push({
      month,
      monthlyInvestment: monthlyAmount,
      totalInvested,
      tokensThisMonth,
      totalHktTokens,
      hktPrice: appreciatedPrice,
      currentValue,
      roi,
    });
  }
  
  return {
    projections,
    summary: {
      totalMonths: months,
      totalInvested,
      finalValue: projections[projections.length - 1]?.currentValue || 0,
      totalROI: projections[projections.length - 1]?.roi || 0,
      totalHktTokens,
    },
  };
}