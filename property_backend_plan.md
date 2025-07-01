# Property Management Backend API Implementation Plan

## Phase 1 - Stack Confirmation & Data Model Design

### Stack Analysis Confirmed
- **Backend Framework**: Node.js with Express.js and TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: JWT-based authentication with admin middleware
- **Schema File**: `shared/schema.ts`
- **Admin Protection**: Existing admin middleware in authentication system

### Proposed Property Schema Design
Based on the requirements, I'll design a comprehensive property schema that integrates seamlessly with your existing Drizzle ORM setup.

## Phase 2 - Backend Implementation Plan

### 1. Database Schema and Migration

**File to Modify**: `shared/schema.ts`

**Action**: Add the new properties table schema using Drizzle ORM syntax.

**Code to Add**:
```typescript
// Properties table for real estate management
export const properties = pgTable("properties", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description").notNull(),
  price: decimal("price", { precision: 15, scale: 2 }).notNull(),
  location: varchar("location", { length: 255 }).notNull(),
  status: varchar("status", { length: 20 }).notNull().default('For Sale'), // 'For Sale', 'Sold', 'Rented'
  type: varchar("type", { length: 20 }).notNull().default('House'), // 'House', 'Apartment', 'Land'
  imageUrls: text("image_urls").array().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Property types for type safety
export type PropertyStatus = 'For Sale' | 'Sold' | 'Rented';
export type PropertyType = 'House' | 'Apartment' | 'Land';

// Inferred types for TypeScript
export type Property = typeof properties.$inferSelect;
export type InsertProperty = typeof properties.$inferInsert;

// Zod validation schemas
export const insertPropertySchema = createInsertSchema(properties).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updatePropertySchema = insertPropertySchema.partial();

// Property status and type validation schemas
export const propertyStatusSchema = z.enum(['For Sale', 'Sold', 'Rented']);
export const propertyTypeSchema = z.enum(['House', 'Apartment', 'Land']);
```

**Migration Command**:
```bash
# Generate and apply the database migration
npm run db:push
```

**Note**: The `npm run db:push` command will automatically detect the new table schema and create the `properties` table in your PostgreSQL database with all the specified columns and constraints.

### 2. Backend API for Property CRUD

**File to Create**: `server/routes/propertyRoutes.ts`

**Action**: Create a comprehensive property management API with full CRUD operations and admin protection.

**Full Code**:
```typescript
import { Router } from 'express';
import { z } from 'zod';
import { db } from '../db';
import { properties, insertPropertySchema, updatePropertySchema, type Property } from '@shared/schema';
import { eq, and, or, like, desc } from 'drizzle-orm';

const router = Router();

// Admin authentication middleware function
// This should match your existing admin middleware pattern
async function requireAdmin(req: any, res: any, next: any) {
  // Check for session token from cookie or Authorization header
  const token = req.cookies?.sessionToken || req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  // Validate session and check admin status
  // This should integrate with your existing auth system
  try {
    // Replace this with your actual session validation logic
    const session = await validateSession(token);
    if (!session || !session.isAdmin) {
      return res.status(403).json({ message: 'Admin access required' });
    }
    
    req.user = session;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired session' });
  }
}

// Validation schemas for request body
const createPropertySchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().positive('Price must be positive'),
  location: z.string().min(1, 'Location is required').max(255, 'Location too long'),
  status: z.enum(['For Sale', 'Sold', 'Rented']).default('For Sale'),
  type: z.enum(['House', 'Apartment', 'Land']).default('House'),
  imageUrls: z.array(z.string().url('Invalid image URL')).default([]),
});

const updatePropertySchema = createPropertySchema.partial();

const querySchema = z.object({
  status: z.enum(['For Sale', 'Sold', 'Rented']).optional(),
  type: z.enum(['House', 'Apartment', 'Land']).optional(),
  search: z.string().optional(),
  page: z.string().transform(Number).default('1'),
  limit: z.string().transform(Number).default('10'),
});

// POST /api/properties - Create a new property
router.post('/', requireAdmin, async (req, res) => {
  try {
    const validatedData = createPropertySchema.parse(req.body);
    
    const [newProperty] = await db
      .insert(properties)
      .values({
        ...validatedData,
        updatedAt: new Date(),
      })
      .returning();

    res.status(201).json({
      success: true,
      message: 'Property created successfully',
      data: newProperty
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors
      });
    }
    
    console.error('Error creating property:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create property'
    });
  }
});

// GET /api/properties - Fetch all properties with filtering and search
router.get('/', async (req, res) => {
  try {
    const query = querySchema.parse(req.query);
    
    // Build where conditions
    const conditions = [];
    
    if (query.status) {
      conditions.push(eq(properties.status, query.status));
    }
    
    if (query.type) {
      conditions.push(eq(properties.type, query.type));
    }
    
    // Text search on title field
    if (query.search) {
      conditions.push(like(properties.title, `%${query.search}%`));
    }
    
    // Combine conditions
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    
    // Calculate pagination
    const offset = (query.page - 1) * query.limit;
    
    // Execute query with pagination
    const allProperties = await db
      .select()
      .from(properties)
      .where(whereClause)
      .orderBy(desc(properties.createdAt))
      .limit(query.limit)
      .offset(offset);
    
    // Get total count for pagination
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(properties)
      .where(whereClause);
    
    const totalPages = Math.ceil(count / query.limit);
    
    res.json({
      success: true,
      data: allProperties,
      pagination: {
        page: query.page,
        limit: query.limit,
        total: count,
        totalPages,
        hasNext: query.page < totalPages,
        hasPrev: query.page > 1
      },
      filters: {
        status: query.status,
        type: query.type,
        search: query.search
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Invalid query parameters',
        errors: error.errors
      });
    }
    
    console.error('Error fetching properties:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch properties'
    });
  }
});

// GET /api/properties/:id - Fetch a single property by ID
router.get('/:id', async (req, res) => {
  try {
    const propertyId = parseInt(req.params.id);
    
    if (isNaN(propertyId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid property ID'
      });
    }
    
    const [property] = await db
      .select()
      .from(properties)
      .where(eq(properties.id, propertyId));
    
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }
    
    res.json({
      success: true,
      data: property
    });
  } catch (error) {
    console.error('Error fetching property:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch property'
    });
  }
});

// PATCH /api/properties/:id - Update an existing property
router.patch('/:id', requireAdmin, async (req, res) => {
  try {
    const propertyId = parseInt(req.params.id);
    
    if (isNaN(propertyId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid property ID'
      });
    }
    
    const validatedData = updatePropertySchema.parse(req.body);
    
    // Check if property exists
    const [existingProperty] = await db
      .select()
      .from(properties)
      .where(eq(properties.id, propertyId));
    
    if (!existingProperty) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }
    
    // Update property
    const [updatedProperty] = await db
      .update(properties)
      .set({
        ...validatedData,
        updatedAt: new Date()
      })
      .where(eq(properties.id, propertyId))
      .returning();
    
    res.json({
      success: true,
      message: 'Property updated successfully',
      data: updatedProperty
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors
      });
    }
    
    console.error('Error updating property:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update property'
    });
  }
});

// DELETE /api/properties/:id - Delete a property
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const propertyId = parseInt(req.params.id);
    
    if (isNaN(propertyId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid property ID'
      });
    }
    
    // Check if property exists
    const [existingProperty] = await db
      .select()
      .from(properties)
      .where(eq(properties.id, propertyId));
    
    if (!existingProperty) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }
    
    // Delete property
    await db
      .delete(properties)
      .where(eq(properties.id, propertyId));
    
    res.json({
      success: true,
      message: 'Property deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting property:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete property'
    });
  }
});

// GET /api/properties/stats/summary - Get property statistics (admin only)
router.get('/stats/summary', requireAdmin, async (req, res) => {
  try {
    // Get total count
    const [{ totalCount }] = await db
      .select({ totalCount: sql<number>`count(*)` })
      .from(properties);
    
    // Get count by status
    const statusCounts = await db
      .select({
        status: properties.status,
        count: sql<number>`count(*)`
      })
      .from(properties)
      .groupBy(properties.status);
    
    // Get count by type
    const typeCounts = await db
      .select({
        type: properties.type,
        count: sql<number>`count(*)`
      })
      .from(properties)
      .groupBy(properties.type);
    
    res.json({
      success: true,
      data: {
        total: totalCount,
        byStatus: statusCounts,
        byType: typeCounts
      }
    });
  } catch (error) {
    console.error('Error fetching property statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics'
    });
  }
});

export default router;
```

**Note**: You'll need to add this import at the top of the file for the SQL count function:
```typescript
import { sql } from 'drizzle-orm';
```

**File to Modify**: `server/routes.ts`

**Action**: Import and integrate the new property routes into the main Express application.

**Code to Add** (Add after line 45 where other routes are registered):
```typescript
// Property management routes
const propertyRoutes = (await import('./routes/propertyRoutes')).default;
app.use('/api/properties', propertyRoutes);
```

**Alternative Integration Method** (if you prefer to add it in the main index.ts file):

**File to Modify**: `server/index.ts`

**Code to Add** (Add this where other routes are registered):
```typescript
// Property management routes
import propertyRoutes from './routes/propertyRoutes';
app.use('/api/properties', propertyRoutes);
```

### 3. Image Management Strategy

**Strategy**: URL-Based Image Storage

For this implementation, we're using a **URL-based image management strategy** that provides flexibility and simplicity:

#### How It Works:
1. **Frontend Responsibility**: The frontend application will handle image uploads to external services like:
   - Cloudinary
   - AWS S3
   - Google Cloud Storage
   - or any other image hosting service

2. **Backend Storage**: The backend will only store the resulting image URLs in the `imageUrls` array field in the database.

3. **API Integration**: The property creation and update endpoints (`POST /api/properties` and `PATCH /api/properties/:id`) accept an `imageUrls` array in the request body.

#### Request Body Example:
```json
{
  "title": "Beautiful Beach House",
  "description": "Stunning oceanfront property with panoramic views",
  "price": 750000,
  "location": "Malibu, CA",
  "status": "For Sale",
  "type": "House",
  "imageUrls": [
    "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/property1_img1.jpg",
    "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/property1_img2.jpg",
    "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/property1_img3.jpg"
  ]
}
```

#### Benefits:
- **Separation of Concerns**: Image storage is handled by specialized services
- **Scalability**: No server storage or bandwidth concerns
- **Flexibility**: Easy to switch between different image hosting providers
- **Performance**: Images are served from CDN networks
- **Simplicity**: Backend only needs to validate and store URLs

#### Validation:
The API validates that all provided URLs are properly formatted URLs using Zod validation:
```typescript
imageUrls: z.array(z.string().url('Invalid image URL')).default([])
```

This approach allows for immediate implementation while maintaining the flexibility to add more sophisticated image management features in the future if needed.

## API Endpoints Summary

### Property CRUD Operations
- `POST /api/properties` - Create new property (Admin only)
- `GET /api/properties` - List properties with filtering and search
- `GET /api/properties/:id` - Get single property details
- `PATCH /api/properties/:id` - Update property (Admin only)
- `DELETE /api/properties/:id` - Delete property (Admin only)

### Statistics
- `GET /api/properties/stats/summary` - Get property statistics (Admin only)

### Query Parameters for GET /api/properties
- `status` - Filter by property status ('For Sale', 'Sold', 'Rented')
- `type` - Filter by property type ('House', 'Apartment', 'Land')
- `search` - Search in property titles
- `page` - Page number for pagination (default: 1)
- `limit` - Items per page (default: 10)

### Example API Calls

**Create a property:**
```bash
POST /api/properties
Content-Type: application/json
Authorization: Bearer <admin-token>

{
  "title": "Modern Downtown Apartment",
  "description": "Luxurious 2-bedroom apartment in the heart of the city",
  "price": 450000,
  "location": "Downtown Los Angeles, CA",
  "status": "For Sale",
  "type": "Apartment",
  "imageUrls": ["https://example.com/image1.jpg", "https://example.com/image2.jpg"]
}
```

**Search for beachfront properties:**
```bash
GET /api/properties?search=beachfront&status=For Sale
```

**Get properties by type with pagination:**
```bash
GET /api/properties?type=House&page=2&limit=5
```

## Database Migration Command

After adding the schema to `shared/schema.ts`, run this command to create the database table:

```bash
npm run db:push
```

This will automatically:
1. Detect the new `properties` table schema
2. Generate the necessary SQL to create the table
3. Apply the migration to your PostgreSQL database
4. Create all columns with proper types and constraints

## Security Features

- **Admin Protection**: All write operations require admin authentication
- **Input Validation**: Comprehensive Zod schema validation for all inputs
- **SQL Injection Protection**: Drizzle ORM provides built-in protection
- **Type Safety**: Full TypeScript coverage for all data operations
- **Error Handling**: Comprehensive error responses with proper HTTP status codes

This implementation provides a robust, scalable foundation for property management that integrates seamlessly with your existing authentication and database infrastructure.