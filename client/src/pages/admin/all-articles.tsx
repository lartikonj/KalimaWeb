import { useState, useEffect, useMemo } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { getArticles, deleteArticle, getCategories } from "@/lib/firebase";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pencil, Trash2, Eye, Filter, Search, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import type { FirestoreArticle } from "@/lib/firebase";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function AllArticles() {
  const [articles, setArticles] = useState<FirestoreArticle[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<FirestoreArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const { language } = useLanguage();
  
  // Available subcategories based on selected category
  const availableSubcategories = useMemo(() => {
    if (!selectedCategory) return [];
    const category = categories.find(cat => cat.slug === selectedCategory);
    return category?.subcategories || [];
  }, [categories, selectedCategory]);

  // Fetch all articles and categories on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch articles and categories in parallel
        const [allArticles, allCategories] = await Promise.all([
          getArticles(),
          getCategories()
        ]);
        
        console.log("Fetched articles:", allArticles);
        setArticles(allArticles);
        setFilteredArticles(allArticles);
        setCategories(allCategories);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to load content. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]);
  
  // Filter articles when category, subcategory, or search term changes
  useEffect(() => {
    if (articles.length === 0) return;
    
    let filtered = [...articles];
    
    // Filter by category if selected
    if (selectedCategory && selectedCategory !== "all") {
      filtered = filtered.filter(article => article.category === selectedCategory);
    }
    
    // Filter by subcategory if selected
    if (selectedSubcategory && selectedSubcategory !== "all") {
      filtered = filtered.filter(article => article.subcategory === selectedSubcategory);
    }
    
    // Filter by search term if provided
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(article => {
        // Search in title, in any language
        const titleMatch = Object.values(article.translations || {}).some(
          trans => trans.title?.toLowerCase().includes(term)
        );
        
        // Search in summary, in any language
        const summaryMatch = Object.values(article.translations || {}).some(
          trans => trans.summary?.toLowerCase().includes(term)
        );
        
        // Search in slug
        const slugMatch = article.slug?.toLowerCase().includes(term);
        
        return titleMatch || summaryMatch || slugMatch;
      });
    }
    
    setFilteredArticles(filtered);
  }, [articles, selectedCategory, selectedSubcategory, searchTerm]);

  const confirmDelete = (article) => {
    setSelectedArticle(article);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedArticle) return;
    
    try {
      await deleteArticle(selectedArticle.slug);
      setArticles((prev) => prev.filter((a) => a.id !== selectedArticle.id));
      toast({
        title: "Success",
        description: "Article deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting article:", error);
      toast({
        title: "Error",
        description: "Failed to delete article. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setSelectedArticle(null);
    }
  };

  const getArticleTitle = (article) => {
    // Try to get title in current language, fall back to English, then to slug
    if (article.translations && article.translations[language]?.title) {
      return article.translations[language].title;
    } else if (article.translations && article.translations.en?.title) {
      return article.translations.en.title;
    } else {
      return article.slug || "Untitled";
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">All Articles</h1>
          <Link href="/admin/articles/create">
            <Button>Create New Article</Button>
          </Link>
        </div>
        
        {/* Filtering Controls */}
        <div className="border rounded-lg p-4 space-y-4">
          <h2 className="text-lg font-medium flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter Articles
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search articles..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-0 top-0 h-full"
                  onClick={() => setSearchTerm("")}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            {/* Category Select */}
            <Select 
              value={selectedCategory} 
              onValueChange={(value) => {
                setSelectedCategory(value);
                setSelectedSubcategory(""); // Reset subcategory when category changes
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.slug} value={category.slug}>
                    {category.titles?.en || category.slug}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {/* Subcategory Select */}
            <Select 
              value={selectedSubcategory} 
              onValueChange={setSelectedSubcategory}
              disabled={!selectedCategory || availableSubcategories.length === 0}
            >
              <SelectTrigger>
                <SelectValue placeholder={selectedCategory ? "All Subcategories" : "Select a category first"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subcategories</SelectItem>
                {availableSubcategories.map((subcategory) => (
                  <SelectItem key={subcategory.slug} value={subcategory.slug}>
                    {subcategory.titles?.en || subcategory.slug}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Active Filters */}
          {((selectedCategory && selectedCategory !== "all") || (selectedSubcategory && selectedSubcategory !== "all") || searchTerm) && (
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedCategory && selectedCategory !== "all" && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Category: {categories.find(c => c.slug === selectedCategory)?.titles?.en || selectedCategory}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-4 w-4 ml-1 p-0" 
                    onClick={() => {
                      setSelectedCategory("all");
                      setSelectedSubcategory("all");
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
              
              {selectedSubcategory && selectedSubcategory !== "all" && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Subcategory: {availableSubcategories.find(s => s.slug === selectedSubcategory)?.titles?.en || selectedSubcategory}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-4 w-4 ml-1 p-0" 
                    onClick={() => setSelectedSubcategory("all")}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
              
              {searchTerm && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Search: {searchTerm}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-4 w-4 ml-1 p-0" 
                    onClick={() => setSearchTerm("")}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs" 
                onClick={() => {
                  setSelectedCategory("all");
                  setSelectedSubcategory("all");
                  setSearchTerm("");
                }}
              >
                Clear All
              </Button>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="text-center p-8 border rounded-lg">
            {articles.length > 0 ? (
              <>
                <p className="text-lg text-muted-foreground">No articles match your filters</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => {
                    setSelectedCategory("");
                    setSelectedSubcategory("");
                    setSearchTerm("");
                  }}
                >
                  Clear Filters
                </Button>
              </>
            ) : (
              <>
                <p className="text-lg text-muted-foreground">No articles found</p>
                <Link href="/admin/articles/create">
                  <Button variant="outline" className="mt-4">Create your first article</Button>
                </Link>
              </>
            )}
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <div className="p-3 bg-muted/50 border-b">
              <p className="text-sm text-muted-foreground">
                Showing {filteredArticles.length} of {articles.length} total articles
              </p>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category / Subcategory</TableHead>
                  <TableHead>Languages</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredArticles.map((article) => (
                  <TableRow key={article.id}>
                    <TableCell className="font-medium">
                      {getArticleTitle(article)}
                    </TableCell>
                    <TableCell>
                      {article.category || "—"} 
                      {article.subcategory ? ` / ${article.subcategory}` : ""}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {article.availableLanguages?.map((lang) => (
                          <span
                            key={lang}
                            className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full"
                          >
                            {lang}
                          </span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-0.5 text-xs rounded-full ${
                          article.draft
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200"
                            : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200"
                        }`}
                      >
                        {article.draft ? "Draft" : "Published"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/article/${article.slug}`}>
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/admin/articles/edit/${article.slug}`}>
                          <Button variant="ghost" size="icon">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => confirmDelete(article)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              article and all its translations.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}