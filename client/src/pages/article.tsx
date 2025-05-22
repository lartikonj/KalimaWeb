import { useState, useEffect } from "react";
import { useRoute } from "wouter";
import { getArticleBySlug, getArticles } from "@/lib/firebase";
import { ArticleDetail } from "@/components/articles/ArticleDetail";
import { Article } from "@/types";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ArticlePage() {
  const [, params] = useRoute("/:category/:subcategory/:slug");
  const { language } = useLanguage();
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchArticle = async () => {
      if (!params?.slug || !params?.category || !params?.subcategory) return;
      
      setIsLoading(true);
      
      try {
        const fetchedArticle = await getArticleBySlug(params.slug);
        
        // Verify article belongs to correct category/subcategory
        if (fetchedArticle && 
            fetchedArticle.category === params.category &&
            fetchedArticle.subcategory === params.subcategory) {
        
        if (fetchedArticle && !fetchedArticle.draft) {
          setArticle(fetchedArticle as Article);
          
          // Get the category and subcategory to fetch related articles
          const translation = 
            fetchedArticle.translations[language] || 
            fetchedArticle.translations["en"] || 
            fetchedArticle.translations[fetchedArticle.availableLanguages[0]];
          
          if (translation) {
            // Fetch related articles with the same category
            const related = await getArticles({
              category: translation.category,
              language,
              draft: false
            });
            
            // Filter out the current article and limit to 3 related articles
            const filteredRelated = related
              .filter(art => art.id !== fetchedArticle.id)
              .slice(0, 3);
            
            setRelatedArticles(filteredRelated as Article[]);
          }
        } else {
          setArticle(null);
        }
      } catch (error) {
        console.error("Error fetching article:", error);
        setArticle(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchArticle();
  }, [params?.slug, language]);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <ArticleDetail 
        article={article} 
        relatedArticles={relatedArticles}
        isLoading={isLoading}
      />
    </div>
  );
}
