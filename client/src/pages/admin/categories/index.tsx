import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useLanguage, Language } from "@/contexts/LanguageContext";
import { getCategories, createCategory, updateCategory, deleteCategory } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { 
  FolderPlus, 
  Folder, 
  FolderTree, 
  Edit, 
  Trash2, 
  Plus,
  Languages,
  Save
} from "lucide-react";

// Define interface for category data
interface CategoryData {
  id: string;
  slug: string;
  titles: Record<string, string>;
  subcategories: Array<{
    slug: string;
    titles: Record<string, string>;
  }>;
}

export default function CategoriesAdmin() {
  const { t, language } = useLanguage();
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeLanguage, setActiveLanguage] = useState<Language>(language);
  
  // States for category operations
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [newCategorySlug, setNewCategorySlug] = useState("");
  const [newCategoryTitles, setNewCategoryTitles] = useState<Record<string, string>>({
    en: "", fr: "", es: "", de: "", ar: ""
  });
  
  // States for subcategory operations
  const [categoryToAddSubcategory, setCategoryToAddSubcategory] = useState<string | null>(null);
  const [isAddSubcategoryOpen, setIsAddSubcategoryOpen] = useState(false);
  const [newSubcategorySlug, setNewSubcategorySlug] = useState("");
  const [newSubcategoryTitles, setNewSubcategoryTitles] = useState<Record<string, string>>({
    en: "", fr: "", es: "", de: "", ar: ""
  });
  
  // States for editing
  const [categoryToEdit, setCategoryToEdit] = useState<CategoryData | null>(null);
  const [subcategoryToEdit, setSubcategoryToEdit] = useState<{
    categoryId: string;
    subcategoryIndex: number;
    subcategory: { slug: string; titles: Record<string, string> };
  } | null>(null);
  const [isEditCategoryOpen, setIsEditCategoryOpen] = useState(false);
  const [isEditSubcategoryOpen, setIsEditSubcategoryOpen] = useState(false);
  const [editedCategoryTitles, setEditedCategoryTitles] = useState<Record<string, string>>({
    en: "", fr: "", es: "", de: "", ar: ""
  });
  const [editedSubcategoryTitles, setEditedSubcategoryTitles] = useState<Record<string, string>>({
    en: "", fr: "", es: "", de: "", ar: ""
  });
  
  // States for deletion
  const [categoryToDelete, setCategoryToDelete] = useState<CategoryData | null>(null);
  const [subcategoryToDelete, setSubcategoryToDelete] = useState<{
    categoryId: string;
    subcategoryIndex: number;
    subcategory: { slug: string; titles: Record<string, string> };
  } | null>(null);

  // Fetch all categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const fetchedCategories = await getCategories();
        setCategories(fetchedCategories as CategoryData[]);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast({
          title: t("admin.error"),
          description: t("admin.errorFetchingCategories"),
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCategories();
  }, [t]);

  // Generate a slug from a title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/gi, '-');
  };

  // Handle creating a new category
  const handleCreateCategory = async () => {
    if (!newCategorySlug.trim()) {
      toast({
        title: t("admin.error"),
        description: t("admin.slugRequired"),
        variant: "destructive"
      });
      return;
    }
    
    if (!newCategoryTitles.en.trim()) {
      toast({
        title: t("admin.error"),
        description: t("admin.englishTitleRequired"),
        variant: "destructive"
      });
      return;
    }
    
    try {
      const newCategory = await createCategory({
        slug: newCategorySlug,
        titles: newCategoryTitles,
        subcategories: []
      });
      
      setCategories([...categories, newCategory as CategoryData]);
      
      setNewCategorySlug("");
      setNewCategoryTitles({
        en: "", fr: "", es: "", de: "", ar: ""
      });
      
      setIsAddCategoryOpen(false);
      
      toast({
        title: t("admin.success"),
        description: t("admin.categoryCreated"),
      });
    } catch (error) {
      console.error("Error creating category:", error);
      toast({
        title: t("admin.error"),
        description: t("admin.errorCreatingCategory"),
        variant: "destructive"
      });
    }
  };

  // Handle creating a new subcategory
  const handleCreateSubcategory = async () => {
    if (!categoryToAddSubcategory) return;
    
    if (!newSubcategorySlug.trim()) {
      toast({
        title: t("admin.error"),
        description: t("admin.slugRequired"),
        variant: "destructive"
      });
      return;
    }
    
    if (!newSubcategoryTitles.en.trim()) {
      toast({
        title: t("admin.error"),
        description: t("admin.englishTitleRequired"),
        variant: "destructive"
      });
      return;
    }
    
    try {
      const category = categories.find(cat => cat.id === categoryToAddSubcategory);
      if (!category) return;
      
      // Check if subcategory slug already exists
      const slugExists = category.subcategories.some(sub => sub.slug === newSubcategorySlug);
      if (slugExists) {
        toast({
          title: t("admin.error"),
          description: t("admin.subcategorySlugExists"),
          variant: "destructive"
        });
        return;
      }
      
      const newSubcategory = {
        slug: newSubcategorySlug,
        titles: newSubcategoryTitles
      };
      
      const updatedCategory = {
        ...category,
        subcategories: [...category.subcategories, newSubcategory]
      };
      
      await updateCategory(category.id, {
        slug: category.slug,
        titles: category.titles,
        subcategories: updatedCategory.subcategories
      });
      
      setCategories(categories.map(cat => 
        cat.id === category.id ? updatedCategory : cat
      ));
      
      setNewSubcategorySlug("");
      setNewSubcategoryTitles({
        en: "", fr: "", es: "", de: "", ar: ""
      });
      setCategoryToAddSubcategory(null);
      setIsAddSubcategoryOpen(false);
      
      toast({
        title: t("admin.success"),
        description: t("admin.subcategoryCreated"),
      });
    } catch (error) {
      console.error("Error creating subcategory:", error);
      toast({
        title: t("admin.error"),
        description: t("admin.errorCreatingSubcategory"),
        variant: "destructive"
      });
    }
  };

  // Handle updating a category
  const handleUpdateCategory = async () => {
    if (!categoryToEdit) return;
    
    if (!editedCategoryTitles.en.trim()) {
      toast({
        title: t("admin.error"),
        description: t("admin.englishTitleRequired"),
        variant: "destructive"
      });
      return;
    }
    
    try {
      const updatedCategory = {
        ...categoryToEdit,
        titles: editedCategoryTitles
      };
      
      await updateCategory(categoryToEdit.id, {
        slug: categoryToEdit.slug,
        titles: editedCategoryTitles,
        subcategories: categoryToEdit.subcategories
      });
      
      setCategories(categories.map(cat => 
        cat.id === categoryToEdit.id ? updatedCategory : cat
      ));
      
      setCategoryToEdit(null);
      setIsEditCategoryOpen(false);
      
      toast({
        title: t("admin.success"),
        description: t("admin.categoryUpdated"),
      });
    } catch (error) {
      console.error("Error updating category:", error);
      toast({
        title: t("admin.error"),
        description: t("admin.errorUpdatingCategory"),
        variant: "destructive"
      });
    }
  };

  // Handle updating a subcategory
  const handleUpdateSubcategory = async () => {
    if (!subcategoryToEdit) return;
    
    if (!editedSubcategoryTitles.en.trim()) {
      toast({
        title: t("admin.error"),
        description: t("admin.englishTitleRequired"),
        variant: "destructive"
      });
      return;
    }
    
    try {
      const category = categories.find(cat => cat.id === subcategoryToEdit.categoryId);
      if (!category) return;
      
      const updatedSubcategories = [...category.subcategories];
      updatedSubcategories[subcategoryToEdit.subcategoryIndex] = {
        slug: subcategoryToEdit.subcategory.slug,
        titles: editedSubcategoryTitles
      };
      
      const updatedCategory = {
        ...category,
        subcategories: updatedSubcategories
      };
      
      await updateCategory(category.id, {
        slug: category.slug,
        titles: category.titles,
        subcategories: updatedSubcategories
      });
      
      setCategories(categories.map(cat => 
        cat.id === category.id ? updatedCategory : cat
      ));
      
      setSubcategoryToEdit(null);
      setIsEditSubcategoryOpen(false);
      
      toast({
        title: t("admin.success"),
        description: t("admin.subcategoryUpdated"),
      });
    } catch (error) {
      console.error("Error updating subcategory:", error);
      toast({
        title: t("admin.error"),
        description: t("admin.errorUpdatingSubcategory"),
        variant: "destructive"
      });
    }
  };

  // Handle deleting a category
  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return;
    
    try {
      await deleteCategory(categoryToDelete.id);
      
      setCategories(categories.filter(cat => cat.id !== categoryToDelete.id));
      setCategoryToDelete(null);
      
      toast({
        title: t("admin.success"),
        description: t("admin.categoryDeleted"),
      });
    } catch (error) {
      console.error("Error deleting category:", error);
      toast({
        title: t("admin.error"),
        description: t("admin.errorDeletingCategory"),
        variant: "destructive"
      });
    }
  };

  // Handle deleting a subcategory
  const handleDeleteSubcategory = async () => {
    if (!subcategoryToDelete) return;
    
    try {
      const category = categories.find(cat => cat.id === subcategoryToDelete.categoryId);
      if (!category) return;
      
      const updatedSubcategories = category.subcategories.filter(
        (_, index) => index !== subcategoryToDelete.subcategoryIndex
      );
      
      const updatedCategory = {
        ...category,
        subcategories: updatedSubcategories
      };
      
      await updateCategory(category.id, {
        slug: category.slug,
        titles: category.titles,
        subcategories: updatedSubcategories
      });
      
      setCategories(categories.map(cat => 
        cat.id === category.id ? updatedCategory : cat
      ));
      
      setSubcategoryToDelete(null);
      
      toast({
        title: t("admin.success"),
        description: t("admin.subcategoryDeleted"),
      });
    } catch (error) {
      console.error("Error deleting subcategory:", error);
      toast({
        title: t("admin.error"),
        description: t("admin.errorDeletingSubcategory"),
        variant: "destructive"
      });
    }
  };
  
  // Helper function to get title in preferred language
  const getLocalizedTitle = (titles: Record<string, string>) => {
    if (titles[language]) return titles[language];
    if (titles.en) return titles.en;
    return Object.values(titles).find(title => title) || "Untitled";
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-100">
            {t("admin.categoriesManagement")}
          </h1>
          
          <Button onClick={() => setIsAddCategoryOpen(true)}>
            <FolderPlus className="h-4 w-4 mr-2" />
            {t("admin.addCategory")}
          </Button>
        </div>
        
        {/* Categories List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="animate-pulse space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
              ))}
            </div>
          ) : categories.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <FolderTree className="h-10 w-10 mx-auto mb-4 text-neutral-400" />
                <p className="text-neutral-500 dark:text-neutral-400">
                  {t("admin.noCategories")}
                </p>
                <Button className="mt-4" onClick={() => setIsAddCategoryOpen(true)}>
                  <FolderPlus className="h-4 w-4 mr-2" />
                  {t("admin.addCategory")}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Accordion type="single" collapsible className="w-full space-y-4">
              {categories.map((category) => (
                <AccordionItem key={category.id} value={category.id} className="border rounded-md overflow-hidden">
                  <AccordionTrigger className="px-4 py-4 hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                    <div className="flex items-center justify-between w-full pr-4">
                      <div className="flex items-center">
                        <Folder className="h-5 w-5 mr-3 text-primary-500" />
                        <div>
                          <h3 className="text-lg font-medium text-left">
                            {getLocalizedTitle(category.titles)}
                          </h3>
                          <p className="text-xs text-neutral-500 mt-1">
                            {t("admin.slug")}: <code>{category.slug}</code>
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setCategoryToEdit(category);
                            setEditedCategoryTitles(category.titles);
                            setIsEditCategoryOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          {t("admin.edit")}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500"
                          onClick={(e) => {
                            e.stopPropagation();
                            setCategoryToDelete(category);
                          }}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          {t("admin.delete")}
                        </Button>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 pt-2">
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">{t("admin.subcategories")}</h4>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setCategoryToAddSubcategory(category.id);
                            setIsAddSubcategoryOpen(true);
                          }}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          {t("admin.addSubcategory")}
                        </Button>
                      </div>
                      
                      {category.subcategories.length === 0 ? (
                        <p className="text-neutral-500 text-sm py-4 text-center">
                          {t("admin.noSubcategoriesYet")}
                        </p>
                      ) : (
                        <div className="space-y-2 mt-3">
                          {category.subcategories.map((subcategory, index) => (
                            <div 
                              key={subcategory.slug}
                              className="border rounded-md p-3 flex justify-between items-center hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                            >
                              <div>
                                <h5 className="font-medium">
                                  {getLocalizedTitle(subcategory.titles)}
                                </h5>
                                <p className="text-xs text-neutral-500 mt-1">
                                  {t("admin.slug")}: <code>{subcategory.slug}</code>
                                </p>
                              </div>
                              <div className="flex space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setSubcategoryToEdit({
                                      categoryId: category.id,
                                      subcategoryIndex: index,
                                      subcategory
                                    });
                                    setEditedSubcategoryTitles(subcategory.titles);
                                    setIsEditSubcategoryOpen(true);
                                  }}
                                >
                                  <Edit className="h-4 w-4 mr-1" />
                                  {t("admin.edit")}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-500"
                                  onClick={() => {
                                    setSubcategoryToDelete({
                                      categoryId: category.id,
                                      subcategoryIndex: index,
                                      subcategory
                                    });
                                  }}
                                >
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  {t("admin.delete")}
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>
      </div>
      
      {/* Add Category Dialog */}
      <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{t("admin.addNewCategory")}</DialogTitle>
            <DialogDescription>
              {t("admin.addNewCategoryDescription")}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category-slug" className="text-right">
                {t("admin.slug")}
              </Label>
              <div className="col-span-3">
                <Input
                  id="category-slug"
                  value={newCategorySlug}
                  onChange={(e) => setNewCategorySlug(e.target.value)}
                  placeholder="category-slug"
                />
                <p className="text-xs text-neutral-500 mt-1">
                  {t("admin.slugDescription")}
                </p>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium">{t("admin.titles")}</h4>
                <div className="flex gap-2">
                  <Languages className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
              
              <Tabs defaultValue="en" className="w-full">
                <TabsList className="grid grid-cols-5">
                  <TabsTrigger value="en">EN</TabsTrigger>
                  <TabsTrigger value="fr">FR</TabsTrigger>
                  <TabsTrigger value="es">ES</TabsTrigger>
                  <TabsTrigger value="de">DE</TabsTrigger>
                  <TabsTrigger value="ar">AR</TabsTrigger>
                </TabsList>
                <div className="mt-4 space-y-4">
                  <TabsContent value="en">
                    <Label htmlFor="title-en">{t("languages.en")}</Label>
                    <Input
                      id="title-en"
                      value={newCategoryTitles.en}
                      onChange={(e) => setNewCategoryTitles({...newCategoryTitles, en: e.target.value})}
                      placeholder={t("admin.englishTitleRequired")}
                      className="mt-1"
                    />
                  </TabsContent>
                  <TabsContent value="fr">
                    <Label htmlFor="title-fr">{t("languages.fr")}</Label>
                    <Input
                      id="title-fr"
                      value={newCategoryTitles.fr}
                      onChange={(e) => setNewCategoryTitles({...newCategoryTitles, fr: e.target.value})}
                      placeholder={t("admin.optionalTitle")}
                      className="mt-1"
                    />
                  </TabsContent>
                  <TabsContent value="es">
                    <Label htmlFor="title-es">{t("languages.es")}</Label>
                    <Input
                      id="title-es"
                      value={newCategoryTitles.es}
                      onChange={(e) => setNewCategoryTitles({...newCategoryTitles, es: e.target.value})}
                      placeholder={t("admin.optionalTitle")}
                      className="mt-1"
                    />
                  </TabsContent>
                  <TabsContent value="de">
                    <Label htmlFor="title-de">{t("languages.de")}</Label>
                    <Input
                      id="title-de"
                      value={newCategoryTitles.de}
                      onChange={(e) => setNewCategoryTitles({...newCategoryTitles, de: e.target.value})}
                      placeholder={t("admin.optionalTitle")}
                      className="mt-1"
                    />
                  </TabsContent>
                  <TabsContent value="ar">
                    <Label htmlFor="title-ar">{t("languages.ar")}</Label>
                    <Input
                      id="title-ar"
                      value={newCategoryTitles.ar}
                      onChange={(e) => setNewCategoryTitles({...newCategoryTitles, ar: e.target.value})}
                      placeholder={t("admin.optionalTitle")}
                      className="mt-1"
                      dir="rtl"
                    />
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsAddCategoryOpen(false)}
            >
              {t("admin.cancel")}
            </Button>
            <Button onClick={handleCreateCategory}>
              <Save className="h-4 w-4 mr-2" />
              {t("admin.saveCategory")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add Subcategory Dialog */}
      <Dialog open={isAddSubcategoryOpen} onOpenChange={setIsAddSubcategoryOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{t("admin.addNewSubcategory")}</DialogTitle>
            <DialogDescription>
              {t("admin.addNewSubcategoryDescription")}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="subcategory-slug" className="text-right">
                {t("admin.slug")}
              </Label>
              <div className="col-span-3">
                <Input
                  id="subcategory-slug"
                  value={newSubcategorySlug}
                  onChange={(e) => setNewSubcategorySlug(e.target.value)}
                  placeholder="subcategory-slug"
                />
                <p className="text-xs text-neutral-500 mt-1">
                  {t("admin.slugDescription")}
                </p>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium">{t("admin.titles")}</h4>
                <div className="flex gap-2">
                  <Languages className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
              
              <Tabs defaultValue="en" className="w-full">
                <TabsList className="grid grid-cols-5">
                  <TabsTrigger value="en">EN</TabsTrigger>
                  <TabsTrigger value="fr">FR</TabsTrigger>
                  <TabsTrigger value="es">ES</TabsTrigger>
                  <TabsTrigger value="de">DE</TabsTrigger>
                  <TabsTrigger value="ar">AR</TabsTrigger>
                </TabsList>
                <div className="mt-4 space-y-4">
                  <TabsContent value="en">
                    <Label htmlFor="subtitle-en">{t("languages.en")}</Label>
                    <Input
                      id="subtitle-en"
                      value={newSubcategoryTitles.en}
                      onChange={(e) => setNewSubcategoryTitles({...newSubcategoryTitles, en: e.target.value})}
                      placeholder={t("admin.englishTitleRequired")}
                      className="mt-1"
                    />
                  </TabsContent>
                  <TabsContent value="fr">
                    <Label htmlFor="subtitle-fr">{t("languages.fr")}</Label>
                    <Input
                      id="subtitle-fr"
                      value={newSubcategoryTitles.fr}
                      onChange={(e) => setNewSubcategoryTitles({...newSubcategoryTitles, fr: e.target.value})}
                      placeholder={t("admin.optionalTitle")}
                      className="mt-1"
                    />
                  </TabsContent>
                  <TabsContent value="es">
                    <Label htmlFor="subtitle-es">{t("languages.es")}</Label>
                    <Input
                      id="subtitle-es"
                      value={newSubcategoryTitles.es}
                      onChange={(e) => setNewSubcategoryTitles({...newSubcategoryTitles, es: e.target.value})}
                      placeholder={t("admin.optionalTitle")}
                      className="mt-1"
                    />
                  </TabsContent>
                  <TabsContent value="de">
                    <Label htmlFor="subtitle-de">{t("languages.de")}</Label>
                    <Input
                      id="subtitle-de"
                      value={newSubcategoryTitles.de}
                      onChange={(e) => setNewSubcategoryTitles({...newSubcategoryTitles, de: e.target.value})}
                      placeholder={t("admin.optionalTitle")}
                      className="mt-1"
                    />
                  </TabsContent>
                  <TabsContent value="ar">
                    <Label htmlFor="subtitle-ar">{t("languages.ar")}</Label>
                    <Input
                      id="subtitle-ar"
                      value={newSubcategoryTitles.ar}
                      onChange={(e) => setNewSubcategoryTitles({...newSubcategoryTitles, ar: e.target.value})}
                      placeholder={t("admin.optionalTitle")}
                      className="mt-1"
                      dir="rtl"
                    />
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsAddSubcategoryOpen(false);
                setCategoryToAddSubcategory(null);
              }}
            >
              {t("admin.cancel")}
            </Button>
            <Button onClick={handleCreateSubcategory}>
              <Save className="h-4 w-4 mr-2" />
              {t("admin.saveSubcategory")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Category Dialog */}
      <Dialog open={isEditCategoryOpen} onOpenChange={setIsEditCategoryOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{t("admin.editCategory")}</DialogTitle>
            <DialogDescription>
              {t("admin.editCategoryDescription")}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-category-slug" className="text-right">
                {t("admin.slug")}
              </Label>
              <div className="col-span-3">
                <Input
                  id="edit-category-slug"
                  value={categoryToEdit?.slug || ""}
                  disabled
                  className="bg-neutral-100 dark:bg-neutral-800"
                />
                <p className="text-xs text-neutral-500 mt-1">
                  {t("admin.slugCannotBeChanged")}
                </p>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium">{t("admin.titles")}</h4>
                <div className="flex gap-2">
                  <Languages className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
              
              <Tabs defaultValue="en" className="w-full">
                <TabsList className="grid grid-cols-5">
                  <TabsTrigger value="en">EN</TabsTrigger>
                  <TabsTrigger value="fr">FR</TabsTrigger>
                  <TabsTrigger value="es">ES</TabsTrigger>
                  <TabsTrigger value="de">DE</TabsTrigger>
                  <TabsTrigger value="ar">AR</TabsTrigger>
                </TabsList>
                <div className="mt-4 space-y-4">
                  <TabsContent value="en">
                    <Label htmlFor="edit-title-en">{t("languages.en")}</Label>
                    <Input
                      id="edit-title-en"
                      value={editedCategoryTitles.en}
                      onChange={(e) => setEditedCategoryTitles({...editedCategoryTitles, en: e.target.value})}
                      placeholder={t("admin.englishTitleRequired")}
                      className="mt-1"
                    />
                  </TabsContent>
                  <TabsContent value="fr">
                    <Label htmlFor="edit-title-fr">{t("languages.fr")}</Label>
                    <Input
                      id="edit-title-fr"
                      value={editedCategoryTitles.fr}
                      onChange={(e) => setEditedCategoryTitles({...editedCategoryTitles, fr: e.target.value})}
                      placeholder={t("admin.optionalTitle")}
                      className="mt-1"
                    />
                  </TabsContent>
                  <TabsContent value="es">
                    <Label htmlFor="edit-title-es">{t("languages.es")}</Label>
                    <Input
                      id="edit-title-es"
                      value={editedCategoryTitles.es}
                      onChange={(e) => setEditedCategoryTitles({...editedCategoryTitles, es: e.target.value})}
                      placeholder={t("admin.optionalTitle")}
                      className="mt-1"
                    />
                  </TabsContent>
                  <TabsContent value="de">
                    <Label htmlFor="edit-title-de">{t("languages.de")}</Label>
                    <Input
                      id="edit-title-de"
                      value={editedCategoryTitles.de}
                      onChange={(e) => setEditedCategoryTitles({...editedCategoryTitles, de: e.target.value})}
                      placeholder={t("admin.optionalTitle")}
                      className="mt-1"
                    />
                  </TabsContent>
                  <TabsContent value="ar">
                    <Label htmlFor="edit-title-ar">{t("languages.ar")}</Label>
                    <Input
                      id="edit-title-ar"
                      value={editedCategoryTitles.ar}
                      onChange={(e) => setEditedCategoryTitles({...editedCategoryTitles, ar: e.target.value})}
                      placeholder={t("admin.optionalTitle")}
                      className="mt-1"
                      dir="rtl"
                    />
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsEditCategoryOpen(false);
                setCategoryToEdit(null);
              }}
            >
              {t("admin.cancel")}
            </Button>
            <Button onClick={handleUpdateCategory}>
              <Save className="h-4 w-4 mr-2" />
              {t("admin.saveChanges")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Subcategory Dialog */}
      <Dialog open={isEditSubcategoryOpen} onOpenChange={setIsEditSubcategoryOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{t("admin.editSubcategory")}</DialogTitle>
            <DialogDescription>
              {t("admin.editSubcategoryDescription")}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-subcategory-slug" className="text-right">
                {t("admin.slug")}
              </Label>
              <div className="col-span-3">
                <Input
                  id="edit-subcategory-slug"
                  value={subcategoryToEdit?.subcategory.slug || ""}
                  disabled
                  className="bg-neutral-100 dark:bg-neutral-800"
                />
                <p className="text-xs text-neutral-500 mt-1">
                  {t("admin.slugCannotBeChanged")}
                </p>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium">{t("admin.titles")}</h4>
                <div className="flex gap-2">
                  <Languages className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
              
              <Tabs defaultValue="en" className="w-full">
                <TabsList className="grid grid-cols-5">
                  <TabsTrigger value="en">EN</TabsTrigger>
                  <TabsTrigger value="fr">FR</TabsTrigger>
                  <TabsTrigger value="es">ES</TabsTrigger>
                  <TabsTrigger value="de">DE</TabsTrigger>
                  <TabsTrigger value="ar">AR</TabsTrigger>
                </TabsList>
                <div className="mt-4 space-y-4">
                  <TabsContent value="en">
                    <Label htmlFor="edit-subtitle-en">{t("languages.en")}</Label>
                    <Input
                      id="edit-subtitle-en"
                      value={editedSubcategoryTitles.en}
                      onChange={(e) => setEditedSubcategoryTitles({...editedSubcategoryTitles, en: e.target.value})}
                      placeholder={t("admin.englishTitleRequired")}
                      className="mt-1"
                    />
                  </TabsContent>
                  <TabsContent value="fr">
                    <Label htmlFor="edit-subtitle-fr">{t("languages.fr")}</Label>
                    <Input
                      id="edit-subtitle-fr"
                      value={editedSubcategoryTitles.fr}
                      onChange={(e) => setEditedSubcategoryTitles({...editedSubcategoryTitles, fr: e.target.value})}
                      placeholder={t("admin.optionalTitle")}
                      className="mt-1"
                    />
                  </TabsContent>
                  <TabsContent value="es">
                    <Label htmlFor="edit-subtitle-es">{t("languages.es")}</Label>
                    <Input
                      id="edit-subtitle-es"
                      value={editedSubcategoryTitles.es}
                      onChange={(e) => setEditedSubcategoryTitles({...editedSubcategoryTitles, es: e.target.value})}
                      placeholder={t("admin.optionalTitle")}
                      className="mt-1"
                    />
                  </TabsContent>
                  <TabsContent value="de">
                    <Label htmlFor="edit-subtitle-de">{t("languages.de")}</Label>
                    <Input
                      id="edit-subtitle-de"
                      value={editedSubcategoryTitles.de}
                      onChange={(e) => setEditedSubcategoryTitles({...editedSubcategoryTitles, de: e.target.value})}
                      placeholder={t("admin.optionalTitle")}
                      className="mt-1"
                    />
                  </TabsContent>
                  <TabsContent value="ar">
                    <Label htmlFor="edit-subtitle-ar">{t("languages.ar")}</Label>
                    <Input
                      id="edit-subtitle-ar"
                      value={editedSubcategoryTitles.ar}
                      onChange={(e) => setEditedSubcategoryTitles({...editedSubcategoryTitles, ar: e.target.value})}
                      placeholder={t("admin.optionalTitle")}
                      className="mt-1"
                      dir="rtl"
                    />
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsEditSubcategoryOpen(false);
                setSubcategoryToEdit(null);
              }}
            >
              {t("admin.cancel")}
            </Button>
            <Button onClick={handleUpdateSubcategory}>
              <Save className="h-4 w-4 mr-2" />
              {t("admin.saveChanges")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Category Alert Dialog */}
      <AlertDialog open={!!categoryToDelete} onOpenChange={(open) => !open && setCategoryToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("admin.deleteCategory")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("admin.deleteCategoryWarning")}
              <div className="mt-2 font-medium text-destructive">
                {categoryToDelete && getLocalizedTitle(categoryToDelete.titles)}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("admin.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600"
              onClick={handleDeleteCategory}
            >
              {t("admin.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Delete Subcategory Alert Dialog */}
      <AlertDialog open={!!subcategoryToDelete} onOpenChange={(open) => !open && setSubcategoryToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("admin.deleteSubcategory")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("admin.deleteSubcategoryWarning")}
              <div className="mt-2 font-medium text-destructive">
                {subcategoryToDelete && getLocalizedTitle(subcategoryToDelete.subcategory.titles)}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("admin.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600"
              onClick={handleDeleteSubcategory}
            >
              {t("admin.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}