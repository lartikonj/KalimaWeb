import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { CategoryCard } from "./CategoryCard";
import { getCategories } from "@/lib/firebase";
import { Skeleton } from "@/components/ui/skeleton";

export function CategoryList() {
  const { language, t } = useLanguage();
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const fetchedCategories = await getCategories();
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCategories();
  }, []);
  
  // Get translated category name based on current language
  const getTranslatedName = (category: any) => {
    if (category.translations && category.translations[language]) {
      return category.translations[language];
    }
    
    // Fallback to English or the category name
    return category.translations?.en || category.name;
  };
  
  // Transform subcategories to the format expected by CategoryCard
  const getTransformedSubcategories = (category: any) => {
    if (!category.subcategories) return [];
    
    return category.subcategories.map((subcategory: any) => ({
      name: subcategory.translations && subcategory.translations[language] 
        ? subcategory.translations[language] 
        : (subcategory.translations?.en || subcategory.key),
      slug: subcategory.key
    }));
  };
  
  // Assign colors to categories
  const colors = ["primary", "accent", "secondary", "purple", "teal"];
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="rounded-lg border p-5 space-y-4">
            <Skeleton className="h-8 w-2/3" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-5 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((category, index) => (
        <CategoryCard
          key={category.id}
          name={getTranslatedName(category)}
          slug={category.id}
          color={colors[index % colors.length]}
          subcategories={getTransformedSubcategories(category)}
        />
      ))}
    </div>
  );
}
