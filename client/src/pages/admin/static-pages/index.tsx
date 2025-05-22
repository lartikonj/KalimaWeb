import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useLanguage, Language } from "@/contexts/LanguageContext";
import { getStaticPages, createStaticPage, updateStaticPage, deleteStaticPage } from "@/lib/firebase";
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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { 
  FileText, 
  FilePlus, 
  Edit, 
  Trash2,
  Languages,
  Save
} from "lucide-react";

// Define interface for static page data
interface StaticPageData {
  id: string;
  slug: string;
  translations: Record<string, string>;
}

export default function StaticPagesAdmin() {
  const { t, language } = useLanguage();
  const [staticPages, setStaticPages] = useState<StaticPageData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // States for page operations
  const [isAddPageOpen, setIsAddPageOpen] = useState(false);
  const [newPageSlug, setNewPageSlug] = useState("");
  const [newPageContent, setNewPageContent] = useState<Record<string, string>>({
    en: "", fr: "", es: "", de: "", ar: ""
  });
  
  // States for editing
  const [pageToEdit, setPageToEdit] = useState<StaticPageData | null>(null);
  const [isEditPageOpen, setIsEditPageOpen] = useState(false);
  const [editedPageContent, setEditedPageContent] = useState<Record<string, string>>({
    en: "", fr: "", es: "", de: "", ar: ""
  });
  
  // States for deletion
  const [pageToDelete, setPageToDelete] = useState<StaticPageData | null>(null);

  // Fetch all static pages on mount
  useEffect(() => {
    const fetchStaticPages = async () => {
      setIsLoading(true);
      try {
        const fetchedPages = await getStaticPages();
        setStaticPages(fetchedPages as StaticPageData[]);
      } catch (error) {
        console.error("Error fetching static pages:", error);
        toast({
          title: t("admin.error"),
          description: t("admin.errorFetchingPages"),
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStaticPages();
  }, [t]);

  // Handle creating a new static page
  const handleCreatePage = async () => {
    if (!newPageSlug.trim()) {
      toast({
        title: t("admin.error"),
        description: t("admin.slugRequired"),
        variant: "destructive"
      });
      return;
    }
    
    if (!newPageContent.en.trim()) {
      toast({
        title: t("admin.error"),
        description: t("admin.englishContentRequired"),
        variant: "destructive"
      });
      return;
    }
    
    try {
      const newPage = await createStaticPage({
        slug: newPageSlug,
        translations: newPageContent
      });
      
      setStaticPages([...staticPages, newPage as StaticPageData]);
      
      setNewPageSlug("");
      setNewPageContent({
        en: "", fr: "", es: "", de: "", ar: ""
      });
      
      setIsAddPageOpen(false);
      
      toast({
        title: t("admin.success"),
        description: t("admin.pageCreated"),
      });
    } catch (error) {
      console.error("Error creating static page:", error);
      toast({
        title: t("admin.error"),
        description: t("admin.errorCreatingPage"),
        variant: "destructive"
      });
    }
  };

  // Handle updating a static page
  const handleUpdatePage = async () => {
    if (!pageToEdit) return;
    
    if (!editedPageContent.en.trim()) {
      toast({
        title: t("admin.error"),
        description: t("admin.englishContentRequired"),
        variant: "destructive"
      });
      return;
    }
    
    try {
      const updatedPage = await updateStaticPage(pageToEdit.id, {
        slug: pageToEdit.slug,
        translations: editedPageContent
      });
      
      setStaticPages(staticPages.map(page => 
        page.id === pageToEdit.id ? updatedPage as StaticPageData : page
      ));
      
      setPageToEdit(null);
      setIsEditPageOpen(false);
      
      toast({
        title: t("admin.success"),
        description: t("admin.pageUpdated"),
      });
    } catch (error) {
      console.error("Error updating static page:", error);
      toast({
        title: t("admin.error"),
        description: t("admin.errorUpdatingPage"),
        variant: "destructive"
      });
    }
  };

  // Handle deleting a static page
  const handleDeletePage = async () => {
    if (!pageToDelete) return;
    
    try {
      await deleteStaticPage(pageToDelete.id);
      
      setStaticPages(staticPages.filter(page => page.id !== pageToDelete.id));
      setPageToDelete(null);
      
      toast({
        title: t("admin.success"),
        description: t("admin.pageDeleted"),
      });
    } catch (error) {
      console.error("Error deleting static page:", error);
      toast({
        title: t("admin.error"),
        description: t("admin.errorDeletingPage"),
        variant: "destructive"
      });
    }
  };
  
  // Helper function to get content in preferred language
  const getLocalizedContent = (translations: Record<string, string>) => {
    if (translations[language]) return translations[language];
    if (translations.en) return translations.en;
    return Object.values(translations).find(content => content) || "";
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-100">
            {t("admin.staticPagesManagement")}
          </h1>
          
          <Button onClick={() => setIsAddPageOpen(true)}>
            <FilePlus className="h-4 w-4 mr-2" />
            {t("admin.addPage")}
          </Button>
        </div>
        
        {/* Static Pages List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="animate-pulse space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
              ))}
            </div>
          ) : staticPages.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <FileText className="h-10 w-10 mx-auto mb-4 text-neutral-400" />
                <p className="text-neutral-500 dark:text-neutral-400">
                  {t("admin.noStaticPages")}
                </p>
                <Button className="mt-4" onClick={() => setIsAddPageOpen(true)}>
                  <FilePlus className="h-4 w-4 mr-2" />
                  {t("admin.addPage")}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {staticPages.map((page) => (
                <Card key={page.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center">
                      <FileText className="h-5 w-5 mr-2 text-primary-500" />
                      {page.slug}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-32 overflow-hidden relative">
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        {getLocalizedContent(page.translations).substring(0, 200)}
                        {getLocalizedContent(page.translations).length > 200 && "..."}
                      </div>
                      <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-background to-transparent"></div>
                    </div>
                    
                    <div className="mt-4 text-xs text-neutral-500">
                      <div className="flex space-x-1">
                        <span>{t("admin.availableLanguages")}:</span>
                        <div className="space-x-1">
                          {Object.entries(page.translations)
                            .filter(([_, content]) => content.trim().length > 0)
                            .map(([lang, _]) => (
                              <span key={lang} className="font-semibold">{lang.toUpperCase()}</span>
                            ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-4 flex justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setPageToEdit(page);
                        setEditedPageContent(page.translations);
                        setIsEditPageOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      {t("admin.edit")}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-500"
                      onClick={() => {
                        setPageToDelete(page);
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      {t("admin.delete")}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Add Static Page Dialog */}
      <Dialog open={isAddPageOpen} onOpenChange={setIsAddPageOpen}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t("admin.addNewPage")}</DialogTitle>
            <DialogDescription>
              {t("admin.addNewPageDescription")}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="page-slug" className="text-right">
                {t("admin.slug")}
              </Label>
              <div className="col-span-3">
                <Input
                  id="page-slug"
                  value={newPageSlug}
                  onChange={(e) => setNewPageSlug(e.target.value)}
                  placeholder="about-us"
                />
                <p className="text-xs text-neutral-500 mt-1">
                  {t("admin.pageSlugDescription")}
                </p>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium">{t("admin.pageContent")}</h4>
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
                    <Label htmlFor="content-en">{t("languages.en")}</Label>
                    <Textarea
                      id="content-en"
                      value={newPageContent.en}
                      onChange={(e) => setNewPageContent({...newPageContent, en: e.target.value})}
                      placeholder={t("admin.englishContentRequired")}
                      className="mt-1 min-h-32"
                    />
                  </TabsContent>
                  <TabsContent value="fr">
                    <Label htmlFor="content-fr">{t("languages.fr")}</Label>
                    <Textarea
                      id="content-fr"
                      value={newPageContent.fr}
                      onChange={(e) => setNewPageContent({...newPageContent, fr: e.target.value})}
                      placeholder={t("admin.optionalContent")}
                      className="mt-1 min-h-32"
                    />
                  </TabsContent>
                  <TabsContent value="es">
                    <Label htmlFor="content-es">{t("languages.es")}</Label>
                    <Textarea
                      id="content-es"
                      value={newPageContent.es}
                      onChange={(e) => setNewPageContent({...newPageContent, es: e.target.value})}
                      placeholder={t("admin.optionalContent")}
                      className="mt-1 min-h-32"
                    />
                  </TabsContent>
                  <TabsContent value="de">
                    <Label htmlFor="content-de">{t("languages.de")}</Label>
                    <Textarea
                      id="content-de"
                      value={newPageContent.de}
                      onChange={(e) => setNewPageContent({...newPageContent, de: e.target.value})}
                      placeholder={t("admin.optionalContent")}
                      className="mt-1 min-h-32"
                    />
                  </TabsContent>
                  <TabsContent value="ar">
                    <Label htmlFor="content-ar">{t("languages.ar")}</Label>
                    <Textarea
                      id="content-ar"
                      value={newPageContent.ar}
                      onChange={(e) => setNewPageContent({...newPageContent, ar: e.target.value})}
                      placeholder={t("admin.optionalContent")}
                      className="mt-1 min-h-32"
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
              onClick={() => setIsAddPageOpen(false)}
            >
              {t("admin.cancel")}
            </Button>
            <Button onClick={handleCreatePage}>
              <Save className="h-4 w-4 mr-2" />
              {t("admin.savePage")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Static Page Dialog */}
      <Dialog open={isEditPageOpen} onOpenChange={setIsEditPageOpen}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t("admin.editStaticPage")}</DialogTitle>
            <DialogDescription>
              {t("admin.editStaticPageDescription")}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-page-slug" className="text-right">
                {t("admin.slug")}
              </Label>
              <div className="col-span-3">
                <Input
                  id="edit-page-slug"
                  value={pageToEdit?.slug || ""}
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
                <h4 className="font-medium">{t("admin.pageContent")}</h4>
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
                    <Label htmlFor="edit-content-en">{t("languages.en")}</Label>
                    <Textarea
                      id="edit-content-en"
                      value={editedPageContent.en}
                      onChange={(e) => setEditedPageContent({...editedPageContent, en: e.target.value})}
                      placeholder={t("admin.englishContentRequired")}
                      className="mt-1 min-h-32"
                    />
                  </TabsContent>
                  <TabsContent value="fr">
                    <Label htmlFor="edit-content-fr">{t("languages.fr")}</Label>
                    <Textarea
                      id="edit-content-fr"
                      value={editedPageContent.fr}
                      onChange={(e) => setEditedPageContent({...editedPageContent, fr: e.target.value})}
                      placeholder={t("admin.optionalContent")}
                      className="mt-1 min-h-32"
                    />
                  </TabsContent>
                  <TabsContent value="es">
                    <Label htmlFor="edit-content-es">{t("languages.es")}</Label>
                    <Textarea
                      id="edit-content-es"
                      value={editedPageContent.es}
                      onChange={(e) => setEditedPageContent({...editedPageContent, es: e.target.value})}
                      placeholder={t("admin.optionalContent")}
                      className="mt-1 min-h-32"
                    />
                  </TabsContent>
                  <TabsContent value="de">
                    <Label htmlFor="edit-content-de">{t("languages.de")}</Label>
                    <Textarea
                      id="edit-content-de"
                      value={editedPageContent.de}
                      onChange={(e) => setEditedPageContent({...editedPageContent, de: e.target.value})}
                      placeholder={t("admin.optionalContent")}
                      className="mt-1 min-h-32"
                    />
                  </TabsContent>
                  <TabsContent value="ar">
                    <Label htmlFor="edit-content-ar">{t("languages.ar")}</Label>
                    <Textarea
                      id="edit-content-ar"
                      value={editedPageContent.ar}
                      onChange={(e) => setEditedPageContent({...editedPageContent, ar: e.target.value})}
                      placeholder={t("admin.optionalContent")}
                      className="mt-1 min-h-32"
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
                setIsEditPageOpen(false);
                setPageToEdit(null);
              }}
            >
              {t("admin.cancel")}
            </Button>
            <Button onClick={handleUpdatePage}>
              <Save className="h-4 w-4 mr-2" />
              {t("admin.saveChanges")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Static Page Alert Dialog */}
      <AlertDialog open={!!pageToDelete} onOpenChange={(open) => !open && setPageToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("admin.deletePage")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("admin.deletePageWarning")}
              <div className="mt-2 font-medium text-destructive">
                {pageToDelete?.slug}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("admin.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600"
              onClick={handleDeletePage}
            >
              {t("admin.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}