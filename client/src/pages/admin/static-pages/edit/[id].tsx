import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { StaticPageForm } from "@/components/admin/StaticPageForm";
import { getStaticPages, updateStaticPage } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { Language } from "@/contexts/LanguageContext";

interface StaticPage {
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

export default function EditStaticPage() {
  const { id } = useParams();
  const [pageData, setPageData] = useState<StaticPage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [, navigate] = useLocation();

  useEffect(() => {
    async function fetchPageData() {
      setIsLoading(true);
      try {
        if (!id) {
          throw new Error("No page ID provided");
        }
        
        // Fetch all pages then find the one with matching ID
        const pages = await getStaticPages();
        const page = pages.find(p => p.id === id);
        
        if (!page) {
          throw new Error(`Page with ID ${id} not found`);
        }
        
        setPageData(page as StaticPage);
      } catch (error) {
        console.error("Error fetching page:", error);
        toast({
          title: "Error",
          description: "Failed to load the page data. Please try again.",
          variant: "destructive",
        });
        // Navigate back to the list page on error
        navigate("/admin/static-pages");
      } finally {
        setIsLoading(false);
      }
    }

    fetchPageData();
  }, [id, toast, navigate]);

  const handleSubmit = async (data: {
    slug: string;
    translations: Record<string, {
      title: string;
      content: string;
      keywords?: string[];
    }>;
  }) => {
    if (!id || !pageData) return;
    
    setIsSubmitting(true);
    try {
      // Create availableLanguages array from the translations keys
      const availableLanguages = Object.keys(data.translations) as Language[];
      
      // Update the static page in Firestore
      await updateStaticPage(id, {
        availableLanguages,
        translations: data.translations
      });
      
      toast({
        title: "Success",
        description: "Static page updated successfully.",
      });
      
      // Navigate back to the static pages list
      navigate("/admin/static-pages");
    } catch (error) {
      console.error("Error updating static page:", error);
      toast({
        title: "Error",
        description: "Failed to update static page. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center p-8">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!pageData) {
    return (
      <AdminLayout>
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold mb-4">Page Not Found</h1>
          <p className="text-muted-foreground mb-4">
            The page you're trying to edit doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate("/admin/static-pages")}
            className="text-primary hover:underline"
          >
            Back to Static Pages
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Edit Static Page</h1>
          <p className="text-muted-foreground">
            Edit the static page "{pageData.slug}" and its translations.
          </p>
        </div>
        
        <StaticPageForm 
          initialData={pageData}
          onSubmit={handleSubmit} 
          isSubmitting={isSubmitting} 
        />
      </div>
    </AdminLayout>
  );
}