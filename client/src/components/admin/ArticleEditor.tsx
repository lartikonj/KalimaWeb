import React, { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useLanguage, Language } from "@/contexts/LanguageContext";
import { getCategories, createArticle, updateArticle, getArticleBySlug, createCategory, updateCategory } from "@/lib/firebase";
import { Timestamp } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from 'react-markdown';

import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  Trash2,
  Languages, 
  BookOpen, 
  Image as ImageIcon,
  X,
  Check,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { getRandomPhoto } from "@/lib/unsplash";
import { cn } from "@/lib/utils";

// Schema for the article content section
const contentSectionSchema = z.object({
  title: z.string().default("Content"), // Keep title in schema but not in UI
  paragraph: z.string().min(1, "Content is required"),
  references: z.array(z.string()).optional(),
});

// Schema for the entire article form
const articleFormSchema = z.object({
  slug: z.string().min(3, "Slug must be at least 3 characters")
    .refine(slug => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug), {
      message: "Slug must contain only lowercase letters, numbers, and hyphens"
    }),
  title: z.string().optional(), // Main title (often derived from English translation)
  category: z.string().min(1, "Category is required"),
  subcategory: z.string().min(1, "Subcategory is required"),
  author: z.object({
    uid: z.string().default("system"),
    displayName: z.string().min(1, "Author name is required"),
    photoURL: z.string().optional()
  }).default({
    uid: "system",
    displayName: "Kalima Author", 
    photoURL: ""
  }),
  availableLanguages: z.array(z.string()).min(1, "At least one language is required"),
  translations: z.record(z.object({
    title: z.string().min(1, "Title is required"),
    summary: z.string().min(1, "Summary is required"),
    keywords: z.array(z.string()).optional().default([]),
    content: z.array(contentSectionSchema).min(1, "At least one content section is required"),
  })),
  draft: z.boolean().default(true),
  imageUrl: z.string().optional(), // For backward compatibility
  imageUrls: z.array(z.string()).optional().default([]),
  imageDescriptions: z.array(z.string()).optional().default([]),
  featured: z.boolean().optional().default(false),
  popular: z.boolean().optional().default(false),
});

type ArticleFormValues = z.infer<typeof articleFormSchema>;

interface ArticleEditorProps {
  initialData?: ArticleFormValues;
  isEditMode?: boolean;
}

export function ArticleEditor({ initialData, isEditMode = false }: ArticleEditorProps) {
  const [, navigate] = useLocation();
  const { t, language } = useLanguage();
  const [activeLanguage, setActiveLanguage] = useState<Language>(language);
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingImage, setIsFetchingImage] = useState(false);

  // Initialize form with default values or initial data
  const form = useForm<ArticleFormValues>({
    resolver: zodResolver(articleFormSchema),
    defaultValues: initialData || {
      slug: "",
      title: "", // Main title
      category: "",
      subcategory: "",
      author: {
        uid: "system",
        displayName: "Kalima Author",
        photoURL: ""
      },
      availableLanguages: ["en"],
      imageUrls: [],
      imageDescriptions: [], // For image alt texts
      featured: false,
      popular: false,
      translations: {
        en: {
          title: "",
          summary: "",
          keywords: [], // SEO keywords
          content: [{ paragraph: "" }],
        },
      },
      draft: true,
      imageUrl: "", // For backward compatibility
    },
  });

  // Get subcategories when category changes
  const watchCategory = form.watch("category");

  // Set up fieldArrays for content sections of the active language
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: `translations.${activeLanguage}.content` as any,
  });

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const fetchedCategories = await getCategories();
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast({
          title: t("admin.error"),
          description: t("admin.errorFetchingCategories"),
          variant: "destructive"
        });
      }
    };

    fetchCategories();
  }, [t]);

  // Update subcategories when category changes
  useEffect(() => {
    if (watchCategory) {
      const selectedCategory = categories.find(cat => cat.slug === watchCategory);
      if (selectedCategory && selectedCategory.subcategories) {
        setSubcategories(selectedCategory.subcategories);

        // If the currently selected subcategory doesn't belong to the new category, reset it
        const currentSubcategory = form.getValues("subcategory");
        const subcategoryExists = selectedCategory.subcategories.some(
          (sub: any) => sub.slug === currentSubcategory
        );

        if (!subcategoryExists) {
          form.setValue("subcategory", "");
        }
      } else {
        setSubcategories([]);
      }
    } else {
      setSubcategories([]);
    }
  }, [watchCategory, categories, form]);

  // Handle language toggle
  const handleLanguageToggle = (lang: Language) => {
    setActiveLanguage(lang);

    // Initialize the translation object for the selected language if it doesn't exist
    const translations = form.getValues("translations");
    if (!translations[lang]) {
      form.setValue(`translations.${lang}`, {
        title: "",
        summary: "",
        keywords: [],
        content: [{ paragraph: "" }],
      });
    }

    // Update available languages array if this language is not already included
    const availableLanguages = form.getValues("availableLanguages");
    if (!availableLanguages.includes(lang)) {
      form.setValue("availableLanguages", [...availableLanguages, lang]);
    }
  };

  // Add a new content section to the active language
  const addContentSection = () => {
    append({ title: "Content", paragraph: "", references: [] });
  };

  // Remove a language from available languages and its translations
  const removeLanguage = (lang: Language) => {
    const availableLanguages = form.getValues("availableLanguages");

    // Don't allow removing the last language
    if (availableLanguages.length <= 1) {
      toast({
        title: t("admin.error"),
        description: t("admin.cannotRemoveLastLanguage"),
        variant: "destructive"
      });
      return;
    }

    // Remove the language from available languages
    const updatedLanguages = availableLanguages.filter(l => l !== lang);
    form.setValue("availableLanguages", updatedLanguages);

    // Get updated translations object without the removed language
    const translations = form.getValues("translations");
    const { [lang]: removed, ...updatedTranslations } = translations;
    form.setValue("translations", updatedTranslations);

    // Switch to another language if the active one was removed
    if (activeLanguage === lang) {
      setActiveLanguage(updatedLanguages[0] as Language);
    }
  };

  // Generate a random featured image from Unsplash
  const generateFeaturedImage = async () => {
    try {
      setIsFetchingImage(true);

      // Get all form values and access the nested properties safely
      const formValues = form.getValues();
      const activeTitle = formValues.translations?.[activeLanguage]?.title || '';
      const englishTitle = formValues.translations?.en?.title || '';

      // Use the title in the active language or fallback to English for better search results
      const title = activeTitle || englishTitle || "";

      const categoryName = categories.find(cat => cat.slug === watchCategory)?.titles?.en || "";

      // Create a search query based on title and category
      const searchQuery = `${title} ${categoryName}`.trim() || "education";

      const imageUrl = await getRandomPhoto(searchQuery);
      form.setValue("imageUrl", imageUrl);

      toast({
        title: t("admin.imageFetched"),
        description: t("admin.imageFetchedDescription"),
      });
    } catch (error) {
      console.error("Error fetching image:", error);
      toast({
        title: t("admin.error"),
        description: t("admin.errorFetchingImage"),
        variant: "destructive"
      });
    } finally {
      setIsFetchingImage(false);
    }
  };

  // Form submission handler
  const onSubmit = async (data: ArticleFormValues) => {
    try {
      setIsLoading(true);

      // Extract values from form directly
      const slug = form.getValues("slug");
      const category = form.getValues("category") || "general";
      const subcategory = form.getValues("subcategory") || "other";

      // Clean up translations - remove any category/subcategory that might have been added incorrectly
      const cleanTranslations = { ...data.translations };
      Object.keys(cleanTranslations).forEach(lang => {
        if (cleanTranslations[lang]) {
          // Remove category and subcategory from translations as they belong at article level
          const { category: _, subcategory: __, ...cleanTranslation } = cleanTranslations[lang] as any;
          cleanTranslations[lang] = {
            title: cleanTranslation.title || "",
            summary: cleanTranslation.summary || "",
            keywords: cleanTranslation.keywords || [],
            content: cleanTranslation.content || [{ paragraph: "" }]
          };
        }
      });

      // Debug form values
      console.log("Form data submitted:", JSON.stringify({
        slug: slug,
        category: category,
        subcategory: subcategory,
        hasTranslations: !!data.translations,
        availableLanguages: data.availableLanguages,
        cleanedTranslationsKeys: Object.keys(cleanTranslations)
      }, null, 2));

      // Set the correct data structure
      data.slug = slug;
      data.category = category;
      data.subcategory = subcategory;
      data.translations = cleanTranslations;

      // Ensure we have valid category and subcategory values
      if (!data.category || !data.subcategory) {
        throw new Error(t("admin.categorySubcategoryRequired") || "Category and subcategory are required");
      }

      // Ensure we have at least one image (either imageUrl or imageUrls)
      const hasImages = (data.imageUrls && data.imageUrls.length > 0) || 
                       (data.imageUrl && data.imageUrl.trim() !== "");
      
      if (!hasImages) {
        // Auto-generate a placeholder image if none provided
        data.imageUrls = ["https://images.unsplash.com/photo-1637332203993-ab33850d8b7b?q=80&w=1760&auto=format&fit=crop"];
        console.log("Added placeholder image URL");
      }

      // Add createdAt timestamp if this is a new article
      // Make sure author has a uid field
      const author = data.author ? {
        uid: data.author.uid || "system",
        displayName: data.author.displayName || "Kalima Author",
        photoURL: data.author.photoURL || ""
      } : {
        uid: "system", 
        displayName: "Kalima Author",
        photoURL: ""
      };

      // Convert image to imageUrls array if needed
      const imageUrls = data.imageUrls && data.imageUrls.length > 0 
        ? data.imageUrls 
        : (data.imageUrl ? [data.imageUrl] : []);

      // Ensure we have image descriptions for each image
      const imageDescriptions = data.imageDescriptions || [];
      // Add default descriptions if needed
      while (imageDescriptions.length < imageUrls.length) {
        imageDescriptions.push(`Image ${imageDescriptions.length + 1} for ${data.title || data.translations.en?.title || 'article'}`);
      }

      // Validate and fix translation structure
      const updatedTranslations = { ...cleanTranslations };
      Object.keys(updatedTranslations).forEach(lang => {
        const translation = updatedTranslations[lang];
        
        // Ensure all required fields exist
        if (!translation.title || translation.title.trim() === '') {
          throw new Error(`Title is required for language: ${lang}`);
        }
        
        if (!translation.summary || translation.summary.trim() === '') {
          throw new Error(`Summary is required for language: ${lang}`);
        }
        
        // Ensure keywords array exists
        if (!translation.keywords) {
          translation.keywords = [];
        }
        
        // Ensure content array exists and has proper structure
        if (!translation.content || !Array.isArray(translation.content) || translation.content.length === 0) {
          translation.content = [{ paragraph: "No content provided" }];
        }
        
        // Clean up content structure
        translation.content = translation.content.map(item => {
          if (typeof item === 'string') {
            return { paragraph: item };
          }
          return {
            paragraph: item.paragraph || ""
          };
        });
      });

      // Set the main title from the English translation or first available translation
      const title = data.title || data.translations.en?.title || 
                   Object.values(data.translations)[0]?.title || "Untitled Article";

      // Check if category exists, if not, create it
      const categoryExists = categories.some(c => c.slug === data.category && !c.id?.toString().startsWith('temp-'));
      const isNewCategory = !categoryExists;

      if (isNewCategory) {
        // Find the temporary category to get its titles
        const tempCategory = categories.find(c => c.slug === data.category);
        const categoryTitles = tempCategory?.titles || { en: data.category };

        try {
          // Create the category in Firestore
          await createCategory({
            slug: data.category,
            titles: categoryTitles,
            subcategories: []
          });

          toast({
            title: "Category Created",
            description: `Created new category "${data.category}"`,
          });
        } catch (error) {
          console.error("Error creating category:", error);
          toast({
            title: "Category Error",
            description: "Failed to create new category. Article will still be saved.",
            variant: "destructive"
          });
        }
      }

      // Check if subcategory exists in the category, if not, add it
      const categoryObj = categories.find(c => c.slug === data.category);
      if (categoryObj) {
        const subcategoryExists = categoryObj.subcategories?.some(
          (s: any) => s.slug === data.subcategory
        );

        if (!subcategoryExists && data.subcategory) {
          try {
            // Find the temporary subcategory to get its titles
            const tempSubcategory = subcategories.find((s: any) => s.slug === data.subcategory);
            const subcategoryTitles = tempSubcategory?.titles || { en: data.subcategory };

            // Add subcategory to the category (skip if category is new as it will be handled in createCategory)
            if (!isNewCategory && categoryObj.id) {
              await updateCategory(categoryObj.id, {
                slug: categoryObj.slug,
                titles: categoryObj.titles,
                subcategories: [
                  ...(categoryObj.subcategories || []),
                  { slug: data.subcategory, titles: subcategoryTitles }
                ]
              });

              toast({
                title: "Subcategory Added",
                description: `Added new subcategory "${data.subcategory}" to category "${data.category}"`,
              });
            }
          } catch (error) {
            console.error("Error adding subcategory:", error);
            toast({
              title: "Subcategory Error",
              description: "Failed to add new subcategory. Article will still be saved.",
              variant: "destructive"
            });
          }
        }
      }

      // Prepare article data and filter out undefined values
      const articleData = {
        ...data,
        title, // Set main title explicitly
        author, // Use the properly formatted author object
        imageUrls, // Ensure we have an array of image URLs
        imageDescriptions, // Add image descriptions
        translations: updatedTranslations, // Ensure keywords exist in all translations
        featured: data.featured || false,
        popular: data.popular || false,
        createdAt: isEditMode ? undefined : Timestamp.now(),
      };

      // Remove undefined fields to prevent Firestore errors
      Object.keys(articleData).forEach(key => {
        if (articleData[key] === undefined) {
          delete articleData[key];
        }
      });

      if (isEditMode) {
        // Use the current slug from form data, not initialData
        const currentSlug = articleData.slug || initialData?.slug;
        if (!currentSlug) {
          throw new Error("Article slug is required for updating");
        }
        
        console.log("Calling updateArticle with slug:", currentSlug);
        console.log("Article data being sent:", JSON.stringify(articleData, null, 2));
        
        // Call updateArticle with the correct parameters
        await updateArticle(currentSlug, articleData);
        toast({
          title: t("admin.articleUpdated"),
          description: t("admin.articleUpdatedDescription"),
        });
      } else {
        // First check if an article with this slug already exists
        const existingArticle = await getArticleBySlug(data.slug);
        if (existingArticle) {
          throw new Error(t("admin.slugAlreadyExists"));
        }

        // Create the article with explicit values to avoid undefined
        // We don't need this duplicate object - we've already prepared all the data correctly above
        const newArticleData = articleData;

        console.log("Creating article with processed data:", JSON.stringify({
          slug: newArticleData.slug,
          slugType: typeof newArticleData.slug,
          categoryType: typeof newArticleData.category,
          availableLanguagesLength: newArticleData.availableLanguages.length
        }, null, 2));

        try {
          await createArticle(newArticleData);
        } catch (createError) {
          console.error("Detailed article creation error:", createError);
          throw createError;
        }
        toast({
          title: t("admin.articleCreated"),
          description: t("admin.articleCreatedDescription"),
        });
      }

      // Redirect to articles list
      navigate("/admin/articles");
    } catch (error) {
      console.error("Error saving article:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      console.error("Detailed error:", errorMessage);
      
      toast({
        title: t("admin.error"),
        description: isEditMode 
          ? `${t("admin.errorSavingArticle")}: ${errorMessage}`
          : `${t("admin.errorCreatingArticle")}: ${errorMessage}`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={() => navigate("/admin/articles")}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("admin.backToArticles")}
        </Button>

        <div className="flex gap-2">
          <Button
            variant="outline"
            type="button"
            onClick={generateFeaturedImage}
            disabled={isFetchingImage}
            className="gap-2"
          >
            <ImageIcon className="h-4 w-4" />
            {isFetchingImage ? t("admin.fetchingImage") : t("admin.generateImage")}
          </Button>

          <Button
            type="button"
            onClick={form.handleSubmit(onSubmit)}
            disabled={isLoading}
            className="gap-2"
          >
            <Save className="h-4 w-4" />
            {isLoading ? t("admin.saving") : t("admin.saveArticle")}
          </Button>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>{t("admin.basicInformation")}</CardTitle>
                <CardDescription>
                  {t("admin.basicInformationDescription")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Slug */}
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("admin.slug")}</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="my-article-title" 
                          {...field}
                          disabled={isEditMode} // Disable slug editing in edit mode
                        />
                      </FormControl>
                      <FormDescription>
                        {t("admin.slugDescription")}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Category with on-the-fly creation */}
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>{t("admin.category")}</FormLabel>
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={t("admin.selectCategory")} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem key={category.slug} value={category.slug}>
                                  {category.titles?.[language] || category.titles?.en || category.slug}
                                </SelectItem>
                              ))}
                              {field.value && !categories.find(c => c.slug === field.value) && (
                                <SelectItem value={field.value}>
                                  {field.value} (New)
                                </SelectItem>
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button 
                              type="button" 
                              variant="outline" 
                              size="icon"
                              title={t("admin.addNewCategory") || "Add New Category"}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-80">
                            <div className="space-y-4">
                              <h4 className="font-medium">{t("admin.addNewCategory") || "Add New Category"}</h4>
                              <div className="space-y-2">
                                <Label>{t("admin.slug") || "Slug"}</Label>
                                <Input
                                  id="new-category-slug"
                                  placeholder="category-slug"
                                  onChange={(e) => {
                                    // Convert to slug format
                                    const slugValue = e.target.value
                                      .toLowerCase()
                                      .replace(/[^a-z0-9]+/g, '-')
                                      .replace(/^-|-$/g, '');
                                    e.target.value = slugValue;
                                  }}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>{t("admin.title") || "Title (English)"}</Label>
                                <Input
                                  id="new-category-title"
                                  placeholder="Category Title"
                                />
                              </div>
                              <Button
                                type="button"
                                onClick={() => {
                                  const slugInput = document.getElementById("new-category-slug") as HTMLInputElement;
                                  const titleInput = document.getElementById("new-category-title") as HTMLInputElement;

                                  if (slugInput?.value && titleInput?.value) {
                                    const newSlug = slugInput.value;
                                    const newTitle = titleInput.value;

                                    // Add to form
                                    field.onChange(newSlug);

                                    // Add to categories list for display
                                    const newCategory = {
                                      id: `temp-${Date.now()}`,
                                      slug: newSlug,
                                      titles: { [language]: newTitle, en: newTitle },
                                      subcategories: []
                                    };

                                    setCategories([...categories, newCategory]);

                                    // Reset inputs
                                    slugInput.value = "";
                                    titleInput.value = "";

                                    toast({
                                      title: "Category Added",
                                      description: `New category "${newTitle}" will be created when you save the article.`,
                                    });
                                  }
                                }}
                              >
                                {t("admin.addCategory") || "Add Category"}
                              </Button>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Subcategory with on-the-fly creation (only show if category is selected) */}
                {watchCategory && (
                  <FormField
                    control={form.control}
                    name="subcategory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("admin.subcategory")}</FormLabel>
                        <div className="flex gap-2">
                          <div className="flex-1">
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder={t("admin.selectSubcategory")} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {subcategories.map((subcategory: any) => (
                                  <SelectItem key={subcategory.slug} value={subcategory.slug}>
                                    {subcategory.titles?.[language] || subcategory.titles?.en || subcategory.slug}
                                  </SelectItem>
                                ))}
                                {field.value && !subcategories.find((s: any) => s.slug === field.value) && (
                                  <SelectItem value={field.value}>
                                    {field.value} (New)
                                  </SelectItem>
                                )}
                              </SelectContent>
                            </Select>
                          </div>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button 
                                type="button" 
                                variant="outline" 
                                size="icon"
                                title={t("admin.addNewSubcategory") || "Add New Subcategory"}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80">
                              <div className="space-y-4">
                                <h4 className="font-medium">{t("admin.addNewSubcategory") || "Add New Subcategory"}</h4>
                                <div className="space-y-2">
                                  <Label>{t("admin.slug") || "Slug"}</Label>
                                  <Input
                                    id="new-subcategory-slug"
                                    placeholder="subcategory-slug"
                                    onChange={(e) => {
                                      // Convert to slug format
                                      const slugValue = e.target.value
                                        .toLowerCase()
                                        .replace(/[^a-z0-9]+/g, '-')
                                        .replace(/^-|-$/g, '');
                                      e.target.value = slugValue;
                                    }}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>{t("admin.title") || "Title (English)"}</Label>
                                  <Input
                                    id="new-subcategory-title"
                                    placeholder="Subcategory Title"
                                  />
                                </div>
                                <Button
                                  type="button"
                                  onClick={() => {
                                    const slugInput = document.getElementById("new-subcategory-slug") as HTMLInputElement;
                                    const titleInput = document.getElementById("new-subcategory-title") as HTMLInputElement;

                                    if (slugInput?.value && titleInput?.value) {
                                      const newSlug = slugInput.value;
                                      const newTitle = titleInput.value;

                                      // Add to form
                                      field.onChange(newSlug);

                                      // Find current category and add new subcategory
                                      const categoryIndex = categories.findIndex(c => c.slug === watchCategory);
                                      if (categoryIndex !== -1) {
                                        // Create a new subcategory
                                        const newSubcategory = {
                                          slug: newSlug,
                                          titles: { [language]: newTitle, en: newTitle }
                                        };

                                        // Add to subcategories list for display
                                        setSubcategories([...subcategories, newSubcategory]);

                                        // Add to category's subcategories
                                        const updatedCategories = [...categories];
                                        if (!updatedCategories[categoryIndex].subcategories) {
                                          updatedCategories[categoryIndex].subcategories = [];
                                        }
                                        updatedCategories[categoryIndex].subcategories.push(newSubcategory);
                                        setCategories(updatedCategories);

                                        // Reset inputs
                                        slugInput.value = "";
                                        titleInput.value = "";

                                        toast({
                                          title: "Subcategory Added",
                                          description: `New subcategory "${newTitle}" will be created when you save the article.`,
                                        });
                                      }
                                    }
                                  }}
                                >
                                  {t("admin.addSubcategory") || "Add Subcategory"}
                                </Button>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* Author */}
                <FormField
                  control={form.control}
                  name="author"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("admin.author")}</FormLabel>
                      <FormControl>
                        {/* Converting complex author object to string display for the input */}
                        <Input 
                          placeholder={t("admin.authorPlaceholder")} 
                          value={field.value?.displayName || ""}
                          onChange={(e) => {
                            // Update just the displayName in the author object
                            const currentAuthor = field.value || { uid: "system", displayName: "" };
                            field.onChange({
                              ...currentAuthor,
                              displayName: e.target.value,
                              uid: currentAuthor.uid || "system"
                            });
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        {t("admin.authorDescription")}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Image URLs (Multiple) */}
                <FormField
                  control={form.control}
                  name="imageUrls"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("admin.articleImages")}</FormLabel>
                      <FormControl>
                        <div className="space-y-2">
                          {field.value?.map((url, index) => (
                            <div key={index} className="flex gap-2">
                              <Input
                                value={url}
                                onChange={(e) => {
                                  const newUrls = [...field.value];
                                  newUrls[index] = e.target.value;
                                  field.onChange(newUrls);
                                }}
                                placeholder="https://example.com/image.jpg"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => {
                                  const newUrls = [...field.value];
                                  newUrls.splice(index, 1);
                                  field.onChange(newUrls);

                                  // Also remove the corresponding image description
                                  const imageDescriptions = form.getValues("imageDescriptions") || [];
                                  if (imageDescriptions.length > index) {
                                    const newDescriptions = [...imageDescriptions];
                                    newDescriptions.splice(index, 1);
                                    form.setValue("imageDescriptions", newDescriptions);
                                  }
                                }}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              field.onChange([...(field.value || []), ""]);
                            }}
                            className="gap-2"
                          >
                            <Plus className="h-4 w-4" />
                            {t("admin.addImageUrl") || "Add Image"}
                          </Button>
                        </div>
                      </FormControl>
                      <FormDescription>
                        {t("admin.articleImagesDescription") || "Add URLs for article images"}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Legacy Image URL support */}
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("admin.featuredImage")} (Legacy)</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        {t("admin.featuredImageDescription")} (For backward compatibility)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Image Descriptions */}
                {form.watch("imageUrls")?.length > 0 && (
                  <FormField
                    control={form.control}
                    name="imageDescriptions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("admin.imageDescriptions") || "Image Descriptions"}</FormLabel>
                        <FormControl>
                          <div className="space-y-2">
                            {form.watch("imageUrls").map((url, index) => {
                              // Ensure we have an array for descriptions
                              const descriptions = Array.isArray(field.value) ? field.value : [];

                              return (
                                <div key={index} className="flex gap-2 items-center">
                                  <div className="w-12 h-12 flex-shrink-0">
                                    <img 
                                      src={url} 
                                      alt={`Thumbnail ${index + 1}`}
                                      className="w-full h-full object-cover rounded-md"
                                      onError={(e) => {
                                        (e.target as HTMLImageElement).src = "https://via.placeholder.com/100?text=IMG";
                                      }}
                                    />
                                  </div>
                                  <Input
                                    value={descriptions[index] || ""}
                                    onChange={(e) => {
                                      const newDescriptions = [...descriptions];
                                      newDescriptions[index] = e.target.value;
                                      field.onChange(newDescriptions);
                                    }}
                                    placeholder={`Description for image ${index + 1}`}
                                  />
                                </div>
                              );
                            })}
                          </div>
                        </FormControl>
                        <FormDescription>
                          {t("admin.imageDescriptionsHelp") || "Add descriptive alt text for each image for better accessibility and SEO"}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* Image Previews */}
                {form.watch("imageUrls")?.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm font-medium mb-2">{t("admin.imagePreview")}</p>
                    <div className="grid grid-cols-2 gap-2">
                      {form.watch("imageUrls").map((url, index) => {
                        const descriptions = form.watch("imageDescriptions") || [];
                        const altText = descriptions[index] || `Preview ${index + 1}`;

                        return (
                          <div key={index} className="border rounded-md overflow-hidden h-32">
                            <img
                              src={url}
                              alt={altText}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "https://via.placeholder.com/800x400?text=Image+Error";
                              }}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Draft Status */}
                <FormField
                  control={form.control}
                  name="draft"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          {t("admin.draftMode")}
                        </FormLabel>
                        <FormDescription>
                          {t("admin.draftModeDescription")}
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Language Selector and Available Languages */}
            <Card>
              <CardHeader>
                <CardTitle>{t("admin.languageSettings")}</CardTitle>
                <CardDescription>
                  {t("admin.languageSettingsDescription")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col space-y-4">
                  <div>
                    <FormLabel>{t("admin.activeLanguage")}</FormLabel>
                    <div className="grid grid-cols-5 gap-2 mt-2">
                      <Button
                        type="button"
                        variant={activeLanguage === "en" ? "default" : "outline"}
                        onClick={() => handleLanguageToggle("en")}
                        className="w-full"
                      >
                        EN
                      </Button>
                      <Button
                        type="button"
                        variant={activeLanguage === "fr" ? "default" : "outline"}
                        onClick={() => handleLanguageToggle("fr")}
                        className="w-full"
                      >
                        FR
                      </Button>
                      <Button
                        type="button"
                        variant={activeLanguage === "es" ? "default" : "outline"}
                        onClick={() => handleLanguageToggle("es")}
                        className="w-full"
                      >
                        ES
                      </Button>
                      <Button
                        type="button"
                        variant={activeLanguage === "de" ? "default" : "outline"}
                        onClick={() => handleLanguageToggle("de")}
                        className="w-full"
                      >
                        DE
                      </Button>
                      <Button
                        type="button"
                        variant={activeLanguage === "ar" ? "default" : "outline"}
                        onClick={() => handleLanguageToggle("ar")}
                        className="w-full"
                      >
                        AR
                      </Button>
                    </div>
                  </div>

                  <div>
                    <FormLabel>{t("admin.availableLanguages")}</FormLabel>
                    <div className="mt-2">
                      <FormField
                        control={form.control}
                        name="availableLanguages"
                        render={() => (
                          <FormItem>
                            <div className="space-y-2">
                              {["en", "fr", "es", "de", "ar"].map((lang) => (
                                <div 
                                  key={lang}
                                  className="flex items-center justify-between p-2 border rounded-md"
                                >
                                  <div className="flex items-center space-x-2">
                                    <Controller
                                      control={form.control}
                                      name="availableLanguages"
                                      render={({ field }) => (
                                        <Checkbox
                                          checked={field.value.includes(lang)}
                                          onCheckedChange={(checked) => {
                                            const currentValue = field.value || [];
                                            if (checked) {
                                              if (!currentValue.includes(lang)) {
                                                field.onChange([...currentValue, lang]);
                                                // Initialize translation if needed
                                                if (!form.getValues(`translations.${lang}`)) {
                                                  form.setValue(`translations.${lang}`, {
                                                    title: "",
                                                    summary: "",
                                                    keywords: [],
                                                    content: [{ paragraph: "" }],
                                                  });
                                                }
                                              }
                                            } else {
                                              // Don't allow removing the last language
                                              if (currentValue.length <= 1) {
                                                toast({
                                                  title: t("admin.error"),
                                                  description: t("admin.cannotRemoveLastLanguage"),
                                                  variant: "destructive"
                                                });
                                                return;
                                              }
                                              field.onChange(currentValue.filter((value) => value !== lang));
                                              // Remove the translation
                                              const translations = form.getValues("translations");
                                              const { [lang]: removed, ...rest } = translations;
                                              form.setValue("translations", rest);
                                              // Switch active language if needed
                                              if (activeLanguage === lang) {
                                                setActiveLanguage(currentValue.filter((value) => value !== lang)[0] as Language);
                                              }
                                            }
                                          }}
                                          id={`language-${lang}`}
                                        />
                                      )}
                                    />
                                    <label
                                      htmlFor={`language-${lang}`}
                                      className="text-sm font-medium leading-none cursor-pointer"
                                    >
                                      {t(`languages.${lang}`)}
                                    </label>
                                  </div>

                                  {form.watch("availableLanguages").includes(lang) && (
                                    <div className="flex items-center space-x-1">
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setActiveLanguage(lang as Language)}
                                        className="text-xs h-8"
                                      >
                                        {t("admin.edit")}
                                      </Button>
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeLanguage(lang as Language)}
                                        className="text-red-500 text-xs h-8"
                                        disabled={form.watch("availableLanguages").length <= 1}
                                      >
                                        {t("admin.remove")}
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Translation Content */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>
                    {t("admin.content")} - {t(`languages.${activeLanguage}`)}
                  </CardTitle>
                  <CardDescription>
                    {t("admin.contentDescription")}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Languages className="h-5 w-5 text-muted-foreground" />
                  <span className="font-bold text-muted-foreground">
                    {activeLanguage.toUpperCase()}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Title */}
              <FormField
                control={form.control}
                name={`translations.${activeLanguage}.title`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("admin.title")}</FormLabel>
                    <FormControl>
                      <Input 
                    placeholder={
                      activeLanguage === 'en' ? t("admin.titlePlaceholder") :
                      activeLanguage === 'fr' ? "Titre de l'article en français" :
                      activeLanguage === 'es' ? "Título del artículo en español" :
                      activeLanguage === 'de' ? "Artikeltitel auf Deutsch" :
                      activeLanguage === 'ar' ? "عنوان المقال باللغة العربية" :
                      t("admin.titlePlaceholder")
                    }
                    {...field} 
                  />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Summary */}
              <FormField
                control={form.control}
                name={`translations.${activeLanguage}.summary`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("admin.summary")}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={
                          activeLanguage === 'en' ? t("admin.summaryPlaceholder") :
                          activeLanguage === 'fr' ? "Résumé de l'article en français..." :
                          activeLanguage === 'es' ? "Resumen del artículo en español..." :
                          activeLanguage === 'de' ? "Zusammenfassung des Artikels auf Deutsch..." :
                          activeLanguage === 'ar' ? "ملخص المقال باللغة العربية..." :
                          t("admin.summaryPlaceholder")
                        }
                        className="min-h-20"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Keywords */}
              <FormField
                control={form.control}
                name={`translations.${activeLanguage}.keywords`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("admin.keywords") || "Keywords"}</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder={
                          activeLanguage === 'en' ? "e-learning, education, online (comma separated)" :
                          activeLanguage === 'fr' ? "e-learning, éducation, en ligne (séparés par des virgules)" :
                          activeLanguage === 'es' ? "e-learning, educación, en línea (separados por comas)" :
                          activeLanguage === 'de' ? "e-learning, bildung, online (durch Kommas getrennt)" :
                          activeLanguage === 'ar' ? "التعلم الإلكتروني، التعليم، عبر الإنترنت (مفصولة بفواصل)" :
                          "e-learning, education, online (comma separated)"
                        }
                        value={Array.isArray(field.value) ? field.value.join(", ") : ""}
                        onChange={(e) => {
                          const keywordsText = e.target.value;
                          const keywordsArray = keywordsText
                            .split(",")
                            .map(k => k.trim())
                            .filter(k => k.length > 0);
                          field.onChange(keywordsArray);
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      {t("admin.keywordsDescription") || "Add SEO keywords separated by commas"}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Content Sections */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <FormLabel>{t("admin.contentSections")}</FormLabel>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addContentSection}
                    className="gap-1"
                  >
                    <Plus className="h-4 w-4" />
                    {t("admin.addSection")}
                  </Button>
                </div>

                {fields.map((field, index) => (
                  <div key={field.id} className="p-4 border rounded-md space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">
                        {t("admin.section")} {index + 1}
                      </h3>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(index)}
                        disabled={fields.length <= 1}
                        className="text-red-500 h-8"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        {t("admin.removeSection")}
                      </Button>
                    </div>

                    {/* Hidden Section Title - auto-filled with "Content" */}
                    <input 
                      type="hidden" 
                      {...form.register(`translations.${activeLanguage}.content.${index}.title`)} 
                      value="Content" 
                    />

                    {/* Section Content with Markdown Support */}
                    <FormField
                      control={form.control}
                      name={`translations.${activeLanguage}.content.${index}.paragraph`}
                      render={({ field }) => (
                        <FormItem className="space-y-4">
                          <FormLabel>{t("admin.sectionContent")}</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder={
                                activeLanguage === 'en' ? "Use Markdown for formatting: # Heading, ## Subheading, **bold**, *italic*, \\n\\n for new paragraph" :
                                activeLanguage === 'fr' ? "Utilisez Markdown pour le formatage: # Titre, ## Sous-titre, **gras**, *italique*, \\n\\n pour nouveau paragraphe" :
                                activeLanguage === 'es' ? "Use Markdown para formato: # Título, ## Subtítulo, **negrita**, *cursiva*, \\n\\n para nuevo párrafo" :
                                activeLanguage === 'de' ? "Verwenden Sie Markdown für Formatierung: # Überschrift, ## Unterüberschrift, **fett**, *kursiv*, \\n\\n für neuen Absatz" :
                                activeLanguage === 'ar' ? "استخدم Markdown للتنسيق: # عنوان، ## عنوان فرعي، **سميك**، *مائل*، \\n\\n لفقرة جديدة" :
                                "Use Markdown for formatting: # Heading, ## Subheading, **bold**, *italic*, \\n\\n for new paragraph"
                              }
                              className="min-h-48 font-mono"
                              {...field}
                            />
                          </FormControl>

                          {/* Markdown Preview */}
                          {field.value && (
                            <div className="border rounded-md p-4 mt-2">
                              <div className="text-sm font-medium mb-2">Markdown Preview:</div>
                              <div className="prose dark:prose-invert max-w-none">
                                <ReactMarkdown>
                                  {field.value}
                                </ReactMarkdown>
                              </div>
                            </div>
                          )}

                          <FormDescription>
                            You can use Markdown formatting in this field:
                            <ul className="list-disc list-inside mt-1 space-y-1 text-xs">
                              <li># Heading 1, ## Heading 2, ### Heading 3</li>
                              <li>**bold text**, *italic text*</li>
                              <li>- bullet points</li>
                              <li>1. numbered lists</li>
                              <li>[link text](https://example.com)</li>
                              <li>Leave a blank line for a new paragraph</li>
                            </ul>
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* References - Future implementation */}
                    {/* <FormField
                      control={form.control}
                      name={`translations.${activeLanguage}.content.${index}.references`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("admin.references")}</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder={t("admin.referencesPlaceholder")}
                              className="min-h-20"
                              {...field}
                              value={(field.value || []).join("\\n")}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value
                                    ? e.target.value.split("\\n")
                                    : []
                                )
                              }
                            />
                          </FormControl>
                          <FormDescription>
                            {t("admin.referencesDescription")}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    /> */}
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                type="button"
                onClick={() => navigate("/admin/articles")}
              >
                {t("admin.cancel")}
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isEditMode ? t("admin.updateArticle") : t("admin.createArticle")}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}