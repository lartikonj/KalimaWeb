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
  languages: z.array(z.string()),
  translations: z.record(z.object({
    title: z.string().min(3).max(200),
    summary: z.string().min(10).max(500),
    category: z.string(),
    subcategory: z.string().optional(),
    content: z.array(z.string())
  })),
  draft: z.boolean().default(true),
  imageUrl: z.string().url().optional(),
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
    languages: ["en"],
    translations: {
      en: {
        title: "",
        summary: "",
        category: "",
        subcategory: "",
        content: [""]
      }
    },
    draft: true,
    imageUrl: "",
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
    name: `translations.${activeLanguage}.content`,
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
    form.setValue("imageUrl", imageUrl);
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
          category: existingTranslation?.category || "",
          subcategory: existingTranslation?.subcategory || "",
          content: [""]
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
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={t("admin.article.selectCategory")} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {categories.map(category => (
                                  <SelectItem key={category.slug} value={category.slug}>
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
                            defaultValue={field.value}
                            disabled={!selectedCategory}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={t("admin.article.selectSubcategory")} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {getSubcategories(selectedCategory).map(subcategory => (
                                  <SelectItem key={subcategory.slug} value={subcategory.slug}>
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
                      <div key={field.id} className="flex mb-2">
                        <FormField
                          control={form.control}
                          name={`translations.${lang}.content.${index}`}
                          render={({ field }) => (
                            <FormItem className="flex-grow">
                              <FormControl>
                                <Textarea 
                                  placeholder={t("admin.article.paragraphPlaceholder")} 
                                  {...field} 
                                  rows={3}
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
                          className="ml-2 mt-1"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => append("")}
                      className="mt-2"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {t("admin.article.addParagraph")}
                    </Button>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>

          <div className="space-y-6">
            {/* Draft Status */}
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

            {/* Featured Image */}
            <div>
              <h3 className="text-lg font-medium mb-2">{t("admin.article.featuredImage")}</h3>

              {/* Current image preview */}
              {form.getValues().imageUrl && (
                <div className="mb-4">
                  <img 
                    src={form.getValues().imageUrl} 
                    alt={t("admin.article.preview")}
                    className="w-full h-40 object-cover rounded-md"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => form.setValue("imageUrl", "")}
                    className="mt-2"
                  >
                    {t("admin.article.removeImage")}
                  </Button>
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
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("admin.article.imageUrl")}</FormLabel>
                      <FormControl>
                        <Input placeholder="https://..." {...field} />
                      </FormControl>
                      <FormDescription>
                        {t("admin.article.imageUrlDescription")}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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