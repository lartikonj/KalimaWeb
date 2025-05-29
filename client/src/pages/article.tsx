import { useState, useEffect } from "react";
import { useRoute, Link } from "wouter";
import { getArticleBySlug, getArticles, getCategoryBySlug } from "@/lib/firebase";
import { ArticleDetail } from "@/components/articles/ArticleDetail";
import { Article } from "@/types";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSEO } from "@/hooks/use-seo";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ArticlePage() {
  const [, paramsOld] = useRoute("/article/:slug");
  const [, paramsNew] = useRoute("/categories/:categorySlug/:subcategorySlug/:slug");
  const { language, t } = useLanguage();
  const [article, setArticle] = useState<Article | null>(null);
  const [categoryData, setCategoryData] = useState<any>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Get slug from either route pattern
  const slug = paramsNew?.slug || paramsOld?.slug;
  const categorySlug = paramsNew?.categorySlug;
  const subcategorySlug = paramsNew?.subcategorySlug;
  
  useEffect(() => {
    const fetchArticle = async () => {
      if (!slug) return;
      
      setIsLoading(true);
      
      try {
        const fetchedArticle = await getArticleBySlug(slug);
        
        if (fetchedArticle && !fetchedArticle.draft) {
          setArticle(fetchedArticle as Article);
          
          // Get the category and subcategory to fetch related articles
          const translation = 
            fetchedArticle.translations[language] || 
            fetchedArticle.translations["en"] || 
            fetchedArticle.translations[fetchedArticle.availableLanguages[0]];
          
          if (translation) {
            // Fetch category data for breadcrumbs
            // First try to use URL params, then fall back to article data
            const catSlug = categorySlug || translation.category;
            if (catSlug) {
              try {
                const category = await getCategoryBySlug(catSlug);
                setCategoryData(category);
              } catch (err) {
                console.error("Error fetching category data:", err);
              }
            }
            
            // Fetch related articles with the same category and subcategory if possible
            const related = await getArticles({
              category: categorySlug || translation.category,
              subcategory: subcategorySlug || translation.subcategory,
              language,
              draft: false
            });
            
            // Filter out the current article and limit to 3 related articles
            const filteredRelated = related
              .filter(art => art.id !== fetchedArticle.id)
              .slice(0, 3);
            
            setRelatedArticles(filteredRelated as Article[]);
            
            // If we're using the old URL pattern, redirect to the new URL pattern
            if (!categorySlug && translation.category && translation.subcategory) {
              // Use window.history to update the URL without reloading the page
              const newPath = `/categories/${translation.category}/${translation.subcategory}/${slug}`;
              window.history.replaceState(null, '', newPath);
            }
          }
        } else {
          setArticle(null);
          setError(t("error.articleNotFound"));
        }
      } catch (error) {
        console.error("Error fetching article:", error);
        setArticle(null);
        setError(t("error.failedToLoad"));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchArticle();
  }, [slug, categorySlug, subcategorySlug, language, t]);

  // Get current translation for SEO
  const translation = article && (
    article.translations[language] || 
    article.translations["en"] || 
    article.translations[article.availableLanguages[0]]
  );

  // Use SEO hook
  useSEO({
    title: translation?.title,
    description: translation?.summary,
    keywords: translation?.keywords,
    image: article?.imageUrls?.[0] || article?.imageUrl,
    url: window.location.href,
    type: 'article',
    author: article?.author?.displayName,
    publishedTime: article?.createdAt?.toDate?.()?.toISOString(),
    modifiedTime: article?.createdAt?.toDate?.()?.toISOString(),
    section: translation?.category,
    language: language
  });
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        {/* Skeleton breadcrumb */}
        <div className="flex items-center text-sm mb-6 animate-pulse">
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
          <ChevronRight className="h-4 w-4 mx-2 text-neutral-400" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
          <ChevronRight className="h-4 w-4 mx-2 text-neutral-400" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
        </div>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-6"></div>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !article) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-red-500 mb-4">{error || t("error.articleNotFound")}</h1>
        <Button asChild>
          <Link href="/categories">{t("general.backToCategories")}</Link>
        </Button>
      </div>
    );
  }
  
  const articleCategorySlug = categorySlug || translation?.category;
  const articleSubcategorySlug = subcategorySlug || translation?.subcategory;
  
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
        
        {articleCategorySlug && (
          <>
            <ChevronRight className="h-4 w-4 mx-2 text-neutral-400" />
            <Link href={`/categories/${articleCategorySlug}`}>
              <span className="text-neutral-500 hover:text-primary-600 cursor-pointer">
                {t(`categories.${articleCategorySlug}`)}
              </span>
            </Link>
          </>
        )}
        
        {articleSubcategorySlug && (
          <>
            <ChevronRight className="h-4 w-4 mx-2 text-neutral-400" />
            <Link href={`/categories/${articleCategorySlug}/${articleSubcategorySlug}`}>
              <span className="text-neutral-500 hover:text-primary-600 cursor-pointer">
                {t(`subcategories.${articleSubcategorySlug}`)}
              </span>
            </Link>
          </>
        )}
        
        <ChevronRight className="h-4 w-4 mx-2 text-neutral-400" />
        <span className="font-medium">{translation?.title}</span>
      </div>
      
      <ArticleDetail 
        article={article as any} 
        relatedArticles={relatedArticles as any}
        isLoading={false}
      />
    </div>
  );
}
