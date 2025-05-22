import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArticleGrid } from "@/components/articles/ArticleGrid";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { getArticles } from "@/lib/firebase";
import { Article } from "@/types";
import { BookmarkIcon } from "lucide-react";

export default function Favorites() {
  const { t, language } = useLanguage();
  const { userData } = useAuth();
  const [favoriteArticles, setFavoriteArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!userData || !userData.favorites || userData.favorites.length === 0) {
        setFavoriteArticles([]);
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      
      try {
        // Get all articles
        const allArticles = await getArticles({ draft: false });
        
        // Filter to only include articles in the user's favorites
        const userFavorites = allArticles.filter(article => 
          userData.favorites.includes(article.id)
        );
        
        setFavoriteArticles(userFavorites as Article[]);
      } catch (error) {
        console.error("Error fetching favorite articles:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFavorites();
  }, [userData]);
  
  if (!isLoading && (!userData?.favorites || userData.favorites.length === 0)) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8 text-center">
          {t("favorites.title")}
        </h1>
        
        <div className="text-center max-w-md mx-auto bg-white dark:bg-neutral-800 rounded-lg shadow-md p-8">
          <BookmarkIcon className="mx-auto h-12 w-12 text-neutral-400 mb-4" />
          <h2 className="text-xl font-medium mb-2">
            {t("favorites.empty")}
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            {t("favorites.emptyDescription")}
          </p>
          <Button asChild>
            <Link href="/categories">
              {t("favorites.browse")}
            </Link>
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        {t("favorites.title")}
      </h1>
      
      <ArticleGrid 
        articles={favoriteArticles}
        isLoading={isLoading}
        emptyMessage={t("favorites.empty")}
      />
    </div>
  );
}
