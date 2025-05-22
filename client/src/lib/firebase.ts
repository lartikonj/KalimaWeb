import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  User as FirebaseUser,
  updateProfile 
} from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  query, 
  where, 
  getDocs, 
  arrayUnion, 
  arrayRemove,
  Timestamp,
  addDoc 
} from "firebase/firestore";
import { ArticleTranslation, SuggestedArticle } from "@shared/schema";
import { Language } from "@/contexts/LanguageContext";

// Define our Firestore document types
interface FirestoreArticle {
  id: string;
  slug: string;
  availableLanguages: string[];
  translations: Record<string, ArticleTranslation>;
  createdAt: Timestamp;
  draft: boolean;
  imageUrl: string;
}

interface FirestoreCategory {
  id: string;
  slug: string;
  titles: Record<string, string>;
  subcategories: Array<{
    slug: string;
    titles: Record<string, string>;
  }>;
}

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Add debug logging but don't expose sensitive info
console.log("Firebase config loaded with:", {
  projectId: firebaseConfig.projectId || "missing",
  authDomain: firebaseConfig.authDomain || "missing"
});

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// User related functions
export async function registerUser(email: string, password: string, displayName: string) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update profile to add display name
    await updateProfile(userCredential.user, { displayName });
    
    // Create user document in Firestore
    await setDoc(doc(db, "users", userCredential.user.uid), {
      uid: userCredential.user.uid,
      displayName,
      email,
      favorites: [],
      suggestedArticles: []
    });
    
    return userCredential.user;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
}

export async function loginUser(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
}

export async function logoutUser() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
}

export function onAuthChange(callback: (user: FirebaseUser | null) => void) {
  return onAuthStateChanged(auth, callback);
}

// User data functions
export async function getUserData(uid: string) {
  try {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
      return userDoc.data();
    }
    return null;
  } catch (error) {
    console.error("Error getting user data:", error);
    throw error;
  }
}

export async function addFavorite(uid: string, articleId: string) {
  try {
    await updateDoc(doc(db, "users", uid), {
      favorites: arrayUnion(articleId)
    });
  } catch (error) {
    console.error("Error adding favorite:", error);
    throw error;
  }
}

export async function removeFavorite(uid: string, articleId: string) {
  try {
    await updateDoc(doc(db, "users", uid), {
      favorites: arrayRemove(articleId)
    });
  } catch (error) {
    console.error("Error removing favorite:", error);
    throw error;
  }
}

export async function addSuggestion(uid: string, suggestion: SuggestedArticle) {
  try {
    await updateDoc(doc(db, "users", uid), {
      suggestedArticles: arrayUnion(suggestion)
    });
  } catch (error) {
    console.error("Error adding suggestion:", error);
    throw error;
  }
}

// Category related functions
export async function getCategories() {
  try {
    const categoriesSnapshot = await getDocs(collection(db, "categories"));
    return categoriesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting categories:", error);
    throw error;
  }
}

export async function getCategoryBySlug(slug: string) {
  try {
    const categoryDoc = await getDoc(doc(db, "categories", slug));
    if (categoryDoc.exists()) {
      return { id: categoryDoc.id, ...categoryDoc.data() };
    }
    return null;
  } catch (error) {
    console.error("Error getting category by slug:", error);
    throw error;
  }
}

export async function createCategory(categoryData: {
  slug: string;
  titles: Record<string, string>;
  subcategories: Array<{
    slug: string;
    titles: Record<string, string>;
  }>;
}) {
  try {
    // Use the slug as the document ID for easy retrieval
    await setDoc(doc(db, "categories", categoryData.slug), {
      slug: categoryData.slug,
      titles: categoryData.titles,
      subcategories: categoryData.subcategories || []
    });
    
    return {
      id: categoryData.slug,
      ...categoryData
    };
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
}

export async function updateCategory(
  categoryId: string,
  categoryData: {
    slug: string;
    titles: Record<string, string>;
    subcategories: Array<{
      slug: string;
      titles: Record<string, string>;
    }>;
  }
) {
  try {
    // Update the category document
    await updateDoc(doc(db, "categories", categoryId), {
      titles: categoryData.titles,
      subcategories: categoryData.subcategories || []
    });
    
    return {
      id: categoryId,
      ...categoryData
    };
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
}

// Article related functions
export async function getArticles(options?: { 
  category?: string; 
  subcategory?: string; 
  language?: string;
  draft?: boolean;
}) {
  try {
    let articlesQuery = query(collection(db, "articles"));
    
    // Add filters if specified
    if (options?.draft !== undefined) {
      articlesQuery = query(articlesQuery, where("draft", "==", options.draft));
    }
    
    // For filtering by category/subcategory we need to look at translations
    // We'll get all articles and filter them in memory since Firestore doesn't allow
    // querying nested fields directly in the way we need
    
    const articlesSnapshot = await getDocs(articlesQuery);
    
    return articlesSnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(article => {
        // Filter by language if specified
        if (options?.language && article.availableLanguages && 
            !article.availableLanguages.includes(options.language)) {
          return false;
        }

        // Filter by category if specified
        if (options?.category) {
          const hasCategory = Object.values(article.translations || {}).some((translation: any) => 
            translation.category === options.category
          );
          if (!hasCategory) return false;
        }
        
        // Filter by subcategory if specified
        if (options?.subcategory) {
          const hasSubcategory = Object.values(article.translations || {}).some((translation: any) => 
            translation.subcategory === options.subcategory
          );
          if (!hasSubcategory) return false;
        }
        
        return true;
      });
  } catch (error) {
    console.error("Error getting articles:", error);
    throw error;
  }
}

export async function getArticleBySlug(slug: string) {
  try {
    // Try to get the article directly by ID/slug as the document ID
    const articleDoc = await getDoc(doc(db, "articles", slug));
    
    if (articleDoc.exists()) {
      return { id: articleDoc.id, ...articleDoc.data() };
    }
    
    // If not found by direct ID, query by slug field
    const articlesRef = collection(db, "articles");
    const q = query(articlesRef, where("slug", "==", slug));
    const articles = await getDocs(q);
    
    if (articles.empty) {
      return null;
    }
    
    const foundArticle = articles.docs[0];
    return { id: foundArticle.id, ...foundArticle.data() };
  } catch (error) {
    console.error("Error getting article by slug:", error);
    throw error;
  }
}

export async function getArticlesByCategory(category: string, language?: string) {
  try {
    // Directly filter by category using Firestore query
    const articlesRef = collection(db, "articles");
    const q = query(articlesRef, where("category", "==", category));
    const articlesSnapshot = await getDocs(q);
    
    return articlesSnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(article => {
        // Filter by language if specified
        if (language && article.availableLanguages && 
            !article.availableLanguages.includes(language)) {
          return false;
        }
        
        return true;
      });
  } catch (error) {
    console.error("Error getting articles by category:", error);
    throw error;
  }
}

export async function createArticle(
  slug: string,
  languages: string[],
  translations: Record<string, {
    title: string;
    summary: string;
    category: string;
    subcategory: string;
    content: string[];
  }>,
  draft: boolean,
  imageUrl?: string
) {
  try {
    const articleData = {
      slug,
      availableLanguages: languages,
      translations,
      draft,
      imageUrl: imageUrl || "",
      createdAt: Timestamp.now()
    };
    
    await addDoc(collection(db, "articles"), articleData);
  } catch (error) {
    console.error("Error creating article:", error);
    throw error;
  }
}

export async function updateArticle(
  articleId: string,
  slug: string,
  category: string,
  subcategory: string, 
  availableLanguages: string[], 
  translations: Record<string, {
    title: string;
    summary: string;
    content: Array<{type: string; text: string}>;
  }>, 
  draft: boolean,
  imageUrl?: string
) {
  try {
    const articleData = {
      slug,
      category,
      subcategory,
      availableLanguages,
      translations,
      draft,
      imageUrl: imageUrl || ""
    };
    
    await updateDoc(doc(db, "articles", articleId), articleData);
  } catch (error) {
    console.error("Error updating article:", error);
    throw error;
  }
}

export { app, auth, db };
