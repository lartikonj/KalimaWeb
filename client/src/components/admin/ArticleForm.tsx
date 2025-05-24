import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { searchPhotos } from "@/lib/unsplash";
import categories from "@/data/categories";
import { X, Plus, ImageIcon, Loader2 } from "lucide-react";
import { Language } from "@/contexts/LanguageContext";

// Schema for article form
const articleFormSchema = z.object({
  slug: z.string().min(3).max(100),
  title: z.string().min(3).max(200).optional(),
  languages: z.array(z.string()),
  category: z.string().default("general"),
  subcategory: z.string().default("other"),
  author: z.object({
    uid: z.string().optional(),
    displayName: z.string().min(1, "Author name is required"),
    photoURL: z.string().url().optional()
  }).optional(),
  translations: z.record(z.object({
    title: z.string().min(3).max(200),
    summary: z.string().min(10).max(500),
    keywords: z.array(z.string()).optional().default([]),
    content: z.array(z.object({
      title: z.string(),
      paragraph: z.string(),
      references: z.array(z.string()).optional()
    }))
  })),
  draft: z.boolean().default(true),
  featured: z.boolean().default(false),
  popular: z.boolean().default(false),
  imageUrls: z.array(z.string().url()).optional().default([]),
  imageDescriptions: z.array(z.string()).optional().default([]),
});

type ArticleFormValues = z.infer<typeof articleFormSchema>;

interface ArticleFormProps {
  initialData?: ArticleFormValues;
  onSubmit: (data: ArticleFormValues) => Promise<void>;
  isSubmitting?: boolean;
}

export function ArticleForm({
  initialData,
  onSubmit,
  isSubmitting = false,
}: ArticleFormProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [activeLanguage, setActiveLanguage] = useState<Language>("en");
  const [imageSearchTerm, setImageSearchTerm] = useState("");
  const [searchedImages, setSearchedImages] = useState<any[]>([]);
  const [isSearchingImages, setIsSearchingImages] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>(
    initialData?.translations[activeLanguage]?.category || ""
  );

  // Get subcategories based on selected category
  const getSubcategories = (categorySlug: string) => {
    const category = categories.find(cat => cat.slug === categorySlug);
    return category ? category.subcategories : [];
  };

  // Default form values
  const defaultValues: ArticleFormValues = {
    slug: "",
    title: "",
    category: "general",
    subcategory: "other",
    languages: ["en"],
    author: {
      uid: "",
      displayName: "",
      photoURL: ""
    },
    translations: {
      en: {
        title: "",
        summary: "",
        keywords: [],
        content: [{
          title: "Introduction",
          paragraph: "",
          references: []
        }]
      }
    },
    draft: true,
    featured: false,
    popular: false,
    imageUrls: [],
    imageDescriptions: [],
  };

  // Form instance
  const form = useForm<ArticleFormValues>({
    resolver: zodResolver(articleFormSchema),
    defaultValues: initialData || defaultValues,
  });

  // Update subcategory options when category changes
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name?.includes('category') && !name?.includes('subcategory')) {
        const category = value.translations?.[activeLanguage]?.category;
        if (category) {
          setSelectedCategory(category);
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [form, activeLanguage]);

  // Create field array for content paragraphs
  const { fields, append, remove } = useFieldArray({
    name: `translations.${activeLanguage}.content` as any,
    control: form.control,
  });

  // Handle image search
  const handleImageSearch = async () => {
    if (!imageSearchTerm.trim()) {
      toast({
        title: t("admin.imageSearch.noTerm"),
        description: t("admin.imageSearch.enterSearchTerm"),
        variant: "destructive",
      });
      return;
    }

    setIsSearchingImages(true);

    try {
      const results = await searchPhotos(imageSearchTerm, 6);
      setSearchedImages(results);
    } catch (error) {
      toast({
        title: t("error.title"),
        description: t("admin.imageSearch.failed"),
        variant: "destructive",
      });
    } finally {
      setIsSearchingImages(false);
    }
  };

  // Handle image selection
  const handleSelectImage = (imageUrl: string) => {
    const currentImages = form.getValues().imageUrls || [];
    form.setValue("imageUrls", [...currentImages, imageUrl]);
  };

  // Handle adding/removing languages
  const toggleLanguage = (lang: Language) => {
    const currentLanguages = form.getValues().languages;

    if (currentLanguages.includes(lang)) {
      // If removing a language that is currently active, switch to another language
      if (activeLanguage === lang) {
        const nextLang = currentLanguages.find(l => l !== lang) || "en";
        setActiveLanguage(nextLang as Language);
      }

      // Remove the language
      form.setValue(
        "languages",
        currentLanguages.filter(l => l !== lang)
      );

      // Remove translations for this language
      const translations = form.getValues().translations;
      delete translations[lang];
      form.setValue("translations", translations);
    } else {
      // Add the language
      form.setValue("languages", [...currentLanguages, lang]);

      // Initialize translations for this language
      if (!form.getValues().translations[lang]) {
        // Copy from active language if possible
        const existingTranslation = form.getValues().translations[activeLanguage];
        form.setValue(`translations.${lang}`, {
          title: "",
          summary: "",
          keywords: [],
          content: [{
            title: "Introduction",
            paragraph: "",
            references: []
          }]
        });
      }

      // Switch to this language
      setActiveLanguage(lang);
    }
  };

  // Handle form submission
  const handleSubmit = async (data: ArticleFormValues) => {
    await onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            {/* Slug field */}
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("admin.article.slug")}</FormLabel>
                  <FormControl>
                    <Input placeholder="article-slug" {...field} />
                  </FormControl>
                  <FormDescription>
                    {t("admin.article.slugDescription")}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Author information */}
            <div className="space-y-4 border border-gray-200 dark:border-gray-800 rounded-md p-4 bg-gray-50 dark:bg-gray-900">
              <h3 className="text-lg font-medium">Author Information</h3>
              
              {/* Author Display Name */}
              <FormField
                control={form.control}
                name="author.displayName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Author Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter author name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Author Photo URL */}
              <FormField
                control={form.control}
                name="author.photoURL"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Author Photo URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/photo.jpg" {...field} />
                    </FormControl>
                    <FormDescription>
                      URL to the author's profile photo (optional)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Available Languages */}
            <div>
              <h3 className="text-lg font-medium mb-2">{t("admin.article.availableLanguages")}</h3>
              <div className="flex flex-wrap gap-2">
                <LanguageToggle
                  code="en"
                  label="English"
                  isActive={form.getValues().languages.includes("en")}
                  onClick={() => toggleLanguage("en")}
                  disabled={form.getValues().languages.length === 1 && form.getValues().languages.includes("en")}
                />
                <LanguageToggle
                  code="ar"
                  label="العربية"
                  isActive={form.getValues().languages.includes("ar")}
                  onClick={() => toggleLanguage("ar")}
                  disabled={false}
                />
                <LanguageToggle
                  code="fr"
                  label="Français"
                  isActive={form.getValues().languages.includes("fr")}
                  onClick={() => toggleLanguage("fr")}
                  disabled={false}
                />
                <LanguageToggle
                  code="es"
                  label="Español"
                  isActive={form.getValues().languages.includes("es")}
                  onClick={() => toggleLanguage("es")}
                  disabled={false}
                />
                <LanguageToggle
                  code="de"
                  label="Deutsch"
                  isActive={form.getValues().languages.includes("de")}
                  onClick={() => toggleLanguage("de")}
                  disabled={false}
                />
              </div>
            </div>

            {/* Language Tabs for Translations */}
            <Tabs value={activeLanguage} onValueChange={(value) => setActiveLanguage(value as Language)}>
              <TabsList className="mb-4">
                {form.getValues().languages.map(lang => (
                  <TabsTrigger key={lang} value={lang} disabled={!form.getValues().languages.includes(lang)}>
                    {lang.toUpperCase()}
                  </TabsTrigger>
                ))}
              </TabsList>

              {form.getValues().languages.map(lang => (
                <TabsContent key={lang} value={lang} className="space-y-4">
                  {/* Title */}
                  <FormField
                    control={form.control}
                    name={`translations.${lang}.title`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("admin.article.title")}</FormLabel>
                        <FormControl>
                          <Input placeholder={t("admin.article.titlePlaceholder")} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Summary */}
                  <FormField
                    control={form.control}
                    name={`translations.${lang}.summary`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("admin.article.summary")}</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder={t("admin.article.summaryPlaceholder")} 
                            {...field} 
                            rows={3}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Category and Subcategory */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`translations.${lang}.category`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("admin.article.category")}</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            value={field.value || categories[0]?.slug || ""}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={t("admin.article.selectCategory")} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {categories.map(category => (
                                  <SelectItem key={category.slug} value={category.slug || "default-category"}>
                                    {t(`categories.${category.slug}`)}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`translations.${lang}.subcategory`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("admin.article.subcategory")}</FormLabel>
                          <Select 
                            onValueChange={field.onChange}
                            value={field.value || getSubcategories(selectedCategory)[0]?.slug || ""}
                            disabled={!selectedCategory}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={t("admin.article.selectSubcategory")} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {getSubcategories(selectedCategory).map(subcategory => (
                                  <SelectItem key={subcategory.slug} value={subcategory.slug || "default-subcategory"}>
                                    {t(`subcategories.${subcategory.slug}`)}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Content Paragraphs */}
                  <div>
                    <FormLabel>{t("admin.article.content")}</FormLabel>
                    {fields.map((field, index) => (
                      <div key={field.id} className="border rounded-md p-4 mb-4">
                        <div className="mb-3">
                          <FormField
                            control={form.control}
                            name={`translations.${lang}.content.${index}.title`}
                            render={({ field }) => (
                              <FormItem className="flex-grow">
                                <FormLabel>Section Title</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="Section title" 
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="flex">
                          <FormField
                            control={form.control}
                            name={`translations.${lang}.content.${index}.paragraph`}
                            render={({ field }) => (
                              <FormItem className="flex-grow">
                                <FormLabel>Content</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    placeholder={t("admin.article.paragraphPlaceholder")} 
                                    {...field} 
                                    rows={4}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => remove(index)}
                            disabled={fields.length === 1}
                            className="ml-2 h-8 mt-8"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => append({
                        title: "New Section",
                        paragraph: "",
                        references: []
                      })}
                      className="mt-2"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {t("admin.article.addParagraph") || "Add Section"}
                    </Button>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>

          <div className="space-y-6">
            {/* Draft Status */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="draft"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        {t("admin.article.draft")}
                      </FormLabel>
                      <FormDescription>
                        {t("admin.article.draftDescription")}
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

              <FormField
                control={form.control}
                name="featured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        {t("admin.article.featured") || "Featured"}
                      </FormLabel>
                      <FormDescription>
                        {t("admin.article.featuredDescription") || "Mark as featured to highlight on homepage"}
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

              <FormField
                control={form.control}
                name="popular"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        {t("admin.article.popular") || "Popular"}
                      </FormLabel>
                      <FormDescription>
                        {t("admin.article.popularDescription") || "Mark as popular to show in trending section"}
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
            </div>

            {/* Featured Image */}
            <div>
              <h3 className="text-lg font-medium mb-2">{t("admin.article.featuredImage")}</h3>

              {/* Current images preview */}
              {form.getValues().imageUrls?.length > 0 && (
                <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {form.getValues().imageUrls.map((imageUrl, index) => (
                    <div key={index} className="relative">
                      <img 
                        src={imageUrl} 
                        alt={`${t("admin.article.preview")} ${index + 1}`}
                        className="w-full h-40 object-cover rounded-md"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const currentImages = [...form.getValues().imageUrls];
                          currentImages.splice(index, 1);
                          form.setValue("imageUrls", currentImages);
                        }}
                        className="absolute top-2 right-2 bg-white dark:bg-gray-800"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Image search */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Input
                    placeholder={t("admin.imageSearch.placeholder")}
                    value={imageSearchTerm}
                    onChange={(e) => setImageSearchTerm(e.target.value)}
                    className="flex-grow"
                  />
                  <Button
                    type="button"
                    onClick={handleImageSearch}
                    disabled={isSearchingImages}
                  >
                    {isSearchingImages ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      t("admin.imageSearch.search")
                    )}
                  </Button>
                </div>

                {/* Search results */}
                {searchedImages.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {searchedImages.map((image) => (
                      <div
                        key={image.id}
                        className="cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => handleSelectImage(image.urls.regular)}
                      >
                        <img
                          src={image.urls.small}
                          alt={image.alt_description || "Unsplash image"}
                          className="w-full h-24 object-cover rounded-md"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* URL Input */}
                <div className="space-y-2 mt-4">
                  <FormLabel>{t("admin.article.imageUrl") || "Add Image URL"}</FormLabel>
                  <div className="flex gap-2">
                    <Input 
                      placeholder="https://example.com/image.jpg" 
                      value={imageSearchTerm}
                      onChange={(e) => setImageSearchTerm(e.target.value)}
                      className="flex-grow"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => {
                        if (imageSearchTerm && imageSearchTerm.trim().startsWith('http')) {
                          handleSelectImage(imageSearchTerm);
                          setImageSearchTerm('');
                        }
                      }}
                    >
                      Add
                    </Button>
                  </div>
                  <FormDescription>
                    {t("admin.article.imageUrlDescription") || "Enter a direct URL to an image or search above"}
                  </FormDescription>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submit buttons */}
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline">
            {t("admin.cancel")}
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("admin.saving")}
              </>
            ) : (
              t("admin.saveArticle")
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}

interface LanguageToggleProps {
  code: string;
  label: string;
  isActive: boolean;
  onClick: () => void;
  disabled: boolean;
}

function LanguageToggle({ code, label, isActive, onClick, disabled }: LanguageToggleProps) {
  return (
    <Button
      type="button"
      variant={isActive ? "default" : "outline"}
      size="sm"
      onClick={onClick}
      disabled={disabled}
      className="flex items-center"
    >
      {isActive && <Checkbox checked className="mr-2 h-4 w-4" />}
      {code.toUpperCase()} - {label}
    </Button>
  );
}