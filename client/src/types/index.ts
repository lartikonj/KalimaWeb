// Common Types for Kalima Application

import { Language } from "@/contexts/LanguageContext";

// Article types
export interface ArticleTranslation {
  title: string;
  summary: string;
  category: string;
  subcategory: string;
  content: string[];
}

export interface Article {
  id: string;
  slug: string;
  translations: Record<string, ArticleTranslation>;
  availableLanguages: string[];
  createdAt: any; // Firestore timestamp
  imageUrl: string;
  draft: boolean;
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
