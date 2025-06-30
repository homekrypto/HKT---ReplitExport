import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  twitterCard?: string;
}

export default function SEO({ 
  title, 
  description, 
  keywords,
  image = "https://homekrypto.com/og-image.jpg",
  url,
  type = "website",
  twitterCard = "summary_large_image"
}: SEOProps) {
  useEffect(() => {
    // Set page title
    document.title = title;

    // Set meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = description;
      document.head.appendChild(meta);
    }

    // Set keywords if provided
    if (keywords) {
      const metaKeywords = document.querySelector('meta[name="keywords"]');
      if (metaKeywords) {
        metaKeywords.setAttribute('content', keywords);
      } else {
        const meta = document.createElement('meta');
        meta.name = 'keywords';
        meta.content = keywords;
        document.head.appendChild(meta);
      }
    }

    // Open Graph tags
    const setOGMeta = (property: string, content: string) => {
      const existing = document.querySelector(`meta[property="${property}"]`);
      if (existing) {
        existing.setAttribute('content', content);
      } else {
        const meta = document.createElement('meta');
        meta.setAttribute('property', property);
        meta.content = content;
        document.head.appendChild(meta);
      }
    };

    setOGMeta('og:title', title);
    setOGMeta('og:description', description);
    setOGMeta('og:image', image);
    setOGMeta('og:type', type);
    if (url) setOGMeta('og:url', url);
    setOGMeta('og:site_name', 'Home Krypto Token');

    // Twitter Card tags
    const setTwitterMeta = (name: string, content: string) => {
      const existing = document.querySelector(`meta[name="${name}"]`);
      if (existing) {
        existing.setAttribute('content', content);
      } else {
        const meta = document.createElement('meta');
        meta.name = name;
        meta.content = content;
        document.head.appendChild(meta);
      }
    };

    setTwitterMeta('twitter:card', twitterCard);
    setTwitterMeta('twitter:title', title);
    setTwitterMeta('twitter:description', description);
    setTwitterMeta('twitter:image', image);
    setTwitterMeta('twitter:site', '@HomeKryptoToken');

    // Canonical URL
    if (url) {
      const canonicalLink = document.querySelector('link[rel="canonical"]');
      if (canonicalLink) {
        canonicalLink.setAttribute('href', url);
      } else {
        const link = document.createElement('link');
        link.rel = 'canonical';
        link.href = url;
        document.head.appendChild(link);
      }
    }

    // Schema.org structured data for real estate
    if (type === 'website' && title.includes('Agent')) {
      const schema = {
        "@context": "https://schema.org",
        "@type": "RealEstateAgent",
        "name": "Home Krypto Token Real Estate Network",
        "description": description,
        "url": url || window.location.href,
        "sameAs": [
          "https://www.facebook.com/profile.php?id=61576090167804",
          "https://x.com/HomeKryptoToken",
          "https://www.instagram.com/homekryptotoken/"
        ]
      };

      const scriptTag = document.createElement('script');
      scriptTag.type = 'application/ld+json';
      scriptTag.textContent = JSON.stringify(schema);
      
      const existingSchema = document.querySelector('script[type="application/ld+json"]');
      if (existingSchema) {
        existingSchema.textContent = JSON.stringify(schema);
      } else {
        document.head.appendChild(scriptTag);
      }
    }

  }, [title, description, keywords, image, url, type, twitterCard]);

  return null;
}