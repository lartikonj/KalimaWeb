import { useState } from "react";
import { useLocation } from "wouter";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { StaticPageForm } from "@/components/admin/StaticPageForm";
import { createStaticPage } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { Language } from "@/contexts/LanguageContext";

export default function CreateStaticPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const handleSubmit = async (data: {
    slug: string;
    translations: Record<string, {
      title: string;
      content: string;
      keywords?: string[];
    }>;
  }) => {
    setIsSubmitting(true);
    try {
      // Create availableLanguages array from the translations keys
      const availableLanguages = Object.keys(data.translations) as Language[];
      
      // Create the static page in Firestore
      await createStaticPage({
        slug: data.slug,
        availableLanguages,
        translations: data.translations
      });
      
      toast({
        title: "Success",
        description: "Static page created successfully.",
      });
      
      // Navigate back to the static pages list
      navigate("/admin/static-pages");
    } catch (error) {
      console.error("Error creating static page:", error);
      toast({
        title: "Error",
        description: "Failed to create static page. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Create Static Page</h1>
          <p className="text-muted-foreground">
            Create a new static page with translations for multiple languages.
          </p>
        </div>
        
        <StaticPageForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </AdminLayout>
  );
}