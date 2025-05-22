import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PenLine, FileText, Loader2 } from "lucide-react";
import { addSuggestion } from "@/lib/firebase";
import { Link } from "wouter";
import { Language } from "@/contexts/LanguageContext";

// Form validation schema
const formSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters.",
  }).max(100, {
    message: "Title must not exceed 100 characters."
  }),
  language: z.enum(["en", "ar", "fr", "es", "de"] as const),
  content: z.string().min(20, {
    message: "Content must be at least 20 characters.",
  }),
});

export default function Suggestions() {
  const { t, language } = useLanguage();
  const { user, userData } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("new");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form setup
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      language: language as Language,
      content: "",
    },
  });
  
  // Submit handler
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      toast({
        title: t("auth.loginRequired"),
        description: t("auth.loginToSubmitSuggestion"),
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Split content into paragraphs
      const paragraphs = values.content
        .split('\n')
        .map(p => p.trim())
        .filter(p => p.length > 0);
      
      if (paragraphs.length === 0) {
        paragraphs.push(values.content);
      }
      
      // Prepare suggestion object
      const suggestion = {
        title: values.title,
        language: values.language,
        content: paragraphs,
      };
      
      // Add suggestion to user's account
      await addSuggestion(user.uid, suggestion);
      
      // Show success message
      toast({
        title: t("suggestions.form.success"),
        description: t("suggestions.form.successMessage"),
      });
      
      // Reset form and switch to submitted tab
      form.reset();
      setActiveTab("submitted");
    } catch (error) {
      console.error("Error submitting suggestion:", error);
      toast({
        title: t("error.title"),
        description: error instanceof Error ? error.message : t("error.generic"),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!user || !userData) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p>{t("auth.loginRequired")}</p>
        <Button asChild className="mt-4">
          <Link href="/login">
            {t("auth.login")}
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-neutral-800 dark:text-neutral-100">
        {t("suggestions.title")}
      </h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-2 w-[400px] mx-auto">
          <TabsTrigger value="new" className="flex items-center">
            <PenLine className="h-4 w-4 mr-2" />
            {t("suggestions.new")}
          </TabsTrigger>
          <TabsTrigger value="submitted" className="flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            {t("suggestions.submitted")}
          </TabsTrigger>
        </TabsList>
        
        {/* New Suggestion Tab */}
        <TabsContent value="new">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>{t("suggestions.form.title")}</CardTitle>
              <CardDescription>
                {t("suggestions.form.description")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("suggestions.form.titleLabel")}</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder={t("suggestions.form.titlePlaceholder")} 
                            {...field} 
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="language"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("suggestions.form.language")}</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                          disabled={isSubmitting}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={t("language.selectLanguage")} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="ar">العربية</SelectItem>
                            <SelectItem value="fr">Français</SelectItem>
                            <SelectItem value="es">Español</SelectItem>
                            <SelectItem value="de">Deutsch</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          {t("suggestions.form.languageDescription")}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("suggestions.form.content")}</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder={t("suggestions.form.contentPlaceholder")} 
                            {...field} 
                            rows={8}
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormDescription>
                          {t("suggestions.form.contentDescription")}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t("general.submitting")}
                      </>
                    ) : (
                      t("suggestions.form.submit")
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Submitted Suggestions Tab */}
        <TabsContent value="submitted">
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle>{t("suggestions.submitted")}</CardTitle>
              <CardDescription>
                {t("suggestions.submittedDescription")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!userData.suggestedArticles || userData.suggestedArticles.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">{t("suggestions.empty")}</h3>
                  <p className="text-muted-foreground mb-4">{t("suggestions.emptyDescription")}</p>
                  <Button onClick={() => setActiveTab("new")}>
                    {t("suggestions.new")}
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {userData.suggestedArticles.map((suggestion, index) => (
                    <Card key={index} className="overflow-hidden">
                      <CardHeader className="bg-muted/50 pb-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{suggestion.title}</CardTitle>
                            <CardDescription className="flex items-center mt-1">
                              <div className="flex items-center">
                                <span className="text-xs uppercase font-semibold tracking-wider px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded mr-2">
                                  {suggestion.language}
                                </span>
                                <span className="text-xs">
                                  {suggestion.content.length} {t("admin.suggestions.paragraphs")}
                                </span>
                              </div>
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <div className="prose dark:prose-invert max-w-none prose-sm">
                          {suggestion.content.map((paragraph, pIndex) => (
                            <p key={pIndex} className={pIndex === 0 ? "" : "mt-2"}>
                              {paragraph}
                            </p>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-center border-t pt-6">
              <Button 
                variant={activeTab === "new" ? "default" : "outline"}
                onClick={() => setActiveTab("new")}
              >
                <PenLine className="h-4 w-4 mr-2" />
                {t("suggestions.new")}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
