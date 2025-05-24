import { useEffect, useState } from "react";
import { useParams } from "wouter";
import { getStaticPageBySlug } from "@/lib/firebase";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";

interface PageData {
  id: string;
  slug: string;
  availableLanguages: string[];
  translations: Record<string, {
    title: string;
    content: string;
    keywords?: string[];
  }>;
  updatedAt: any;
}

export default function StaticPage() {
  const { slug } = useParams();
  const { language } = useLanguage();
  const { toast } = useToast();
  const [pageData, setPageData] = useState<PageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchPageData() {
      setIsLoading(true);
      try {
        if (!slug) {
          throw new Error("No page slug provided");
        }
        
        const page = await getStaticPageBySlug(slug);
        setPageData(page as PageData);
      } catch (error) {
        console.error("Error fetching page:", error);
        toast({
          title: "Error",
          description: "Failed to load the page content.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchPageData();
  }, [slug, toast]);

  // Get the content in the current language or fallback to English
  const getPageContent = () => {
    if (!pageData) return null;

    // Try to get content in current language
    if (pageData.translations[language]) {
      return pageData.translations[language];
    }
    
    // Fallback to English
    if (pageData.translations.en) {
      return pageData.translations.en;
    }
    
    // If no English, take the first available translation
    const availableLanguages = Object.keys(pageData.translations);
    if (availableLanguages.length > 0) {
      return pageData.translations[availableLanguages[0]];
    }
    
    return null;
  };
  
  const content = getPageContent();

  if (isLoading) {
    return (
      <div className="container py-12">
        <div className="flex justify-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!pageData || !content) {
    return (
      <div className="container py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Page Not Found</h1>
          <p className="text-muted-foreground">
            The page you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <article className="prose dark:prose-invert max-w-none">
        <h1 className="text-3xl font-bold mb-6">{content.title}</h1>
        <div className="my-8">
          <ReactMarkdown>{content.content}</ReactMarkdown>
        </div>
      </article>
    </div>
  );
}