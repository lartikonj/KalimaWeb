import { useEffect, useState } from "react";
import { useRoute, Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { ArticleGrid } from "@/components/articles/ArticleGrid";
import { getCategoryBySlug, getArticlesByCategory } from "@/lib/firebase";

export default function SubcategoryPage() {
  const { t, language } = useLanguage();
  const [, params] = useRoute("/categories/:categorySlug/:subcategorySlug");
  const categorySlug = params?.categorySlug || "";
  const subcategorySlug = params?.subcategorySlug || "";
  
  const [category, setCategory] = useState<any>(null);
  const [subcategory, setSubcategory] = useState<any>(null);
  const [articles, setArticles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategoryAndArticles = async () => {
      setIsLoading(true);
      try {
        // Fetch category data
        const categoryData = await getCategoryBySlug(categorySlug);
        if (!categoryData) {
          setError(t("error.categoryNotFound"));
          setIsLoading(false);
          return;
        }
        
        setCategory(categoryData);
        
        // Find the subcategory
        const subcategories = categoryData.subcategories || [];
        const foundSubcategory = subcategories.find(
          (sub: any) => sub.slug === subcategorySlug
        );
        
        if (!foundSubcategory) {
          setError(t("error.subcategoryNotFound"));
          setIsLoading(false);
          return;
        }
        
        setSubcategory(foundSubcategory);
        
        // Fetch articles for this category and subcategory
        const fetchedArticles = await getArticlesByCategory(categorySlug, language);
        
        // Filter articles for this subcategory
        const subcategoryArticles = fetchedArticles.filter((article: any) => {
          // Check if the article has this subcategory at the top level
          if (article.category === categorySlug && article.subcategory === subcategorySlug) {
            return true;
          }
          
          // Check all translations for this subcategory
          return Object.values(article.translations || {}).some((translation: any) => {
            return translation.category === categorySlug && 
                   translation.subcategory === subcategorySlug;
          });
        });
        
        setArticles(subcategoryArticles);
      } catch (err) {
        console.error("Error fetching subcategory data:", err);
        setError(t("error.failedToLoad"));
      } finally {
        setIsLoading(false);
      }
    };

    if (categorySlug && subcategorySlug) {
      fetchCategoryAndArticles();
    }
  }, [categorySlug, subcategorySlug, language, t]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-red-500 mb-4">{error}</h1>
        <Button asChild>
          <Link href="/categories">{t("general.backToCategories")}</Link>
        </Button>
      </div>
    );
  }

  if (!category || !subcategory) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">{t("error.subcategoryNotFound")}</h1>
        <Button asChild>
          <Link href={`/categories/${categorySlug}`}>{t("general.backToCategory")}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm mb-6">
        <Link href="/">
          <span className="text-neutral-500 hover:text-primary-600 cursor-pointer">
            {t("nav.home")}
          </span>
        </Link>
        <ChevronRight className="h-4 w-4 mx-2 text-neutral-400" />
        <Link href="/categories">
          <span className="text-neutral-500 hover:text-primary-600 cursor-pointer">
            {t("nav.categories")}
          </span>
        </Link>
        <ChevronRight className="h-4 w-4 mx-2 text-neutral-400" />
        <Link href={`/categories/${categorySlug}`}>
          <span className="text-neutral-500 hover:text-primary-600 cursor-pointer">
            {category.titles?.[language] || category.titles?.en || categorySlug}
          </span>
        </Link>
        <ChevronRight className="h-4 w-4 mx-2 text-neutral-400" />
        <span className="font-medium">{subcategory.titles?.[language] || subcategory.titles?.en || subcategorySlug}</span>
      </div>

      {/* Subcategory Title and Description */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-100 mb-2">
          {subcategory.titles?.[language] || subcategory.titles?.en || subcategorySlug}
        </h1>
        <p className="text-neutral-600 dark:text-neutral-300">
          {t(`subcategoryDescriptions.${subcategorySlug}`)}
        </p>
      </div>

      {/* Articles Grid */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">{t("general.articles")}</h2>
        <ArticleGrid 
          articles={articles} 
          isLoading={false}
          emptyMessage={t("general.noArticlesInSubcategory")}
        />
      </div>
    </div>
  );
}