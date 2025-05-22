import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { ArticleForm } from "@/components/admin/ArticleForm";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { getArticleBySlug, updateArticle } from "@/lib/firebase";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Link } from "wouter";

export default function EditArticle() {
  const [match, params] = useRoute("/admin/articles/edit/:slug");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [article, setArticle] = useState<any>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!params?.slug) return;
      
      setIsLoading(true);
      
      try {
        const fetchedArticle = await getArticleBySlug(params.slug);
        
        if (fetchedArticle) {
          setArticle(fetchedArticle);
        } else {
          toast({
            title: t("error.title"),
            description: t("admin.articleNotFound"),
            variant: "destructive",
          });
          setLocation("/admin/articles");
        }
      } catch (error) {
        console.error("Error fetching article:", error);
        toast({
          title: t("error.title"),
          description: t("error.generic"),
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchArticle();
  }, [params?.slug, toast, t, setLocation]);

  const handleUpdateArticle = async (data: any) => {
    setIsSubmitting(true);
    
    try {
      if (!article || !article.id) {
        throw new Error("Article data is missing");
      }
      
      await updateArticle(
        article.id,
        data.slug,
        data.languages,
        data.translations,
        data.draft,
        data.imageUrl
      );
      
      toast({
        title: t("admin.articleUpdated"),
        description: t("admin.articleUpdatedSuccess"),
      });
      
      // Redirect to articles list
      setLocation("/admin/articles");
    } catch (error) {
      console.error("Error updating article:", error);
      toast({
        title: t("error.title"),
        description: error instanceof Error ? error.message : t("error.generic"),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <p>{t("general.loading")}</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p>{t("admin.articleNotFound")}</p>
        <Button asChild className="mt-4">
          <Link href="/admin/articles">
            {t("general.backToArticles")}
          </Link>
        </Button>
      </div>
    );
  }

  // Prepare the form data
  const formData = {
    slug: article.slug,
    languages: article.availableLanguages,
    translations: article.translations,
    draft: article.draft,
    imageUrl: article.imageUrl || "",
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <Button variant="outline" size="icon" asChild className="mr-4">
          <Link href="/admin/articles">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-100">
          {t("admin.editArticle")}
        </h1>
      </div>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{t("admin.editArticle")}</CardTitle>
          <CardDescription>
            {t("admin.editArticleDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ArticleForm 
            initialData={formData} 
            onSubmit={handleUpdateArticle} 
            isSubmitting={isSubmitting}
          />
        </CardContent>
      </Card>
    </div>
  );
}
