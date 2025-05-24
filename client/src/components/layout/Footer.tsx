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
          {/* Main intro content for all screen sizes */}
          <div className="text-center mb-8">
            <h3 className="text-xl font-bold mb-4 text-white">Kalima</h3>
            <p className="text-gray-300 text-sm max-w-2xl mx-auto">
              A multilingual educational platform providing valuable resources
              in multiple languages to support global learning.
            </p>
          </div>
          
          {/* Mobile view - Two column grid layout */}
          <div className="grid grid-cols-2 gap-8 text-center md:hidden">
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
                {staticPages.slice(0, 4).map(page => (
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
          </div>
          
          {/* Mobile language dropdown */}
          <div className="md:hidden flex justify-center mt-6">
            <div className="relative inline-block text-left">
              <div>
                <button 
                  type="button" 
                  className="inline-flex justify-center w-full rounded-md border border-gray-700 shadow-sm px-4 py-2 bg-gray-800 text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                  onClick={() => {
                    const dropdown = document.getElementById('language-dropdown');
                    if (dropdown) {
                      dropdown.classList.toggle('hidden');
                    }
                  }}
                >
                  {language === 'en' ? 'English' : 
                   language === 'ar' ? 'العربية' : 
                   language === 'fr' ? 'Français' : 
                   language === 'es' ? 'Español' : 
                   language === 'de' ? 'Deutsch' : 'Select Language'}
                  <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              <div id="language-dropdown" className="hidden origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5">
                <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                  <button 
                    onClick={() => { 
                      window.dispatchEvent(new CustomEvent('setLanguage', { detail: 'en' })); 
                      document.getElementById('language-dropdown')?.classList.add('hidden');
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm ${language === 'en' ? 'text-white font-bold' : 'text-gray-300'}`}>
                    English
                  </button>
                  <button 
                    onClick={() => { 
                      window.dispatchEvent(new CustomEvent('setLanguage', { detail: 'ar' })); 
                      document.getElementById('language-dropdown')?.classList.add('hidden');
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm ${language === 'ar' ? 'text-white font-bold' : 'text-gray-300'}`}>
                    العربية (Arabic)
                  </button>
                  <button 
                    onClick={() => { 
                      window.dispatchEvent(new CustomEvent('setLanguage', { detail: 'fr' })); 
                      document.getElementById('language-dropdown')?.classList.add('hidden');
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm ${language === 'fr' ? 'text-white font-bold' : 'text-gray-300'}`}>
                    Français (French)
                  </button>
                  <button 
                    onClick={() => { 
                      window.dispatchEvent(new CustomEvent('setLanguage', { detail: 'es' })); 
                      document.getElementById('language-dropdown')?.classList.add('hidden');
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm ${language === 'es' ? 'text-white font-bold' : 'text-gray-300'}`}>
                    Español (Spanish)
                  </button>
                  <button 
                    onClick={() => { 
                      window.dispatchEvent(new CustomEvent('setLanguage', { detail: 'de' })); 
                      document.getElementById('language-dropdown')?.classList.add('hidden');
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm ${language === 'de' ? 'text-white font-bold' : 'text-gray-300'}`}>
                    Deutsch (German)
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Desktop view - 4 column grid */}
          <div className="hidden md:grid md:grid-cols-4 md:gap-8 md:text-left">
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
            
            <div className="col-span-2">
              <h3 className="text-lg font-bold mb-4 text-white">Languages</h3>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => { window.dispatchEvent(new CustomEvent('setLanguage', { detail: 'en' })); }}
                  className={`text-sm text-gray-300 hover:text-white hover:underline transition-colors text-left ${language === 'en' ? 'font-bold text-white' : ''}`}>
                  English
                </button>
                <button 
                  onClick={() => { window.dispatchEvent(new CustomEvent('setLanguage', { detail: 'ar' })); }}
                  className={`text-sm text-gray-300 hover:text-white hover:underline transition-colors text-left ${language === 'ar' ? 'font-bold text-white' : ''}`}>
                  العربية (Arabic)
                </button>
                <button 
                  onClick={() => { window.dispatchEvent(new CustomEvent('setLanguage', { detail: 'fr' })); }}
                  className={`text-sm text-gray-300 hover:text-white hover:underline transition-colors text-left ${language === 'fr' ? 'font-bold text-white' : ''}`}>
                  Français (French)
                </button>
                <button 
                  onClick={() => { window.dispatchEvent(new CustomEvent('setLanguage', { detail: 'es' })); }}
                  className={`text-sm text-gray-300 hover:text-white hover:underline transition-colors text-left ${language === 'es' ? 'font-bold text-white' : ''}`}>
                  Español (Spanish)
                </button>
                <button 
                  onClick={() => { window.dispatchEvent(new CustomEvent('setLanguage', { detail: 'de' })); }}
                  className={`text-sm text-gray-300 hover:text-white hover:underline transition-colors text-left ${language === 'de' ? 'font-bold text-white' : ''}`}>
                  Deutsch (German)
                </button>
              </div>
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