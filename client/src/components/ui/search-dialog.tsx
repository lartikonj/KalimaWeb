import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { getArticles } from "@/lib/firebase";

export function SearchDialog() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { language, t } = useLanguage();
  const [, setLocation] = useLocation();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Open search dialog when pressing Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

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

  const handleResultClick = (slug: string) => {
    setOpen(false);
    setLocation(`/article/${slug}`);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Search className="h-4 w-4" />
          <span className="hidden sm:inline">{t("search.search")}</span>
          <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] top-4 sm:top-20 max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>{t("search.searchArticles")}</DialogTitle>
        </DialogHeader>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("search.typeToSearch")}
            className="pl-8 pr-8"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          {query && (
            <X
              className="absolute right-2 top-2.5 h-4 w-4 cursor-pointer text-muted-foreground"
              onClick={() => setQuery("")}
            />
          )}
        </div>
        
        <div className="mt-4 max-h-[40vh] overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center p-4">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : results.length > 0 ? (
            <>
              <ul className="space-y-2">
                {results.slice(0, 5).map((article) => (
                  <li 
                    key={article.id} 
                    className="rounded-md p-2 hover:bg-muted cursor-pointer"
                    onClick={() => handleResultClick(article.slug)}
                  >
                    <h3 className="font-medium">{article.translations[language].title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {article.translations[language].summary}
                    </p>
                  </li>
                ))}
              </ul>
              
              {results.length > 5 && (
                <div className="mt-4 flex justify-center">
                  <Button 
                    onClick={() => {
                      setOpen(false);
                      setLocation(`/search?q=${encodeURIComponent(query)}`);
                    }}
                    className="w-full"
                  >
                    {t("search.seeAllResults")} ({results.length})
                  </Button>
                </div>
              )}
            </>
          ) : query.trim().length >= 2 ? (
            <p className="text-center text-muted-foreground py-4">
              {t("search.noResults")}
            </p>
          ) : (
            <p className="text-center text-muted-foreground py-4">
              {t("search.enterSearchTerm")}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}