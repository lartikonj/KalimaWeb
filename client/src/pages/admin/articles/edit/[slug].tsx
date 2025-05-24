import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ArticleEditor } from "@/components/admin/ArticleEditor";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { getArticleBySlug } from "@/lib/firebase";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Link } from "wouter";

export default function EditArticle() {
  const [match, params] = useRoute("/admin/articles/edit/:slug");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
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

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin mb-4" />
          <p>{t("general.loading")}</p>
        </div>
      </AdminLayout>
    );
  }

  if (!article) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center p-12">
          <p className="text-lg mb-4">{t("admin.articleNotFound")}</p>
          <Button asChild>
            <Link href="/admin/articles">
              {t("general.backToArticles")}
            </Link>
          </Button>
        </div>
      </AdminLayout>
    );
  }

  // Prepare the article data for the editor
  const formattedArticle = {
    id: article.id,
    slug: article.slug,
    translations: article.translations || {},
    availableLanguages: article.availableLanguages || [],
    draft: article.draft || false,
    featured: article.featured || false,
    popular: article.popular || false,
    imageUrls: article.imageUrls || [],
    imageDescriptions: article.imageDescriptions || [],
    author: article.author || {
      uid: "",
      displayName: "",
      photoURL: ""
    },
    category: article.category || "",
    subcategory: article.subcategory || ""
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link href="/admin/articles">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-100">
              {t("admin.editArticle")}
            </h1>
          </div>
        </div>
        
        <ArticleEditor 
          initialData={formattedArticle}
          isEditMode={true}
        />
      </div>
    </AdminLayout>
  );
}