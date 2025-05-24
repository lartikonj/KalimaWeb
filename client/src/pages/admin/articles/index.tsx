import { useState, useEffect } from "react";
import { Link } from "wouter";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { deleteArticle } from "@/lib/firebase";
import { db } from "@/lib/firebase";
import { getDocs, collection, DocumentData, query, orderBy, limit } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  PenSquare, 
  Trash2, 
  Eye, 
  Search, 
  Plus, 
  FilterX,
  FileText 
} from "lucide-react";

export default function ArticlesPage() {
  const { t, language } = useLanguage();
  const [articles, setArticles] = useState<any[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [languageFilter, setLanguageFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  const [categories, setCategories] = useState<Set<string>>(new Set());

  // Get toast hook
  const { toast } = useToast();
  
  // Simple and direct approach to fetch all articles from Firestore
  useEffect(() => {
    const fetchAllArticles = async () => {
      setIsLoading(true);
      
      try {
        // Get all articles with a simple, direct query
        const queryRef = query(collection(db, "articles"), limit(100)); // Limit to 100 articles max
        const snapshot = await getDocs(queryRef);
        
        // Direct debugging output
        console.log(`Found ${snapshot.size} articles in Firestore database`);
        
        // Handle empty case
        if (snapshot.empty) {
          console.log("No articles found in database");
          setArticles([]);
          setFilteredArticles([]);
          setIsLoading(false);
          return;
        }
        
        // Convert Firestore documents to article objects and log each one
        const allArticles = snapshot.docs.map(doc => {
          const data = doc.data();
          console.log(`Article ID: ${doc.id}, Slug: ${data.slug || "no-slug"}`);
          return {
            id: doc.id,
            ...(data as any)
          };
        });
        
        // Simple display of first article for debugging
        if (allArticles.length > 0) {
          console.log("First article data:", JSON.stringify(allArticles[0], null, 2));
        }
        
        // Find all unique categories from articles
        const categories = new Set<string>();
        allArticles.forEach((article: any) => {
          if (article.category && typeof article.category === 'string') {
            categories.add(article.category);
          }
        });
        
        // Update state with all articles and categories
        setArticles(allArticles);
        setFilteredArticles(allArticles); // Show all by default
        setCategories(categories);
        
        console.log(`Loaded ${allArticles.length} articles and ${categories.size} categories`);
      } catch (error) {
        console.error("Error loading articles:", error);
        toast({
          title: "Error Loading Content",
          description: "There was a problem fetching your articles. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAllArticles();
  }, [toast]);

  // Apply filters
  useEffect(() => {
    let filtered = [...articles];
    
    // Debug what we're working with
    console.log("Current article count:", articles.length);
    console.log("First article sample:", articles[0]);
    
    // Apply search filter
    if (searchTerm) {
      const lowerCaseSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(article => {
        // Search through all translations
        if (!article.translations) return false;
        
        return Object.values(article.translations).some((translation: any) => {
          return (
            translation.title?.toLowerCase().includes(lowerCaseSearch) ||
            translation.summary?.toLowerCase().includes(lowerCaseSearch)
          );
        });
      });
    }
    
    // Apply category filter
    if (categoryFilter && categoryFilter !== "all") {
      filtered = filtered.filter(article => article.category === categoryFilter);
    }
    
    // Apply language filter
    if (languageFilter && languageFilter !== "all") {
      filtered = filtered.filter(article => 
        article.availableLanguages?.includes(languageFilter)
      );
    }
    
    // Apply status filter
    if (statusFilter && statusFilter !== "all") {
      const isDraft = statusFilter === "draft";
      filtered = filtered.filter(article => article.draft === isDraft);
    }
    
    console.log("Filtered articles count:", filtered.length);
    setFilteredArticles(filtered);
  }, [articles, searchTerm, categoryFilter, languageFilter, statusFilter]);

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm("");
    setCategoryFilter("all");
    setLanguageFilter("all");
    setStatusFilter("all");
  };

  // Delete article
  const handleDeleteArticle = async () => {
    if (!selectedArticle) return;
    
    try {
      await deleteArticle(selectedArticle.slug);
      
      setArticles(prev => prev.filter(a => a.id !== selectedArticle.id));
      toast({
        title: "Article Deleted",
        description: "The article was successfully deleted.",
      });
      
      setSelectedArticle(null);
    } catch (error) {
      console.error("Error deleting article:", error);
      toast({
        title: "Error",
        description: "There was an error deleting the article. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Format date
  const formatDate = (timestamp: any) => {
    if (!timestamp) return "-";
    
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString();
    } catch {
      return "-";
    }
  };

  // Simplified article title getter that always returns something displayable
  const getArticleTitle = (article: any) => {
    // If no article or it's invalid, return a default
    if (!article) {
      return "Untitled Article";
    }
    
    // If slug exists, use that as a fallback
    const slug = article.slug || "untitled";
    
    // Check for translations
    if (!article.translations) {
      return slug;
    }
    
    // Try current language
    if (article.translations[language]?.title) {
      return article.translations[language].title;
    }
    
    // Try English
    if (article.translations.en?.title) {
      return article.translations.en.title;
    }
    
    // Try first available language in translations
    const languages = Object.keys(article.translations);
    if (languages.length > 0) {
      const firstLang = languages[0];
      if (article.translations[firstLang]?.title) {
        return article.translations[firstLang].title;
      }
    }
    
    // Return slug if all else fails
    return slug;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">{t("admin.articles")}</h1>
            <p className="text-muted-foreground">Manage your articles</p>
          </div>
          
          <Button asChild>
            <Link href="/admin/articles/create">
              <Plus className="mr-2 h-4 w-4" />
              Create Article
            </Link>
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filter Articles</CardTitle>
            <CardDescription>Filter articles by category, language, or status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              
              {/* Filter controls */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Category filter */}
                <Select 
                  value={categoryFilter} 
                  onValueChange={setCategoryFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {Array.from(categories).map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {/* Language filter */}
                <Select 
                  value={languageFilter} 
                  onValueChange={setLanguageFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Languages</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="ar">العربية</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                  </SelectContent>
                </Select>
                
                {/* Status filter */}
                <Select 
                  value={statusFilter} 
                  onValueChange={setStatusFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
                
                {/* Reset filters */}
                <Button 
                  variant="outline" 
                  onClick={resetFilters}
                  className="gap-2"
                >
                  <FilterX className="h-4 w-4" />
                  Reset Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Articles Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableCaption>{`${filteredArticles.length} articles`}</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Languages</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6">
                      <div className="flex flex-col items-center gap-2">
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                        <span>Loading...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredArticles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex flex-col items-center gap-3">
                        <FileText className="h-10 w-10 text-muted-foreground" />
                        <p className="font-medium">
                          {(searchTerm || categoryFilter !== "all" || languageFilter !== "all" || statusFilter !== "all")
                            ? "No articles found"
                            : "No articles yet"}
                        </p>
                        {(searchTerm || categoryFilter !== "all" || languageFilter !== "all" || statusFilter !== "all") ? (
                          <p className="text-sm text-muted-foreground">
                            Try a different filter or search term
                          </p>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            Create your first article to get started
                          </p>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredArticles.map((article) => (
                    <TableRow key={article.id}>
                      <TableCell className="font-medium">{getArticleTitle(article)}</TableCell>
                      <TableCell>
                        {article.category || "-"}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {article.availableLanguages?.map((lang: string) => (
                            <Badge key={lang} variant="outline">
                              {lang.toUpperCase()}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        {article.draft ? (
                          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-500">
                            Draft
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500">
                            Published
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>{formatDate(article.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={article.category && article.subcategory 
                              ? `/categories/${article.category}/${article.subcategory}/${article.slug}` 
                              : `/article/${article.slug}`}>
                              <span className="sr-only">View</span>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/admin/articles/edit/${article.slug}`}>
                              <span className="sr-only">Edit</span>
                              <PenSquare className="h-4 w-4" />
                            </Link>
                          </Button>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => setSelectedArticle(article)}
                              >
                                <span className="sr-only">Delete</span>
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this article? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={handleDeleteArticle}
                                  className="bg-red-600 text-white hover:bg-red-700"
                                >
                                  Delete
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
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}