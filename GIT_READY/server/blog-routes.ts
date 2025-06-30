import { Router } from 'express';
import { requireAuth } from './auth';
import { storage } from './storage';
import type { AuthenticatedRequest } from './auth';
import { insertBlogPostSchema } from '@shared/schema';
import { z } from 'zod';

const router = Router();

// Middleware to check API key for write operations
const requireApiKey = (req: any, res: any, next: any) => {
  const apiKey = req.headers['x-api-key'] || req.headers['authorization']?.replace('Bearer ', '');
  const validApiKey = process.env.BLOG_API_KEY;

  if (!validApiKey) {
    return res.status(500).json({ error: 'Blog API not configured' });
  }

  if (!apiKey || apiKey !== validApiKey) {
    return res.status(401).json({ error: 'Invalid or missing API key' });
  }

  next();
};

// Public endpoints (no auth required)

// Get published blog posts for public blog page
router.get('/public', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const posts = await storage.getPublishedBlogPosts(limit, offset);
    
    // Return only necessary fields for public consumption
    const publicPosts = posts.map(post => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      author: post.author,
      publishedAt: post.publishedAt,
      featuredImageUrl: post.featuredImageUrl,
      metaTitle: post.metaTitle,
      metaDescription: post.metaDescription
    }));

    res.json({
      posts: publicPosts,
      page,
      limit,
      hasMore: posts.length === limit
    });
  } catch (error) {
    console.error('Error fetching public blog posts:', error);
    res.status(500).json({ error: 'Failed to fetch blog posts' });
  }
});

// Get single published blog post by slug (for public blog post page)
router.get('/public/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const post = await storage.getBlogPostBySlug(slug);

    if (!post || post.status !== 'published') {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    res.json(post);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    res.status(500).json({ error: 'Failed to fetch blog post' });
  }
});

// Search published blog posts
router.get('/search', async (req, res) => {
  try {
    const query = req.query.q as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    if (!query || query.trim().length < 2) {
      return res.status(400).json({ error: 'Search query must be at least 2 characters' });
    }

    const posts = await storage.searchBlogPosts(query.trim(), limit, offset);
    
    const publicPosts = posts.map(post => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      author: post.author,
      publishedAt: post.publishedAt,
      featuredImageUrl: post.featuredImageUrl
    }));

    res.json({
      posts: publicPosts,
      query: query.trim(),
      page,
      limit,
      hasMore: posts.length === limit
    });
  } catch (error) {
    console.error('Error searching blog posts:', error);
    res.status(500).json({ error: 'Failed to search blog posts' });
  }
});

// API endpoints for Make.com integration (require API key)

// Create new blog post
router.post('/', requireApiKey, async (req, res) => {
  try {
    const validatedData = insertBlogPostSchema.parse(req.body);
    const post = await storage.createBlogPost(validatedData);
    res.status(201).json(post);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: error.errors 
      });
    }
    console.error('Error creating blog post:', error);
    res.status(500).json({ error: 'Failed to create blog post' });
  }
});

// Get all blog posts (including drafts) - for admin/Make.com
router.get('/', requireApiKey, async (req, res) => {
  try {
    const status = req.query.status as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = (page - 1) * limit;

    const posts = await storage.getAllBlogPosts(status, limit, offset);
    
    res.json({
      posts,
      page,
      limit,
      hasMore: posts.length === limit
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    res.status(500).json({ error: 'Failed to fetch blog posts' });
  }
});

// Get single blog post by ID (for admin/Make.com)
router.get('/:id', requireApiKey, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid post ID' });
    }

    const post = await storage.getBlogPost(id);
    if (!post) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    res.json(post);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    res.status(500).json({ error: 'Failed to fetch blog post' });
  }
});

// Update blog post
router.put('/:id', requireApiKey, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid post ID' });
    }

    // Validate only the fields that are being updated
    const updateSchema = insertBlogPostSchema.partial();
    const validatedData = updateSchema.parse(req.body);

    const post = await storage.updateBlogPost(id, validatedData);
    if (!post) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    res.json(post);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: error.errors 
      });
    }
    console.error('Error updating blog post:', error);
    res.status(500).json({ error: 'Failed to update blog post' });
  }
});

// Delete blog post
router.delete('/:id', requireApiKey, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid post ID' });
    }

    const success = await storage.deleteBlogPost(id);
    if (!success) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    res.json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    res.status(500).json({ error: 'Failed to delete blog post' });
  }
});

// Utility endpoint to generate slug from title
router.post('/generate-slug', requireApiKey, async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Check if slug already exists
    const existingPost = await storage.getBlogPostBySlug(slug);
    if (existingPost) {
      const timestamp = Date.now();
      const uniqueSlug = `${slug}-${timestamp}`;
      return res.json({ slug: uniqueSlug });
    }

    res.json({ slug });
  } catch (error) {
    console.error('Error generating slug:', error);
    res.status(500).json({ error: 'Failed to generate slug' });
  }
});

export default router;