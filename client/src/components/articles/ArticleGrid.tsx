import { useLanguage } from "@/contexts/LanguageContext";
import { ArticleCard } from "./ArticleCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";

interface Article {
  id: string;
  slug: string;
  category: string;
  subcategory: string;
  availableLanguages: string[];
  translations: Record<string, {
    title: string;
    summary: string;
    keywords?: string[];
    content: Array<{
      title: string;
      paragraph: string;
      references?: string[];
    }>;
  }>;
  createdAt: any; // Firestore timestamp
  imageUrl?: string;
  imageUrls?: string[];
  featured?: boolean;
  popular?: boolean;
}

interface ArticleGridProps {
  articles: Article[];
  isLoading?: boolean;
  emptyMessage?: string;
}

export function ArticleGrid({ articles, isLoading = false, emptyMessage }: ArticleGridProps) {
  const { language, t } = useLanguage();
  const { userData } = useAuth();
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <ArticleCardSkeleton key={index} />
        ))}
      </div>
    );
  }
  
  if (!articles || articles.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-600 dark:text-neutral-300">
          {emptyMessage || t("article.noArticles")}
        </p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map((article) => {
        // Make sure we have a valid article with proper structure
        if (!article || !article.translations || Object.keys(article.translations).length === 0) {
          return null;
        }
        
        // Check if the article is in user's favorites
        const isFavorite = userData?.favorites?.includes(article.id);
        
        return (
          <ArticleCard
            key={article.id}
            id={article.id}
            slug={article.slug}
            category={article.category}
            subcategory={article.subcategory}
            imageUrl={article.imageUrl}
            imageUrls={article.imageUrls}
            availableLanguages={article.availableLanguages}
            translations={article.translations}
            createdAt={article.createdAt}
            isFavorite={isFavorite}
            featured={article.featured}
            popular={article.popular}
          />
        );
      })}
    </div>
  );
}

function ArticleCardSkeleton() {
  return (
    <div className="border rounded-lg overflow-hidden">
      <Skeleton className="w-full h-48" />
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-6 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-2/3 mb-4" />
        <div className="flex justify-between items-center">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>
    </div>
  );
}
