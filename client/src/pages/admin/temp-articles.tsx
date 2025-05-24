import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function TempArticlesView() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        
        // Simple direct Firestore query
        const articlesRef = collection(db, "articles");
        const snapshot = await getDocs(articlesRef);
        
        console.log(`Found ${snapshot.size} articles in Firestore`);
        
        if (snapshot.empty) {
          setArticles([]);
          return;
        }
        
        const loadedArticles: any[] = [];
        
        snapshot.forEach((doc) => {
          loadedArticles.push({
            id: doc.id,
            ...doc.data()
          });
        });
        
        console.log(`Loaded ${loadedArticles.length} articles`);
        setArticles(loadedArticles);
      } catch (err) {
        console.error("Error fetching articles:", err);
        setError("Failed to load articles from database");
      } finally {
        setLoading(false);
      }
    };
    
    fetchArticles();
  }, []);

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">All Articles (Simple View)</h1>
        
        <div className="mb-4">
          <Button asChild>
            <Link href="/admin/articles/create">Create New Article</Link>
          </Button>
        </div>
        
        {loading ? (
          <div className="py-10 text-center">Loading articles...</div>
        ) : error ? (
          <div className="py-10 text-center text-red-500">{error}</div>
        ) : articles.length === 0 ? (
          <div className="py-10 text-center">No articles found in database</div>
        ) : (
          <div className="space-y-6">
            <p>Found {articles.length} articles in database</p>
            
            <div className="grid gap-4 border rounded-lg p-4">
              {articles.map((article) => (
                <div key={article.id} className="border-b last:border-0 pb-4 last:pb-0">
                  <div className="font-bold">
                    {article.translations?.en?.title || article.slug || "Untitled"}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    ID: {article.id} | Slug: {article.slug || "none"} | Category: {article.category || "none"}
                  </div>
                  <div className="mt-2">
                    <Link href={`/admin/articles/edit/${article.slug}`}>
                      <a className="text-blue-500 hover:underline mr-4">Edit</a>
                    </Link>
                    <Link href={`/article/${article.slug}`}>
                      <a className="text-blue-500 hover:underline">View</a>
                    </Link>
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