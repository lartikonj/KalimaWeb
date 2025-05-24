import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { getArticles } from "@/lib/firebase";
import { Link } from "wouter";

export default function SearchPage() {
  const [, setLocation] = useLocation();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { language, t } = useLanguage();

  // Get query from URL on first load
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const q = urlParams.get("q");
    if (q) {
      setQuery(q);
    }
  }, []);

  // Search when query changes
  useEffect(() => {
    const searchArticles = async () => {
      if (query.trim().length < 2) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        // Get all articles
        const allArticles = await getArticles({ language });
        
        // Simple search in title, summary, and content
        const searchResults = allArticles.filter(article => {
          if (!article.translations[language]) return false;
          
          const { title, summary, content } = article.translations[language];
          const queryLower = query.toLowerCase();
          
          // Check title and summary
          if (title.toLowerCase().includes(queryLower)) return true;
          if (summary.toLowerCase().includes(queryLower)) return true;
          
          // Check content
          if (Array.isArray(content)) {
            return content.some(section => {
              if (section.title?.toLowerCase().includes(queryLower)) return true;
              if (section.paragraph?.toLowerCase().includes(queryLower)) return true;
              return false;
            });
          }
          
          return false;
        });
        
        setResults(searchResults);
      } catch (error) {
        console.error("Error searching articles:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const delaySearch = setTimeout(() => {
      if (query.trim().length >= 2) {
        searchArticles();
      }
    }, 300);

    return () => clearTimeout(delaySearch);
  }, [query, language]);

  // Update URL when query changes
  useEffect(() => {
    if (query.trim()) {
      const url = new URL(window.location.href);
      url.searchParams.set("q", query);
      window.history.replaceState({}, "", url.toString());
    }
  }, [query]);

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">{t("search.results")}</h1>
      
      {/* Search box */}
      <div className="relative max-w-2xl mb-8">
        <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder={t("search.typeToSearch")}
          className="pl-10 py-6 text-lg"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      
      {/* Results */}
      <div className="mt-8">
        {isLoading ? (
          <div className="flex justify-center p-8">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : results.length > 0 ? (
          <div>
            <h2 className="text-xl font-semibold mb-4">
              {results.length} {results.length === 1 ? t("search.result") : t("search.results")} 
              {query ? ` ${t("search.for")} "${query}"` : ''}
            </h2>
            
            <ul className="space-y-6 divide-y divide-gray-200 dark:divide-gray-800">
              {results.map((article) => (
                <li key={article.id} className="pt-6 first:pt-0">
                  <article>
                    <Link href={`/article/${article.slug}`} className="block">
                      <h3 className="text-xl font-bold hover:text-primary transition-colors">
                        {article.translations[language].title}
                      </h3>
                      <p className="mt-2 text-muted-foreground">
                        {article.translations[language].summary}
                      </p>
                      <div className="mt-3">
                        <Button variant="link" className="p-0 h-auto font-medium">
                          {t("general.readMore")}
                        </Button>
                      </div>
                    </Link>
                  </article>
                </li>
              ))}
            </ul>
          </div>
        ) : query.trim().length >= 2 ? (
          <div className="text-center py-8">
            <h2 className="text-xl font-semibold">{t("search.noResults")}</h2>
            <p className="mt-2 text-muted-foreground">{t("search.tryDifferentTerms")}</p>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">{t("search.enterSearchTerm")}</p>
          </div>
        )}
      </div>
    </div>
  );
}