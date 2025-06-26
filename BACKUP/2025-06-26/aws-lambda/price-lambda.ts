// HKT Price Monitoring Lambda Functions
import { APIGatewayProxyHandler, ScheduledEvent } from 'aws-lambda';
import { hktStatsService } from './dynamodb-client';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
};

interface PriceData {
  price: number;
  priceChange24h: number;
  marketCap?: number;
  volume24h?: number;
  totalSupply?: number;
}

// Scheduled function to update HKT price
export const updateHktPrice = async (event: ScheduledEvent) => {
  try {
    console.log('Starting HKT price update...');
    
    // Try multiple data sources
    let priceData = await fetchFromCoinGecko();
    if (!priceData) {
      priceData = await fetchFromDexScreener();
    }
    if (!priceData) {
      priceData = await fetchFromMoralis();
    }
    
    // If no real data, use placeholder for new token
    if (!priceData) {
      console.log('HKT token not yet listed on major exchanges - using placeholder data');
      priceData = {
        price: 0.0001, // $0.0001 placeholder
        priceChange24h: 0,
        totalSupply: 1000000000, // 1B tokens
      };
    }
    
    // Update in DynamoDB
    await hktStatsService.updateHktStats({
      price: priceData.price,
      priceChange24h: priceData.priceChange24h,
      marketCap: priceData.marketCap,
      volume24h: priceData.volume24h,
      totalSupply: priceData.totalSupply,
      dataSource: 'automated-update',
    });
    
    console.log(`HKT price updated: $${priceData.price}`);
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'HKT price updated successfully',
        price: priceData.price,
      }),
    };
  } catch (error) {
    console.error('Error updating HKT price:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to update HKT price' }),
    };
  }
};

// API endpoint to get current HKT price
export const getHktPrice: APIGatewayProxyHandler = async (event) => {
  try {
    if (event.httpMethod === 'OPTIONS') {
      return { statusCode: 200, headers: CORS_HEADERS, body: '' };
    }

    const stats = await hktStatsService.getLatestHktStats();
    
    if (!stats) {
      return {
        statusCode: 404,
        headers: CORS_HEADERS,
        body: JSON.stringify({ error: 'Price data not available' }),
      };
    }

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        price: stats.price,
        priceChange24h: stats.priceChange24h,
        marketCap: stats.marketCap,
        volume24h: stats.volume24h,
        totalSupply: stats.totalSupply,
        lastUpdated: stats.lastUpdated,
        dataSource: stats.dataSource,
      }),
    };
  } catch (error) {
    console.error('Error getting HKT price:', error);
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};

// Data source functions
async function fetchFromCoinGecko(): Promise<PriceData | null> {
  try {
    // HKT contract address: 0x0de50324B6960B15A5ceD3D076aE314ac174Da2e
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=0x0de50324B6960B15A5ceD3D076aE314ac174Da2e&vs_currencies=usd&include_24hr_change=true&include_market_cap=true&include_24hr_vol=true'
    );
    
    if (!response.ok) return null;
    
    const data = await response.json();
    const tokenData = data['0x0de50324b6960b15a5ced3d076ae314ac174da2e'];
    
    if (!tokenData) return null;
    
    return {
      price: tokenData.usd || 0,
      priceChange24h: tokenData.usd_24h_change || 0,
      marketCap: tokenData.usd_market_cap,
      volume24h: tokenData.usd_24h_vol,
    };
  } catch (error) {
    console.log('CoinGecko fetch failed:', error.message);
    return null;
  }
}

async function fetchFromDexScreener(): Promise<PriceData | null> {
  try {
    const response = await fetch(
      'https://api.dexscreener.com/latest/dex/tokens/0x0de50324B6960B15A5ceD3D076aE314ac174Da2e'
    );
    
    if (!response.ok) return null;
    
    const data = await response.json();
    const pairs = data.pairs;
    
    if (!pairs || pairs.length === 0) return null;
    
    // Get the most liquid pair
    const mainPair = pairs.reduce((prev: any, current: any) => 
      (current.liquidity?.usd || 0) > (prev.liquidity?.usd || 0) ? current : prev
    );
    
    return {
      price: parseFloat(mainPair.priceUsd) || 0,
      priceChange24h: parseFloat(mainPair.priceChange?.['24h']) || 0,
      volume24h: parseFloat(mainPair.volume?.['24h']) || 0,
    };
  } catch (error) {
    console.log('DexScreener fetch failed:', error.message);
    return null;
  }
}

async function fetchFromMoralis(): Promise<PriceData | null> {
  try {
    const apiKey = process.env.MORALIS_API_KEY;
    if (!apiKey) return null;
    
    const response = await fetch(
      `https://deep-index.moralis.io/api/v2/erc20/0x0de50324B6960B15A5ceD3D076aE314ac174Da2e/price?chain=eth`,
      {
        headers: {
          'X-API-Key': apiKey,
        },
      }
    );
    
    if (!response.ok) return null;
    
    const data = await response.json();
    
    return {
      price: parseFloat(data.usdPrice) || 0,
      priceChange24h: parseFloat(data.percentChange24h) || 0,
    };
  } catch (error) {
    console.log('Moralis fetch failed:', error.message);
    return null;
  }
}

// Get price history for charts
export const getPriceHistory: APIGatewayProxyHandler = async (event) => {
  try {
    if (event.httpMethod === 'OPTIONS') {
      return { statusCode: 200, headers: CORS_HEADERS, body: '' };
    }

    const days = parseInt(event.queryStringParameters?.days || '7');
    const limit = Math.min(days * 24, 168); // Max 7 days of hourly data
    
    // In a real implementation, you would query historical data from DynamoDB
    // For now, return mock historical data
    const mockHistory = generateMockPriceHistory(days);

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        prices: mockHistory,
        period: `${days} days`,
      }),
    };
  } catch (error) {
    console.error('Error getting price history:', error);
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};

function generateMockPriceHistory(days: number) {
  const history = [];
  const now = Date.now();
  const basePrice = 0.0001;
  
  for (let i = days * 24; i >= 0; i--) {
    const timestamp = now - (i * 60 * 60 * 1000); // Hour intervals
    const variation = (Math.random() - 0.5) * 0.1; // ±10% variation
    const price = basePrice * (1 + variation);
    
    history.push([timestamp, price]);
  }
  
  return history;
}