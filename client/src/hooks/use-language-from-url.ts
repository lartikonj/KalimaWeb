
import { useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect } from "react";

const SUPPORTED_LANGUAGES = ['en', 'ar', 'fr', 'es', 'de'];

export function useLanguageFromUrl() {
  const [location] = useLocation();
  const { language, setLanguage } = useLanguage();

  useEffect(() => {
    const pathParts = location.split('/').filter(Boolean);
    const urlLang = pathParts[0];

    // If URL starts with a supported language code
    if (SUPPORTED_LANGUAGES.includes(urlLang)) {
      if (language !== urlLang) {
        setLanguage(urlLang);
      }
    } else {
      // If no language in URL and we're not on admin/auth pages
      if (!location.startsWith('/admin') && 
          !location.startsWith('/login') && 
          !location.startsWith('/register') && 
          !location.startsWith('/profile') &&
          location !== '/') {
        // Redirect to language-specific URL
        const newPath = `/${language}${location}`;
        window.history.replaceState(null, '', newPath);
      }
    }
  }, [location, language, setLanguage]);

  // Extract language from URL
  const pathParts = location.split('/').filter(Boolean);
  const urlLanguage = SUPPORTED_LANGUAGES.includes(pathParts[0]) ? pathParts[0] : language;

  return {
    urlLanguage,
    isLanguageInUrl: SUPPORTED_LANGUAGES.includes(pathParts[0]),
    pathWithoutLanguage: SUPPORTED_LANGUAGES.includes(pathParts[0]) 
      ? '/' + pathParts.slice(1).join('/') 
      : location
  };
}
