import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { getArticles, deleteArticle } from "@/lib/firebase";
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
import { Pencil, Trash2, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import type { FirestoreArticle } from "@/lib/firebase";

export default function AllArticles() {
  const [articles, setArticles] = useState<FirestoreArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const { toast } = useToast();
  const { language } = useLanguage();

  // Fetch all articles on component mount
  useEffect(() => {
    const fetchArticles = async () => {
      setIsLoading(true);
      try {
        const allArticles = await getArticles();
        console.log("Fetched articles:", allArticles);
        setArticles(allArticles);
      } catch (error) {
        console.error("Error fetching articles:", error);
        toast({
          title: "Error",
          description: "Failed to load articles. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, [toast]);

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

        {isLoading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center p-8 border rounded-lg">
            <p className="text-lg text-muted-foreground">No articles found</p>
            <Link href="/admin/articles/create">
              <Button variant="outline" className="mt-4">Create your first article</Button>
            </Link>
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
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
                {articles.map((article) => (
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