import React, { createContext, useContext, useState, useEffect } from "react";
import translations from "@/data/translations";

// Available languages
export type Language = "en" | "ar" | "fr" | "es" | "de";

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

// Create the context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize from localStorage or default to English
  const [language, setLanguageState] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem("language") as Language;
    return savedLanguage && ["en", "ar", "fr", "es", "de"].includes(savedLanguage)
      ? savedLanguage
      : "en";
  });

  // Check if current language is RTL
  const isRTL = language === "ar";

  // Set language and update localStorage
  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    localStorage.setItem("language", newLanguage);
  };

  // Translation function
  const t = (key: string): string => {
    // Split key into sections (e.g., "navbar.home" becomes ["navbar", "home"])
    const keys = key.split(".");
    
    // Navigate through the translations object to find the correct translation
    let value: any = translations[language];
    
    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k];
      } else {
        // Fallback to English if translation not found
        let fallback = translations["en"];
        for (const fallbackKey of keys) {
          if (fallback && typeof fallback === "object" && fallbackKey in fallback) {
            fallback = fallback[fallbackKey];
          } else {
            return key; // Return the key itself if no translation found
          }
        }
        return typeof fallback === "string" ? fallback : key;
      }
    }
    
    return typeof value === "string" ? value : key;
  };

  // Update document direction based on language
  useEffect(() => {
    document.documentElement.setAttribute("dir", isRTL ? "rtl" : "ltr");
    document.documentElement.setAttribute("lang", language);
  }, [language, isRTL]);

  const value = {
    language,
    setLanguage,
    t,
    isRTL
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
