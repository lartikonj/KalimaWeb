import { articles, users, InsertArticle, InsertUser, SuggestedArticle, User, Article } from "@shared/schema";

// Storage interface
export interface IStorage {
  // User operations
  getUserByUid(uid: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  addFavorite(uid: string, articleId: string): Promise<void>;
  removeFavorite(uid: string, articleId: string): Promise<void>;
  addSuggestion(uid: string, suggestion: SuggestedArticle): Promise<void>;
  
  // Article operations
  getArticles(options?: { category?: string; subcategory?: string; language?: string }): Promise<Article[]>;
  getArticleBySlug(slug: string): Promise<Article | undefined>;
  createArticle(article: InsertArticle): Promise<Article>;
  updateArticle(slug: string, article: InsertArticle): Promise<Article>;
  deleteArticle(slug: string): Promise<void>;
}

// Memory storage implementation 
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private usersByUid: Map<string, User>;
  private articles: Map<number, Article>;
  private articlesBySlug: Map<string, Article>;
  private userId: number;
  private articleId: number;

  constructor() {
    this.users = new Map();
    this.usersByUid = new Map();
    this.articles = new Map();
    this.articlesBySlug = new Map();
    this.userId = 1;
    this.articleId = 1;
  }

  // User operations
  async getUserByUid(uid: string): Promise<User | undefined> {
    return this.usersByUid.get(uid);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id };
    
    this.users.set(id, user);
    this.usersByUid.set(user.uid, user);
    
    return user;
  }

  async addFavorite(uid: string, articleId: string): Promise<void> {
    const user = this.usersByUid.get(uid);
    
    if (!user) {
      throw new Error("User not found");
    }
    
    if (!user.favorites) {
      user.favorites = [];
    }
    
    if (!user.favorites.includes(articleId)) {
      user.favorites.push(articleId);
    }
  }

  async removeFavorite(uid: string, articleId: string): Promise<void> {
    const user = this.usersByUid.get(uid);
    
    if (!user) {
      throw new Error("User not found");
    }
    
    if (!user.favorites) {
      return;
    }
    
    user.favorites = user.favorites.filter(id => id !== articleId);
  }

  async addSuggestion(uid: string, suggestion: SuggestedArticle): Promise<void> {
    const user = this.usersByUid.get(uid);
    
    if (!user) {
      throw new Error("User not found");
    }
    
    if (!user.suggestedArticles) {
      user.suggestedArticles = [];
    }
    
    user.suggestedArticles.push(suggestion);
  }

  // Article operations
  async getArticles(options?: { category?: string; subcategory?: string; language?: string }): Promise<Article[]> {
    let result = Array.from(this.articles.values());
    
    if (options) {
      if (options.language) {
        result = result.filter(article => 
          article.availableLanguages.includes(options.language!)
        );
      }
      
      if (options.category || options.subcategory) {
        result = result.filter(article => {
          for (const lang in article.translations) {
            const translation = article.translations[lang];
            
            if (options.category && translation.category !== options.category) {
              continue;
            }
            
            if (options.subcategory && translation.subcategory !== options.subcategory) {
              continue;
            }
            
            return true;
          }
          
          return false;
        });
      }
    }
    
    // Only return published articles by default
    return result.filter(article => !article.draft);
  }

  async getArticleBySlug(slug: string): Promise<Article | undefined> {
    return this.articlesBySlug.get(slug);
  }

  async createArticle(insertArticle: InsertArticle): Promise<Article> {
    const id = this.articleId++;
    const article: Article = {
      ...insertArticle,
      id,
      createdAt: new Date()
    };
    
    this.articles.set(id, article);
    this.articlesBySlug.set(article.slug, article);
    
    return article;
  }

  async updateArticle(slug: string, updateArticle: InsertArticle): Promise<Article> {
    const article = this.articlesBySlug.get(slug);
    
    if (!article) {
      throw new Error("Article not found");
    }
    
    // Update the article properties
    const updatedArticle: Article = {
      ...article,
      ...updateArticle,
    };
    
    // If slug has changed, update the maps accordingly
    if (slug !== updateArticle.slug) {
      this.articlesBySlug.delete(slug);
      this.articlesBySlug.set(updateArticle.slug, updatedArticle);
    } else {
      this.articlesBySlug.set(slug, updatedArticle);
    }
    
    this.articles.set(article.id, updatedArticle);
    
    return updatedArticle;
  }

  async deleteArticle(slug: string): Promise<void> {
    const article = this.articlesBySlug.get(slug);
    
    if (!article) {
      throw new Error("Article not found");
    }
    
    this.articles.delete(article.id);
    this.articlesBySlug.delete(slug);
  }
}

export const storage = new MemStorage();
