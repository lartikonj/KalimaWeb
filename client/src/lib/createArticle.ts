import { createArticle as firebaseCreateArticle } from './firebase';
import { z } from 'zod';

// Define the article schema for validation
const articleSchema = z.object({
  slug: z.string().min(1, "Slug is required"),
  title: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  subcategory: z.string().min(1, "Subcategory is required"),
  availableLanguages: z.array(z.string()).min(1, "At least one language is required"),
  translations: z.record(z.object({
    title: z.string().min(1, "Title is required"),
    summary: z.string().min(1, "Summary is required"),
    keywords: z.array(z.string()).optional().default([]),
    content: z.array(z.object({
      title: z.string().optional(),
      paragraph: z.string().min(1, "Content paragraph is required"),
      references: z.array(z.string()).optional()
    })).min(1, "At least one content section is required")
  })),
  draft: z.boolean().default(true),
  featured: z.boolean().default(false),
  popular: z.boolean().default(false),
  imageUrls: z.array(z.string()).optional().default([]),
  imageDescriptions: z.array(z.string()).optional().default([]),
  author: z.object({
    uid: z.string(),
    displayName: z.string(),
    photoURL: z.string().optional()
  }).optional()
});

export type ArticleFormData = z.infer<typeof articleSchema>;

/**
 * Validates and creates an article in Firestore
 * This wrapper function adds additional validation and error handling
 */
export async function createArticle(articleData: ArticleFormData) {
  try {
    console.log("Article data received:", JSON.stringify(articleData, null, 2));
    
    // Check slug specifically before validation
    if (!articleData.slug || articleData.slug.trim() === '') {
      // Generate a slug from the title if available, otherwise use timestamp
      const slugBase = articleData.title || 
        (articleData.translations.en?.title) || 
        Object.values(articleData.translations)[0]?.title || 
        `article-${Date.now()}`;
      
      // Create a URL-friendly slug
      articleData.slug = slugBase
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') || `article-${Date.now()}`;
      
      console.log("Generated slug:", articleData.slug);
    }
    
    // Convert single imageUrl to imageUrls array if needed (for backward compatibility)
    if ((articleData as any).imageUrl && !articleData.imageUrls) {
      articleData.imageUrls = [(articleData as any).imageUrl];
      delete (articleData as any).imageUrl;
    }
    
    // Ensure imageUrls exists
    if (!articleData.imageUrls || !Array.isArray(articleData.imageUrls)) {
      articleData.imageUrls = [];
    }
    
    // If imageUrls is empty, add placeholder
    if (articleData.imageUrls.length === 0) {
      articleData.imageUrls = ["https://images.unsplash.com/photo-1637332203993-ab33850d8b7b?q=80&w=1760&auto=format&fit=crop"];
    }
    
    // Ensure imageDescriptions exist and match imageUrls length
    if (!articleData.imageDescriptions || !Array.isArray(articleData.imageDescriptions)) {
      articleData.imageDescriptions = [];
    }
    
    // Add placeholder descriptions if needed
    while (articleData.imageDescriptions.length < articleData.imageUrls.length) {
      articleData.imageDescriptions.push(`Image ${articleData.imageDescriptions.length + 1} for ${articleData.title || 'article'}`);
    }
    
    // Set author information if missing
    if (!articleData.author) {
      articleData.author = {
        uid: "system",
        displayName: "System"
      };
    }
    
    // Set main title field from translations if not specified
    if (!articleData.title) {
      articleData.title = articleData.translations.en?.title || 
        Object.values(articleData.translations)[0]?.title || 
        "Untitled Article";
    }
    
    // Add featured and popular flags if missing
    articleData.featured = articleData.featured || false;
    articleData.popular = articleData.popular || false;
    
    // Ensure all translations have appropriate content structure
    Object.keys(articleData.translations).forEach(lang => {
      const translation = articleData.translations[lang];
      
      // Ensure keywords array exists
      if (!translation.keywords) {
        translation.keywords = [];
      }
      
      // Make sure content has proper structure
      if (!translation.content || !Array.isArray(translation.content)) {
        translation.content = [{
          title: "Content",
          paragraph: "No content provided",
          references: []
        }];
      }
      
      // Fix content items that might be missing title
      translation.content = translation.content.map(item => {
        // If content is just a string, convert to proper format
        if (typeof item === 'string') {
          return {
            title: "Content",
            paragraph: item,
            references: []
          };
        }
        
        // Create a new object with all required fields to ensure proper type
        return {
          title: item.title || "Content",
          paragraph: item.paragraph || "",
          references: item.references || []
        };
      });
    });
    
    // Ensure all required fields are present
    const validatedData = articleSchema.parse(articleData);
    
    // Ensure all available languages have corresponding translations
    for (const lang of validatedData.availableLanguages) {
      if (!validatedData.translations[lang]) {
        throw new Error(`Language ${lang} is listed as available but has no translation`);
      }
    }
    
    // Ensure all translations are for available languages
    for (const lang in validatedData.translations) {
      if (!validatedData.availableLanguages.includes(lang)) {
        throw new Error(`Translation for ${lang} exists but language is not listed as available`);
      }
    }
    
    // Create the article with our enhanced structure
    return await firebaseCreateArticle(validatedData);
  } catch (error) {
    console.error("Error creating article:", error);
    
    if (error instanceof z.ZodError) {
      // Format Zod validation errors for better readability
      const errorMessage = error.errors.map(err => 
        `${err.path.join('.')}: ${err.message}`
      ).join(', ');
      
      throw new Error(`Validation error: ${errorMessage}`);
    }
    
    throw error;
  }
}