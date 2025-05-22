import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArticleGrid } from "@/components/articles/ArticleGrid";
import { CategoryList } from "@/components/categories/CategoryList";
import { useLanguage } from "@/contexts/LanguageContext";
import { getArticles } from "@/lib/firebase";
import { Article } from "@/types";
import { ChevronRight } from "lucide-react";

export default function Home() {
  const { t, language } = useLanguage();
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      setIsLoading(true);
      try {
        // Only get published articles
        const fetchedArticles = await getArticles({ 
          draft: false,
          language: language 
        });
        
        // Sort by creation date (newest first)
        const sortedArticles = fetchedArticles.sort((a, b) => {
          const dateA = a.createdAt?.toDate?.() ? a.createdAt.toDate().getTime() : 0;
          const dateB = b.createdAt?.toDate?.() ? b.createdAt.toDate().getTime() : 0;
          return dateB - dateA;
        });
        
        setArticles(sortedArticles);
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, [language]);

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      {/* Hero Section */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl overflow-hidden shadow-lg mb-8">
        <div className="relative">
          <img 
            src="https://images.unsplash.com/photo-1509062522246-3755977927d7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=500" 
            alt="Students reading educational content" 
            className="w-full h-64 object-cover sm:h-80 md:h-96"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-600/80 to-primary-800/50 flex items-center">
            <div className="px-6 md:px-12 max-w-3xl">
              <h1 className="text-3xl md:text-4xl font-bold text-white font-heading mb-4">
                {t("home.hero.title")}
              </h1>
              <p className="text-white text-lg md:text-xl mb-6">
                {t("home.hero.subtitle")}
              </p>
              <Button asChild size="lg" className="bg-white text-primary-600 hover:bg-neutral-100">
                <Link href="/categories">
                  {t("home.hero.cta")}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Categories */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-heading font-bold text-neutral-800 dark:text-neutral-100">
            {t("home.featuredCategories")}
          </h2>
          <Button asChild variant="ghost" className="group">
            <Link href="/categories" className="flex items-center gap-1">
              {t("general.viewAll")}
              <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
        <CategoryList />
      </div>

      {/* Latest Articles */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-heading font-bold text-neutral-800 dark:text-neutral-100">
            {t("home.latestArticles")}
          </h2>
          <Button asChild variant="ghost" className="group">
            <Link href="/categories" className="flex items-center gap-1">
              {t("general.viewAll")}
              <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
        
        <ArticleGrid 
          articles={articles.slice(0, 6)} 
          isLoading={isLoading} 
          emptyMessage={t("article.noArticles")}
        />
      </div>
    </div>
  );
}
