import { useState, useEffect } from "react";
import { Link, useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { ArticleGrid } from "@/components/articles/ArticleGrid";
import { CategoryList } from "@/components/categories/CategoryList";
import { useLanguage } from "@/contexts/LanguageContext";
import { getArticles, getCategoryBySlug } from "@/lib/firebase";
import { Article } from "@/types";
import { ChevronLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

export default function Categories() {
  const { language, t } = useLanguage();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [articles, setArticles] = useState<Article[]>([]);
  const [currentCategory, setCurrentCategory] = useState<string | null>(null);
  const [currentSubcategory, setCurrentSubcategory] = useState<string | null>(null);
  const [categoryData, setCategoryData] = useState<any>(null);
  const [categoryLoading, setCategoryLoading] = useState(false);
  
  // Check if we're on a specific category or subcategory route
  const [isCategoryMatch, categoryParams] = useRoute("/categories/:category");
  const [isSubcategoryMatch, subcategoryParams] = useRoute("/categories/:category/:subcategory");
  
  // Set current category and subcategory based on route
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

  // Fetch category data when currentCategory changes
  useEffect(() => {
    const fetchCategoryData = async () => {
      if (!currentCategory) {
        setCategoryData(null);
        return;
      }
      
      setCategoryLoading(true);
      try {
        const data = await getCategoryBySlug(currentCategory);
        setCategoryData(data);
      } catch (error) {
        console.error("Error fetching category data:", error);
        toast({
          title: "Error",
          description: "Failed to load category data",
          variant: "destructive"
        });
      } finally {
        setCategoryLoading(false);
      }
    };
    
    fetchCategoryData();
  }, [currentCategory, toast]);
  
  // Fetch articles when category, subcategory or language changes
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
        
        setArticles(sortedArticles as Article[]);
      } catch (error) {
        console.error("Error fetching articles:", error);
        toast({
          title: "Error",
          description: "Failed to load articles",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, [currentCategory, currentSubcategory, language, toast]);
  
  // Helper functions for displaying translated names
  const getTranslatedCategoryName = () => {
    if (!currentCategory) return "";
    
    if (categoryData && categoryData.titles) {
      return categoryData.titles[language] || categoryData.titles.en || categoryData.slug;
    }
    
    return currentCategory;
  };
  
  const getTranslatedSubcategoryName = () => {
    if (!currentSubcategory || !categoryData || !categoryData.subcategories) return "";
    
    const subcategory = categoryData.subcategories.find((sub: any) => sub.slug === currentSubcategory);
    if (subcategory && subcategory.titles) {
      return subcategory.titles[language] || subcategory.titles.en || subcategory.slug;
    }
    
    return currentSubcategory;
  };
  
  // Transform subcategories data for UI
  const getFormattedSubcategories = () => {
    if (!currentCategory || !categoryData || !categoryData.subcategories) return [];
    
    return categoryData.subcategories.map((subcategory: any) => ({
      name: subcategory.titles[language] || subcategory.titles.en || subcategory.slug,
      slug: subcategory.slug
    }));
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
                    {getTranslatedCategoryName()}
                  </Link>
                  <span>/</span>
                  <span>{getTranslatedSubcategoryName()}</span>
                </>
              ) : (
                <span>{getTranslatedCategoryName()}</span>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-100">
                {currentSubcategory ? getTranslatedSubcategoryName() : getTranslatedCategoryName()}
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
            {currentCategory && !currentSubcategory && !categoryLoading && (
              <div className="flex flex-wrap gap-2 mt-4">
                {getFormattedSubcategories().map(subcategory => (
                  <Button 
                    key={subcategory.slug}
                    variant="outline"
                    size="sm"
                    asChild
                  >
                    <Link href={`/categories/${currentCategory}/${subcategory.slug}`}>
                      {subcategory.name}
                    </Link>
                  </Button>
                ))}
              </div>
            )}
            
            {categoryLoading && (
              <div className="flex flex-wrap gap-2 mt-4">
                {[1, 2, 3].map(i => (
                  <Skeleton key={i} className="h-9 w-24" />
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
            {t("categories.latest")} {currentSubcategory ? getTranslatedSubcategoryName() : getTranslatedCategoryName()}
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