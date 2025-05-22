import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { ArticleForm } from "@/components/admin/ArticleForm";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { createArticle } from "@/lib/firebase";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { getRandomPhoto } from "@/lib/unsplash";

export default function CreateArticle() {
  const [, setLocation] = useLocation();
  const [searchParams] = useLocation();
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialData, setInitialData] = useState<any>(null);

  // Parse URL query parameters to pre-fill form if coming from suggestions
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const title = params.get('title');
    const suggestionLanguage = params.get('language');
    
    if (title && suggestionLanguage) {
      // Create initial data based on suggestion
      const data = {
        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        languages: [suggestionLanguage],
        translations: {
          [suggestionLanguage]: {
            title: title,
            summary: "",
            category: "language-learning", // Default category
            subcategory: "", // Default to no subcategory
            content: [""] // Empty content to start
          }
        },
        draft: true,
        imageUrl: "",
      };
      
      setInitialData(data);
    } else {
      // Default form data with current UI language
      const defaultLanguage = language;
      
      setInitialData({
        slug: "",
        languages: [defaultLanguage],
        translations: {
          [defaultLanguage]: {
            title: "",
            summary: "",
            category: "",
            subcategory: "",
            content: [""]
          }
        },
        draft: true,
        imageUrl: "",
      });
    }
  }, [language]);

  const handleCreateArticle = async (data: any) => {
    setIsSubmitting(true);
    
    try {
      // If no image URL is provided, fetch a random one based on category
      if (!data.imageUrl) {
        try {
          // Get the first available translation to determine category
          const firstLang = data.languages[0];
          const firstTranslation = data.translations[firstLang];
          
          if (firstTranslation && firstTranslation.category) {
            // Search for an image based on the category and title
            const searchTerm = `${t(`categories.${firstTranslation.category}`)} ${firstTranslation.title}`;
            const imageUrl = await getRandomPhoto(searchTerm);
            data.imageUrl = imageUrl;
          }
        } catch (imageError) {
          console.error("Error fetching random image:", imageError);
          // Continue without image if fetching fails
        }
      }
      
      await createArticle(
        data.slug,
        data.languages,
        data.translations,
        data.draft,
        data.imageUrl
      );
      
      toast({
        title: t("admin.articleCreated"),
        description: t("admin.articleCreatedSuccess"),
      });
      
      // Redirect to articles list
      setLocation("/admin/articles");
    } catch (error) {
      console.error("Error creating article:", error);
      toast({
        title: t("error.title"),
        description: error instanceof Error ? error.message : t("error.generic"),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!initialData) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p>{t("general.loading")}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <Button variant="outline" size="icon" asChild className="mr-4">
          <Link href="/admin/articles">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-100">
          {t("admin.createArticle")}
        </h1>
      </div>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{t("admin.createArticle")}</CardTitle>
          <CardDescription>
            {t("admin.createArticleDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ArticleForm 
            initialData={initialData}
            onSubmit={handleCreateArticle}
            isSubmitting={isSubmitting}
          />
        </CardContent>
      </Card>
    </div>
  );
}
