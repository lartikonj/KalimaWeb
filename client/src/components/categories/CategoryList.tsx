import { useLanguage } from "@/contexts/LanguageContext";
import { CategoryCard } from "./CategoryCard";
import categories from "@/data/categories";

export function CategoryList() {
  const { language, t } = useLanguage();
  
  // Get translated category and subcategory names
  const translatedCategories = categories.map(category => {
    return {
      ...category,
      name: t(`categories.${category.slug}`),
      subcategories: category.subcategories.map(subcategory => ({
        ...subcategory,
        name: t(`subcategories.${subcategory.slug}`)
      }))
    };
  });
  
  // Assign colors to categories
  const colors = ["primary", "accent", "secondary", "purple", "teal"];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {translatedCategories.map((category, index) => (
        <CategoryCard
          key={category.slug}
          name={category.name}
          slug={category.slug}
          color={colors[index % colors.length]}
          subcategories={category.subcategories}
        />
      ))}
    </div>
  );
}
