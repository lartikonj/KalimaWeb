import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { Language, useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const staticPageSchema = z.object({
  slug: z
    .string()
    .min(2, { message: "Slug must be at least 2 characters" })
    .max(50, { message: "Slug must be less than 50 characters" })
    .regex(/^[a-z0-9-]+$/, {
      message: "Slug can only contain lowercase letters, numbers, and hyphens",
    }),
  translations: z.record(
    z.object({
      title: z.string().min(1, { message: "Title is required" }),
      content: z.string().min(1, { message: "Content is required" }),
      keywords: z.array(z.string()).optional(),
    })
  ),
});

type StaticPageFormValues = z.infer<typeof staticPageSchema>;

interface StaticPageFormProps {
  initialData?: {
    id?: string;
    slug: string;
    availableLanguages: string[];
    translations: Record<string, {
      title: string;
      content: string;
      keywords?: string[];
    }>;
    updatedAt?: any;
  };
  onSubmit: (data: StaticPageFormValues) => Promise<void>;
  isSubmitting?: boolean;
}

export function StaticPageForm({
  initialData,
  onSubmit,
  isSubmitting = false,
}: StaticPageFormProps) {
  const { language: currentLanguage } = useLanguage();
  const [activeLanguages, setActiveLanguages] = useState<Language[]>(
    initialData?.availableLanguages as Language[] || [currentLanguage]
  );
  const [newKeyword, setNewKeyword] = useState("");
  const [activeTab, setActiveTab] = useState<Language>(
    activeLanguages[0] || "en"
  );

  // Default values for the form
  const defaultValues: StaticPageFormValues = {
    slug: initialData?.slug || "",
    translations: initialData?.translations || {
      [currentLanguage]: {
        title: "",
        content: "",
        keywords: [],
      },
    },
  };

  const form = useForm<StaticPageFormValues>({
    resolver: zodResolver(staticPageSchema),
    defaultValues,
  });

  const toggleLanguage = (lang: Language) => {
    if (activeLanguages.includes(lang)) {
      // Only allow removing a language if there will still be at least one language active
      if (activeLanguages.length > 1) {
        setActiveLanguages(activeLanguages.filter((l) => l !== lang));
        
        // If the active tab is being removed, switch to another tab
        if (activeTab === lang) {
          const newActiveTab = activeLanguages.find((l) => l !== lang) || "en";
          setActiveTab(newActiveTab);
        }
      }
    } else {
      setActiveLanguages([...activeLanguages, lang]);
      
      // If this is the first language being added, make it the active tab
      if (activeLanguages.length === 0) {
        setActiveTab(lang);
      }
      
      // Initialize form values for the new language
      const currentTranslations = form.getValues("translations");
      if (!currentTranslations[lang]) {
        form.setValue(`translations.${lang}`, {
          title: "",
          content: "",
          keywords: [],
        });
      }
    }
  };

  const addKeyword = (lang: Language) => {
    if (!newKeyword.trim()) return;
    
    const currentKeywords = form.getValues(`translations.${lang}.keywords`) || [];
    form.setValue(`translations.${lang}.keywords`, [...currentKeywords, newKeyword.trim()]);
    setNewKeyword("");
  };

  const removeKeyword = (lang: Language, index: number) => {
    const currentKeywords = form.getValues(`translations.${lang}.keywords`) || [];
    form.setValue(
      `translations.${lang}.keywords`,
      currentKeywords.filter((_, i) => i !== index)
    );
  };

  const handleSubmit = async (data: StaticPageFormValues) => {
    // Ensure only active languages are included in the final data
    const filteredTranslations: Record<string, any> = {};
    activeLanguages.forEach((lang) => {
      if (data.translations[lang]) {
        filteredTranslations[lang] = data.translations[lang];
      }
    });
    
    // Submit the form with only the active languages
    await onSubmit({
      ...data,
      translations: filteredTranslations,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        {/* Slug Field */}
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Page Slug</FormLabel>
              <FormControl>
                <Input
                  placeholder="about-us"
                  {...field}
                  disabled={!!initialData?.id}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Language Toggles */}
        <div className="space-y-2">
          <FormLabel>Available Languages</FormLabel>
          <div className="flex flex-wrap gap-2">
            <LanguageToggle
              code="en"
              label="English"
              isActive={activeLanguages.includes("en")}
              onClick={() => toggleLanguage("en")}
              disabled={activeLanguages.length === 1 && activeLanguages.includes("en")}
            />
            <LanguageToggle
              code="fr"
              label="French"
              isActive={activeLanguages.includes("fr")}
              onClick={() => toggleLanguage("fr")}
              disabled={activeLanguages.length === 1 && activeLanguages.includes("fr")}
            />
            <LanguageToggle
              code="ar"
              label="Arabic"
              isActive={activeLanguages.includes("ar")}
              onClick={() => toggleLanguage("ar")}
              disabled={activeLanguages.length === 1 && activeLanguages.includes("ar")}
            />
            <LanguageToggle
              code="es"
              label="Spanish"
              isActive={activeLanguages.includes("es")}
              onClick={() => toggleLanguage("es")}
              disabled={activeLanguages.length === 1 && activeLanguages.includes("es")}
            />
            <LanguageToggle
              code="de"
              label="German"
              isActive={activeLanguages.includes("de")}
              onClick={() => toggleLanguage("de")}
              disabled={activeLanguages.length === 1 && activeLanguages.includes("de")}
            />
          </div>
        </div>

        {/* Tabs for each language */}
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as Language)}
          className="w-full"
        >
          <TabsList className="mb-4">
            {activeLanguages.map((lang) => (
              <TabsTrigger key={lang} value={lang} className="uppercase">
                {lang}
              </TabsTrigger>
            ))}
          </TabsList>

          {activeLanguages.map((lang) => (
            <TabsContent key={lang} value={lang} className="space-y-6">
              <Card>
                <CardContent className="pt-6 space-y-6">
                  {/* Title Field */}
                  <FormField
                    control={form.control}
                    name={`translations.${lang}.title`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title ({lang.toUpperCase()})</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={`Title in ${lang}`}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Content Field */}
                  <FormField
                    control={form.control}
                    name={`translations.${lang}.content`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Content ({lang.toUpperCase()})</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder={`Content in ${lang} (Markdown supported)`}
                            className="min-h-[300px] font-mono"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Keywords Field */}
                  <div className="space-y-2">
                    <FormLabel>Keywords ({lang.toUpperCase()})</FormLabel>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add keyword"
                        value={newKeyword}
                        onChange={(e) => setNewKeyword(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addKeyword(lang);
                          }
                        }}
                      />
                      <Button
                        type="button"
                        onClick={() => addKeyword(lang)}
                      >
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {form.watch(`translations.${lang}.keywords`)?.map(
                        (keyword, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="flex items-center gap-1"
                          >
                            {keyword}
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-4 w-4 ml-1 p-0"
                              onClick={() => removeKeyword(lang, index)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </Badge>
                        )
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : initialData?.id ? "Update Page" : "Create Page"}
        </Button>
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
      className="flex items-center gap-2"
    >
      <span className="text-xs font-bold uppercase">{code}</span>
      <span className="hidden sm:inline">{label}</span>
    </Button>
  );
}