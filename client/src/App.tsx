import { Switch, Route, Router } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Header from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import Home from "@/pages/home";
import Categories from "@/pages/categories";
import CategoryPage from "@/pages/category";
import SubcategoryPage from "@/pages/subcategory";
import Article from "@/pages/article";
import StaticPage from "@/pages/page";
import Login from "@/pages/login";
import Register from "@/pages/register";
import Favorites from "@/pages/favorites";
import SearchPage from "@/pages/search";
// Use existing admin components
import Dashboard from "@/pages/admin/dashboard";
import AdminArticles from "@/pages/admin/articles";
import AdminCategories from "@/pages/admin/categories";
import AdminStaticPages from "@/pages/admin/static-pages/index";
import CreateStaticPage from "@/pages/admin/static-pages/create";
import EditStaticPage from "@/pages/admin/static-pages/edit/[id]";
import Suggestions from "@/pages/admin/suggestions";
import EditArticle from "@/pages/admin/articles/edit/[slug]";
import CreateArticle from "@/pages/admin/create-article";
import AllArticles from "@/pages/admin/all-articles";
import Profile from "@/pages/profile";
import UserSuggestions from "@/pages/suggestions";
import { useAuth, AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { useEffect } from "react";
import { initializeFirestore } from "@/lib/firestoreInit";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  if (!user) {
    return <Login />;
  }
  
  return <>{children}</>;
}

function RouterContent() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/categories" component={Categories} />
          <Route path="/categories/:categorySlug" component={CategoryPage} />
          <Route path="/categories/:categorySlug/:subcategorySlug" component={SubcategoryPage} />
          <Route path="/categories/:categorySlug/:subcategorySlug/:slug" component={Article} />
          <Route path="/article/:slug" component={Article} />
          <Route path="/page/:slug" component={StaticPage} />
          <Route path="/search" component={SearchPage} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/favorites">
            <ProtectedRoute>
              <Favorites />
            </ProtectedRoute>
          </Route>
          <Route path="/profile">
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          </Route>
          <Route path="/suggestions">
            <ProtectedRoute>
              <UserSuggestions />
            </ProtectedRoute>
          </Route>
          <Route path="/admin">
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          </Route>
          <Route path="/admin/articles">
            <ProtectedRoute>
              <AllArticles />
            </ProtectedRoute>
          </Route>

          <Route path="/admin/categories">
            <ProtectedRoute>
              <AdminCategories />
            </ProtectedRoute>
          </Route>
          <Route path="/admin/static-pages">
            <ProtectedRoute>
              <AdminStaticPages />
            </ProtectedRoute>
          </Route>
          <Route path="/admin/static-pages/create">
            <ProtectedRoute>
              <CreateStaticPage />
            </ProtectedRoute>
          </Route>
          <Route path="/admin/static-pages/edit/:id">
            <ProtectedRoute>
              <EditStaticPage />
            </ProtectedRoute>
          </Route>
          <Route path="/admin/suggestions">
            <ProtectedRoute>
              <Suggestions />
            </ProtectedRoute>
          </Route>
          <Route path="/admin/articles/edit/:slug">
            <ProtectedRoute>
              <EditArticle />
            </ProtectedRoute>
          </Route>
          <Route path="/admin/articles/create">
            <ProtectedRoute>
              <CreateArticle />
            </ProtectedRoute>
          </Route>
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  // Initialize Firestore collections when the app loads
  useEffect(() => {
    initializeFirestore()
      .then(() => console.log('Firestore initialized successfully'))
      .catch(error => console.error('Failed to initialize Firestore:', error));
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <TooltipProvider>
              <Toaster />
              <Router>
                <RouterContent />
              </Router>
            </TooltipProvider>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
