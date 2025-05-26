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
        return "bg-blue-100 dark:bg-blue-900";
      case "accent":
        return "bg-green-100 dark:bg-green-900";
      case "secondary":
        return "bg-orange-100 dark:bg-orange-900";
      case "purple":
        return "bg-purple-100 dark:bg-purple-900";
      case "teal":
        return "bg-teal-100 dark:bg-teal-900";
      case "red":
        return "bg-red-100 dark:bg-red-900";
      case "gold":
        return "bg-yellow-100 dark:bg-yellow-900";
      case "pink":
        return "bg-pink-100 dark:bg-pink-900";
      case "indigo":
        return "bg-indigo-100 dark:bg-indigo-900";
      case "emerald":
        return "bg-emerald-100 dark:bg-emerald-900";
      case "rose":
        return "bg-rose-100 dark:bg-rose-900";
      case "cyan":
        return "bg-cyan-100 dark:bg-cyan-900";
      default:
        return "bg-blue-100 dark:bg-blue-900";
    }
  };
  
  const getTitleClass = () => {
    switch (color) {
      case "primary":
        return "text-blue-700 dark:text-blue-300";
      case "accent":
        return "text-green-700 dark:text-green-300";
      case "secondary":
        return "text-orange-700 dark:text-orange-300";
      case "purple":
        return "text-purple-700 dark:text-purple-300";
      case "teal":
        return "text-teal-700 dark:text-teal-300";
      case "red":
        return "text-red-700 dark:text-red-300";
      case "gold":
        return "text-yellow-700 dark:text-yellow-300";
      case "pink":
        return "text-pink-700 dark:text-pink-300";
      case "indigo":
        return "text-indigo-700 dark:text-indigo-300";
      case "emerald":
        return "text-emerald-700 dark:text-emerald-300";
      case "rose":
        return "text-rose-700 dark:text-rose-300";
      case "cyan":
        return "text-cyan-700 dark:text-cyan-300";
      default:
        return "text-blue-700 dark:text-blue-300";
    }
  };
  
  const getLinkClass = () => {
    switch (color) {
      case "primary":
        return "hover:text-blue-600 dark:hover:text-blue-400";
      case "accent":
        return "hover:text-green-600 dark:hover:text-green-400";
      case "secondary":
        return "hover:text-orange-600 dark:hover:text-orange-400";
      case "purple":
        return "hover:text-purple-600 dark:hover:text-purple-400";
      case "teal":
        return "hover:text-teal-600 dark:hover:text-teal-400";
      case "red":
        return "hover:text-red-600 dark:hover:text-red-400";
      case "gold":
        return "hover:text-yellow-600 dark:hover:text-yellow-400";
      case "pink":
        return "hover:text-pink-600 dark:hover:text-pink-400";
      case "indigo":
        return "hover:text-indigo-600 dark:hover:text-indigo-400";
      case "emerald":
        return "hover:text-emerald-600 dark:hover:text-emerald-400";
      case "rose":
        return "hover:text-rose-600 dark:hover:text-rose-400";
      case "cyan":
        return "hover:text-cyan-600 dark:hover:text-cyan-400";
      default:
        return "hover:text-blue-600 dark:hover:text-blue-400";
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
