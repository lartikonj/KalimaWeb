import { Badge } from "@/components/ui/badge";

interface LanguageBadgeProps {
  language: string;
  size?: "sm" | "md";
}

export function LanguageBadge({ language, size = "sm" }: LanguageBadgeProps) {
  // Color mapping for language badges
  const colorMap: Record<string, string> = {
    en: "bg-blue-500 text-white",
    ar: "bg-red-500 text-white",
    fr: "bg-green-500 text-white",
    es: "bg-yellow-500 text-white",
    de: "bg-purple-500 text-white"
  };
  
  const classes = `lang-badge ${colorMap[language] || "bg-gray-500 text-white"} ${
    size === "sm" ? "px-2 py-1 text-xs" : "px-3 py-1 text-sm"
  } font-semibold rounded`;
  
  return (
    <Badge className={classes}>
      {language.toUpperCase()}
    </Badge>
  );
}
