import { useState, useEffect } from "react";
import { Link } from "wouter";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AllArticlesPage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAllArticles = async () => {
      try {
        setLoading(true);
        
        // Direct Firestore query to get ALL articles
        const articlesRef = collection(db, "articles");
        const snapshot = await getDocs(articlesRef);
        
        console.log(`Found ${snapshot.size} articles in Firestore`);
        
        const allArticles = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setArticles(allArticles);
        
        // Log each article to console for debugging
        allArticles.forEach((article, index) => {
          console.log(`Article ${index + 1}:`, article.id, article.slug);
        });
      } catch (error) {
        console.error("Error fetching articles:", error);
        toast({
          title: "Error",
          description: "Failed to load articles from Firestore",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchAllArticles();
  }, [toast]);

  // Get title from any available language
  const getTitle = (article: any) => {
    if (!article.translations) return article.slug || "Untitled";
    
    const languages = Object.keys(article.translations);
    if (languages.length === 0) return article.slug || "Untitled";
    
    // Try to get first translation title
    const firstLang = languages[0];
    return article.translations[firstLang]?.title || article.slug || "Untitled";
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">All Articles</h1>
            <p className="text-muted-foreground">View and manage all articles in the database</p>
          </div>
          
          <Button asChild>
            <Link href="/admin/articles/create">
              <Plus className="mr-2 h-4 w-4" />
              Create New Article
            </Link>
          </Button>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <span className="ml-2">Loading articles...</span>
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-12 border rounded-lg bg-muted/20">
            <h3 className="text-lg font-medium">No Articles Found</h3>
            <p className="text-muted-foreground mt-1">Create your first article to get started</p>
            <Button asChild className="mt-4">
              <Link href="/admin/articles/create">Create Article</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <p className="text-sm text-muted-foreground">
              Showing all {articles.length} articles from Firestore
            </p>
            
            <div className="grid gap-4">
              {articles.map(article => (
                <div key={article.id} className="flex items-center justify-between p-4 border rounded-lg bg-card">
                  <div>
                    <h3 className="font-medium">{getTitle(article)}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-sm text-muted-foreground">
                        ID: {article.id}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        Slug: {article.slug || "none"}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        Category: {article.category || "none"}
                      </span>
                      {article.draft ? (
                        <span className="text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-500 px-2 py-1 rounded">
                          Draft
                        </span>
                      ) : (
                        <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500 px-2 py-1 rounded">
                          Published
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/articles/edit/${article.slug}`}>
                        <Pencil className="h-4 w-4 mr-1" />
                        Edit
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/article/${article.slug}`}>
                        View
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}