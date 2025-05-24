import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { ChevronRight } from "lucide-react";

interface SubcategoryProps {
  name: string;
  slug: string;
}

interface CategoryCardProps {
  name: string;
  slug: string;
  color: string;
  subcategories: SubcategoryProps[];
}

export function CategoryCard({ name, slug, color, subcategories }: CategoryCardProps) {
  const { t, isRTL } = useLanguage();
  
  // Generate dynamic classes based on the color
  const getHeaderClass = () => {
    switch (color) {
      case "primary":
        return "bg-primary-100 dark:bg-primary-900";
      case "accent":
        return "bg-accent-100 dark:bg-accent-900";
      case "secondary":
        return "bg-secondary-100 dark:bg-secondary-900";
      case "purple":
        return "bg-purple-100 dark:bg-purple-900";
      case "teal":
        return "bg-teal-100 dark:bg-teal-900";
      default:
        return "bg-primary-100 dark:bg-primary-900";
    }
  };
  
  const getTitleClass = () => {
    switch (color) {
      case "primary":
        return "text-primary-700 dark:text-primary-300";
      case "accent":
        return "text-accent-700 dark:text-accent-300";
      case "secondary":
        return "text-secondary-700 dark:text-secondary-300";
      case "purple":
        return "text-purple-700 dark:text-purple-300";
      case "teal":
        return "text-teal-700 dark:text-teal-300";
      default:
        return "text-primary-700 dark:text-primary-300";
    }
  };
  
  const getLinkClass = () => {
    switch (color) {
      case "primary":
        return "hover:text-primary-600 dark:hover:text-primary-400";
      case "accent":
        return "hover:text-accent-600 dark:hover:text-accent-400";
      case "secondary":
        return "hover:text-secondary-600 dark:hover:text-secondary-400";
      case "purple":
        return "hover:text-purple-600 dark:hover:text-purple-400";
      case "teal":
        return "hover:text-teal-600 dark:hover:text-teal-400";
      default:
        return "hover:text-primary-600 dark:hover:text-primary-400";
    }
  };
  
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className={`p-4 ${getHeaderClass()}`}>
        <h2 className={`text-xl font-bold ${getTitleClass()}`}>{name}</h2>
      </CardHeader>
      <CardContent className="p-4">
        <ul className="space-y-2">
          {subcategories.map((subcategory) => (
            <li key={subcategory.slug}>
              <Link 
                href={`/categories/${slug}/${subcategory.slug}`} 
                className={`flex items-center text-neutral-700 dark:text-neutral-300 ${getLinkClass()}`}
              >
                {!isRTL && <ChevronRight className="h-4 w-4 mr-1" />}
                {subcategory.name}
                {isRTL && <ChevronRight className="h-4 w-4 ml-1 transform rotate-180" />}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-4">
          <Button 
            asChild 
            variant="outline"
            className={getLinkClass()}
          >
            <Link href={`/categories/${slug}`}>
              {t("categories.viewAll")}
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
