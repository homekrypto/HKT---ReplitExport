# HKT Blog API Documentation

## Overview
The HKT Blog API provides comprehensive blog management functionality with Make.com integration support. It includes public endpoints for the website and authenticated endpoints for content management.

## Environment Variables
Set the following environment variable for API security:
```
BLOG_API_KEY=your-secure-api-key-here
```

## API Endpoints

### Public Endpoints (No Authentication Required)

#### GET /api/blog/public
Get published blog posts for the public blog page.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Posts per page (default: 10)

**Response:**
```json
{
  "posts": [
    {
      "id": 1,
      "title": "Getting Started with HKT",
      "slug": "getting-started-with-hkt",
      "excerpt": "Learn how to begin your investment journey...",
      "author": "HomeKrypto Team",
      "publishedAt": "2025-06-22T12:00:00Z",
      "featuredImageUrl": "https://example.com/image.jpg",
      "metaTitle": "SEO Title",
      "metaDescription": "SEO Description"
    }
  ],
  "page": 1,
  "limit": 10,
  "hasMore": true
}
```

#### GET /api/blog/public/:slug
Get a single published blog post by slug.

**Response:**
```json
{
  "id": 1,
  "title": "Getting Started with HKT",
  "slug": "getting-started-with-hkt",
  "content": "<p>Full HTML content...</p>",
  "excerpt": "Learn how to begin...",
  "author": "HomeKrypto Team",
  "status": "published",
  "publishedAt": "2025-06-22T12:00:00Z",
  "createdAt": "2025-06-22T10:00:00Z",
  "updatedAt": "2025-06-22T11:00:00Z",
  "metaTitle": "SEO Title",
  "metaDescription": "SEO Description",
  "featuredImageUrl": "https://example.com/image.jpg"
}
```

#### GET /api/blog/search
Search published blog posts.

**Query Parameters:**
- `q` (required): Search query (minimum 2 characters)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Posts per page (default: 10)

### Authenticated Endpoints (API Key Required)

All write operations require the `X-API-Key` header or `Authorization: Bearer <api-key>`.

#### POST /api/blog
Create a new blog post.

**Headers:**
```
X-API-Key: your-api-key
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "My Blog Post",
  "slug": "my-blog-post", // Optional, auto-generated from title if not provided
  "content": "<p>Full HTML content of the post</p>",
  "excerpt": "Short description for previews",
  "author": "Author Name", // Optional, defaults to "HomeKrypto Team"
  "status": "draft", // Options: "draft", "published", "archived"
  "publishedAt": "2025-06-22T12:00:00Z", // Optional, auto-set when status = published
  "metaTitle": "SEO optimized title",
  "metaDescription": "SEO meta description",
  "featuredImageUrl": "https://example.com/image.jpg"
}
```

#### GET /api/blog
Get all blog posts (including drafts) for admin/Make.com.

**Headers:**
```
X-API-Key: your-api-key
```

**Query Parameters:**
- `status` (optional): Filter by status ("draft", "published", "archived")
- `page` (optional): Page number (default: 1)
- `limit` (optional): Posts per page (default: 50)

#### GET /api/blog/:id
Get a single blog post by ID for admin/Make.com.

**Headers:**
```
X-API-Key: your-api-key
```

#### PUT /api/blog/:id
Update an existing blog post.

**Headers:**
```
X-API-Key: your-api-key
Content-Type: application/json
```

**Request Body:** (All fields optional)
```json
{
  "title": "Updated Title",
  "content": "<p>Updated content</p>",
  "status": "published",
  "excerpt": "Updated excerpt"
}
```

#### DELETE /api/blog/:id
Delete a blog post.

**Headers:**
```
X-API-Key: your-api-key
```

**Response:**
```json
{
  "message": "Blog post deleted successfully"
}
```

#### POST /api/blog/generate-slug
Generate a unique slug from a title.

**Headers:**
```
X-API-Key: your-api-key
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "My Blog Post Title"
}
```

**Response:**
```json
{
  "slug": "my-blog-post-title"
}
```

## Make.com Integration

### Setting Up Make.com Scenarios

1. **Create Blog Post Scenario:**
   - Use HTTP module to POST to `/api/blog`
   - Set headers: `X-API-Key: your-api-key`
   - Send JSON body with blog post data

2. **Update Blog Post Scenario:**
   - Use HTTP module to PUT to `/api/blog/{post_id}`
   - Include post ID in URL path
   - Send updated fields in JSON body

3. **Delete Blog Post Scenario:**
   - Use HTTP module to DELETE to `/api/blog/{post_id}`

### Example Make.com HTTP Module Configuration

**URL:** `https://your-domain.com/api/blog`
**Method:** POST
**Headers:**
```
X-API-Key: your-secure-api-key
Content-Type: application/json
```
**Body:**
```json
{
  "title": "{{title}}",
  "content": "{{content}}",
  "excerpt": "{{excerpt}}",
  "status": "published",
  "author": "{{author}}",
  "featuredImageUrl": "{{image_url}}"
}
```

## Content Guidelines

### Content Format
- **HTML Content**: The `content` field accepts full HTML
- **Markdown Support**: Convert Markdown to HTML before sending
- **Image Handling**: Use absolute URLs for images
- **Slug Generation**: Slugs are automatically generated from titles if not provided

### SEO Best Practices
- Always include `metaTitle` and `metaDescription`
- Use descriptive, keyword-rich titles
- Keep meta descriptions under 160 characters
- Include relevant `featuredImageUrl` for social sharing

## Error Handling

### Common Error Responses

**400 Bad Request:**
```json
{
  "error": "Validation failed",
  "details": [
    {
      "path": ["title"],
      "message": "Title is required"
    }
  ]
}
```

**401 Unauthorized:**
```json
{
  "error": "Invalid or missing API key"
}
```

**404 Not Found:**
```json
{
  "error": "Blog post not found"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Failed to create blog post"
}
```

## Database Schema

The blog posts are stored with the following structure:

```sql
CREATE TABLE blog_posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  content TEXT NOT NULL,
  excerpt VARCHAR(500),
  author VARCHAR(100) DEFAULT 'HomeKrypto Team',
  status VARCHAR(20) DEFAULT 'draft',
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
  meta_title VARCHAR(255),
  meta_description VARCHAR(500),
  featured_image_url VARCHAR(500)
);
```

## Security Notes

- Store the `BLOG_API_KEY` securely
- Use HTTPS for all API requests
- Validate and sanitize all content inputs
- The API key provides full blog management access
- Consider implementing rate limiting for production use