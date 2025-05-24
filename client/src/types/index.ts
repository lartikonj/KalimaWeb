// Common Types for Kalima Application

import { Language } from "@/contexts/LanguageContext";

// Article types
export interface ArticleTranslation {
  title: string;
  summary: string;
  category: string;
  subcategory: string;
  keywords?: string[];
  content: Array<{
    title: string;
    paragraph: string;
    references?: string[];
  }>;
}

export interface Article {
  id: string;
  slug: string;
  translations: Record<string, ArticleTranslation>;
  availableLanguages: string[];
  createdAt: any; // Firestore timestamp
  imageUrl?: string; // Legacy single image
  imageUrls?: string[]; // New multi-image support
  imageDescriptions?: string[]; // Image accessibility descriptions
  draft: boolean;
  featured?: boolean;
  popular?: boolean;
  author?: {
    uid: string;
    displayName: string;
    photoURL?: string;
  };
}

// User types
export interface SuggestedArticle {
  title: string;
  language: string;
  content: string[];
}

export interface User {
  uid: string;
  displayName: string;
  email: string;
  favorites: string[];
  suggestedArticles: SuggestedArticle[];
}

// Category types
export interface Subcategory {
  name: string;
  slug: string;
}

export interface Category {
  name: string;
  slug: string;
  subcategories: Subcategory[];
}

// Filter types
export interface ArticleFilter {
  category?: string;
  subcategory?: string;
  language?: Language;
  draft?: boolean;
}

// Navigation types
export interface NavItem {
  label: string;
  href: string;
  icon?: any;
}
