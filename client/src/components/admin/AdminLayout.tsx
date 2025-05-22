import React from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  LayoutDashboard, 
  FileText, 
  FolderTree, 
  FileQuestion,
  ScrollText,
  LogOut
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [location] = useLocation();
  const { t } = useLanguage();

  const navigation = [
    { 
      name: "dashboard", 
      href: "/admin", 
      icon: LayoutDashboard,
      current: location === "/admin"
    },
    { 
      name: "articles", 
      href: "/admin/articles", 
      icon: FileText,
      current: location.startsWith("/admin/articles")
    },
    { 
      name: "categories", 
      href: "/admin/categories", 
      icon: FolderTree,
      current: location.startsWith("/admin/categories")
    },
    { 
      name: "pages", 
      href: "/admin/pages", 
      icon: ScrollText,
      current: location.startsWith("/admin/pages")
    },
    { 
      name: "suggestions", 
      href: "/admin/suggestions", 
      icon: FileQuestion,
      current: location.startsWith("/admin/suggestions")
    }
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-neutral-900">
      {/* Sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 border-r border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-800">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4">
                <Link href="/" className="text-xl font-bold text-primary-600 dark:text-primary-400">
                  Kalima Admin
                </Link>
              </div>
              <nav className="mt-5 flex-1 px-2 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      item.current
                        ? "bg-gray-100 dark:bg-neutral-700 text-primary-600 dark:text-primary-400"
                        : "text-gray-600 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-neutral-700 hover:text-gray-900 dark:hover:text-neutral-100",
                      "group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                    )}
                  >
                    <item.icon
                      className={cn(
                        item.current
                          ? "text-primary-500 dark:text-primary-400"
                          : "text-gray-400 dark:text-neutral-400 group-hover:text-gray-500 dark:group-hover:text-neutral-300",
                        "mr-3 flex-shrink-0 h-6 w-6"
                      )}
                      aria-hidden="true"
                    />
                    {t(`admin.${item.name}`)}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-gray-200 dark:border-neutral-700 p-4">
              <Link href="/" className="flex-shrink-0 w-full group block">
                <div className="flex items-center">
                  <div>
                    <LogOut className="h-5 w-5 text-gray-400 dark:text-neutral-400 group-hover:text-gray-500 dark:group-hover:text-neutral-300" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-700 dark:text-neutral-300 group-hover:text-gray-900 dark:group-hover:text-neutral-100">
                      {t("admin.backToSite")}
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}