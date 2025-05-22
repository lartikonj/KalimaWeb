import { useState, useEffect } from "react";
import { Link } from "wouter";
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow,
  TableCaption
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import { 
  FileText, 
  PenSquare, 
  Trash2, 
  Plus, 
  Eye, 
  Search,
  FilterX
} from "lucide-react";
import { useLanguage, Language } from "@/contexts/LanguageContext";
import { getArticles, deleteArticle } from "@/lib/firebase";
import { AdminLayout } from "@/components/admin/AdminLayout";

export default function ArticlesAdmin() {
  const { t, language } = useLanguage();
  const [articles, setArticles] = useState<any[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [languageFilter, setLanguageFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categories, setCategories] = useState<Set<string>>(new Set());
  const [articleToDelete, setArticleToDelete] = useState<any>(null);

  // Fetch all articles
  useEffect(() => {
    const fetchArticles = async () => {
      setIsLoading(true);
      try {
        const fetchedArticles = await getArticles();
        setArticles(fetchedArticles);
        setFilteredArticles(fetchedArticles);
        
        // Extract unique categories
        const uniqueCategories = new Set<string>();
        fetchedArticles.forEach((article: any) => {
          if (article.category) {
            uniqueCategories.add(article.category);
          }
        });
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Error fetching articles:", error);
        toast({
          title: t("admin.error"),
          description: t("admin.errorFetchingArticles"),
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchArticles();
  }, [t]);

  // Filter articles when filters change
  useEffect(() => {
    let result = [...articles];
    
    // Apply search term filter
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      result = result.filter(article => {
        // Search in translations
        const hasMatch = Object.values(article.translations || {}).some((translation: any) => {
          return translation.title?.toLowerCase().includes(lowerSearchTerm) || 
                 translation.summary?.toLowerCase().includes(lowerSearchTerm);
        });
        return hasMatch;
      });
    }
    
    // Apply category filter
    if (categoryFilter && categoryFilter !== 'all') {
      result = result.filter(article => article.category === categoryFilter);
    }
    
    // Apply language filter
    if (languageFilter && languageFilter !== 'all') {
      result = result.filter(article => 
        article.availableLanguages && article.availableLanguages.includes(languageFilter)
      );
    }
    
    // Apply status filter
    if (statusFilter && statusFilter !== 'all') {
      const isDraft = statusFilter === 'draft';
      result = result.filter(article => article.draft === isDraft);
    }
    
    setFilteredArticles(result);
  }, [searchTerm, categoryFilter, languageFilter, statusFilter, articles]);

  // Handle article deletion
  const handleDeleteArticle = async () => {
    if (!articleToDelete) return;
    
    try {
      await deleteArticle(articleToDelete.slug);
      
      // Update local state
      const updatedArticles = articles.filter(a => a.id !== articleToDelete.id);
      setArticles(updatedArticles);
      setFilteredArticles(updatedArticles);
      
      toast({
        title: t("admin.articleDeleted"),
        description: t("admin.articleDeletedDescription"),
      });
      
      setArticleToDelete(null);
    } catch (error) {
      console.error("Error deleting article:", error);
      toast({
        title: t("admin.error"),
        description: t("admin.errorDeletingArticle"),
        variant: "destructive"
      });
    }
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm("");
    setCategoryFilter("all");
    setLanguageFilter("all");
    setStatusFilter("all");
  };

  // Get the article title in the current language or fallback
  const getArticleTitle = (article: any) => {
    if (!article.translations) return "Untitled";
    
    // Try current language, then English, then first available
    const translation = 
      article.translations[language] || 
      article.translations.en || 
      article.translations[Object.keys(article.translations)[0]];
    
    return translation?.title || "Untitled";
  };

  // Format date
  const formatDate = (timestamp: any) => {
    if (!timestamp) return "-";
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">{t("admin.articles")}</h1>
            <p className="text-muted-foreground">{t("admin.articlesDescription")}</p>
          </div>
          <Button asChild>
            <Link href="/admin/articles/create">
              <Plus className="mr-2 h-4 w-4" />
              {t("admin.createArticle")}
            </Link>
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>{t("admin.filterArticles")}</CardTitle>
            <CardDescription>{t("admin.filterArticlesDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="relative w-full md:w-auto md:flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t("admin.searchArticles")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-48">
                <Select value={categoryFilter} onValueChange={(value) => setCategoryFilter(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("admin.filterByCategory")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      {t("admin.allCategories")}
                    </SelectItem>
                    {Array.from(categories).map((category) => (
                      <SelectItem key={category} value={category}>
                        {t(`categories.${category}`, { defaultValue: category })}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-full md:w-40">
                <Select value={languageFilter} onValueChange={(value) => setLanguageFilter(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("admin.filterByLanguage")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      {t("admin.allLanguages")}
                    </SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                    <SelectItem value="ar">العربية</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-full md:w-40">
                <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("admin.filterByStatus")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      {t("admin.allStatuses")}
                    </SelectItem>
                    <SelectItem value="published">
                      {t("admin.published")}
                    </SelectItem>
                    <SelectItem value="draft">
                      {t("admin.draft")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button variant="outline" onClick={resetFilters} className="gap-2">
                <FilterX className="h-4 w-4" />
                {t("admin.resetFilters")}
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Articles Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableCaption>{t("admin.articleCount", { count: filteredArticles.length })}</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("admin.title")}</TableHead>
                  <TableHead>{t("admin.category")}</TableHead>
                  <TableHead>{t("admin.languages")}</TableHead>
                  <TableHead>{t("admin.status")}</TableHead>
                  <TableHead>{t("admin.dateCreated")}</TableHead>
                  <TableHead className="text-right">{t("admin.actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6">
                      <div className="flex flex-col items-center gap-2">
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                        <span>{t("admin.loading")}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredArticles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex flex-col items-center gap-3">
                        <FileText className="h-10 w-10 text-muted-foreground" />
                        <p className="font-medium">{t("admin.noArticlesFound")}</p>
                        <p className="text-sm text-muted-foreground">
                          {searchTerm || categoryFilter !== "all" || languageFilter !== "all" || statusFilter !== "all" 
                            ? t("admin.noArticlesWithFilters") 
                            : t("admin.noArticlesYet")}
                        </p>
                        {searchTerm || categoryFilter !== "all" || languageFilter !== "all" || statusFilter !== "all" ? (
                          <Button variant="outline" size="sm" onClick={resetFilters}>
                            {t("admin.resetFilters")}
                          </Button>
                        ) : (
                          <Button asChild size="sm">
                            <Link href="/admin/articles/create">
                              <Plus className="mr-2 h-4 w-4" />
                              {t("admin.createArticle")}
                            </Link>
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredArticles.map((article) => (
                    <TableRow key={article.id}>
                      <TableCell className="font-medium">
                        {getArticleTitle(article)}
                      </TableCell>
                      <TableCell>
                        {article.category ? t(`categories.${article.category}`, { defaultValue: article.category }) : "-"}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {article.availableLanguages?.map((lang: string) => (
                            <Badge key={lang} variant="outline" className="text-xs">
                              {lang.toUpperCase()}
                            </Badge>
                          )) || "-"}
                        </div>
                      </TableCell>
                      <TableCell>
                        {article.draft ? (
                          <Badge variant="outline" className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-500">
                            {t("admin.draft")}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-500">
                            {t("admin.published")}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>{formatDate(article.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <span className="sr-only">{t("admin.openMenu")}</span>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>{t("admin.actions")}</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <DropdownMenuItem
                                    className="text-red-600 dark:text-red-400 cursor-pointer"
                                    onSelect={(e) => {
                                      e.preventDefault();
                                      setArticleToDelete(article);
                                    }}
                                  >
                                    {t("admin.delete")}
                                  </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>{t("admin.confirmDelete")}</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      {t("admin.deleteArticleConfirmText")}
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>{t("admin.cancel")}</AlertDialogCancel>
                                    <AlertDialogAction
                                      className="bg-red-600 text-white hover:bg-red-700"
                                      onClick={handleDeleteArticle}
                                    >
                                      {t("admin.delete")}
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </DropdownMenuContent>
                          </DropdownMenu>
                          
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" asChild>
                            <Link href={`/article/${article.slug}`}>
                              <span className="sr-only">{t("admin.view")}</span>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" asChild>
                            <Link href={`/admin/articles/edit/${article.slug}`}>
                              <span className="sr-only">{t("admin.edit")}</span>
                              <PenSquare className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}