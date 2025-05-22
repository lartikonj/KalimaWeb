import { ReactNode } from "react";
import { AdminNav } from "./AdminNav";
import { useLanguage } from "@/contexts/LanguageContext";
import { Separator } from "@/components/ui/separator";

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { t } = useLanguage();
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="grid grid-cols-1 md:grid-cols-[250px_minmax(0,1fr)] gap-8">
        <div className="hidden md:block space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-2 text-neutral-800 dark:text-neutral-200">
              {t("admin.adminPanel")}
            </h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              {t("admin.manageYourContent")}
            </p>
          </div>
          
          <Separator />
          
          <AdminNav />
        </div>
        
        <div>
          {/* Mobile Admin Nav (for smaller screens) */}
          <div className="mb-6 md:hidden">
            <h2 className="text-lg font-semibold mb-2 text-neutral-800 dark:text-neutral-200">
              {t("admin.adminPanel")}
            </h2>
            <Separator className="my-2" />
            <AdminNav />
            <Separator className="my-2" />
          </div>
          
          {/* Main Content */}
          <div className="space-y-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}