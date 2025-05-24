import { Link } from "wouter";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookmarkIcon, BookmarkPlusIcon } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { addFavorite, removeFavorite } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { LanguageBadge } from "./LanguageBadge";

interface ArticleCardProps {
  id: string;
  slug: string;
  mainTitle?: string; // Main article title
  category: string;
  subcategory: string;
  imageUrls?: string[];
  imageUrl?: string; // For backwards compatibility
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
  isFavorite?: boolean;
  featured?: boolean;
  popular?: boolean;
}

export function ArticleCard({
  id,
  slug,
  mainTitle,
  category,
  subcategory,
  imageUrls,
  imageUrl, // For backwards compatibility
  availableLanguages,
  translations,
  createdAt,
  isFavorite = false,
  featured = false,
  popular = false,
}: ArticleCardProps) {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const [favorite, setFavorite] = useState(isFavorite);
  const [isUpdating, setIsUpdating] = useState(false);

  // Get the translation for the current language or fall back to English
  const currentTranslation = translations[language] || translations.en || Object.values(translations)[0];
  const displayTitle = currentTranslation?.title || mainTitle || '';
  const summary = currentTranslation?.summary || '';
  
  // Convert Firestore timestamp to Date
  const date = createdAt?.toDate?.() ? createdAt.toDate() : new Date();
  
  // Format date based on current language
  const formattedDate = date.toLocaleDateString(
    language === "en" ? "en-US" : 
    language === "fr" ? "fr-FR" : 
    language === "es" ? "es-ES" : 
    language === "de" ? "de-DE" : 
    "ar-SA", 
    { year: 'numeric', month: 'long', day: 'numeric' }
  );

  const handleFavoriteToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
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
      if (favorite) {
        await removeFavorite(user.uid, id);
        setFavorite(false);
        toast({
          title: t("favorites.removed"),
          description: t("favorites.articleRemoved"),
        });
      } else {
        await addFavorite(user.uid, id);
        setFavorite(true);
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

  // Check if we have valid data
  if (!translations || Object.keys(translations).length === 0) {
    return null;
  }

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="relative">
        <Link href={`/categories/${category}/${subcategory}/${slug}`}>
          <img
            src={(imageUrls && imageUrls.length > 0) ? imageUrls[0] : (imageUrl || 'https://images.unsplash.com/photo-1637332203993-ab33850d8b7b?q=80&w=1760&auto=format&fit=crop')}
            alt={displayTitle}
            className="w-full h-48 object-cover hover:opacity-90 transition-opacity"
            onError={(e) => {
              // Fallback to a static image if the source fails to load
              e.currentTarget.src = 'https://images.unsplash.com/photo-1637332203993-ab33850d8b7b?q=80&w=1760&auto=format&fit=crop';
            }}
          />
        </Link>
        
        {/* Language Badges */}
        <div className="absolute top-0 right-0 flex space-x-1 rtl:space-x-reverse p-2">
          {availableLanguages?.map(lang => (
            <LanguageBadge key={lang} language={lang} />
          )) || []}
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="outline" className="text-xs bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
            {category}
            {subcategory && ` > ${subcategory}`}
          </Badge>
          <span className="text-xs text-neutral-500 dark:text-neutral-400">{formattedDate}</span>
        </div>
        
        <Link href={`/categories/${category}/${subcategory}/${slug}`}>
          <h3 className="text-lg font-bold mb-2 text-neutral-800 dark:text-neutral-100 hover:text-primary-600 dark:hover:text-primary-400 line-clamp-2">
            {displayTitle}
          </h3>
        </Link>
        
        <p className="text-neutral-600 dark:text-neutral-300 mb-4 text-sm line-clamp-3">
          {summary}
        </p>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <Link href={`/categories/${category}/${subcategory}/${slug}`}>
          <Button variant="link" className="p-0 h-auto text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300">
            {t("article.readMore")}
          </Button>
        </Link>
        
        <Button
          variant="ghost"
          size="icon"
          disabled={isUpdating}
          onClick={handleFavoriteToggle}
          className={favorite ? "text-accent-500" : "text-neutral-400 hover:text-accent-500"}
        >
          {favorite ? (
            <BookmarkIcon className="h-5 w-5" />
          ) : (
            <BookmarkPlusIcon className="h-5 w-5" />
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
