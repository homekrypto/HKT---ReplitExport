import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface AIAssistantRequest {
  message: string;
  context?: {
    userId?: number;
    userInvestments?: any[];
    currentPage?: string;
  };
}

export interface AIAssistantResponse {
  response: string;
  suggestedActions?: string[];
  category: 'investment' | 'platform' | 'general' | 'technical';
}

export async function getAIAssistance(request: AIAssistantRequest): Promise<AIAssistantResponse> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OpenAI API key not configured");
  }

  const systemPrompt = `You are an expert AI assistant for Home Krypto Token (HKT), a blockchain-based real estate investment platform. Your role is to help users with:

1. REAL ESTATE INVESTMENT GUIDANCE:
   - Explain fractional property ownership through HKT tokens
   - Guide users on investment strategies and portfolio building
   - Discuss property types, locations, and rental income potential
   - Help with risk assessment and diversification

2. HKT PLATFORM ASSISTANCE:
   - Explain how to buy HKT tokens using Uniswap
   - Guide through registration, verification, and platform features
   - Help with wallet connections (MetaMask integration)
   - Explain investment calculations and projections

3. TECHNICAL SUPPORT:
   - Troubleshoot common platform issues
   - Guide through blockchain transactions
   - Explain Web3 concepts in simple terms
   - Help with account and security questions

4. INVESTMENT EDUCATION:
   - Explain real estate market trends
   - Discuss crypto investing basics
   - Help understand property sharing models (52-week ownership)
   - Guide on rental income and value appreciation

IMPORTANT GUIDELINES:
- Always provide accurate, helpful information about real estate and crypto investing
- Be encouraging but realistic about investment risks
- Use simple language for complex concepts
- Suggest relevant platform features when appropriate
- Never provide financial advice - only educational information
- Focus on HKT's unique fractional ownership model
- Emphasize the pilot property concept (vacation rental shares)

Current HKT details:
- Token price: $0.152
- Token contract: 0x0de50324B6960B15A5ceD3D076aE314ac174Da2e (ERC-20)
- Total supply: 1,000,000,000 HKT
- Monthly investment plans starting at $106.83
- 52-week property sharing model
- Vacation rental focus for pilot properties
- Blockchain-secured ownership records`;

  const userContext = request.context ? `
User context:
- Current page: ${request.context.currentPage || 'unknown'}
- User ID: ${request.context.userId || 'anonymous'}
- Has investments: ${request.context.userInvestments?.length ? 'yes' : 'no'}
` : '';

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: systemPrompt + userContext + "\n\nPlease respond in JSON format with the following structure: { \"response\": \"your helpful response\", \"suggestedActions\": [\"action1\", \"action2\"], \"category\": \"investment|platform|general|technical\" }"
        },
        {
          role: "user",
          content: request.message
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 800,
      temperature: 0.7
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No response from OpenAI");
    }

    const parsed = JSON.parse(content);
    
    // Ensure the response has the expected structure
    return {
      response: parsed.response || "I'm here to help with your HKT investment questions!",
      suggestedActions: parsed.suggestedActions || [],
      category: parsed.category || 'general'
    };

  } catch (error) {
    console.error('AI Assistant error:', error);
    
    // Fallback response for errors
    return {
      response: "I'm experiencing some technical difficulties right now. Please try asking your question again, or contact our support team for immediate assistance.",
      suggestedActions: [
        "Try rephrasing your question",
        "Visit our How It Works page",
        "Contact support"
      ],
      category: 'technical'
    };
  }
}

export function categorizeQuestion(message: string): 'investment' | 'platform' | 'general' | 'technical' {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('invest') || lowerMessage.includes('property') || lowerMessage.includes('returns') || lowerMessage.includes('profit')) {
    return 'investment';
  }
  
  if (lowerMessage.includes('buy') || lowerMessage.includes('wallet') || lowerMessage.includes('metamask') || lowerMessage.includes('uniswap')) {
    return 'platform';
  }
  
  if (lowerMessage.includes('error') || lowerMessage.includes('bug') || lowerMessage.includes('not working')) {
    return 'technical';
  }
  
  return 'general';
}