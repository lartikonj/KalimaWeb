import React, { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useLanguage, Language } from "@/contexts/LanguageContext";
import { getCategories, createArticle, updateArticle, getArticleBySlug } from "@/lib/firebase";
import { Timestamp } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
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
  Image as ImageIcon
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { getRandomPhoto } from "@/lib/unsplash";
import { cn } from "@/lib/utils";
import { Timestamp } from "firebase/firestore";

// Schema for the article content section
const contentSectionSchema = z.object({
  title: z.string().min(1, "Title is required"),
  paragraph: z.string().min(1, "Content is required"),
  references: z.array(z.string()).optional(),
});

// Schema for the entire article form
const articleFormSchema = z.object({
  slug: z.string().min(3, "Slug must be at least 3 characters")
    .refine(slug => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug), {
      message: "Slug must contain only lowercase letters, numbers, and hyphens"
    }),
  category: z.string().min(1, "Category is required"),
  subcategory: z.string().min(1, "Subcategory is required"),
  author: z.string().optional(),
  availableLanguages: z.array(z.string()).min(1, "At least one language is required"),
  translations: z.record(z.object({
    title: z.string().min(1, "Title is required"),
    summary: z.string().min(1, "Summary is required"),
    content: z.array(contentSectionSchema).min(1, "At least one content section is required"),
  })),
  draft: z.boolean().default(true),
  imageUrl: z.string().min(1, "Image URL is required"),
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
      category: "",
      subcategory: "",
      author: "",
      availableLanguages: ["en"],
      translations: {
        en: {
          title: "",
          summary: "",
          content: [{ title: "", paragraph: "", references: [] }],
        },
      },
      draft: true,
      imageUrl: "",
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
        content: [{ title: "", paragraph: "", references: [] }],
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
    append({ title: "", paragraph: "", references: [] });
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
      
      // Ensure we have valid category and subcategory values
      if (!data.category || !data.subcategory) {
        throw new Error(t("admin.categorySubcategoryRequired"));
      }
      
      // Ensure imageUrl exists
      if (!data.imageUrl) {
        throw new Error(t("admin.imageUrlRequired"));
      }
      
      // Add createdAt timestamp if this is a new article
      const articleData = {
        ...data,
        createdAt: isEditMode ? undefined : Timestamp.now(),
      };
      
      if (isEditMode) {
        await updateArticle(initialData?.slug as string, articleData);
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
        const newArticleData = {
          slug: data.slug,
          category: data.category,
          subcategory: data.subcategory,
          author: data.author || "",
          availableLanguages: data.availableLanguages,
          translations: data.translations,
          draft: data.draft !== undefined ? data.draft : true,
          imageUrl: data.imageUrl,
          createdAt: Timestamp.now(),
        };
        
        await createArticle(newArticleData);
        toast({
          title: t("admin.articleCreated"),
          description: t("admin.articleCreatedDescription"),
        });
      }
      
      // Redirect to articles list
      navigate("/admin/articles");
    } catch (error) {
      console.error("Error saving article:", error);
      toast({
        title: t("admin.error"),
        description: t("admin.errorSavingArticle"),
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
                
                {/* Category */}
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("admin.category")}</FormLabel>
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
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Subcategory (only show if category is selected) */}
                {watchCategory && (
                  <FormField
                    control={form.control}
                    name="subcategory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("admin.subcategory")}</FormLabel>
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
                          </SelectContent>
                        </Select>
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
                        <Input placeholder={t("admin.authorPlaceholder")} {...field} />
                      </FormControl>
                      <FormDescription>
                        {t("admin.authorDescription")}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Image URL */}
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("admin.featuredImage")}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        {t("admin.featuredImageDescription")}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Image Preview */}
                {form.watch("imageUrl") && (
                  <div className="mt-2">
                    <p className="text-sm font-medium mb-2">{t("admin.imagePreview")}</p>
                    <div className="border rounded-md overflow-hidden h-32">
                      <img
                        src={form.watch("imageUrl")}
                        alt={t("admin.articlePreview")}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://via.placeholder.com/800x400?text=Image+Error";
                        }}
                      />
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
                                                    content: [{ title: "", paragraph: "", references: [] }],
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
                      <Input placeholder={t("admin.titlePlaceholder")} {...field} />
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
                        placeholder={t("admin.summaryPlaceholder")}
                        className="min-h-20"
                        {...field}
                      />
                    </FormControl>
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
                    
                    {/* Section Title */}
                    <FormField
                      control={form.control}
                      name={`translations.${activeLanguage}.content.${index}.title`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("admin.sectionTitle")}</FormLabel>
                          <FormControl>
                            <Input placeholder={t("admin.sectionTitlePlaceholder")} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* Section Content */}
                    <FormField
                      control={form.control}
                      name={`translations.${activeLanguage}.content.${index}.paragraph`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("admin.sectionContent")}</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder={t("admin.sectionContentPlaceholder")}
                              className="min-h-32"
                              {...field}
                            />
                          </FormControl>
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