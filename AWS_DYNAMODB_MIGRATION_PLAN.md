# HKT Project Migration to AWS Lambda + DynamoDB

## Migration Overview
Complete migration from PostgreSQL + Express to AWS Lambda + DynamoDB serverless architecture.

## Current Database Schema Analysis

### PostgreSQL Tables (Current)
1. **users** - User accounts and authentication
2. **sessions** - User session management  
3. **password_resets** - Password reset tokens
4. **email_verifications** - Email verification tokens
5. **investments** - User investment records
6. **quarterly_data** - Investment performance data
7. **hkt_stats** - Token price and market data
8. **subscribers** - Newsletter subscribers
9. **supported_chains** - Blockchain networks
10. **user_wallets** - User wallet addresses
11. **wallet_verification_challenges** - Wallet verification
12. **blog_posts** - Blog content management

## DynamoDB Table Design

### Primary Table Strategy: Single Table Design
**Table Name:** `hkt-platform-data`

#### Access Patterns & Keys
```
PK (Partition Key) | SK (Sort Key) | Entity Type
-------------------|---------------|-------------
USER#{userId}      | PROFILE       | User Profile
USER#{userId}      | SESSION#{sessionId} | User Session  
USER#{userId}      | WALLET#{walletId} | User Wallet
USER#{userId}      | INVESTMENT#{investmentId} | Investment
USER#{userId}      | QUARTERLY#{date} | Quarterly Data
GLOBAL             | HKT_STATS#{timestamp} | HKT Statistics
EMAIL#{email}      | VERIFICATION#{token} | Email Verification
EMAIL#{email}      | PASSWORD_RESET#{token} | Password Reset
BLOG#{postId}      | METADATA | Blog Post
BLOG#{slug}        | CONTENT | Blog Content
SUBSCRIBER#{email} | PROFILE | Newsletter Subscriber
CHAIN#{chainId}    | CONFIG | Supported Chain
WALLET#{address}   | CHALLENGE#{token} | Wallet Verification
```

#### GSI (Global Secondary Indexes)
1. **EmailIndex**: GSI1PK = email, GSI1SK = USER#{userId}
2. **WalletIndex**: GSI2PK = walletAddress, GSI2SK = USER#{userId}
3. **InvestmentIndex**: GSI3PK = investmentType, GSI3SK = createdAt
4. **BlogIndex**: GSI4PK = status, GSI4SK = publishedAt

## Migration Steps

### Phase 1: AWS Setup
1. Create DynamoDB table with proper indexes
2. Set up Lambda functions for each API endpoint
3. Configure API Gateway routing
4. Set up IAM roles and policies

### Phase 2: Data Migration
1. Export data from PostgreSQL (Neon)
2. Transform data format for DynamoDB
3. Bulk import using AWS Data Pipeline or custom script
4. Verify data integrity

### Phase 3: Application Migration
1. Replace Drizzle ORM with AWS SDK DynamoDB client
2. Update storage layer with DynamoDB operations
3. Convert Express routes to Lambda handlers
4. Update authentication to use JWT tokens

### Phase 4: Infrastructure
1. Deploy React frontend to S3 + CloudFront
2. Set up EventBridge for scheduled price updates
3. Configure SES for email services
4. Set up monitoring and logging

## Code Architecture Changes

### New DynamoDB Client
```typescript
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({ region: 'us-east-1' });
const docClient = DynamoDBDocumentClient.from(client);
```

### Lambda Function Structure
```typescript
import { APIGatewayProxyHandler } from 'aws-lambda';

export const handler: APIGatewayProxyHandler = async (event) => {
  // DynamoDB operations
  // Business logic
  // Return response
};
```

## Benefits of DynamoDB Migration

### Performance
- Single-digit millisecond latency
- Auto-scaling based on demand
- No connection pooling issues

### Cost Optimization
- Pay-per-request pricing
- No database server costs
- Scales to zero when not used

### Operational Benefits
- Fully managed service
- Automatic backups
- Multi-region replication available

### Lambda Integration
- Native AWS SDK integration
- No cold start database connections
- Serverless-first architecture

## Estimated Migration Timeline
- **Phase 1 (AWS Setup)**: 2-3 days
- **Phase 2 (Data Migration)**: 1-2 days  
- **Phase 3 (Application)**: 3-5 days
- **Phase 4 (Infrastructure)**: 1-2 days
- **Testing & Deployment**: 2-3 days

**Total**: 9-15 days for complete migration

## Cost Comparison

### Current (PostgreSQL + Replit)
- Database: ~$25/month
- Hosting: ~$20/month
- **Total: ~$45/month**

### AWS Lambda + DynamoDB
- DynamoDB: ~$5-15/month (based on usage)
- Lambda: ~$2-10/month (based on requests)
- API Gateway: ~$3-8/month
- S3 + CloudFront: ~$5-10/month
- **Total: ~$15-43/month** (scales with usage)

## Next Steps
1. Create DynamoDB table schema
2. Build Lambda function templates
3. Create data migration scripts
4. Set up deployment pipeline