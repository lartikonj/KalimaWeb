import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertArticleSchema, insertUserSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Users routes
  app.get("/api/users/:uid", async (req, res) => {
    try {
      const uid = req.params.uid;
      const user = await storage.getUserByUid(uid);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      return res.json(user);
    } catch (error) {
      return res.status(500).json({ message: "Failed to get user" });
    }
  });
  
  app.post("/api/users", async (req, res) => {
    try {
      const validation = insertUserSchema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({ message: "Invalid user data", errors: validation.error.errors });
      }
      
      const user = await storage.createUser(validation.data);
      return res.status(201).json(user);
    } catch (error) {
      return res.status(500).json({ message: "Failed to create user" });
    }
  });
  
  app.patch("/api/users/:uid/favorites", async (req, res) => {
    try {
      const uid = req.params.uid;
      const { articleId, action } = req.body;
      
      if (!articleId || !action || !['add', 'remove'].includes(action)) {
        return res.status(400).json({ message: "Invalid request. Provide articleId and action (add/remove)" });
      }
      
      const user = await storage.getUserByUid(uid);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      if (action === 'add') {
        await storage.addFavorite(uid, articleId);
      } else {
        await storage.removeFavorite(uid, articleId);
      }
      
      return res.json({ message: "Favorites updated successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Failed to update favorites" });
    }
  });
  
  app.post("/api/users/:uid/suggestions", async (req, res) => {
    try {
      const uid = req.params.uid;
      const suggestion = req.body;
      
      if (!suggestion.title || !suggestion.language || !suggestion.content) {
        return res.status(400).json({ 
          message: "Invalid suggestion. Provide title, language, and content" 
        });
      }
      
      const user = await storage.getUserByUid(uid);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      await storage.addSuggestion(uid, suggestion);
      return res.status(201).json({ message: "Suggestion added successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Failed to add suggestion" });
    }
  });
  
  // Articles routes
  app.get("/api/articles", async (req, res) => {
    try {
      const { category, subcategory, language } = req.query;
      const articles = await storage.getArticles({
        category: category as string,
        subcategory: subcategory as string,
        language: language as string
      });
      return res.json(articles);
    } catch (error) {
      return res.status(500).json({ message: "Failed to get articles" });
    }
  });
  
  app.get("/api/articles/:slug", async (req, res) => {
    try {
      const slug = req.params.slug;
      const article = await storage.getArticleBySlug(slug);
      
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }
      
      return res.json(article);
    } catch (error) {
      return res.status(500).json({ message: "Failed to get article" });
    }
  });
  
  app.post("/api/articles", async (req, res) => {
    try {
      const validation = insertArticleSchema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({ 
          message: "Invalid article data", 
          errors: validation.error.errors 
        });
      }
      
      // Check if slug already exists
      const existingArticle = await storage.getArticleBySlug(validation.data.slug);
      if (existingArticle) {
        return res.status(400).json({ message: "An article with this slug already exists" });
      }
      
      const article = await storage.createArticle(validation.data);
      return res.status(201).json(article);
    } catch (error) {
      return res.status(500).json({ message: "Failed to create article" });
    }
  });
  
  app.put("/api/articles/:slug", async (req, res) => {
    try {
      const slug = req.params.slug;
      const validation = insertArticleSchema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({ 
          message: "Invalid article data", 
          errors: validation.error.errors 
        });
      }
      
      const existingArticle = await storage.getArticleBySlug(slug);
      
      if (!existingArticle) {
        return res.status(404).json({ message: "Article not found" });
      }
      
      const updatedArticle = await storage.updateArticle(slug, validation.data);
      return res.json(updatedArticle);
    } catch (error) {
      return res.status(500).json({ message: "Failed to update article" });
    }
  });
  
  app.delete("/api/articles/:slug", async (req, res) => {
    try {
      const slug = req.params.slug;
      const existingArticle = await storage.getArticleBySlug(slug);
      
      if (!existingArticle) {
        return res.status(404).json({ message: "Article not found" });
      }
      
      await storage.deleteArticle(slug);
      return res.json({ message: "Article deleted successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Failed to delete article" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
