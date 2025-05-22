import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "wouter";
import { getArticles, getCategories, getStaticPages } from "@/lib/firebase";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FilePenLine,
  FolderTree,
  FileText,
  Lightbulb,
  PlusCircle,
  Languages,
  Archive,
  CheckCircle,
  BarChart
} from "lucide-react";

export default function Dashboard() {
  const { t } = useLanguage();
  const { user, userData } = useAuth();
  const [stats, setStats] = useState({
    articles: 0,
    publishedArticles: 0,
    draftArticles: 0,
    categories: 0,
    staticPages: 0,
    suggestions: 0,
    languageCount: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        // Fetch statistics concurrently
        const [articles, categories, staticPages] = await Promise.all([
          getArticles(),
          getCategories(),
          getStaticPages()
        ]);
        
        // Count languages across all articles
        const allLanguages = new Set<string>();
        articles.forEach(article => {
          article.availableLanguages.forEach(lang => allLanguages.add(lang));
        });
        
        // Count published vs. draft articles
        const publishedArticles = articles.filter(article => !article.draft).length;
        const draftArticles = articles.filter(article => article.draft).length;
        
        // Calculate suggestions count (if user data is available)
        const suggestionsCount = userData?.suggestedArticles?.length || 0;
        
        setStats({
          articles: articles.length,
          publishedArticles,
          draftArticles,
          categories: categories.length,
          staticPages: staticPages.length,
          suggestions: suggestionsCount,
          languageCount: allLanguages.size
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStats();
  }, [userData]);

  const adminSections = [
    {
      title: t("admin.articlesManagement"),
      description: t("admin.articlesManagementDescription"),
      icon: <FilePenLine className="h-6 w-6" />,
      stats: stats.articles,
      statLabel: t("admin.articlesTotal"),
      href: "/admin/articles",
      buttonText: t("admin.manageArticles"),
      createHref: "/admin/articles/create",
      createText: t("admin.createArticle")
    },
    {
      title: t("admin.categoriesManagement"),
      description: t("admin.categoriesManagementDescription"),
      icon: <FolderTree className="h-6 w-6" />,
      stats: stats.categories,
      statLabel: t("admin.categoriesTotal"),
      href: "/admin/categories",
      buttonText: t("admin.manageCategories")
    },
    {
      title: t("admin.staticPages"),
      description: t("admin.staticPagesDescription"),
      icon: <FileText className="h-6 w-6" />,
      stats: stats.staticPages,
      statLabel: t("admin.pagesTotal"),
      href: "/admin/static-pages",
      buttonText: t("admin.managePages")
    },
    {
      title: t("admin.suggestions"),
      description: t("admin.suggestionsDescription"),
      icon: <Lightbulb className="h-6 w-6" />,
      stats: stats.suggestions,
      statLabel: t("admin.suggestionsTotal"),
      href: "/admin/suggestions",
      buttonText: t("admin.manageSuggestions")
    }
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-100">
            {t("admin.dashboard")}
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 mt-2">
            {t("admin.welcomeMessage")} {user?.displayName || ""}
          </p>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                {t("admin.stats.totalArticles")}
              </CardTitle>
              <FilePenLine className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-8 w-12 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
              ) : (
                <div className="text-3xl font-bold">{stats.articles}</div>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                {t("admin.stats.articlesDescription")}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                {t("admin.stats.publishedArticles")}
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-8 w-12 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
              ) : (
                <div className="text-3xl font-bold">{stats.publishedArticles}</div>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                {t("admin.stats.publishedDescription")}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                {t("admin.stats.draftArticles")}
              </CardTitle>
              <Archive className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-8 w-12 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
              ) : (
                <div className="text-3xl font-bold">{stats.draftArticles}</div>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                {t("admin.stats.draftsDescription")}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                {t("admin.stats.languages")}
              </CardTitle>
              <Languages className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-8 w-12 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
              ) : (
                <div className="text-3xl font-bold">{stats.languageCount}</div>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                {t("admin.stats.languagesDescription")}
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Admin Content Management Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {adminSections.map((section) => (
            <Card key={section.title} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-center mb-2">
                  <div className="p-2 bg-primary/10 rounded-full text-primary mr-3">
                    {section.icon}
                  </div>
                  <CardTitle>{section.title}</CardTitle>
                </div>
                <CardDescription>{section.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <div className="text-3xl font-bold mr-2">
                    {isLoading ? (
                      <div className="w-12 h-10 bg-neutral-200 dark:bg-neutral-700 animate-pulse rounded" />
                    ) : (
                      section.stats
                    )}
                  </div>
                  <div className="text-neutral-500 dark:text-neutral-400">
                    {section.statLabel}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4">
                <Link href={section.href}>
                  <Button variant="outline">
                    {section.buttonText}
                  </Button>
                </Link>
                
                {section.createHref && (
                  <Link href={section.createHref}>
                    <Button>
                      <PlusCircle className="h-4 w-4 mr-2" />
                      {section.createText}
                    </Button>
                  </Link>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Quick Tips */}
        <Card>
          <CardHeader>
            <CardTitle>{t("admin.tips.title")}</CardTitle>
            <CardDescription>{t("admin.tips.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-2">
                <div className="p-1 bg-primary/10 rounded-full text-primary mt-0.5">
                  <BarChart className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-medium">{t("admin.tips.multilingualContent")}</h3>
                  <p className="text-sm text-muted-foreground">{t("admin.tips.multilingualDescription")}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="p-1 bg-primary/10 rounded-full text-primary mt-0.5">
                  <BarChart className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-medium">{t("admin.tips.drafts")}</h3>
                  <p className="text-sm text-muted-foreground">{t("admin.tips.draftsDescription")}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="p-1 bg-primary/10 rounded-full text-primary mt-0.5">
                  <BarChart className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-medium">{t("admin.tips.organization")}</h3>
                  <p className="text-sm text-muted-foreground">{t("admin.tips.organizationDescription")}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}