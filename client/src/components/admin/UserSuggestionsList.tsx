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
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Trash2, Eye, FileText, CheckCircle, XCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { User, SuggestedArticle } from "@/types";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface UserSuggestionsListProps {
  users: User[];
  onCreateArticle?: (suggestion: SuggestedArticle, user: User) => void;
  onDeleteSuggestion?: (suggestionIndex: number, user: User) => void;
}

export default function UserSuggestionsList({ 
  users, 
  onCreateArticle, 
  onDeleteSuggestion 
}: UserSuggestionsListProps) {
  const { t } = useLanguage();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedSuggestion, setSelectedSuggestion] = useState<{
    suggestion: SuggestedArticle;
    index: number;
  } | null>(null);
  const [viewMode, setViewMode] = useState<"preview" | "delete" | null>(null);
  
  // Get only users with suggestions
  const usersWithSuggestions = users.filter(
    user => user.suggestedArticles && user.suggestedArticles.length > 0
  );
  
  // Function to show suggestion preview
  const showPreview = (user: User, suggestion: SuggestedArticle, index: number) => {
    setSelectedUser(user);
    setSelectedSuggestion({ suggestion, index });
    setViewMode("preview");
  };
  
  // Function to show delete confirmation
  const showDeleteConfirmation = (user: User, suggestion: SuggestedArticle, index: number) => {
    setSelectedUser(user);
    setSelectedSuggestion({ suggestion, index });
    setViewMode("delete");
  };
  
  // Function to handle creating an article from suggestion
  const handleCreateArticle = () => {
    if (selectedUser && selectedSuggestion && onCreateArticle) {
      onCreateArticle(selectedSuggestion.suggestion, selectedUser);
      setViewMode(null);
    }
  };
  
  // Function to handle deleting a suggestion
  const handleDeleteSuggestion = () => {
    if (selectedUser && selectedSuggestion && onDeleteSuggestion) {
      onDeleteSuggestion(selectedSuggestion.index, selectedUser);
      setViewMode(null);
    }
  };
  
  // Close the dialog
  const closeDialog = () => {
    setViewMode(null);
    setSelectedSuggestion(null);
    setSelectedUser(null);
  };

  if (usersWithSuggestions.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-10">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium">{t("admin.suggestions.noSuggestions")}</h3>
            <p className="text-muted-foreground">{t("admin.suggestions.noSuggestionsDesc")}</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      {usersWithSuggestions.map(user => (
        <Card key={user.uid}>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>{user.displayName}</span>
              <Badge variant="outline">{user.suggestedArticles.length} {t("admin.suggestions.suggestions")}</Badge>
            </CardTitle>
            <CardDescription>{user.email}</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">{t("admin.article.title")}</TableHead>
                  <TableHead className="w-[120px]">{t("language.selectLanguage")}</TableHead>
                  <TableHead className="w-[120px]">{t("admin.suggestions.contentLength")}</TableHead>
                  <TableHead className="text-right">{t("general.actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {user.suggestedArticles.map((suggestion, index) => (
                  <TableRow key={`${user.uid}-${index}`}>
                    <TableCell className="font-medium">{suggestion.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{suggestion.language ? suggestion.language.toUpperCase() : 'N/A'}</Badge>
                    </TableCell>
                    <TableCell>{suggestion.content?.length || 0} {t("admin.suggestions.paragraphs")}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => showPreview(user, suggestion, index)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {onCreateArticle && (
                          <Button
                            variant="outline"
                            size="icon"
                            className="text-secondary-500"
                            onClick={() => onCreateArticle(suggestion, user)}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                        {onDeleteSuggestion && (
                          <Button
                            variant="outline"
                            size="icon"
                            className="text-destructive"
                            onClick={() => showDeleteConfirmation(user, suggestion, index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}
      
      {/* Preview Dialog */}
      {viewMode === "preview" && selectedSuggestion && (
        <Dialog open onOpenChange={closeDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedSuggestion.suggestion.title}</DialogTitle>
              <DialogDescription>
                {t("admin.suggestions.suggestedBy")} {selectedUser?.displayName} (
                <Badge variant="outline">{selectedSuggestion.suggestion.language ? selectedSuggestion.suggestion.language.toUpperCase() : 'N/A'}</Badge>
                )
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 my-4">
              {selectedSuggestion.suggestion.content.map((paragraph, idx) => (
                <p key={idx} className="text-sm">{paragraph}</p>
              ))}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={closeDialog}>
                {t("general.close")}
              </Button>
              {onCreateArticle && (
                <Button onClick={handleCreateArticle}>
                  {t("admin.suggestions.createArticle")}
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Delete Confirmation Dialog */}
      {viewMode === "delete" && selectedSuggestion && (
        <Dialog open onOpenChange={closeDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("admin.suggestions.confirmDelete")}</DialogTitle>
              <DialogDescription>
                {t("admin.suggestions.confirmDeleteDesc")}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={closeDialog}>
                {t("general.cancel")}
              </Button>
              <Button variant="destructive" onClick={handleDeleteSuggestion}>
                {t("general.delete")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
