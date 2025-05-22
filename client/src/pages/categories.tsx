import { useState, useEffect } from "react";
import { Link, useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { ArticleGrid } from "@/components/articles/ArticleGrid";
import { CategoryList } from "@/components/categories/CategoryList";
import { useLanguage } from "@/contexts/LanguageContext";
import { getArticles, getCategoryBySlug, getCategories } from "@/lib/firebase";
import { Article } from "@/types";
import { ChevronLeft } from "lucide-react";

export default function Categories() {
  const { t, language } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const [articles, setArticles] = useState<Article[]>([]);
  const [currentCategory, setCurrentCategory] = useState<string | null>(null);
  const [currentSubcategory, setCurrentSubcategory] = useState<string | null>(null);
  
  // Check if we're on a specific category or subcategory route
  const [isCategoryMatch, categoryParams] = useRoute("/categories/:category");
  const [isSubcategoryMatch, subcategoryParams] = useRoute("/categories/:category/:subcategory");
  
  useEffect(() => {
    if (isSubcategoryMatch && subcategoryParams) {
      setCurrentCategory(subcategoryParams.category);
      setCurrentSubcategory(subcategoryParams.subcategory);
    } else if (isCategoryMatch && categoryParams) {
      setCurrentCategory(categoryParams.category);
      setCurrentSubcategory(null);
    } else {
      setCurrentCategory(null);
      setCurrentSubcategory(null);
    }
  }, [isCategoryMatch, categoryParams, isSubcategoryMatch, subcategoryParams]);
  
  useEffect(() => {
    const fetchArticles = async () => {
      setIsLoading(true);
      try {
        // Get articles based on category/subcategory
        const fetchedArticles = await getArticles({
          category: currentCategory || undefined,
          subcategory: currentSubcategory || undefined,
          language,
          draft: false
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
  }, [currentCategory, currentSubcategory, language]);
  
  // Get category and subcategory names
  const getCategoryName = () => {
    if (!currentCategory) return "";
    return t(`categories.${currentCategory}`);
  };
  
  const getSubcategoryName = () => {
    if (!currentSubcategory) return "";
    return t(`subcategories.${currentSubcategory}`);
  };
  
  // Get current subcategories based on selected category
  const getCurrentSubcategories = () => {
    if (!currentCategory) return [];
    const category = categories.find(cat => cat.slug === currentCategory);
    return category ? category.subcategories : [];
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Breadcrumb & Title */}
      <div>
        {!currentCategory && (
          <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-100">
            {t("categories.allCategories")}
          </h1>
        )}
        
        {currentCategory && (
          <>
            <div className="flex items-center gap-2 mb-2 text-sm text-neutral-500 dark:text-neutral-400">
              <Link href="/categories" className="hover:text-primary-600 dark:hover:text-primary-400">
                {t("categories.allCategories")}
              </Link>
              <span>/</span>
              {currentSubcategory ? (
                <>
                  <Link 
                    href={`/categories/${currentCategory}`} 
                    className="hover:text-primary-600 dark:hover:text-primary-400"
                  >
                    {getCategoryName()}
                  </Link>
                  <span>/</span>
                  <span>{getSubcategoryName()}</span>
                </>
              ) : (
                <span>{getCategoryName()}</span>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-100">
                {currentSubcategory ? getSubcategoryName() : getCategoryName()}
              </h1>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.history.back()}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                {t("general.back")}
              </Button>
            </div>
            
            {/* Show subcategory links if we're on a category page */}
            {currentCategory && !currentSubcategory && (
              <div className="flex flex-wrap gap-2 mt-4">
                {getCurrentSubcategories().map(subcategory => (
                  <Button 
                    key={subcategory.slug}
                    variant="outline"
                    size="sm"
                    asChild
                  >
                    <Link href={`/categories/${currentCategory}/${subcategory.slug}`}>
                      {t(`subcategories.${subcategory.slug}`)}
                    </Link>
                  </Button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Display all categories if we're on the main categories page */}
      {!currentCategory && (
        <CategoryList />
      )}
      
      {/* Display articles based on category/subcategory filter */}
      <div>
        {(currentCategory || currentSubcategory) && (
          <h2 className="text-2xl font-bold mb-6 text-neutral-800 dark:text-neutral-100">
            {t("categories.latest")} {currentSubcategory ? getSubcategoryName() : getCategoryName()}
          </h2>
        )}
        
        <ArticleGrid 
          articles={articles}
          isLoading={isLoading}
          emptyMessage={t("article.noArticles")}
        />
      </div>
    </div>
  );
}
