# HKT Platform DynamoDB Security Configuration

## Resource-Based Policy Overview

The resource-based policy provides fine-grained access control for your HKT platform DynamoDB table with the following security principles:

### 1. Principle of Least Privilege
- Lambda functions only access required data patterns
- Specific attribute-level permissions
- Partition key restrictions based on access patterns

### 2. Data Isolation
- User data isolated by partition keys (`USER#${userId}`)
- Cross-user data access prevented
- Sensitive operations require specific conditions

### 3. Operation-Specific Access
- Read/write permissions tailored to each Lambda function
- Price monitoring limited to `GLOBAL` partition
- Blog operations restricted to `BLOG#*` partitions

## Policy Components

### HKT Lambda Access Statement
```json
{
  "Sid": "HKTLambdaAccess",
  "Effect": "Allow",
  "Principal": {
    "AWS": "arn:aws:iam::881254692636:role/hkt-platform-*-lambdaRole"
  }
}
```

**Purpose**: Main access for HKT Lambda functions
**Permissions**: Full CRUD operations on user data
**Restrictions**: 
- Limited to specific partition keys
- Attribute-level access control
- Wildcard role matching for different environments

### Price Monitoring Access
```json
{
  "Sid": "HKTPriceMonitoringAccess",
  "Condition": {
    "StringEquals": {
      "dynamodb:LeadingKeys": "GLOBAL"
    }
  }
}
```

**Purpose**: Automated HKT price updates
**Permissions**: Write access to global HKT statistics
**Restrictions**: Only `GLOBAL` partition access

### User Data Access
```json
{
  "Condition": {
    "StringLike": {
      "dynamodb:LeadingKeys": [
        "USER#*",
        "EMAIL#*"
      ]
    }
  }
}
```

**Purpose**: User authentication and profile management
**Permissions**: Access to user profiles and email verification
**Restrictions**: User-specific partition isolation

### Security Denials
```json
{
  "Sid": "DenyUnauthorizedAccess",
  "Effect": "Deny",
  "Action": [
    "dynamodb:Scan",
    "dynamodb:PartiQLSelect"
  ]
}
```

**Purpose**: Prevent expensive scan operations and SQL-like queries
**Protection**: Against accidental full table scans
**Impact**: Forces efficient query patterns

## IAM Policy for Lambda Execution Role

The complementary IAM policy provides:

### DynamoDB Permissions
- Standard item operations (Get, Put, Update, Delete, Query)
- Batch operations for efficiency
- Stream access for real-time processing
- Index access for GSI queries

### Additional AWS Services
- **CloudWatch Logs**: Function logging and monitoring
- **SES**: Email notifications and verification
- **EventBridge**: Event-driven architecture
- **Parameter Store**: Configuration management
- **Secrets Manager**: Sensitive data storage

## Security Best Practices Implemented

### 1. Multi-Layer Security
- Resource-based policy at table level
- IAM policy at execution role level
- Application-level access controls

### 2. Data Protection
- Encryption in transit (HTTPS required)
- Encryption at rest (DynamoDB default)
- Access logging enabled
- Point-in-time recovery enabled

### 3. Monitoring and Auditing
- CloudTrail integration for API calls
- CloudWatch metrics for performance
- DynamoDB streams for change tracking
- Access Analyzer validation

### 4. Environment Isolation
- Separate policies per environment (dev/staging/prod)
- Role-based access separation
- Resource naming conventions

## Implementation Steps

### 1. Apply Resource-Based Policy
```bash
aws dynamodb put-resource-policy \
  --resource-arn arn:aws:dynamodb:us-east-1:881254692636:table/hkt-platform-data-prod \
  --policy file://dynamodb-resource-policy.json
```

### 2. Create IAM Role
```bash
aws iam create-role \
  --role-name hkt-platform-prod-lambdaRole \
  --assume-role-policy-document file://lambda-trust-policy.json

aws iam put-role-policy \
  --role-name hkt-platform-prod-lambdaRole \
  --policy-name HKTDynamoDBAccess \
  --policy-document file://dynamodb-iam-policy.json
```

### 3. Validate with Access Analyzer
- Use AWS Access Analyzer to preview external access
- Verify no unintended cross-account access
- Check for overly permissive conditions

## Access Patterns Supported

### User Dashboard
- **Pattern**: Get all user data
- **Query**: `PK = USER#12345`
- **Security**: User isolation enforced

### Investment Tracking
- **Pattern**: User-specific investment data
- **Query**: `PK = USER#12345 AND SK BEGINS_WITH INVESTMENT#`
- **Security**: Partition-level isolation

### Price Monitoring
- **Pattern**: Global HKT statistics
- **Query**: `PK = GLOBAL AND SK BEGINS_WITH HKT_STATS#`
- **Security**: Read-only for most functions

### Authentication
- **Pattern**: Email-based user lookup
- **Query**: GSI on email address
- **Security**: Encrypted attribute access

## Cost Optimization

### Efficient Access Patterns
- Single partition queries minimize RCU consumption
- Batch operations reduce API calls
- Proper indexing eliminates table scans

### Pay-Per-Request Benefits
- No capacity planning required
- Automatic scaling based on demand
- Cost optimization during low usage periods

This security configuration provides enterprise-grade protection while maintaining optimal performance for your HKT investment platform.