
import { useEffect } from 'react';

interface SEOData {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  language?: string;
}

export function useSEO(seoData: SEOData) {
  useEffect(() => {
    // Update page title
    if (seoData.title) {
      document.title = seoData.title.includes('Kalima online') 
        ? seoData.title 
        : `${seoData.title} | Kalima online`;
    }

    // Update meta description
    if (seoData.description) {
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', seoData.description);
      } else {
        const newMetaDescription = document.createElement('meta');
        newMetaDescription.setAttribute('name', 'description');
        newMetaDescription.setAttribute('content', seoData.description);
        document.head.appendChild(newMetaDescription);
      }
    }

    // Update meta keywords
    if (seoData.keywords && seoData.keywords.length > 0) {
      const keywords = seoData.keywords.join(', ');
      const metaKeywords = document.querySelector('meta[name="keywords"]');
      if (metaKeywords) {
        metaKeywords.setAttribute('content', keywords);
      } else {
        const newMetaKeywords = document.createElement('meta');
        newMetaKeywords.setAttribute('name', 'keywords');
        newMetaKeywords.setAttribute('content', keywords);
        document.head.appendChild(newMetaKeywords);
      }
    }

    // Helper function to update or create meta tags
    const updateOrCreateTag = (selector: string, attribute: string, value: string, content: string) => {
      let tag = document.querySelector(selector);
      if (tag) {
        tag.setAttribute('content', content);
      } else {
        tag = document.createElement('meta');
        tag.setAttribute(attribute, value);
        tag.setAttribute('content', content);
        document.head.appendChild(tag);
      }
    };

    // Update Open Graph tags
    if (seoData.title) {
      updateOrCreateTag('meta[property="og:title"]', 'property', 'og:title', seoData.title);
    }
    
    if (seoData.description) {
      updateOrCreateTag('meta[property="og:description"]', 'property', 'og:description', seoData.description);
    }
    
    if (seoData.type) {
      updateOrCreateTag('meta[property="og:type"]', 'property', 'og:type', seoData.type);
    }
    
    if (seoData.url) {
      updateOrCreateTag('meta[property="og:url"]', 'property', 'og:url', seoData.url);
    }
    
    if (seoData.image) {
      updateOrCreateTag('meta[property="og:image"]', 'property', 'og:image', seoData.image);
    }

    // Update Twitter Card tags
    if (seoData.title) {
      updateOrCreateTag('meta[name="twitter:title"]', 'name', 'twitter:title', seoData.title);
    }
    
    if (seoData.description) {
      updateOrCreateTag('meta[name="twitter:description"]', 'name', 'twitter:description', seoData.description);
    }
    
    if (seoData.image) {
      updateOrCreateTag('meta[name="twitter:image"]', 'name', 'twitter:image', seoData.image);
    }

    // Update canonical URL
    if (seoData.url) {
      let canonicalLink = document.querySelector('link[rel="canonical"]');
      if (canonicalLink) {
        canonicalLink.setAttribute('href', seoData.url);
      } else {
        canonicalLink = document.createElement('link');
        canonicalLink.setAttribute('rel', 'canonical');
        canonicalLink.setAttribute('href', seoData.url);
        document.head.appendChild(canonicalLink);
      }
    }

    // Update HTML lang attribute
    if (seoData.language) {
      document.documentElement.setAttribute('lang', seoData.language);
    }

    // Add structured data for articles
    if (seoData.type === 'article') {
      const removeExistingStructuredData = () => {
        const existingScript = document.querySelector('script[type="application/ld+json"]');
        if (existingScript) {
          existingScript.remove();
        }
      };

      removeExistingStructuredData();

      const structuredData = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": seoData.title,
        "description": seoData.description,
        "image": seoData.image,
        "author": {
          "@type": "Person",
          "name": seoData.author || "Kalima online"
        },
        "publisher": {
          "@type": "Organization",
          "name": "Kalima online",
          "logo": {
            "@type": "ImageObject",
            "url": `${window.location.origin}/logo.png`
          }
        },
        "datePublished": seoData.publishedTime || new Date().toISOString(),
        "dateModified": seoData.modifiedTime || new Date().toISOString(),
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": seoData.url || window.location.href
        },
        "keywords": seoData.keywords?.join(', ') || '',
        "articleSection": seoData.section || '',
        "inLanguage": seoData.language || 'en'
      };

      const scriptTag = document.createElement('script');
      scriptTag.setAttribute('type', 'application/ld+json');
      scriptTag.textContent = JSON.stringify(structuredData);
      document.head.appendChild(scriptTag);
    }

  }, [seoData]);

  // Cleanup function
  return () => {
    document.title = "Kalima online - Multilingual Learning Platform";
  };
}
