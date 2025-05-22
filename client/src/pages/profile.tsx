import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "wouter";
import { User, BookmarkIcon, BookmarkPlusIcon, PencilIcon, AlertTriangle, Loader2 } from "lucide-react";

export default function Profile() {
  const { user, userData, logout } = useAuth();
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Handle profile update (not implemented in this demo)
  const handleUpdateProfile = async () => {
    setIsUpdating(true);
    
    try {
      // This would update the profile in Firebase
      // For this demo, we'll just show a success message
      
      toast({
        title: t("profile.updated"),
        description: t("profile.profileUpdated"),
      });
      
      setIsEditingProfile(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: t("error.title"),
        description: t("error.updateFailed"),
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  // Handle account deletion (not implemented in this demo)
  const handleDeleteAccount = async () => {
    setIsUpdating(true);
    
    try {
      // This would delete the account in Firebase
      // For this demo, we'll log out and show a success message
      
      await logout();
      
      toast({
        title: t("profile.accountDeleted"),
        description: t("profile.accountDeletedSuccess"),
      });
      
      setShowDeleteDialog(false);
    } catch (error) {
      console.error("Error deleting account:", error);
      toast({
        title: t("error.title"),
        description: t("error.deleteFailed"),
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  // Edit profile form
  const renderEditProfileForm = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="displayName" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
          {t("auth.displayName")}
        </label>
        <Input 
          id="displayName"
          value={displayName} 
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder={t("auth.displayNamePlaceholder")}
          disabled={isUpdating}
        />
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button 
          variant="outline" 
          onClick={() => setIsEditingProfile(false)}
          disabled={isUpdating}
        >
          {t("general.cancel")}
        </Button>
        <Button 
          onClick={handleUpdateProfile}
          disabled={isUpdating}
        >
          {isUpdating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t("general.saving")}
            </>
          ) : (
            t("general.save")
          )}
        </Button>
      </div>
    </div>
  );
  
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

  // Format join date
  const joinDate = new Date().toLocaleDateString(
    language === "en" ? "en-US" : 
    language === "fr" ? "fr-FR" : 
    language === "es" ? "es-ES" : 
    language === "de" ? "de-DE" : 
    "ar-SA",
    { year: 'numeric', month: 'long', day: 'numeric' }
  );
  
  // Get favorite count and suggestion count
  const favoritesCount = userData.favorites?.length || 0;
  const suggestionsCount = userData.suggestedArticles?.length || 0;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-neutral-800 dark:text-neutral-100">
          {t("profile.title")}
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* User Info Card */}
          <div className="md:col-span-1">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarFallback className="bg-primary-500 text-white text-2xl">
                      {userData.displayName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-bold">{userData.displayName}</h2>
                  <p className="text-neutral-500 dark:text-neutral-400">{user.email}</p>
                  
                  <div className="flex gap-2 mt-4">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        setDisplayName(userData.displayName || "");
                        setIsEditingProfile(true);
                      }}
                    >
                      <PencilIcon className="h-4 w-4 mr-1" />
                      {t("profile.edit")}
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => setShowDeleteDialog(true)}
                    >
                      {t("profile.deleteAccount")}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Stats Card */}
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>{t("profile.stats")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <BookmarkIcon className="h-5 w-5 mr-2 text-primary-500" />
                      <span>{t("profile.favoritesCount")}</span>
                    </div>
                    <Badge variant="secondary">{favoritesCount}</Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <BookmarkPlusIcon className="h-5 w-5 mr-2 text-secondary-500" />
                      <span>{t("profile.suggestionsCount")}</span>
                    </div>
                    <Badge variant="secondary">{suggestionsCount}</Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <User className="h-5 w-5 mr-2 text-accent-500" />
                      <span>{t("profile.memberSince")}</span>
                    </div>
                    <span className="text-sm text-neutral-500 dark:text-neutral-400">{joinDate}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Main Content */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>
                  {isEditingProfile ? t("profile.editProfile") : t("profile.personalInfo")}
                </CardTitle>
                {!isEditingProfile && (
                  <CardDescription>
                    {t("profile.manageYourInfo")}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                {isEditingProfile ? (
                  renderEditProfileForm()
                ) : (
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">
                          {t("auth.displayName")}
                        </TableCell>
                        <TableCell>{userData.displayName}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          {t("auth.email")}
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                )}
              </CardContent>
              {!isEditingProfile && (
                <CardFooter className="flex justify-between border-t pt-6">
                  <Button variant="outline" asChild>
                    <Link href="/favorites">
                      <BookmarkIcon className="h-4 w-4 mr-2" />
                      {t("nav.favorites")}
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/suggestions">
                      <BookmarkPlusIcon className="h-4 w-4 mr-2" />
                      {t("nav.suggestions")}
                    </Link>
                  </Button>
                </CardFooter>
              )}
            </Card>
          </div>
        </div>
      </div>
      
      {/* Delete Account Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("profile.confirmDeleteAccount")}</DialogTitle>
            <DialogDescription>
              {t("profile.deleteAccountWarning")}
            </DialogDescription>
          </DialogHeader>
          <div className="bg-destructive/10 border border-destructive/20 rounded-md p-4 mb-4">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-destructive mr-2 mt-0.5" />
              <div>
                <h4 className="font-semibold text-destructive">{t("profile.warningTitle")}</h4>
                <p className="text-sm text-destructive/90">{t("profile.warningText")}</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowDeleteDialog(false)}
              disabled={isUpdating}
            >
              {t("general.cancel")}
            </Button>
            <Button 
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("general.processing")}
                </>
              ) : (
                t("profile.confirmDelete")
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
