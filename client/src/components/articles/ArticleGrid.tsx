import { useLanguage } from "@/contexts/LanguageContext";
import { ArticleCard } from "./ArticleCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";

interface Article {
  id: string;
  slug: string;
  translations: Record<string, {
    title: string;
    summary: string;
    category: string;
    subcategory: string;
  }>;
  availableLanguages: string[];
  createdAt: any; // Firestore timestamp
  imageUrl: string;
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
        // Get the translation in current language or fall back to English or the first available language
        const translation = 
          article.translations[language] || 
          article.translations["en"] || 
          article.translations[article.availableLanguages[0]];
        
        if (!translation) return null;
        
        // Check if the article is in user's favorites
        const isFavorite = userData?.favorites?.includes(article.id);
        
        // Convert Firestore timestamp to ISO string
        const createdAt = article.createdAt?.toDate?.() 
          ? article.createdAt.toDate().toISOString() 
          : new Date().toISOString();
        
        return (
          <ArticleCard
            key={article.id}
            id={article.id}
            slug={article.slug}
            title={translation.title}
            summary={translation.summary}
            imageUrl={article.imageUrl}
            category={translation.category}
            subcategory={translation.subcategory}
            date={createdAt}
            availableLanguages={article.availableLanguages}
            isFavorite={isFavorite}
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
