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
    <footer className="bg-primary dark:bg-gray-900 text-white py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center sm:text-left">
            <div>
              <h3 className="text-lg font-bold mb-4 text-white">Kalima</h3>
              <p className="text-gray-300 text-sm">
                A multilingual educational platform providing valuable resources
                in multiple languages to support global learning.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4 text-white">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/">
                    <span className="text-sm text-gray-300 hover:text-white hover:underline cursor-pointer transition-colors">Home</span>
                  </Link>
                </li>
                <li>
                  <Link href="/categories">
                    <span className="text-sm text-gray-300 hover:text-white hover:underline cursor-pointer transition-colors">Categories</span>
                  </Link>
                </li>
                <li>
                  <Link href="/favorites">
                    <span className="text-sm text-gray-300 hover:text-white hover:underline cursor-pointer transition-colors">Favorites</span>
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4 text-white">Information</h3>
              <ul className="space-y-2">
                {staticPages.map(page => (
                  <li key={page.id}>
                    <Link href={`/page/${page.slug}`}>
                      <span className="text-sm text-gray-300 hover:text-white hover:underline cursor-pointer transition-colors">
                        {getPageTitle(page)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4 text-white">Languages</h3>
              <ul className="space-y-2">
                <li>
                  <button 
                    onClick={() => { window.dispatchEvent(new CustomEvent('setLanguage', { detail: 'en' })); }}
                    className={`text-sm text-gray-300 hover:text-white hover:underline transition-colors ${language === 'en' ? 'font-bold text-white' : ''}`}>
                    English
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => { window.dispatchEvent(new CustomEvent('setLanguage', { detail: 'ar' })); }}
                    className={`text-sm text-gray-300 hover:text-white hover:underline transition-colors ${language === 'ar' ? 'font-bold text-white' : ''}`}>
                    العربية (Arabic)
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => { window.dispatchEvent(new CustomEvent('setLanguage', { detail: 'fr' })); }}
                    className={`text-sm text-gray-300 hover:text-white hover:underline transition-colors ${language === 'fr' ? 'font-bold text-white' : ''}`}>
                    Français (French)
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => { window.dispatchEvent(new CustomEvent('setLanguage', { detail: 'es' })); }}
                    className={`text-sm text-gray-300 hover:text-white hover:underline transition-colors ${language === 'es' ? 'font-bold text-white' : ''}`}>
                    Español (Spanish)
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => { window.dispatchEvent(new CustomEvent('setLanguage', { detail: 'de' })); }}
                    className={`text-sm text-gray-300 hover:text-white hover:underline transition-colors ${language === 'de' ? 'font-bold text-white' : ''}`}>
                    Deutsch (German)
                  </button>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-400">
            <p>© {currentYear} Kalima Educational Platform. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}