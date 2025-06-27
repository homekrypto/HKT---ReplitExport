# HKT Platform API Documentation

## Authentication Endpoints

### POST /api/auth/register
Register a new user account.
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "country": "United States"
}
```

### POST /api/auth/login
Authenticate user and create session.
```json
{
  "email": "user@example.com", 
  "password": "password123"
}
```

### GET /api/auth/me
Get current authenticated user information.

### POST /api/auth/logout
Logout current user session.

### POST /api/auth/forgot-password
Request password reset email.
```json
{
  "email": "user@example.com"
}
```

### POST /api/auth/reset-password/:token
Reset password using token from email.
```json
{
  "password": "newpassword123"
}
```

## Investment Endpoints

### GET /api/investments
Get user's investment portfolio.

### POST /api/investments
Create new investment.
```json
{
  "monthlyAmount": 500,
  "walletAddress": "0x742d35Cc6635C0532925a3b8D33B4B8b4C07AE26"
}
```

### GET /api/investments/projections
Calculate investment projections.
```json
{
  "monthlyAmount": 500,
  "months": 36
}
```

## Property & Booking Endpoints

### GET /api/bookings/properties/:propertyId
Get property details for booking.

### GET /api/bookings/user-shares/:propertyId
Get user's shares in specific property.

### POST /api/bookings/calculate-price
Calculate booking price.
```json
{
  "checkIn": "2025-07-15",
  "checkOut": "2025-07-22", 
  "currency": "USD"
}
```

### POST /api/bookings/create-stripe-booking
Create booking with Stripe payment.

### POST /api/bookings/create-hkt-booking
Create booking with HKT token payment.

### GET /api/bookings/my-bookings
Get user's booking history.

## Admin Endpoints

### GET /api/admin/properties
Get all properties (admin only).

### PUT /api/admin/properties/:propertyId
Update property details (admin only).

### GET /api/admin/bookings
Get all bookings (admin only).

### PUT /api/admin/hkt-price
Update HKT token price (admin only).

## Blog Endpoints

### GET /api/blog/posts
Get published blog posts.

### GET /api/blog/posts/:slug
Get specific blog post by slug.

### POST /api/blog/posts
Create new blog post (admin only).

## Wallet Endpoints

### GET /api/wallets/user-wallets
Get user's connected wallets.

### POST /api/wallets/generate-challenge
Generate wallet verification challenge.

### POST /api/wallets/verify-signature
Verify wallet ownership with signature.

### POST /api/wallets/set-primary
Set primary wallet address.

## Price Feed Endpoints

### GET /api/price/hkt
Get current HKT token price and statistics.

### GET /api/price/history
Get HKT price history data.

## Contact & Newsletter Endpoints

### POST /api/contact
Send contact form message.
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Question",
  "message": "Hello..."
}
```

### POST /api/newsletter/subscribe
Subscribe to newsletter.
```json
{
  "email": "user@example.com",
  "type": "newsletter"
}
```

## Error Responses

All endpoints return consistent error format:
```json
{
  "error": "Error message",
  "code": "ERROR_CODE", 
  "details": {}
}
```

## Rate Limiting

- Authentication endpoints: 5 requests per minute
- General endpoints: 100 requests per minute
- Admin endpoints: No rate limiting

## Authentication

Most endpoints require JWT token in Authorization header:
```
Authorization: Bearer <jwt_token>
```

Or session cookie for web requests.