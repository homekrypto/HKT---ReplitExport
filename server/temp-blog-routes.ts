import { Router } from 'express';

const router = Router();

// Temporary blog posts data
const tempBlogPosts = [
  {
    id: 1,
    title: 'The Future of Real Estate Investment with Blockchain',
    slug: 'future-real-estate-blockchain',
    excerpt: 'Discover how blockchain technology is revolutionizing real estate investment, making it more accessible and transparent than ever before.',
    content: `<h2>Introduction</h2>
<p>The real estate industry is undergoing a digital transformation, and blockchain technology is at the forefront of this revolution. With the introduction of tokenized real estate, investors can now access premium properties with smaller capital requirements and greater liquidity.</p>

<h2>What is Tokenized Real Estate?</h2>
<p>Tokenized real estate represents ownership shares in physical properties through digital tokens on a blockchain. This innovative approach allows multiple investors to own fractions of high-value properties, democratizing access to real estate investment.</p>

<h2>Benefits of Blockchain in Real Estate</h2>
<ul>
<li><strong>Accessibility:</strong> Lower minimum investment requirements</li>
<li><strong>Transparency:</strong> All transactions recorded on blockchain</li>
<li><strong>Liquidity:</strong> Easier to buy and sell property shares</li>
<li><strong>Global Reach:</strong> Invest in properties worldwide</li>
</ul>

<h2>The HKT Advantage</h2>
<p>Home Krypto Token (HKT) takes tokenized real estate to the next level by offering:</p>
<ul>
<li>Fractional ownership in premium vacation rentals</li>
<li>Monthly investment plans starting from $100</li>
<li>Free weekly stays for token holders</li>
<li>Professional property management</li>
</ul>

<h2>Conclusion</h2>
<p>The future of real estate investment is here, and it's powered by blockchain technology. Join the revolution with HKT and start building your global real estate portfolio today.</p>`,
    author: 'HKT Team',
    status: 'published',
    tags: ['Blockchain', 'Real Estate', 'Investment', 'Technology'],
    publishedAt: '2024-01-15T10:00:00Z',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    featuredImageUrl: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800',
    readingTime: 5
  },
  {
    id: 2,
    title: 'Dominican Republic: The Caribbean\'s Hidden Investment Gem',
    slug: 'dominican-republic-investment-opportunity',
    excerpt: 'Explore why the Dominican Republic is becoming a hotspot for real estate investors seeking high returns and beautiful tropical properties.',
    content: `<h2>Why Dominican Republic?</h2>
<p>The Dominican Republic has emerged as one of the Caribbean's most attractive destinations for real estate investment. With its stunning beaches, growing tourism industry, and favorable investment climate, it offers exceptional opportunities for both personal enjoyment and financial returns.</p>

<h2>Cap Cana: Luxury Meets Opportunity</h2>
<p>Cap Cana represents the pinnacle of luxury real estate in the Dominican Republic. This exclusive resort community offers:</p>
<ul>
<li>World-class golf courses designed by Jack Nicklaus</li>
<li>Private beaches and marinas</li>
<li>Luxury hotels and resorts</li>
<li>High-end residential developments</li>
</ul>

<h2>Investment Benefits</h2>
<h3>Strong Tourism Growth</h3>
<p>The Dominican Republic consistently ranks among the top Caribbean destinations, with visitor numbers growing year over year. This steady influx of tourists creates strong demand for vacation rental properties.</p>

<h3>Favorable Investment Climate</h3>
<ul>
<li>No restrictions on foreign property ownership</li>
<li>Stable political environment</li>
<li>Growing infrastructure development</li>
<li>Competitive property prices compared to other Caribbean islands</li>
</ul>

<h2>HKT's Cap Cana Property</h2>
<p>Our flagship property in Cap Cana offers investors:</p>
<ul>
<li>Luxury 4-bedroom villa with ocean views</li>
<li>Professional property management</li>
<li>Proven rental income track record</li>
<li>Access to exclusive resort amenities</li>
</ul>

<h2>Getting Started</h2>
<p>With HKT, you can start investing in Dominican Republic real estate with as little as $100 per month. Our tokenized ownership model makes it easy to build your Caribbean property portfolio gradually.</p>`,
    author: 'Maria Rodriguez',
    status: 'published',
    tags: ['Dominican Republic', 'Cap Cana', 'Caribbean', 'Investment'],
    publishedAt: '2024-01-10T14:30:00Z',
    createdAt: '2024-01-10T14:30:00Z',
    updatedAt: '2024-01-10T14:30:00Z',
    featuredImageUrl: 'https://images.unsplash.com/photo-1583486702810-b83e6c6c7c6e?w=800',
    readingTime: 6
  },
  {
    id: 3,
    title: 'Understanding Property Shares: Your Path to Real Estate Ownership',
    slug: 'understanding-property-shares',
    excerpt: 'Learn how property shares work and how they can help you build a diversified real estate portfolio without the traditional barriers to entry.',
    content: `<h2>What Are Property Shares?</h2>
<p>Property shares represent fractional ownership in real estate assets. Instead of buying an entire property, you purchase shares that give you proportional ownership rights and benefits.</p>

<h2>How It Works</h2>
<h3>1. Property Selection</h3>
<p>We carefully select premium properties in high-demand vacation destinations. Each property undergoes thorough due diligence to ensure strong rental potential and appreciation prospects.</p>

<h3>2. Tokenization</h3>
<p>Each property is divided into shares represented by HKT tokens. For example, our Cap Cana villa is divided into 52 shares, representing one week of ownership per share.</p>

<h3>3. Purchase Process</h3>
<p>Investors can purchase shares using either:</p>
<ul>
<li>Direct USD payment</li>
<li>HKT tokens from their wallet</li>
<li>Monthly accumulation plans</li>
</ul>

<h2>Benefits of Property Shares</h2>
<h3>Lower Entry Barrier</h3>
<p>Instead of needing hundreds of thousands of dollars to buy property outright, you can start with much smaller amounts and build your ownership over time.</p>

<h3>Usage Rights</h3>
<p>Property share owners enjoy:</p>
<ul>
<li>Free stays equivalent to their ownership percentage</li>
<li>Priority booking during peak seasons</li>
<li>Access to exclusive amenities</li>
</ul>

<h3>Rental Income</h3>
<p>When you're not using your allocated time, the property generates rental income that's distributed proportionally to all shareholders.</p>

<h3>Diversification</h3>
<p>Spread your investment across multiple properties in different locations to reduce risk and maximize opportunities.</p>

<h2>Example: Cap Cana Villa</h2>
<ul>
<li><strong>Property Value:</strong> $200,000</li>
<li><strong>Total Shares:</strong> 52 (one per week)</li>
<li><strong>Price per Share:</strong> $3,846</li>
<li><strong>HKT Equivalent:</strong> 38,460 HKT tokens</li>
</ul>

<h2>Getting Started</h2>
<p>Ready to start building your property share portfolio? Join thousands of investors who are already enjoying the benefits of fractional real estate ownership with HKT.</p>`,
    author: 'David Chen',
    status: 'published',
    tags: ['Property Shares', 'Fractional Ownership', 'HKT', 'Investment Guide'],
    publishedAt: '2024-01-05T09:15:00Z',
    createdAt: '2024-01-05T09:15:00Z',
    updatedAt: '2024-01-05T09:15:00Z',
    featuredImageUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800',
    readingTime: 4
  }
];

// Get all published blog posts
router.get('/posts', (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', tag = '' } = req.query;
    
    let filteredPosts = tempBlogPosts.filter(post => post.status === 'published');
    
    // Apply search filter
    if (search) {
      const searchTerm = search.toString().toLowerCase();
      filteredPosts = filteredPosts.filter(post => 
        post.title.toLowerCase().includes(searchTerm) ||
        post.excerpt.toLowerCase().includes(searchTerm) ||
        post.tags.some(t => t.toLowerCase().includes(searchTerm))
      );
    }
    
    // Apply tag filter
    if (tag) {
      filteredPosts = filteredPosts.filter(post => 
        post.tags.some(t => t.toLowerCase() === tag.toString().toLowerCase())
      );
    }
    
    // Sort by published date (newest first)
    filteredPosts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    
    // Pagination
    const startIndex = (Number(page) - 1) * Number(limit);
    const paginatedPosts = filteredPosts.slice(startIndex, startIndex + Number(limit));
    
    res.json({
      posts: paginatedPosts,
      totalPosts: filteredPosts.length,
      currentPage: Number(page),
      totalPages: Math.ceil(filteredPosts.length / Number(limit))
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    res.status(500).json({ error: 'Failed to fetch blog posts' });
  }
});

// Get single blog post by slug
router.get('/posts/:slug', (req, res) => {
  try {
    const { slug } = req.params;
    const post = tempBlogPosts.find(p => p.slug === slug && p.status === 'published');
    
    if (!post) {
      return res.status(404).json({ error: 'Blog post not found' });
    }
    
    res.json(post);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    res.status(500).json({ error: 'Failed to fetch blog post' });
  }
});

// Get all unique tags
router.get('/tags', (req, res) => {
  try {
    const allTags = tempBlogPosts
      .filter(post => post.status === 'published')
      .flatMap(post => post.tags);
    
    const uniqueTags = Array.from(new Set(allTags)).sort();
    
    res.json(uniqueTags);
  } catch (error) {
    console.error('Error fetching blog tags:', error);
    res.status(500).json({ error: 'Failed to fetch blog tags' });
  }
});

// Get featured posts (first 3 published posts)
router.get('/featured', (req, res) => {
  try {
    const featuredPosts = tempBlogPosts
      .filter(post => post.status === 'published')
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, 3);
    
    res.json(featuredPosts);
  } catch (error) {
    console.error('Error fetching featured posts:', error);
    res.status(500).json({ error: 'Failed to fetch featured posts' });
  }
});

// Search posts
router.get('/search', (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.json({ posts: [], totalResults: 0 });
    }
    
    const searchTerm = q.toString().toLowerCase();
    const searchResults = tempBlogPosts
      .filter(post => post.status === 'published')
      .filter(post => 
        post.title.toLowerCase().includes(searchTerm) ||
        post.excerpt.toLowerCase().includes(searchTerm) ||
        post.content.toLowerCase().includes(searchTerm) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      )
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    
    res.json({
      posts: searchResults,
      totalResults: searchResults.length,
      searchTerm: q
    });
  } catch (error) {
    console.error('Error searching blog posts:', error);
    res.status(500).json({ error: 'Failed to search blog posts' });
  }
});

export default router;