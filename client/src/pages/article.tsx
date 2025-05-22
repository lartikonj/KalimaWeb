
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
        
        if (fetchedArticle && 
            fetchedArticle.translations[language]?.category === params.category && 
            fetchedArticle.translations[language]?.subcategory === params.subcategory && 
            !fetchedArticle.draft) {
          
          setArticle(fetchedArticle as Article);
          
          // Get related articles
          const related = await getArticles({
            category: params.category,
            language,
            draft: false
          });
          
          // Filter out current article and limit to 3
          const filteredRelated = related
            .filter(art => art.id !== fetchedArticle.id)
            .slice(0, 3);
          
          setRelatedArticles(filteredRelated as Article[]);
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
  }, [params?.slug, params?.category, params?.subcategory, language]);
  
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
