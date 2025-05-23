import { createArticle as firebaseCreateArticle } from './firebase';
import { z } from 'zod';

// Define the article schema for validation
const articleSchema = z.object({
  slug: z.string().min(1, "Slug is required"),
  category: z.string().min(1, "Category is required"),
  subcategory: z.string().min(1, "Subcategory is required"),
  availableLanguages: z.array(z.string()).min(1, "At least one language is required"),
  translations: z.record(z.object({
    title: z.string().min(1, "Title is required"),
    summary: z.string().min(1, "Summary is required"),
    content: z.array(z.object({
      title: z.string().optional(),
      paragraph: z.string().min(1, "Content paragraph is required"),
      references: z.array(z.string()).optional()
    })).min(1, "At least one content section is required")
  })),
  draft: z.boolean().default(true),
  imageUrl: z.string().min(1, "Image URL is required")
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
      throw new Error("Slug is required and cannot be empty");
    }
    
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
    
    // Create the article
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