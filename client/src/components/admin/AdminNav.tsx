import { useLocation, Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  FilePenLine,
  FolderTree,
  FileText,
  Lightbulb,
  LayoutDashboard
} from "lucide-react";

export function AdminNav() {
  const [location] = useLocation();
  const { t, language } = useLanguage();
  
  const navItems = [
    {
      label: t("admin.dashboard"),
      href: `/${language}/admin`,
      icon: <LayoutDashboard className="h-5 w-5" />
    },
    {
      label: t("admin.articlesManagement"),
      href: `/${language}/admin/articles`,
      icon: <FilePenLine className="h-5 w-5" />
    },
    {
      label: t("admin.categoriesManagement"),
      href: `/${language}/admin/categories`,
      icon: <FolderTree className="h-5 w-5" />
    },
    {
      label: t("admin.staticPages"),
      href: `/${language}/admin/static-pages`,
      icon: <FileText className="h-5 w-5" />
    },
    {
      label: t("admin.suggestions"),
      href: `/${language}/admin/suggestions`,
      icon: <Lightbulb className="h-5 w-5" />
    }
  ];

  return (
    <div className="space-y-1">
      {navItems.map((item) => {
        const isActive = location === item.href || 
                         (item.href !== "/admin" && location.startsWith(item.href));
        
        return (
          <Link key={item.href} href={item.href}>
            <a
              className={`flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                isActive
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-neutral-600 hover:text-primary hover:bg-primary/5 dark:text-neutral-300 dark:hover:text-primary-light"
              }`}
            >
              <div className={`mr-2 ${isActive ? "text-primary" : ""}`}>
                {item.icon}
              </div>
              {item.label}
            </a>
          </Link>
        );
      })}
    </div>
  );
}