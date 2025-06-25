# AWS Lambda + DynamoDB Deployment Guide

## Prerequisites

1. **AWS Account** with appropriate permissions
2. **Node.js 18+** installed locally
3. **AWS CLI** configured with credentials
4. **Serverless Framework** installed globally
5. **Domain name** (optional, for custom domain)

## Step-by-Step Deployment

### 1. Install Serverless Framework
```bash
npm install -g serverless
npm install -g serverless-webpack serverless-offline
```

### 2. Configure AWS Credentials
```bash
aws configure
# Enter your AWS Access Key ID, Secret Access Key, and region
```

### 3. Install Project Dependencies
```bash
cd aws-lambda
npm install
```

### 4. Set Environment Variables
Create `.env` file:
```
JWT_SECRET=your-super-secret-jwt-key-here
COINGECKO_API_KEY=your-coingecko-api-key (optional)
MORALIS_API_KEY=your-moralis-api-key (optional)
```

### 5. Deploy Backend Infrastructure
```bash
# Deploy to production
serverless deploy --stage prod

# Deploy to staging
serverless deploy --stage staging
```

### 6. Run Data Migration
```bash
# Set up PostgreSQL source
export DATABASE_URL="your-current-neon-database-url"

# Run migration script
npm run migrate
```

### 7. Deploy Frontend to S3
```bash
# Build React app
cd ../
npm run build

# Deploy to S3 bucket (output from serverless deploy)
aws s3 sync dist/ s3://hkt-platform-assets-prod --delete
```

### 8. Configure CloudFront (Optional)
Update CloudFront distribution with custom domain:
```bash
# Get distribution ID from serverless output
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

## Environment Configuration

### Production Environment Variables

Set these in AWS Lambda console or via Serverless:

```yaml
# In serverless.yml
environment:
  TABLE_NAME: ${self:custom.tableName}
  JWT_SECRET: ${env:JWT_SECRET}
  AWS_REGION: ${self:provider.region}
  NODE_ENV: production
  COINGECKO_API_KEY: ${env:COINGECKO_API_KEY}
  MORALIS_API_KEY: ${env:MORALIS_API_KEY}
```

### Frontend Environment Variables

Create `.env.production` in your React app:
```
VITE_API_URL=https://your-api-gateway-url.execute-api.us-east-1.amazonaws.com/prod
VITE_CLOUDFRONT_URL=https://your-cloudfront-domain.cloudfront.net
```

## Post-Deployment Steps

### 1. Verify API Endpoints
```bash
# Test authentication
curl -X POST https://your-api-url/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Test price endpoint
curl https://your-api-url/hkt/price
```

### 2. Set up Custom Domain (Optional)
```yaml
# In serverless.yml, add:
custom:
  customDomain:
    domainName: api.homekrypto.com
    certificateName: '*.homekrypto.com'
    createRoute53Record: true
```

### 3. Configure Monitoring
```yaml
# Add to serverless.yml
custom:
  alerts:
    - functionErrors
    - functionDuration
```

### 4. Set up CI/CD Pipeline
```yaml
# .github/workflows/deploy.yml
name: Deploy to AWS
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm install
      - name: Deploy
        run: serverless deploy --stage prod
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```

## Performance Optimization

### 1. Lambda Function Optimization
- Use provisioned concurrency for frequently called functions
- Optimize bundle size with webpack
- Implement connection pooling for DynamoDB

### 2. DynamoDB Optimization
- Use single-table design for better performance
- Implement proper indexing strategy
- Enable auto-scaling for read/write capacity

### 3. Frontend Optimization
- Enable CloudFront caching
- Implement lazy loading for components
- Use React.memo for expensive components

## Monitoring and Logging

### 1. CloudWatch Logs
- Monitor Lambda function logs
- Set up alerts for errors and performance issues
- Use structured logging with correlation IDs

### 2. DynamoDB Metrics
- Monitor read/write capacity usage
- Track throttling events
- Set up alarms for high latency

### 3. API Gateway Metrics
- Monitor request count and latency
- Track error rates by endpoint
- Set up custom metrics for business logic

## Security Considerations

### 1. IAM Roles
- Use least privilege principle
- Separate roles for different functions
- Regular audit of permissions

### 2. API Security
- Implement rate limiting
- Use API keys for external access
- Enable CORS properly

### 3. Data Security
- Encrypt sensitive data at rest
- Use HTTPS for all communications
- Implement proper authentication

## Cost Optimization

### 1. Lambda Costs
- Use ARM-based processors for better price/performance
- Implement proper timeout settings
- Monitor and optimize memory usage

### 2. DynamoDB Costs
- Use on-demand pricing for variable workloads
- Implement data lifecycle policies
- Use compression for large items

### 3. Data Transfer Costs
- Use CloudFront for static assets
- Implement proper caching strategies
- Optimize API response sizes

## Troubleshooting

### Common Issues
1. **Cold Start Latency**: Use provisioned concurrency
2. **DynamoDB Throttling**: Increase capacity or use auto-scaling
3. **CORS Issues**: Check API Gateway CORS configuration
4. **Authentication Failures**: Verify JWT secret and token expiration

### Debug Commands
```bash
# View logs
serverless logs -f functionName

# Invoke function locally
serverless invoke local -f functionName

# Test offline
serverless offline
```

## Rollback Strategy

### 1. Serverless Rollback
```bash
# Rollback to previous version
serverless rollback --timestamp timestamp-from-deploy
```

### 2. Database Rollback
- Use DynamoDB point-in-time recovery
- Implement backup and restore procedures
- Test rollback procedures regularly

## Support and Maintenance

### 1. Regular Updates
- Update Lambda runtimes
- Update dependencies
- Security patches

### 2. Backup Strategy
- DynamoDB backups
- Code repository backups
- Configuration backups

### 3. Documentation
- API documentation
- Deployment procedures
- Troubleshooting guides

This comprehensive guide covers the complete migration from your current Replit + PostgreSQL setup to a scalable AWS Lambda + DynamoDB architecture.