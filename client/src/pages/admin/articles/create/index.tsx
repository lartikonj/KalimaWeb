import { AdminLayout } from "@/components/admin/AdminLayout";
import { ArticleEditor } from "@/components/admin/ArticleEditor";
import { useLanguage } from "@/contexts/LanguageContext";

export default function CreateArticle() {
  const { t } = useLanguage();
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-100">
            {t("admin.createNewArticle")}
          </h1>
        </div>
        
        <ArticleEditor />
      </div>
    </AdminLayout>
  );
}