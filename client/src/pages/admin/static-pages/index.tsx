import { useState, useEffect } from "react";
import { Link } from "wouter";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { getStaticPages, deleteStaticPage } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Eye, Calendar } from "lucide-react";

interface StaticPage {
  id: string;
  slug: string;
  availableLanguages: string[];
  translations: Record<string, {
    title: string;
    content: string;
    keywords?: string[];
  }>;
  updatedAt: any;
}

export default function StaticPages() {
  const [pages, setPages] = useState<StaticPage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPage, setSelectedPage] = useState<StaticPage | null>(null);
  const { toast } = useToast();
  const { language } = useLanguage();

  useEffect(() => {
    async function fetchPages() {
      setIsLoading(true);
      try {
        const fetchedPages = await getStaticPages();
        setPages(fetchedPages as StaticPage[]);
      } catch (error) {
        console.error("Error fetching static pages:", error);
        toast({
          title: "Error",
          description: "Failed to load static pages. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchPages();
  }, [toast]);

  const confirmDelete = (page: StaticPage) => {
    setSelectedPage(page);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedPage) return;

    try {
      await deleteStaticPage(selectedPage.id);
      setPages(pages.filter(page => page.id !== selectedPage.id));
      toast({
        title: "Success",
        description: "Static page deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting static page:", error);
      toast({
        title: "Error",
        description: "Failed to delete the static page. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setSelectedPage(null);
    }
  };

  const getPageTitle = (page: StaticPage) => {
    // Try to get title in current language
    if (page.translations[language]?.title) {
      return page.translations[language].title;
    }
    
    // Fallback to English
    if (page.translations.en?.title) {
      return page.translations.en.title;
    }
    
    // If no translation available, return the slug
    return page.slug;
  };

  // Format the date to a readable string
  const formatDate = (timestamp: any) => {
    if (!timestamp) return "N/A";
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Static Pages</h1>
          <Link href="/admin/static-pages/create">
            <Button>Create New Page</Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : pages.length === 0 ? (
          <div className="text-center p-8 border rounded-lg">
            <p className="text-lg text-muted-foreground">No static pages found</p>
            <Link href="/admin/static-pages/create">
              <Button variant="outline" className="mt-4">Create your first static page</Button>
            </Link>
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Languages</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pages.map((page) => (
                  <TableRow key={page.id}>
                    <TableCell className="font-medium">
                      {getPageTitle(page)}
                    </TableCell>
                    <TableCell>{page.slug}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {page.availableLanguages.map((lang) => (
                          <Badge key={lang} variant="outline">
                            {lang}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{formatDate(page.updatedAt)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Link href={`/page/${page.slug}`} target="_blank">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/admin/static-pages/edit/${page.id}`}>
                        <Button variant="ghost" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => confirmDelete(page)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                static page "{selectedPage && getPageTitle(selectedPage)}" and all
                its translations.
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
      </div>
    </AdminLayout>
  );
}