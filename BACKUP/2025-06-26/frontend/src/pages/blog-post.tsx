import { useRoute } from 'wouter';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { 
  Calendar, 
  User, 
  ArrowLeft, 
  Share2, 
  Twitter, 
  Facebook, 
  Linkedin,
  Clock,
  Eye
} from 'lucide-react';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  author: string;
  publishedAt: string;
  featuredImageUrl?: string;
  metaTitle?: string;
  metaDescription?: string;
}

export default function BlogPost() {
  const [, params] = useRoute('/blog/:slug');
  const { toast } = useToast();
  const slug = params?.slug;

  const { data: post, isLoading, error } = useQuery({
    queryKey: ['/api/blog/public', slug],
    queryFn: async () => {
      const response = await fetch(`/api/blog/public/${slug}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Blog post not found');
        }
        throw new Error('Failed to fetch blog post');
      }
      return response.json() as Promise<BlogPost>;
    },
    enabled: !!slug,
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleShare = async (platform?: string) => {
    const url = window.location.href;
    const title = post?.title || 'HKT Blog Post';
    
    if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'linkedin') {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
    } else {
      // Copy to clipboard
      try {
        await navigator.clipboard.writeText(url);
        toast({
          title: 'Link Copied',
          description: 'Blog post link copied to clipboard',
        });
      } catch (err) {
        toast({
          title: 'Share Failed',
          description: 'Unable to copy link to clipboard',
          variant: 'destructive',
        });
      }
    }
  };

  // Set document title and meta tags
  if (post && typeof document !== 'undefined') {
    document.title = post.metaTitle || post.title;
    
    // Update or create meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', post.metaDescription || post.excerpt || '');

    // Open Graph tags
    const updateOrCreateMeta = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="${property}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    updateOrCreateMeta('og:title', post.title);
    updateOrCreateMeta('og:description', post.metaDescription || post.excerpt || '');
    updateOrCreateMeta('og:url', window.location.href);
    updateOrCreateMeta('og:type', 'article');
    if (post.featuredImageUrl) {
      updateOrCreateMeta('og:image', post.featuredImageUrl);
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/blog">
            <Button variant="ghost" className="mb-8">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
          
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded mb-8 w-1/3"></div>
            <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded mb-8"></div>
            <div className="space-y-4">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 dark:bg-gray-800 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-black py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/blog">
            <Button variant="ghost" className="mb-8">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
          
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {error instanceof Error && error.message.includes('not found') 
                ? 'Blog Post Not Found' 
                : 'Error Loading Post'
              }
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              {error instanceof Error && error.message.includes('not found')
                ? 'The blog post you\'re looking for doesn\'t exist or has been removed.'
                : 'Failed to load the blog post. Please try again later.'
              }
            </p>
            <Link href="/blog">
              <Button>
                View All Posts
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back to Blog */}
        <Link href="/blog">
          <Button variant="ghost" className="mb-8">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog
          </Button>
        </Link>

        {/* Article Header */}
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            {post.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 dark:text-gray-300 mb-6">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(post.publishedAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{Math.ceil(post.content.length / 1000)} min read</span>
            </div>
          </div>

          {/* Social Share */}
          <div className="flex items-center gap-3 pb-6 border-b border-gray-200 dark:border-gray-800">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Share:</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleShare('twitter')}
            >
              <Twitter className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleShare('facebook')}
            >
              <Facebook className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleShare('linkedin')}
            >
              <Linkedin className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleShare()}
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </header>

        {/* Featured Image */}
        {post.featuredImageUrl && (
          <div className="mb-8">
            <img 
              src={post.featuredImageUrl} 
              alt={post.title}
              className="w-full h-64 md:h-96 object-cover rounded-lg"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          </div>
        )}

        {/* Article Content */}
        <article className="prose prose-lg dark:prose-invert max-w-none mb-12">
          <div 
            dangerouslySetInnerHTML={{ __html: post.content }}
            className="text-gray-800 dark:text-gray-200 leading-relaxed"
          />
        </article>

        {/* Article Footer */}
        <footer className="pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Share this article
              </h3>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => handleShare('twitter')}
                >
                  <Twitter className="h-4 w-4 mr-2" />
                  Twitter
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleShare('linkedin')}
                >
                  <Linkedin className="h-4 w-4 mr-2" />
                  LinkedIn
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleShare()}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Copy Link
                </Button>
              </div>
            </div>
            
            <Link href="/blog">
              <Button>
                Read More Articles
              </Button>
            </Link>
          </div>
        </footer>

        {/* Call to Action */}
        <Card className="mt-12 bg-gradient-to-r from-primary to-secondary text-white">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">
              Ready to Start Your Investment Journey?
            </h3>
            <p className="text-lg mb-6">
              Join thousands of investors who are building wealth through tokenized real estate.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                  Get Started Today
                </Button>
              </Link>
              <Link href="/how-it-works">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                  Learn More
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}