import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { ArticleEditor } from "@/components/admin/ArticleEditor";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useLanguage } from "@/contexts/LanguageContext";

export default function CreateArticle() {
  const { t, language } = useLanguage();
  const [initialData, setInitialData] = useState<any>(null);

  // Parse URL query parameters to pre-fill form data if coming from suggestions
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const title = params.get('title');
    const suggestionLanguage = params.get('language') || language;
    
    if (title) {
      // Create initial data based on suggestion
      const data = {
        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        title: title,
        availableLanguages: [suggestionLanguage],
        translations: {
          [suggestionLanguage]: {
            title: title,
            summary: "",
            keywords: [],
            content: [{ 
              title: "Introduction", 
              paragraph: "", 
              references: [] 
            }]
          }
        },
        category: "general",
        subcategory: "other",
        draft: true,
        imageUrls: [],
        imageDescriptions: [],
        featured: false,
        popular: false,
        author: {
          uid: "system",
          displayName: "Kalima Author",
          photoURL: ""
        }
      };
      
      setInitialData(data);
    } else {
      // Default form data with current UI language
      setInitialData({
        slug: "",
        title: "",
        availableLanguages: [language],
        translations: {
          [language]: {
            title: "",
            summary: "",
            keywords: [],
            content: [{ 
              title: "Introduction", 
              paragraph: "", 
              references: [] 
            }]
          }
        },
        category: "general",
        subcategory: "other",
        draft: true,
        imageUrls: [],
        imageDescriptions: [],
        featured: false,
        popular: false,
        author: {
          uid: "system",
          displayName: "Kalima Author",
          photoURL: ""
        }
      });
    }
  }, [language]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {initialData ? (
          <>
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-100">
                {t("admin.createNewArticle")}
              </h1>
            </div>
            
            <ArticleEditor initialData={initialData} />
          </>
        ) : (
          <div className="flex items-center justify-center h-[50vh]">
            <p>{t("general.loading")}</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}