import { useState, useEffect } from "react";
import { Link } from "wouter";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { getArticles, deleteArticle } from "@/lib/firebase";
import { 
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

export default function ArticlesAdmin() {
  const { t, language } = useLanguage();
  const [articles, setArticles] = useState<any[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [languageFilter, setLanguageFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
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
          Object.values(article.translations).forEach((translation: any) => {
            if (translation.category) {
              uniqueCategories.add(translation.category);
            }
          });
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
        // Search in translations for title and summary
        return Object.values(article.translations).some((translation: any) => {
          return (
            translation.title?.toLowerCase().includes(lowerSearchTerm) ||
            translation.summary?.toLowerCase().includes(lowerSearchTerm)
          );
        });
      });
    }
    
    // Apply category filter
    if (categoryFilter) {
      result = result.filter(article => {
        return Object.values(article.translations).some((translation: any) => {
          return translation.category === categoryFilter;
        });
      });
    }
    
    // Apply language filter
    if (languageFilter) {
      result = result.filter(article => {
        return article.availableLanguages.includes(languageFilter);
      });
    }
    
    // Apply status filter
    if (statusFilter === "published") {
      result = result.filter(article => !article.draft);
    } else if (statusFilter === "draft") {
      result = result.filter(article => article.draft);
    }
    
    setFilteredArticles(result);
  }, [articles, searchTerm, categoryFilter, languageFilter, statusFilter]);

  const resetFilters = () => {
    setSearchTerm("");
    setCategoryFilter("");
    setLanguageFilter("");
    setStatusFilter("");
  };

  const confirmDeleteArticle = (article: any) => {
    setArticleToDelete(article);
  };

  const handleDeleteArticle = async () => {
    if (!articleToDelete) return;
    
    try {
      await deleteArticle(articleToDelete.slug);
      
      // Update the articles list
      setArticles(prevArticles => 
        prevArticles.filter(article => article.slug !== articleToDelete.slug)
      );
      
      toast({
        title: t("admin.articleDeleted"),
        description: t("admin.articleDeletedDescription"),
      });
    } catch (error) {
      console.error("Error deleting article:", error);
      toast({
        title: t("admin.error"),
        description: t("admin.errorDeletingArticle"),
        variant: "destructive"
      });
    } finally {
      setArticleToDelete(null);
    }
  };

  const getArticleTitle = (article: any) => {
    // Try to get the title in the current language first
    if (article.translations[language]?.title) {
      return article.translations[language].title;
    }
    
    // Otherwise, try English
    if (article.translations.en?.title) {
      return article.translations.en.title;
    }
    
    // Otherwise, get the first available language
    const firstLang = article.availableLanguages[0];
    return article.translations[firstLang]?.title || t("admin.untitled");
  };

  const getArticleCategory = (article: any) => {
    // Try to get the category in the current language first
    if (article.translations[language]?.category) {
      return article.translations[language].category;
    }
    
    // Otherwise, try English
    if (article.translations.en?.category) {
      return article.translations.en.category;
    }
    
    // Otherwise, get the first available language
    const firstLang = article.availableLanguages[0];
    return article.translations[firstLang]?.category || "";
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "-";
    
    const date = timestamp.toDate();
    return new Intl.DateTimeFormat(language, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-100">
            {t("admin.articles")}
          </h1>
          
          <Button asChild>
            <Link href="/admin/articles/create">
              <Plus className="mr-2 h-4 w-4" />
              {t("admin.createArticle")}
            </Link>
          </Button>
        </div>
        
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("admin.searchArticles")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          
          <div className="w-full md:w-48">
            <Select value={categoryFilter} onValueChange={(value) => setCategoryFilter(value)}>
              <SelectTrigger>
                <SelectValue placeholder={t("admin.filterByCategory")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">
                  {t("admin.allCategories")}
                </SelectItem>
                {Array.from(categories).map((category) => (
                  <SelectItem key={category} value={category}>
                    {t(`categories.${category}`)}
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
                <SelectItem value="">
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
                <SelectItem value="">
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
        
        {/* Articles Table */}
        <div className="border rounded-md">
          <Table>
            <TableCaption>{t("admin.managingTotalArticles")}</TableCaption>
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
                  <TableCell colSpan={6} className="h-24 text-center">
                    {t("admin.loading")}
                  </TableCell>
                </TableRow>
              ) : filteredArticles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    {t("admin.noArticlesFound")}
                  </TableCell>
                </TableRow>
              ) : (
                filteredArticles.map((article) => (
                  <TableRow key={article.slug}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{getArticleTitle(article)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getArticleCategory(article) ? (
                        t(`categories.${getArticleCategory(article)}`)
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {article.availableLanguages.map((lang: string) => (
                          <Badge key={lang} variant="secondary" className="text-xs">
                            {lang.toUpperCase()}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      {article.draft ? (
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                          {t("admin.draft")}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          {t("admin.published")}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>{formatDate(article.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          asChild
                        >
                          <Link href={`/article/${article.slug}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          asChild
                        >
                          <Link href={`/admin/articles/edit/${article.slug}`}>
                            <PenSquare className="h-4 w-4" />
                          </Link>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => confirmDeleteArticle(article)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>{t("admin.confirmDelete")}</AlertDialogTitle>
                              <AlertDialogDescription>
                                {t("admin.deleteArticleConfirmation")}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>{t("admin.cancel")}</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-500 hover:bg-red-600"
                                onClick={handleDeleteArticle}
                              >
                                {t("admin.delete")}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
}