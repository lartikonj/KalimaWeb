import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
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
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  PenSquare, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye, 
  Search,
  FileText,
  Filter
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getArticles } from "@/lib/firebase";
import { Article } from "@/types";
import { Language } from "@/contexts/LanguageContext";
import categories from "@/data/categories";

export default function AdminArticles() {
  const { t, language } = useLanguage();
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLanguage, setSelectedLanguage] = useState<Language | "">("");
  const [showDrafts, setShowDrafts] = useState<boolean | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState<Article | null>(null);
  
  useEffect(() => {
    const fetchArticles = async () => {
      setIsLoading(true);
      try {
        // Get all articles including drafts
        const fetchedArticles = await getArticles();
        
        // Sort by creation date (newest first)
        const sortedArticles = fetchedArticles.sort((a, b) => {
          const dateA = a.createdAt?.toDate?.() ? a.createdAt.toDate().getTime() : 0;
          const dateB = b.createdAt?.toDate?.() ? b.createdAt.toDate().getTime() : 0;
          return dateB - dateA;
        });
        
        setArticles(sortedArticles as Article[]);
        setFilteredArticles(sortedArticles as Article[]);
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchArticles();
  }, []);
  
  // Apply filters when search term, category, language, or draft status changes
  useEffect(() => {
    let filtered = [...articles];
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(article => {
        // Check if any translation contains the search term
        return Object.values(article.translations).some(
          translation => 
            translation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            translation.summary.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }
    
    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(article => {
        // Check if any translation has the selected category
        return Object.values(article.translations).some(
          translation => translation.category === selectedCategory
        );
      });
    }
    
    // Filter by language
    if (selectedLanguage) {
      filtered = filtered.filter(article => 
        article.availableLanguages.includes(selectedLanguage)
      );
    }
    
    // Filter by draft status
    if (showDrafts !== null) {
      filtered = filtered.filter(article => article.draft === showDrafts);
    }
    
    setFilteredArticles(filtered);
  }, [searchTerm, selectedCategory, selectedLanguage, showDrafts, articles]);
  
  // Handle delete confirmation
  const confirmDelete = (article: Article) => {
    setArticleToDelete(article);
    setShowDeleteDialog(true);
  };
  
  // Format date
  const formatDate = (timestamp: any) => {
    if (!timestamp) return "-";
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString(language === "en" ? "en-US" : 
      language === "fr" ? "fr-FR" : 
      language === "es" ? "es-ES" : 
      language === "de" ? "de-DE" : 
      "ar-SA");
  };
  
  // Get article title based on current language
  const getArticleTitle = (article: Article) => {
    const translation = 
      article.translations[language] || 
      article.translations["en"] || 
      article.translations[article.availableLanguages[0]];
    
    return translation ? translation.title : "Untitled";
  };
  
  // Get article category based on current language
  const getArticleCategory = (article: Article) => {
    const translation = 
      article.translations[language] || 
      article.translations["en"] || 
      article.translations[article.availableLanguages[0]];
    
    return translation ? translation.category : "";
  };
  
  // Clear filters
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedLanguage("");
    setShowDrafts(null);
  };
  
  // Dummy delete function (in a real app, this would call the backend)
  const handleDeleteArticle = () => {
    // In a real app, this would call the API to delete the article
    console.log("Deleting article:", articleToDelete?.id);
    
    // For now, just remove it from the local state
    if (articleToDelete) {
      const updatedArticles = articles.filter(a => a.id !== articleToDelete.id);
      setArticles(updatedArticles);
      setFilteredArticles(updatedArticles);
    }
    
    // Close the dialog
    setShowDeleteDialog(false);
    setArticleToDelete(null);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-100">
          {t("admin.articles")}
        </h1>
        
        <Button asChild>
          <Link href="/admin/articles/create">
            <PenSquare className="mr-2 h-4 w-4" />
            {t("admin.createArticle")}
          </Link>
        </Button>
      </div>
      
      {/* Filters */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <Filter className="mr-2 h-4 w-4" />
            {t("admin.filter")}
          </CardTitle>
          <CardDescription>
            {t("admin.filterDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("admin.searchPlaceholder")}
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Category filter */}
            <Select 
              value={selectedCategory} 
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("admin.filterByCategory")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {t("admin.allCategories")}
                </SelectItem>
                {categories.map(category => (
                  <SelectItem key={category.slug} value={category.slug}>
                    {t(`categories.${category.slug}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {/* Language filter */}
            <Select 
              value={selectedLanguage} 
              onValueChange={(value) => setSelectedLanguage(value as Language | "")}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("admin.filterByLanguage")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">
                  {t("admin.allLanguages")}
                </SelectItem>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="ar">العربية</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="es">Español</SelectItem>
                <SelectItem value="de">Deutsch</SelectItem>
              </SelectContent>
            </Select>
            
            {/* Draft status filter */}
            <Select 
              value={showDrafts === null ? "" : showDrafts ? "draft" : "published"} 
              onValueChange={(value) => {
                if (value === "") {
                  setShowDrafts(null);
                } else {
                  setShowDrafts(value === "draft");
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("admin.filterByStatus")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">
                  {t("admin.allStatus")}
                </SelectItem>
                <SelectItem value="published">
                  {t("admin.publishedOnly")}
                </SelectItem>
                <SelectItem value="draft">
                  {t("admin.draftsOnly")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="mt-4 flex justify-end">
            <Button variant="outline" size="sm" onClick={clearFilters}>
              {t("admin.clearFilters")}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Articles table */}
      <Card>
        <CardContent className="p-0">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("admin.article.title")}</TableHead>
                  <TableHead>{t("admin.article.category")}</TableHead>
                  <TableHead>{t("admin.article.slug")}</TableHead>
                  <TableHead>{t("admin.article.languages")}</TableHead>
                  <TableHead>{t("admin.article.status")}</TableHead>
                  <TableHead>{t("admin.article.created")}</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">
                      {t("general.loading")}
                    </TableCell>
                  </TableRow>
                ) : filteredArticles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">
                      <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                      <p>{t("admin.noArticlesFound")}</p>
                      <p className="text-sm text-muted-foreground">{t("admin.tryAdjustingFilters")}</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredArticles.map((article) => (
                    <TableRow key={article.id}>
                      <TableCell className="font-medium">
                        {getArticleTitle(article)}
                      </TableCell>
                      <TableCell>
                        {t(`categories.${getArticleCategory(article)}`)}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {article.slug}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {article.availableLanguages.map(lang => (
                            <Badge 
                              key={lang} 
                              variant="outline" 
                              className="text-xs"
                            >
                              {lang.toUpperCase()}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        {article.draft ? (
                          <Badge variant="outline" className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400">
                            {t("admin.draft")}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">
                            {t("admin.published")}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {formatDate(article.createdAt)}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>{t("admin.actions")}</DropdownMenuLabel>
                            <DropdownMenuItem asChild>
                              <Link href={`/article/${article.slug}`} className="flex items-center">
                                <Eye className="mr-2 h-4 w-4" />
                                {t("admin.view")}
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/articles/edit/${article.slug}`} className="flex items-center">
                                <Edit className="mr-2 h-4 w-4" />
                                {t("admin.edit")}
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={() => confirmDelete(article)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              {t("admin.delete")}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      {/* Delete confirmation dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("admin.deleteArticle")}</DialogTitle>
            <DialogDescription>
              {t("admin.deleteArticleConfirmation")}
            </DialogDescription>
          </DialogHeader>
          <p className="py-4">
            <span className="font-medium">{articleToDelete ? getArticleTitle(articleToDelete) : ""}</span>
          </p>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowDeleteDialog(false)}
            >
              {t("general.cancel")}
            </Button>
            <Button 
              variant="destructive"
              onClick={handleDeleteArticle}
            >
              {t("general.delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
