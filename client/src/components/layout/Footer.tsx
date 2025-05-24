import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { getStaticPages } from '@/lib/firebase';
import { useLanguage } from '@/contexts/LanguageContext';

interface StaticPage {
  id: string;
  slug: string;
  availableLanguages: string[];
  translations: Record<string, {
    title: string;
    content: string;
    keywords?: string[];
  }>;
}

export function Footer() {
  const [staticPages, setStaticPages] = useState<StaticPage[]>([]);
  const { language } = useLanguage();
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    async function fetchStaticPages() {
      try {
        const pages = await getStaticPages();
        setStaticPages(pages as StaticPage[]);
      } catch (error) {
        console.error('Error fetching static pages for footer:', error);
      }
    }

    fetchStaticPages();
  }, []);

  // Get page title in current language or fallback to another available language
  const getPageTitle = (page: StaticPage) => {
    // Try current language
    if (page.availableLanguages.includes(language) && 
        page.translations[language]?.title) {
      return page.translations[language].title;
    }
    
    // Fallback to English
    if (page.availableLanguages.includes('en') &&
        page.translations['en']?.title) {
      return page.translations['en'].title;
    }
    
    // Last resort: use the first available language
    const firstLang = page.availableLanguages[0];
    if (firstLang && page.translations[firstLang]?.title) {
      return page.translations[firstLang].title;
    }
    
    // If no translations available, return the slug
    return page.slug;
  };

  return (
    <footer className="bg-primary-foreground border-t py-8 mt-12">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">Kalima</h3>
            <p className="text-muted-foreground text-sm">
              A multilingual educational platform providing valuable resources
              in multiple languages to support global learning.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/">
                  <span className="text-sm hover:underline cursor-pointer">Home</span>
                </Link>
              </li>
              <li>
                <Link href="/categories">
                  <span className="text-sm hover:underline cursor-pointer">Categories</span>
                </Link>
              </li>
              <li>
                <Link href="/favorites">
                  <span className="text-sm hover:underline cursor-pointer">Favorites</span>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Information</h3>
            <ul className="space-y-2">
              {staticPages.map(page => (
                <li key={page.id}>
                  <Link href={`/page/${page.slug}`}>
                    <span className="text-sm hover:underline cursor-pointer">
                      {getPageTitle(page)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Languages</h3>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => { /* Handle language change */ }}
                  className="text-sm hover:underline">
                  English
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { /* Handle language change */ }}
                  className="text-sm hover:underline">
                  Arabic
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { /* Handle language change */ }}
                  className="text-sm hover:underline">
                  French
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { /* Handle language change */ }}
                  className="text-sm hover:underline">
                  Spanish
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { /* Handle language change */ }}
                  className="text-sm hover:underline">
                  German
                </button>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-6 text-center text-sm text-muted-foreground">
          <p>© {currentYear} Kalima Educational Platform. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}