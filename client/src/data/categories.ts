import { Category } from "@/types";

// Define all categories and subcategories for the application
const categories: Category[] = [
  {
    name: "Language Learning",
    slug: "language-learning",
    subcategories: [
      { name: "Vocabulary", slug: "vocabulary" },
      { name: "Grammar", slug: "grammar" },
      { name: "Phrases", slug: "phrases" }
    ]
  },
  {
    name: "Culture",
    slug: "culture",
    subcategories: [
      { name: "History", slug: "history" },
      { name: "Food", slug: "food" },
      { name: "Travel", slug: "travel" }
    ]
  },
  {
    name: "Science",
    slug: "science",
    subcategories: [
      { name: "Nature", slug: "nature" },
      { name: "Technology", slug: "technology" },
      { name: "Health", slug: "health" }
    ]
  },
  {
    name: "Stories",
    slug: "stories",
    subcategories: [
      { name: "Short Stories", slug: "short-stories" },
      { name: "Fairy Tales", slug: "fairy-tales" }
    ]
  },
  {
    name: "Tips & Lifestyle",
    slug: "tips-lifestyle",
    subcategories: [
      { name: "Productivity", slug: "productivity" },
      { name: "Study Tips", slug: "study-tips" },
      { name: "Motivation", slug: "motivation" }
    ]
  }
];

export default categories;
