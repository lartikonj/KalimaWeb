import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useLanguage, Language } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { 
  getCategories, 
  getCategoryBySlug,
  createCategory,
  updateCategory
} from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter 
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
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
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { 
  LayoutDashboard, 
  FileText, 
  Settings,
  PlusCircle,
  PencilLine,
  Trash2,
  Save,
  X,
  FolderPlus,
  Tags
} from "lucide-react";

// Form schema for category creation/editing
const categoryFormSchema = z.object({
  slug: z.string().min(2, {
    message: "Slug must be at least 2 characters long"
  }).max(30, {
    message: "Slug must not be longer than 30 characters"
  }).regex(/^[a-z0-9-]+$/, {
    message: "Slug can only contain lowercase letters, numbers, and hyphens"
  }),
  titles: z.object({
    en: z.string().min(2, {
      message: "English title is required"
    }),
    fr: z.string(),
    ar: z.string(),
    es: z.string(),
    de: z.string()
  }),
  subcategories: z.array(
    z.object({
      slug: z.string().min(2).max(30).regex(/^[a-z0-9-]+$/, {
        message: "Slug can only contain lowercase letters, numbers, and hyphens"
      }),
      titles: z.object({
        en: z.string().min(2, {
          message: "English title is required"
        }),
        fr: z.string(),
        ar: z.string(),
        es: z.string(),
        de: z.string()
      })
    })
  ).default([])
});

type CategoryFormValues = z.infer<typeof categoryFormSchema>;

export default function CategoriesAdmin() {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<any | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeLanguage, setActiveLanguage] = useState<Language>("en");
  
  // Initialize form for category creation/editing
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      slug: "",
      titles: {
        en: "",
        fr: "",
        ar: "",
        es: "",
        de: ""
      },
      subcategories: []
    }
  });
  
  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const fetchedCategories = await getCategories();
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast({
          title: "Error",
          description: "Failed to load categories",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCategories();
  }, [toast]);
  
  // Handle category creation
  const handleCreateCategory = async (values: CategoryFormValues) => {
    try {
      // First, check if a category with this slug already exists
      const existingCategory = await getCategoryBySlug(values.slug);
      if (existingCategory) {
        toast({
          title: "Error",
          description: `A category with the slug "${values.slug}" already exists`,
          variant: "destructive"
        });
        return;
      }
      
      await createCategory(values);
      
      toast({
        title: "Success",
        description: "Category created successfully",
      });
      
      // Refresh categories list
      const updatedCategories = await getCategories();
      setCategories(updatedCategories);
      
      // Close the dialog and reset form
      setIsCreateDialogOpen(false);
      form.reset();
    } catch (error) {
      console.error("Error creating category:", error);
      toast({
        title: "Error",
        description: "Failed to create category",
        variant: "destructive"
      });
    }
  };
  
  // Handle category update
  const handleUpdateCategory = async (values: CategoryFormValues) => {
    try {
      await updateCategory(selectedCategory.id, values);
      
      toast({
        title: "Success",
        description: "Category updated successfully",
      });
      
      // Refresh categories list
      const updatedCategories = await getCategories();
      setCategories(updatedCategories);
      
      // Close the dialog and reset form
      setIsEditDialogOpen(false);
      setSelectedCategory(null);
      form.reset();
    } catch (error) {
      console.error("Error updating category:", error);
      toast({
        title: "Error",
        description: "Failed to update category",
        variant: "destructive"
      });
    }
  };
  
  // Handle editing a category
  const handleEditCategory = (category: any) => {
    setSelectedCategory(category);
    
    // Populate form with category data
    form.reset({
      slug: category.slug,
      titles: {
        en: category.titles.en || "",
        fr: category.titles.fr || "",
        ar: category.titles.ar || "",
        es: category.titles.es || "",
        de: category.titles.de || ""
      },
      subcategories: category.subcategories || []
    });
    
    setIsEditDialogOpen(true);
  };
  
  // Handle adding a new subcategory to the form
  const handleAddSubcategory = () => {
    const currentSubcategories = form.getValues("subcategories") || [];
    form.setValue("subcategories", [
      ...currentSubcategories,
      {
        slug: "",
        titles: {
          en: "",
          fr: "",
          ar: "",
          es: "",
          de: ""
        }
      }
    ]);
  };
  
  // Handle removing a subcategory from the form
  const handleRemoveSubcategory = (index: number) => {
    const currentSubcategories = form.getValues("subcategories") || [];
    form.setValue("subcategories", 
      currentSubcategories.filter((_, i) => i !== index)
    );
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-100">
          {t("admin.categories")}
        </h1>
        
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          {t("admin.createCategory")}
        </Button>
      </div>
      
      {/* Admin navigation tabs */}
      <Tabs defaultValue="categories" className="space-y-8">
        <TabsList className="grid grid-cols-4 md:w-[600px]">
          <TabsTrigger value="dashboard" className="flex items-center" asChild>
            <Link href="/admin/dashboard">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">{t("admin.dashboard")}</span>
            </Link>
          </TabsTrigger>
          <TabsTrigger value="articles" className="flex items-center" asChild>
            <Link href="/admin/articles">
              <FileText className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">{t("admin.articles")}</span>
            </Link>
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center">
            <Tags className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">{t("admin.categories")}</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center" asChild>
            <Link href="/admin/settings">
              <Settings className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">{t("admin.settings")}</span>
            </Link>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="categories" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("admin.categoriesList")}</CardTitle>
              <CardDescription>
                {t("admin.manageCategoriesDescription")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-10">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : categories.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-muted-foreground mb-4">
                    {t("admin.noCategories")}
                  </p>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(true)}>
                    <FolderPlus className="mr-2 h-4 w-4" />
                    {t("admin.addFirstCategory")}
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("admin.name")}</TableHead>
                      <TableHead>{t("admin.slug")}</TableHead>
                      <TableHead>{t("admin.languages")}</TableHead>
                      <TableHead>{t("admin.subcategories")}</TableHead>
                      <TableHead className="text-right">{t("admin.actions")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categories.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell className="font-medium">
                          {category.titles?.en || category.slug}
                        </TableCell>
                        <TableCell>{category.slug}</TableCell>
                        <TableCell>
                          {category.titles 
                            ? Object.keys(category.titles)
                                .filter(lang => category.titles[lang])
                                .map(lang => lang.toUpperCase())
                                .join(", ")
                            : "EN"
                          }
                        </TableCell>
                        <TableCell>
                          {category.subcategories?.length || 0}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditCategory(category)}
                          >
                            <PencilLine className="h-4 w-4 mr-1" />
                            {t("admin.edit")}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Create Category Dialog */}
      <Dialog 
        open={isCreateDialogOpen} 
        onOpenChange={(open) => {
          setIsCreateDialogOpen(open);
          if (!open) form.reset();
        }}
      >
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t("admin.createNewCategory")}</DialogTitle>
            <DialogDescription>
              {t("admin.createCategoryDescription")}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleCreateCategory)} className="space-y-6">
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("admin.slug")}</FormLabel>
                    <FormControl>
                      <Input placeholder="category-slug" {...field} />
                    </FormControl>
                    <FormDescription>
                      {t("admin.slugDescription")}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-4">{t("admin.categoryTitles")}</h3>
                
                <Tabs defaultValue="en" className="mb-6">
                  <TabsList>
                    <TabsTrigger value="en">English</TabsTrigger>
                    <TabsTrigger value="fr">Français</TabsTrigger>
                    <TabsTrigger value="ar">العربية</TabsTrigger>
                    <TabsTrigger value="es">Español</TabsTrigger>
                    <TabsTrigger value="de">Deutsch</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="en" className="pt-4">
                    <FormField
                      control={form.control}
                      name="titles.en"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>English Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Category name in English" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                  
                  <TabsContent value="fr" className="pt-4">
                    <FormField
                      control={form.control}
                      name="titles.fr"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>French Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Category name in French" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                  
                  <TabsContent value="ar" className="pt-4">
                    <FormField
                      control={form.control}
                      name="titles.ar"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Arabic Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Category name in Arabic" {...field} dir="rtl" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                  
                  <TabsContent value="es" className="pt-4">
                    <FormField
                      control={form.control}
                      name="titles.es"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Spanish Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Category name in Spanish" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                  
                  <TabsContent value="de" className="pt-4">
                    <FormField
                      control={form.control}
                      name="titles.de"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>German Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Category name in German" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                </Tabs>
              </div>
              
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium">{t("admin.subcategories")}</h3>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={handleAddSubcategory}
                  >
                    <PlusCircle className="h-4 w-4 mr-1" />
                    {t("admin.addSubcategory")}
                  </Button>
                </div>
                
                {form.watch("subcategories")?.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    {t("admin.noSubcategories")}
                  </div>
                ) : (
                  <Accordion type="multiple" className="w-full">
                    {form.watch("subcategories")?.map((_, index) => (
                      <AccordionItem key={index} value={`subcategory-${index}`}>
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex justify-between w-full items-center pr-4">
                            <span>
                              {form.watch(`subcategories.${index}.titles.en`) || 
                              form.watch(`subcategories.${index}.slug`) || 
                              t("admin.newSubcategory")}
                            </span>
                            <Button 
                              type="button"
                              variant="ghost" 
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveSubcategory(index);
                              }}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-4 pt-2">
                            <FormField
                              control={form.control}
                              name={`subcategories.${index}.slug`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>{t("admin.slug")}</FormLabel>
                                  <FormControl>
                                    <Input placeholder="subcategory-slug" {...field} />
                                  </FormControl>
                                  <FormDescription>
                                    {t("admin.slugDescription")}
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <div className="border rounded-lg p-4 mt-4">
                              <h4 className="font-medium mb-4">{t("admin.subcategoryTitles")}</h4>
                              
                              <Tabs defaultValue="en" className="mb-6">
                                <TabsList>
                                  <TabsTrigger value="en">English</TabsTrigger>
                                  <TabsTrigger value="fr">Français</TabsTrigger>
                                  <TabsTrigger value="ar">العربية</TabsTrigger>
                                  <TabsTrigger value="es">Español</TabsTrigger>
                                  <TabsTrigger value="de">Deutsch</TabsTrigger>
                                </TabsList>
                                
                                <TabsContent value="en" className="pt-4">
                                  <FormField
                                    control={form.control}
                                    name={`subcategories.${index}.titles.en`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>English Title</FormLabel>
                                        <FormControl>
                                          <Input placeholder="Subcategory name in English" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </TabsContent>
                                
                                <TabsContent value="fr" className="pt-4">
                                  <FormField
                                    control={form.control}
                                    name={`subcategories.${index}.titles.fr`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>French Title</FormLabel>
                                        <FormControl>
                                          <Input placeholder="Subcategory name in French" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </TabsContent>
                                
                                <TabsContent value="ar" className="pt-4">
                                  <FormField
                                    control={form.control}
                                    name={`subcategories.${index}.titles.ar`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Arabic Title</FormLabel>
                                        <FormControl>
                                          <Input placeholder="Subcategory name in Arabic" {...field} dir="rtl" />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </TabsContent>
                                
                                <TabsContent value="es" className="pt-4">
                                  <FormField
                                    control={form.control}
                                    name={`subcategories.${index}.titles.es`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Spanish Title</FormLabel>
                                        <FormControl>
                                          <Input placeholder="Subcategory name in Spanish" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </TabsContent>
                                
                                <TabsContent value="de" className="pt-4">
                                  <FormField
                                    control={form.control}
                                    name={`subcategories.${index}.titles.de`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>German Title</FormLabel>
                                        <FormControl>
                                          <Input placeholder="Subcategory name in German" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </TabsContent>
                              </Tabs>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                )}
              </div>
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  {t("general.cancel")}
                </Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {t("general.saving")}
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Save className="h-4 w-4 mr-1" />
                      {t("general.save")}
                    </div>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Edit Category Dialog */}
      <Dialog 
        open={isEditDialogOpen} 
        onOpenChange={(open) => {
          setIsEditDialogOpen(open);
          if (!open) {
            setSelectedCategory(null);
            form.reset();
          }
        }}
      >
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t("admin.editCategory")}</DialogTitle>
            <DialogDescription>
              {t("admin.editCategoryDescription")}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleUpdateCategory)} className="space-y-6">
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("admin.slug")}</FormLabel>
                    <FormControl>
                      <Input placeholder="category-slug" {...field} readOnly />
                    </FormControl>
                    <FormDescription>
                      {t("admin.slugCannotBeChanged")}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-4">{t("admin.categoryTitles")}</h3>
                
                <Tabs defaultValue="en" className="mb-6">
                  <TabsList>
                    <TabsTrigger value="en">English</TabsTrigger>
                    <TabsTrigger value="fr">Français</TabsTrigger>
                    <TabsTrigger value="ar">العربية</TabsTrigger>
                    <TabsTrigger value="es">Español</TabsTrigger>
                    <TabsTrigger value="de">Deutsch</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="en" className="pt-4">
                    <FormField
                      control={form.control}
                      name="titles.en"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>English Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Category name in English" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                  
                  <TabsContent value="fr" className="pt-4">
                    <FormField
                      control={form.control}
                      name="titles.fr"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>French Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Category name in French" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                  
                  <TabsContent value="ar" className="pt-4">
                    <FormField
                      control={form.control}
                      name="titles.ar"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Arabic Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Category name in Arabic" {...field} dir="rtl" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                  
                  <TabsContent value="es" className="pt-4">
                    <FormField
                      control={form.control}
                      name="titles.es"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Spanish Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Category name in Spanish" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                  
                  <TabsContent value="de" className="pt-4">
                    <FormField
                      control={form.control}
                      name="titles.de"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>German Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Category name in German" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                </Tabs>
              </div>
              
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium">{t("admin.subcategories")}</h3>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={handleAddSubcategory}
                  >
                    <PlusCircle className="h-4 w-4 mr-1" />
                    {t("admin.addSubcategory")}
                  </Button>
                </div>
                
                {form.watch("subcategories")?.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    {t("admin.noSubcategories")}
                  </div>
                ) : (
                  <Accordion type="multiple" className="w-full">
                    {form.watch("subcategories")?.map((_, index) => (
                      <AccordionItem key={index} value={`subcategory-${index}`}>
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex justify-between w-full items-center pr-4">
                            <span>
                              {form.watch(`subcategories.${index}.titles.en`) || 
                              form.watch(`subcategories.${index}.slug`) || 
                              t("admin.subcategory")}
                            </span>
                            <Button 
                              type="button"
                              variant="ghost" 
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveSubcategory(index);
                              }}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-4 pt-2">
                            <FormField
                              control={form.control}
                              name={`subcategories.${index}.slug`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>{t("admin.slug")}</FormLabel>
                                  <FormControl>
                                    <Input placeholder="subcategory-slug" {...field} />
                                  </FormControl>
                                  <FormDescription>
                                    {t("admin.slugDescription")}
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <div className="border rounded-lg p-4 mt-4">
                              <h4 className="font-medium mb-4">{t("admin.subcategoryTitles")}</h4>
                              
                              <Tabs defaultValue="en" className="mb-6">
                                <TabsList>
                                  <TabsTrigger value="en">English</TabsTrigger>
                                  <TabsTrigger value="fr">Français</TabsTrigger>
                                  <TabsTrigger value="ar">العربية</TabsTrigger>
                                  <TabsTrigger value="es">Español</TabsTrigger>
                                  <TabsTrigger value="de">Deutsch</TabsTrigger>
                                </TabsList>
                                
                                <TabsContent value="en" className="pt-4">
                                  <FormField
                                    control={form.control}
                                    name={`subcategories.${index}.titles.en`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>English Title</FormLabel>
                                        <FormControl>
                                          <Input placeholder="Subcategory name in English" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </TabsContent>
                                
                                <TabsContent value="fr" className="pt-4">
                                  <FormField
                                    control={form.control}
                                    name={`subcategories.${index}.titles.fr`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>French Title</FormLabel>
                                        <FormControl>
                                          <Input placeholder="Subcategory name in French" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </TabsContent>
                                
                                <TabsContent value="ar" className="pt-4">
                                  <FormField
                                    control={form.control}
                                    name={`subcategories.${index}.titles.ar`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Arabic Title</FormLabel>
                                        <FormControl>
                                          <Input placeholder="Subcategory name in Arabic" {...field} dir="rtl" />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </TabsContent>
                                
                                <TabsContent value="es" className="pt-4">
                                  <FormField
                                    control={form.control}
                                    name={`subcategories.${index}.titles.es`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Spanish Title</FormLabel>
                                        <FormControl>
                                          <Input placeholder="Subcategory name in Spanish" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </TabsContent>
                                
                                <TabsContent value="de" className="pt-4">
                                  <FormField
                                    control={form.control}
                                    name={`subcategories.${index}.titles.de`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>German Title</FormLabel>
                                        <FormControl>
                                          <Input placeholder="Subcategory name in German" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </TabsContent>
                              </Tabs>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                )}
              </div>
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setIsEditDialogOpen(false);
                    setSelectedCategory(null);
                  }}
                >
                  {t("general.cancel")}
                </Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {t("general.saving")}
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Save className="h-4 w-4 mr-1" />
                      {t("general.save")}
                    </div>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}