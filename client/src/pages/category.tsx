import { useEffect, useState } from "react";
import { useRoute, Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { getCategoryBySlug } from "@/lib/firebase";

export default function CategoryPage() {
  const { t, language } = useLanguage();
  const [, params] = useRoute("/categories/:categorySlug");
  const categorySlug = params?.categorySlug || "";
  
  const [category, setCategory] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategory = async () => {
      setIsLoading(true);
      try {
        const categoryData = await getCategoryBySlug(categorySlug);
        if (categoryData) {
          setCategory(categoryData);
        } else {
          setError(t("error.categoryNotFound"));
        }
      } catch (err) {
        console.error("Error fetching category:", err);
        setError(t("error.failedToLoad"));
      } finally {
        setIsLoading(false);
      }
    };

    if (categorySlug) {
      fetchCategory();
    }
  }, [categorySlug, t]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-red-500 mb-4">{error}</h1>
        <Button asChild>
          <Link href="/categories">{t("general.backToCategories")}</Link>
        </Button>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">{t("error.categoryNotFound")}</h1>
        <Button asChild>
          <Link href="/categories">{t("general.backToCategories")}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm mb-6">
        <Link href="/">
          <span className="text-neutral-500 hover:text-primary-600 cursor-pointer">
            {t("nav.home")}
          </span>
        </Link>
        <ChevronRight className="h-4 w-4 mx-2 text-neutral-400" />
        <Link href="/categories">
          <span className="text-neutral-500 hover:text-primary-600 cursor-pointer">
            {t("nav.categories")}
          </span>
        </Link>
        <ChevronRight className="h-4 w-4 mx-2 text-neutral-400" />
        <span className="font-medium">{category.titles?.[language] || category.titles?.en || category.slug}</span>
      </div>

      {/* Category Title and Description */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-100 mb-2">
          {category.titles?.[language] || category.titles?.en || category.slug}
        </h1>
        <p className="text-neutral-600 dark:text-neutral-300">
          {t(`categoryDescriptions.${category.slug}`)}
        </p>
      </div>

      {/* Subcategories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {category.subcategories && category.subcategories.length > 0 ? (
          category.subcategories.map((subcategory: any) => (
            <Link key={subcategory.slug} href={`/categories/${category.slug}/${subcategory.slug}`}>
              <Card className="cursor-pointer hover:shadow-md transition-shadow duration-200">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-2">{subcategory.titles?.[language] || subcategory.titles?.en || subcategory.slug}</h2>
                  <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-4">
                    {t(`subcategoryDescriptions.${subcategory.slug}`)}
                  </p>
                  <div className="text-primary-600 dark:text-primary-400 text-sm flex items-center">
                    {t("general.browseSubcategory")}
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-lg text-neutral-500 dark:text-neutral-400">
              {t("general.noSubcategories")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}