import { useState, useEffect } from "react";
import { Link } from "wouter";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Chart,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer 
} from "recharts";
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Settings,
  Languages,
  PenSquare,
  Archive,
  UserCheck,
  FilePlus2,
  FileQuestion
} from "lucide-react";
import { getArticles } from "@/lib/firebase";
import { Article } from "@/types";

export default function Dashboard() {
  const { t, language } = useLanguage();
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchArticles = async () => {
      setIsLoading(true);
      try {
        // Get all articles, including drafts
        const fetchedArticles = await getArticles();
        setArticles(fetchedArticles as Article[]);
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchArticles();
  }, []);
  
  // Count statistics
  const totalArticles = articles.length;
  const publishedArticles = articles.filter(article => !article.draft).length;
  const drafts = articles.filter(article => article.draft).length;
  
  // Count languages
  const languageCounts = articles.reduce((acc, article) => {
    article.availableLanguages.forEach(lang => {
      acc[lang] = (acc[lang] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);
  
  // Prepare language data for chart
  const languageData = Object.entries(languageCounts).map(([lang, count]) => ({
    language: lang.toUpperCase(),
    count
  }));
  
  // Dummy data for charts (in a real app, this would come from the backend)
  const monthlyArticlesData = [
    { name: "Jan", articles: 4 },
    { name: "Feb", articles: 3 },
    { name: "Mar", articles: 5 },
    { name: "Apr", articles: 7 },
    { name: "May", articles: 2 },
    { name: "Jun", articles: 6 },
    { name: "Jul", articles: 8 },
    { name: "Aug", articles: 9 },
    { name: "Sep", articles: 11 },
    { name: "Oct", articles: 13 },
    { name: "Nov", articles: 7 },
    { name: "Dec", articles: 9 },
  ];
  
  const categoryData = [
    { name: t("categories.language-learning"), articles: 15 },
    { name: t("categories.culture"), articles: 10 },
    { name: t("categories.science"), articles: 8 },
    { name: t("categories.stories"), articles: 6 },
    { name: t("categories.tips-lifestyle"), articles: 12 },
  ];
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-100">
          {t("admin.dashboard")}
        </h1>
        
        <Button asChild>
          <Link href="/admin/articles/create">
            <PenSquare className="mr-2 h-4 w-4" />
            {t("admin.createArticle")}
          </Link>
        </Button>
      </div>
      
      {/* Admin navigation tabs */}
      <Tabs defaultValue="overview" className="space-y-8">
        <TabsList className="grid grid-cols-4 md:w-[600px]">
          <TabsTrigger value="overview" className="flex items-center">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">{t("admin.overview")}</span>
          </TabsTrigger>
          <TabsTrigger value="articles" className="flex items-center" asChild>
            <Link href="/admin/articles">
              <FileText className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">{t("admin.articles")}</span>
            </Link>
          </TabsTrigger>
          <TabsTrigger value="suggestions" className="flex items-center" asChild>
            <Link href="/admin/suggestions">
              <FileQuestion className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">{t("admin.suggestions")}</span>
            </Link>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center">
            <Settings className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">{t("admin.settings")}</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">
                  {t("admin.stats.totalArticles")}
                </CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{totalArticles}</div>
                <p className="text-xs text-muted-foreground">
                  {t("admin.dashboard.articlesInSystem")}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">
                  {t("admin.stats.publishedArticles")}
                </CardTitle>
                <FilePlus2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{publishedArticles}</div>
                <p className="text-xs text-muted-foreground">
                  {t("admin.dashboard.visibleToUsers")}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">
                  {t("admin.stats.drafts")}
                </CardTitle>
                <Archive className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{drafts}</div>
                <p className="text-xs text-muted-foreground">
                  {t("admin.dashboard.pendingPublication")}
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
                <div className="text-3xl font-bold">{Object.keys(languageCounts).length}</div>
                <p className="text-xs text-muted-foreground">
                  {t("admin.dashboard.supportedLanguages")}
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>{t("admin.dashboard.monthlyArticles")}</CardTitle>
                <CardDescription>
                  {t("admin.dashboard.articlesByMonth")}
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={monthlyArticlesData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="articles" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      activeDot={{ r: 8 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>{t("admin.dashboard.articlesByCategory")}</CardTitle>
                <CardDescription>
                  {t("admin.dashboard.categoryDistribution")}
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={categoryData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" />
                    <Tooltip />
                    <Legend />
                    <Bar 
                      dataKey="articles" 
                      fill="hsl(var(--primary))" 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          
          {/* Language Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>{t("admin.dashboard.languageDistribution")}</CardTitle>
              <CardDescription>
                {t("admin.dashboard.articlesPerLanguage")}
              </CardDescription>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={languageData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="language" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar 
                    dataKey="count" 
                    name={t("admin.dashboard.articles")}
                    fill="hsl(var(--accent))" 
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>{t("admin.settings")}</CardTitle>
              <CardDescription>
                {t("admin.settingsDescription")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-8 text-muted-foreground">
                {t("admin.settingsPlaceholder")}
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
