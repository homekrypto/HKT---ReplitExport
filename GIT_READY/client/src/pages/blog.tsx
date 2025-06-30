import { useState } from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  User, 
  Search, 
  ArrowRight, 
  Clock,
  Eye,
  Share2
} from 'lucide-react';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  publishedAt: string;
  featuredImageUrl?: string;
  metaTitle?: string;
  metaDescription?: string;
}

interface BlogResponse {
  posts: BlogPost[];
  page: number;
  limit: number;
  hasMore: boolean;
}

export default function Blog() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const { data: blogData, isLoading, error } = useQuery({
    queryKey: ['/api/blog/public', currentPage, searchQuery],
    queryFn: async () => {
      const url = searchQuery 
        ? `/api/blog/search?q=${encodeURIComponent(searchQuery)}&page=${currentPage}&limit=10`
        : `/api/blog/public?page=${currentPage}&limit=10`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch blog posts');
      }
      return response.json() as Promise<BlogResponse>;
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim().length >= 2) {
      setIsSearching(true);
      setCurrentPage(1);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setIsSearching(false);
    setCurrentPage(1);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
            HKT Blog
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Stay updated with the latest insights on real estate investment, blockchain technology, 
            and the future of property ownership through HKT tokens.
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto">
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" disabled={searchQuery.trim().length < 2}>
                <Search className="h-4 w-4" />
              </Button>
            </form>
            {isSearching && (
              <div className="mt-2 flex items-center justify-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Searching for "{searchQuery}"
                </span>
                <Button variant="ghost" size="sm" onClick={clearSearch}>
                  Clear
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-gray-200 dark:bg-gray-800 rounded-t-lg"></div>
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded mb-4 w-3/4"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded mb-1"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded mb-1"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="text-red-600 dark:text-red-400 mb-4">
              Failed to load blog posts. Please try again later.
            </div>
            <Button onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        )}

        {/* Blog Posts Grid */}
        {blogData && (
          <>
            {blogData.posts.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-600 dark:text-gray-300 mb-4">
                  {isSearching 
                    ? `No articles found for "${searchQuery}"`
                    : "No blog posts available yet. Stay tuned for exciting content!"
                  }
                </div>
                {isSearching && (
                  <Button onClick={clearSearch}>
                    View All Posts
                  </Button>
                )}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                  {blogData.posts.map((post) => (
                    <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      {post.featuredImageUrl && (
                        <div className="aspect-video bg-gray-100 dark:bg-gray-800">
                          <img 
                            src={post.featuredImageUrl} 
                            alt={post.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300 mb-3">
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            <span>{post.author}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(post.publishedAt)}</span>
                          </div>
                        </div>
                        
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">
                          {post.title}
                        </h3>
                        
                        {post.excerpt && (
                          <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                            {post.excerpt}
                          </p>
                        )}
                        
                        <Link href={`/blog/${post.slug}`}>
                          <Button variant="outline" className="w-full group">
                            Read More
                            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Pagination */}
                <div className="flex justify-center items-center gap-4">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      Page {currentPage}
                    </span>
                  </div>
                  
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={!blogData.hasMore}
                  >
                    Next
                  </Button>
                </div>
              </>
            )}
          </>
        )}

        {/* Featured Topics */}
        <div className="mt-16 pt-16 border-t border-gray-200 dark:border-gray-800">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Popular Topics
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              'Real Estate Investment',
              'Blockchain Technology',
              'Property Tokenization',
              'Portfolio Diversification',
              'Market Analysis',
              'Investment Strategies'
            ].map((topic) => (
              <Badge key={topic} variant="outline" className="px-4 py-2 cursor-pointer hover:bg-primary hover:text-white transition-colors">
                {topic}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}