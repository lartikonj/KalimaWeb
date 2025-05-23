import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  LayoutDashboard, 
  FileText, 
  Settings,
  FileQuestion,
  ArrowLeft
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import UserSuggestionsList from "@/components/admin/UserSuggestionsList";
import { Link } from "wouter";
import { User, SuggestedArticle } from "@/types";
import { getArticles, db } from "@/lib/firebase";
import { collection, getDocs, doc, getDoc, updateDoc } from "firebase/firestore";

// Mock users with suggestions for demonstration
const MOCK_USERS: User[] = [
  {
    uid: "user1",
    displayName: "John Doe",
    email: "john@example.com",
    favorites: [],
    suggestedArticles: [
      {
        title: "The Benefits of Learning Multiple Languages",
        language: "en",
        content: [
          "Learning multiple languages has been shown to have numerous cognitive benefits.",
          "Studies have demonstrated that bilingual and multilingual individuals often have improved memory, problem-solving abilities, and critical thinking skills.",
          "Additionally, knowing multiple languages can enhance career opportunities in our increasingly globalized world.",
          "Beyond the practical benefits, learning languages also provides deeper insights into different cultures and ways of thinking."
        ]
      },
      {
        title: "Les avantages d'apprendre plusieurs langues",
        language: "fr",
        content: [
          "Il a été démontré que l'apprentissage de plusieurs langues présente de nombreux avantages cognitifs.",
          "Des études ont démontré que les individus bilingues et multilingues ont souvent une meilleure mémoire, des capacités de résolution de problèmes et une pensée critique améliorées.",
          "De plus, la connaissance de plusieurs langues peut améliorer les opportunités de carrière dans notre monde de plus en plus globalisé.",
          "Au-delà des avantages pratiques, l'apprentissage des langues permet également d'acquérir une compréhension plus profonde des différentes cultures et façons de penser."
        ]
      }
    ]
  },
  {
    uid: "user2",
    displayName: "Maria Rodriguez",
    email: "maria@example.com",
    favorites: [],
    suggestedArticles: [
      {
        title: "Técnicas efectivas para el aprendizaje de idiomas",
        language: "es",
        content: [
          "El aprendizaje de idiomas puede ser desafiante, pero existen técnicas probadas que pueden hacer el proceso más efectivo y agradable.",
          "La inmersión, donde te rodeas del idioma objetivo tanto como sea posible, es una de las estrategias más efectivas.",
          "Estudiar de manera constante y regular, incluso en sesiones cortas, es más efectivo que las maratones de estudio ocasionales.",
          "Encontrar un compañero de aprendizaje o unirse a un grupo de conversación puede proporcionar motivación y oportunidades prácticas para usar el idioma."
        ]
      }
    ]
  }
];

export default function Suggestions() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch real users with suggestions from Firebase
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        // Get all users from Firestore
        const usersCollection = collection(db, "users");
        const querySnapshot = await getDocs(usersCollection);
        
        // Filter users that have suggestions
        const usersWithSuggestions: User[] = [];
        
        querySnapshot.forEach((doc) => {
          const userData = doc.data() as User;
          userData.uid = doc.id; // Ensure UID is set
          
          // Only include users that have suggestions
          if (userData.suggestedArticles && userData.suggestedArticles.length > 0) {
            usersWithSuggestions.push(userData);
          }
        });
        
        console.log("Fetched users with suggestions:", usersWithSuggestions);
        setUsers(usersWithSuggestions);
      } catch (error) {
        console.error("Error fetching users with suggestions:", error);
        toast({
          title: t("error.title"),
          description: t("error.generic"),
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [toast, t]);

  // Handle creating an article from a suggestion
  const handleCreateArticle = async (suggestion: SuggestedArticle, user: User) => {
    try {
      // In a real application, this would create an article with default fields
      // and redirect to the edit page to fill in additional details
      
      toast({
        title: t("admin.articleCreated"),
        description: t("admin.articleCreatedFromSuggestion"),
      });
      
      // Redirect to create article page with suggestion data
      setLocation(`/admin/articles/create?title=${encodeURIComponent(suggestion.title)}&language=${suggestion.language}`);
    } catch (error) {
      console.error("Error creating article from suggestion:", error);
      toast({
        title: t("error.title"),
        description: t("error.generic"),
        variant: "destructive",
      });
    }
  };

  // Handle deleting a suggestion
  const handleDeleteSuggestion = async (suggestionIndex: number, user: User) => {
    try {
      // Get current user data
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) {
        throw new Error("User not found");
      }
      
      // Update the suggestions array by removing the suggestion at the specified index
      const userData = userDoc.data();
      const updatedSuggestions = [...userData.suggestedArticles];
      updatedSuggestions.splice(suggestionIndex, 1);
      
      // Update Firestore
      await updateDoc(doc(db, "users", user.uid), {
        suggestedArticles: updatedSuggestions
      });
      
      // Update local state
      const updatedUsers = users.map(u => {
        if (u.uid === user.uid) {
          return {
            ...u,
            suggestedArticles: updatedSuggestions
          };
        }
        return u;
      });
      
      setUsers(updatedUsers);
      
      toast({
        title: t("admin.suggestionDeleted"),
        description: t("admin.suggestionDeletedSuccess"),
      });
    } catch (error) {
      console.error("Error deleting suggestion:", error);
      toast({
        title: t("error.title"),
        description: t("error.generic"),
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <Button variant="outline" size="icon" asChild className="mr-4">
            <Link href="/admin">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-100">
            {t("admin.suggestions")}
          </h1>
        </div>
      </div>
      
      {/* Admin navigation tabs */}
      <Tabs defaultValue="suggestions" className="space-y-8">
        <TabsList className="grid grid-cols-4 md:w-[600px]">
          <TabsTrigger value="overview" className="flex items-center" asChild>
            <Link href="/admin">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">{t("admin.overview")}</span>
            </Link>
          </TabsTrigger>
          <TabsTrigger value="articles" className="flex items-center" asChild>
            <Link href="/admin/articles">
              <FileText className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">{t("admin.articles")}</span>
            </Link>
          </TabsTrigger>
          <TabsTrigger value="suggestions" className="flex items-center">
            <FileQuestion className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">{t("admin.suggestions")}</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center">
            <Settings className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">{t("admin.settings")}</span>
          </TabsTrigger>
        </TabsList>
        
        <Card>
          <CardHeader>
            <CardTitle>{t("admin.userSuggestions")}</CardTitle>
            <CardDescription>
              {t("admin.reviewAndManageSuggestions")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <p>{t("general.loading")}</p>
              </div>
            ) : (
              <UserSuggestionsList 
                users={users}
                onCreateArticle={handleCreateArticle}
                onDeleteSuggestion={handleDeleteSuggestion}
              />
            )}
          </CardContent>
        </Card>
      </Tabs>
    </div>
  );
}
