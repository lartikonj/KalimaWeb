import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table structure
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  uid: text("uid").notNull().unique(),
  displayName: text("display_name").notNull(),
  email: text("email").notNull().unique(),
  favorites: text("favorites").array(), // Array of article IDs
  suggestedArticles: jsonb("suggested_articles") // Array of suggested article objects
});

// Articles table structure
export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  availableLanguages: text("available_languages").array(),
  translations: jsonb("translations"), // Keyed by language code with article content
  createdAt: timestamp("created_at").notNull().defaultNow(),
  draft: boolean("draft").notNull().default(true),
  imageUrl: text("image_url")
});

// Insert schema for users
export const insertUserSchema = createInsertSchema(users).pick({
  uid: true,
  displayName: true,
  email: true,
  favorites: true,
  suggestedArticles: true
});

// Insert schema for articles
export const insertArticleSchema = createInsertSchema(articles).pick({
  slug: true,
  availableLanguages: true,
  translations: true,
  draft: true,
  imageUrl: true
});

// Define the structure of article translations
export const translationSchema = z.record(
  z.string(),
  z.object({
    title: z.string(),
    summary: z.string(),
    category: z.string(),
    subcategory: z.string(),
    content: z.array(z.string())
  })
);

// Define the structure for suggested articles
export const suggestedArticleSchema = z.object({
  title: z.string(),
  language: z.string(),
  content: z.array(z.string())
});

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Article = typeof articles.$inferSelect;
export type InsertArticle = z.infer<typeof insertArticleSchema>;
export type Translation = z.infer<typeof translationSchema>;
export type ArticleTranslation = {
  title: string;
  summary: string;
  category: string;
  subcategory: string;
  content: string[];
};
export type SuggestedArticle = z.infer<typeof suggestedArticleSchema>;
