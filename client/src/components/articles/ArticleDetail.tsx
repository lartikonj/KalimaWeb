import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { ChevronLeft, BookmarkPlus, BookmarkCheck, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { addFavorite, removeFavorite } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { LanguageBadge } from "./LanguageBadge";
import { ArticleCard } from "./ArticleCard";

interface ArticleTranslation {
  title: string;
  summary: string;
  content: Array<{
    type: string;
    text: string;
  }>;
}

interface Article {
  id: string;
  slug: string;
  category: string;
  subcategory: string;
  translations: Record<string, ArticleTranslation>;
  availableLanguages: string[];
  createdAt: any; // Firestore timestamp
  imageUrl: string;
}

interface RelatedArticle {
  id: string;
  slug: string;
  category: string;
  subcategory: string;
  translations: Record<string, {
    title: string;
    summary: string;
    content: Array<{type: string; text: string}>;
  }>;
  availableLanguages: string[];
  createdAt: any;
  imageUrl: string;
}

interface ArticleDetailProps {
  article: Article;
  relatedArticles?: RelatedArticle[];
  isLoading?: boolean;
}

export function ArticleDetail({ article, relatedArticles = [], isLoading = false }: ArticleDetailProps) {
  const { language, t, setLanguage } = useLanguage();
  const { user, userData } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [activeLanguage, setActiveLanguage] = useState(language);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Set the active language to the current UI language if it's available for this article
  useEffect(() => {
    if (article && article.availableLanguages.includes(language)) {
      setActiveLanguage(language);
    } else if (article && article.availableLanguages.length > 0) {
      // Fallback to first available language
      setActiveLanguage(article.availableLanguages[0]);
    }
  }, [article, language]);
  
  // Check if article is in user's favorites
  useEffect(() => {
    if (user && userData && article) {
      setIsFavorite(userData.favorites?.includes(article.id) || false);
    }
  }, [user, userData, article]);
  
  if (isLoading) {
    return <ArticleDetailSkeleton />;
  }
  
  if (!article) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">{t("article.notFound")}</h1>
        <p className="mb-6">{t("article.mayHaveBeenRemoved")}</p>
        <Button onClick={() => setLocation("/")}>
          {t("general.backToHome")}
        </Button>
      </div>
    );
  }
  
  // Get the translation in active language
  const translation = article.translations[activeLanguage];
  
  if (!translation) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">{t("article.translationMissing")}</h1>
        <p className="mb-6">{t("article.chooseAnotherLanguage")}</p>
        <div className="flex justify-center space-x-2">
          {article.availableLanguages.map(lang => (
            <Button 
              key={lang} 
              variant={activeLanguage === lang ? "default" : "outline"}
              onClick={() => setActiveLanguage(lang)}
            >
              {lang.toUpperCase()}
            </Button>
          ))}
        </div>
      </div>
    );
  }
  
  // Format date based on active language
  const formattedDate = article.createdAt?.toDate?.() 
    ? article.createdAt.toDate().toLocaleDateString(
        activeLanguage === "en" ? "en-US" : 
        activeLanguage === "fr" ? "fr-FR" : 
        activeLanguage === "es" ? "es-ES" : 
        activeLanguage === "de" ? "de-DE" : 
        "ar-SA", 
        { year: 'numeric', month: 'long', day: 'numeric' }
      )
    : "";
  
  const handleFavoriteToggle = async () => {
    if (!user) {
      toast({
        title: t("favorites.loginRequired"),
        description: t("favorites.loginToSave"),
        variant: "destructive",
      });
      return;
    }
    
    setIsUpdating(true);
    
    try {
      if (isFavorite) {
        await removeFavorite(user.uid, article.id);
        setIsFavorite(false);
        toast({
          title: t("favorites.removed"),
          description: t("favorites.articleRemoved"),
        });
      } else {
        await addFavorite(user.uid, article.id);
        setIsFavorite(true);
        toast({
          title: t("favorites.added"),
          description: t("favorites.articleSaved"),
        });
      }
    } catch (error) {
      toast({
        title: t("error.title"),
        description: t("error.savingFailed"),
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleLanguageChange = (lang: string) => {
    setActiveLanguage(lang);
    // You can also update the UI language if needed
    setLanguage(lang as any);
  };
  
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: translation.title,
          text: translation.summary,
          url: window.location.href,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: t("article.linkCopied"),
        description: t("article.linkCopiedToClipboard"),
      });
    }
  };
  
  return (
    <div className="bg-white dark:bg-neutral-800 rounded-xl overflow-hidden shadow-lg mb-8">
      <div className="relative">
        <img 
          src={article.imageUrl} 
          alt={translation.title} 
          className="w-full h-64 md:h-80 object-cover"
        />
        <div className="absolute top-0 left-0 p-4">
          <Link href="/">
            <Button variant="secondary" size="sm" className="rounded-full bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm">
              <ChevronLeft className="h-5 w-5 mr-1" />
              {t("general.back")}
            </Button>
          </Link>
        </div>
        <div className="absolute top-0 right-0 flex space-x-1 rtl:space-x-reverse p-4">
          {article.availableLanguages.map(lang => (
            <Button
              key={lang}
              size="sm"
              variant={activeLanguage === lang ? "default" : "secondary"}
              className="px-3 rounded-full"
              onClick={() => handleLanguageChange(lang)}
            >
              {lang.toUpperCase()}
            </Button>
          ))}
        </div>
      </div>
      
      <div className="p-6 md:p-8">
        <div className="flex items-center justify-between mb-4">
          <Badge className="text-sm bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
            {article.category}
            {article.subcategory && ` > ${article.subcategory}`}
          </Badge>
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <Button
              variant="ghost"
              size="sm"
              disabled={isUpdating}
              onClick={handleFavoriteToggle}
              className={isFavorite ? "text-accent-500" : "text-neutral-400 hover:text-accent-500"}
            >
              {isFavorite ? (
                <>
                  <BookmarkCheck className="h-5 w-5 mr-1" />
                  {t("favorites.saved")}
                </>
              ) : (
                <>
                  <BookmarkPlus className="h-5 w-5 mr-1" />
                  {t("favorites.save")}
                </>
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleShare}
              className="text-neutral-400 hover:text-neutral-600 dark:text-neutral-400 dark:hover:text-neutral-200"
            >
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-neutral-800 dark:text-neutral-100 font-heading">
          {translation.title}
        </h1>
        
        <div className="text-neutral-600 dark:text-neutral-300 prose dark:prose-invert max-w-none mb-6">
          {translation.content.map((block, index) => {
            if (block.type === 'heading') {
              return (
                <h2 key={index} className="text-2xl font-bold mt-6 mb-3 text-neutral-800 dark:text-neutral-100">
                  {block.text}
                </h2>
              );
            } else if (block.type === 'paragraph') {
              return (
                <p key={index} className="mb-4">
                  {block.text}
                </p>
              );
            } else {
              // Fallback for any other content type
              return (
                <div key={index} className="mb-4">
                  {block.text}
                </div>
              );
            }
          })}
        </div>
        
        {/* Article metadata */}
        <div className="flex items-center justify-between border-t border-neutral-200 dark:border-neutral-700 pt-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-primary-500">
                <span className="text-xl font-medium leading-none text-white">K</span>
              </span>
            </div>
            <div className="ml-3 rtl:mr-3 rtl:ml-0">
              <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">Kalima</p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">{t("article.educationalContent")}</p>
            </div>
          </div>
          <div className="text-xs text-neutral-500 dark:text-neutral-400">
            {formattedDate}
          </div>
        </div>
      </div>
      
      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <div className="px-6 md:px-8 pb-8">
          <h2 className="text-2xl font-heading font-bold mb-6 text-neutral-800 dark:text-neutral-100">
            {t("article.relatedArticles")}
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedArticles.map((relatedArticle) => {
              // Get the translation in current language or fall back
              const relatedTranslation = 
                relatedArticle.translations[language] || 
                relatedArticle.translations["en"] || 
                relatedArticle.translations[relatedArticle.availableLanguages[0]];
              
              if (!relatedTranslation) return null;
              
              // Check if the article is in user's favorites
              const isRelatedFavorite = userData?.favorites?.includes(relatedArticle.id);
              
              // Convert Firestore timestamp to ISO string
              const createdAt = relatedArticle.createdAt?.toDate?.() 
                ? relatedArticle.createdAt.toDate().toISOString() 
                : new Date().toISOString();
              
              return (
                <ArticleCard
                  key={relatedArticle.id}
                  id={relatedArticle.id}
                  slug={relatedArticle.slug}
                  category={relatedArticle.category}
                  subcategory={relatedArticle.subcategory}
                  imageUrl={relatedArticle.imageUrl}
                  translations={relatedArticle.translations}
                  createdAt={relatedArticle.createdAt}
                  availableLanguages={relatedArticle.availableLanguages}
                  isFavorite={isRelatedFavorite}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function ArticleDetailSkeleton() {
  return (
    <div className="bg-white dark:bg-neutral-800 rounded-xl overflow-hidden shadow-lg mb-8">
      <Skeleton className="w-full h-64 md:h-80" />
      
      <div className="p-6 md:p-8">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-6 w-32" />
          <div className="flex space-x-2">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>
        
        <Skeleton className="h-10 w-full mb-4" />
        <Skeleton className="h-10 w-3/4 mb-8" />
        
        <div className="space-y-4 mb-6">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-4/5" />
        </div>
        
        <div className="border-t border-neutral-200 dark:border-neutral-700 pt-6 flex justify-between">
          <div className="flex items-center">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="ml-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-32 mt-1" />
            </div>
          </div>
          <Skeleton className="h-4 w-28" />
        </div>
      </div>
    </div>
  );
}
