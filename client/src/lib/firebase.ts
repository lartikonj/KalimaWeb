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
  addDoc,
  deleteDoc
} from "firebase/firestore";
import { ArticleTranslation, SuggestedArticle } from "@shared/schema";
import { Language } from "@/contexts/LanguageContext";

// Define our Firestore document types
interface FirestoreArticle {
  id: string;
  slug: string;
  category: string;
  subcategory: string;
  author?: string;
  availableLanguages: string[];
  translations: Record<string, {
    title: string;
    summary: string;
    content: Array<{
      title: string;
      paragraph: string;
      references?: string[];
    }>;
  }>;
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

interface FirestoreStaticPage {
  id: string;
  slug: string;
  translations: Record<string, string>;
}

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Log that we're using the config
console.log("Firebase config loaded with:", {
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain
});

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Authentication functions
export async function registerUser(email: string, password: string, displayName: string) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  
  // Set the display name
  await updateProfile(userCredential.user, { displayName });
  
  // Create a user document with initial data
  await setDoc(doc(db, "users", userCredential.user.uid), {
    uid: userCredential.user.uid,
    displayName,
    email,
    favorites: [],
    suggestedArticles: [],
    isAdmin: false, // By default, new users are not admins
    createdAt: Timestamp.now()
  });
  
  return userCredential.user;
}

export async function loginUser(email: string, password: string) {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}

export async function logoutUser() {
  await signOut(auth);
}

export function onAuthChange(callback: (user: FirebaseUser | null) => void) {
  return onAuthStateChanged(auth, callback);
}

export async function getUserData(uid: string) {
  const userDoc = await getDoc(doc(db, "users", uid));
  if (userDoc.exists()) {
    return userDoc.data();
  }
  return null;
}

export async function addFavorite(uid: string, articleId: string) {
  await updateDoc(doc(db, "users", uid), {
    favorites: arrayUnion(articleId)
  });
}

export async function removeFavorite(uid: string, articleId: string) {
  await updateDoc(doc(db, "users", uid), {
    favorites: arrayRemove(articleId)
  });
}

export async function addSuggestion(uid: string, suggestion: SuggestedArticle) {
  await updateDoc(doc(db, "users", uid), {
    suggestedArticles: arrayUnion(suggestion)
  });
}

// Category related functions
export async function getCategories(): Promise<FirestoreCategory[]> {
  try {
    const categoriesSnapshot = await getDocs(collection(db, "categories"));
    return categoriesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as FirestoreCategory));
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
}

export async function getCategoryBySlug(slug: string): Promise<FirestoreCategory | null> {
  try {
    const categoriesSnapshot = await getDocs(query(
      collection(db, "categories"), 
      where("slug", "==", slug)
    ));
    
    if (categoriesSnapshot.empty) {
      return null;
    }
    
    const categoryDoc = categoriesSnapshot.docs[0];
    return {
      id: categoryDoc.id,
      ...categoryDoc.data()
    } as FirestoreCategory;
  } catch (error) {
    console.error("Error fetching category by slug:", error);
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
}): Promise<FirestoreCategory> {
  try {
    // Verify the slug is unique
    const categoriesSnapshot = await getDocs(query(
      collection(db, "categories"), 
      where("slug", "==", categoryData.slug)
    ));
    
    if (!categoriesSnapshot.empty) {
      throw new Error(`Category with slug ${categoryData.slug} already exists`);
    }
    
    // Add the category document to Firestore
    const docRef = await addDoc(collection(db, "categories"), categoryData);
    
    // Return the created category with its ID
    return {
      id: docRef.id,
      ...categoryData
    } as FirestoreCategory;
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
}

export async function updateCategory(categoryId: string, categoryData: {
  slug: string;
  titles: Record<string, string>;
  subcategories: Array<{
    slug: string;
    titles: Record<string, string>;
  }>;
}): Promise<FirestoreCategory> {
  try {
    // Update the category document
    await updateDoc(doc(db, "categories", categoryId), categoryData);
    
    // Return the updated category with its ID
    return {
      id: categoryId,
      ...categoryData
    } as FirestoreCategory;
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
}

export async function deleteCategory(categoryId: string): Promise<boolean> {
  try {
    // Delete the category document
    await deleteDoc(doc(db, "categories", categoryId));
    return true;
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
}

// Article related functions
export async function getArticles(options?: { 
  category?: string; 
  subcategory?: string; 
  language?: string;
  draft?: boolean;
}): Promise<FirestoreArticle[]> {
  try {
    let articlesQuery = query(collection(db, "articles"));
    
    // Add filters if specified - only add when values are defined
    if (options?.draft !== undefined) {
      articlesQuery = query(articlesQuery, where("draft", "==", options.draft));
    }
    
    // For filtering by category/subcategory we need to look at translations
    // We'll get all articles and filter them in memory since Firestore doesn't allow
    // querying nested fields directly in the way we need
    
    const articlesSnapshot = await getDocs(articlesQuery);
    
    return articlesSnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() } as FirestoreArticle))
      .filter(article => {
        // Filter by language if specified
        if (options?.language && 
            !article.availableLanguages.includes(options.language)) {
          return false;
        }

        // Filter by category if specified
        if (options?.category && options.category !== 'all') {
          const articleCategory = article.category;
          if (!articleCategory || articleCategory !== options.category) {
            return false;
          }
        }
        
        // Filter by subcategory if specified
        if (options?.subcategory && options.subcategory !== 'all') {
          const articleSubcategory = article.subcategory;
          if (!articleSubcategory || articleSubcategory !== options.subcategory) {
            return false;
          }
        }
        
        return true;
      });
  } catch (error) {
    console.error("Error getting articles:", error);
    throw error;
  }
}

export async function getArticleBySlug(slug: string): Promise<FirestoreArticle | null> {
  try {
    // Query articles by slug
    const articlesSnapshot = await getDocs(query(
      collection(db, "articles"), 
      where("slug", "==", slug)
    ));
    
    if (articlesSnapshot.empty) {
      return null;
    }
    
    const articleDoc = articlesSnapshot.docs[0];
    return {
      id: articleDoc.id,
      ...articleDoc.data()
    } as FirestoreArticle;
  } catch (error) {
    console.error("Error getting article by slug:", error);
    throw error;
  }
}

export async function getArticlesByCategory(category: string, language?: string): Promise<FirestoreArticle[]> {
  try {
    // Query articles by category
    const articlesSnapshot = await getDocs(query(
      collection(db, "articles"), 
      where("category", "==", category)
    ));
    
    return articlesSnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() } as FirestoreArticle))
      .filter(article => {
        // Filter by language if specified
        if (language && !article.availableLanguages.includes(language)) {
          return false;
        }
        return true;
      });
  } catch (error) {
    console.error("Error getting articles by category:", error);
    throw error;
  }
}

export async function deleteArticle(slug: string): Promise<boolean> {
  try {
    // Find the article by slug
    const articlesSnapshot = await getDocs(query(
      collection(db, "articles"), 
      where("slug", "==", slug)
    ));
    
    if (articlesSnapshot.empty) {
      throw new Error(`Article with slug ${slug} not found`);
    }
    
    // Delete the article document
    const articleDoc = articlesSnapshot.docs[0];
    await deleteDoc(doc(db, "articles", articleDoc.id));
    
    return true;
  } catch (error) {
    console.error("Error deleting article:", error);
    throw error;
  }
}

export async function createArticle(articleData: {
  slug: string;
  category: string;
  subcategory: string;
  author?: string;
  availableLanguages: string[];
  translations: Record<string, {
    title: string;
    summary: string;
    content: Array<{
      title: string;
      paragraph: string;
      references?: string[];
    }>;
  }>;
  draft: boolean;
  imageUrl: string;
  createdAt?: Timestamp;
}): Promise<FirestoreArticle> {
  try {
    // Validate required fields to prevent "undefined" values
    if (!articleData.slug) {
      throw new Error("Article slug is required");
    }
    
    if (!articleData.category) {
      throw new Error("Article category is required");
    }
    
    if (!articleData.subcategory) {
      throw new Error("Article subcategory is required");
    }
    
    if (!articleData.availableLanguages || articleData.availableLanguages.length === 0) {
      throw new Error("At least one language must be available");
    }
    
    if (!articleData.translations || Object.keys(articleData.translations).length === 0) {
      throw new Error("Article must have at least one translation");
    }
    
    if (!articleData.imageUrl) {
      throw new Error("Article image URL is required");
    }
    
    // Create a clean copy of the article data with defaults for optional fields
    const cleanArticleData = {
      slug: articleData.slug,
      category: articleData.category,
      subcategory: articleData.subcategory,
      author: articleData.author || "",
      availableLanguages: articleData.availableLanguages,
      translations: articleData.translations,
      draft: articleData.draft !== undefined ? articleData.draft : true,
      imageUrl: articleData.imageUrl,
      createdAt: articleData.createdAt || Timestamp.now()
    };
    
    // Check if slug already exists
    const existingArticle = await getArticleBySlug(cleanArticleData.slug);
    if (existingArticle) {
      throw new Error(`Article with slug ${cleanArticleData.slug} already exists`);
    }
    
    // Add the article to Firestore
    const docRef = await addDoc(collection(db, "articles"), cleanArticleData);
    
    // Return the created article with its ID
    return {
      id: docRef.id,
      ...cleanArticleData
    } as FirestoreArticle;
  } catch (error) {
    console.error("Error creating article:", error);
    throw error;
  }
}

export async function updateArticle(slug: string, articleData: {
  category: string;
  subcategory: string;
  author?: string;
  availableLanguages: string[];
  translations: Record<string, {
    title: string;
    summary: string;
    content: Array<{
      title: string;
      paragraph: string;
      references?: string[];
    }>;
  }>;
  draft: boolean;
  imageUrl: string;
}): Promise<FirestoreArticle> {
  try {
    // Find the article by slug
    const articlesSnapshot = await getDocs(query(
      collection(db, "articles"), 
      where("slug", "==", slug)
    ));
    
    if (articlesSnapshot.empty) {
      throw new Error(`Article with slug ${slug} not found`);
    }
    
    const articleDoc = articlesSnapshot.docs[0];
    
    // Prepare the update data (keeping the original slug)
    const updateData = {
      ...articleData,
      slug // Ensure slug remains the same
    };
    
    // Update the article
    await updateDoc(doc(db, "articles", articleDoc.id), updateData);
    
    // Return the updated article
    return {
      id: articleDoc.id,
      ...updateData,
      createdAt: articleDoc.data().createdAt // Keep the original createdAt
    } as FirestoreArticle;
  } catch (error) {
    console.error("Error updating article:", error);
    throw error;
  }
}

// Static page related functions
export async function getStaticPages(): Promise<FirestoreStaticPage[]> {
  try {
    const pagesSnapshot = await getDocs(collection(db, "pages"));
    return pagesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as FirestoreStaticPage));
  } catch (error) {
    console.error("Error fetching static pages:", error);
    throw error;
  }
}

export async function getStaticPageBySlug(slug: string): Promise<FirestoreStaticPage | null> {
  try {
    const pagesSnapshot = await getDocs(query(
      collection(db, "pages"), 
      where("slug", "==", slug)
    ));
    
    if (pagesSnapshot.empty) {
      return null;
    }
    
    const pageDoc = pagesSnapshot.docs[0];
    return {
      id: pageDoc.id,
      ...pageDoc.data()
    } as FirestoreStaticPage;
  } catch (error) {
    console.error("Error fetching static page by slug:", error);
    throw error;
  }
}

export async function createStaticPage(pageData: {
  slug: string;
  translations: Record<string, string>;
}): Promise<FirestoreStaticPage> {
  try {
    // Check if slug already exists
    const existingPage = await getStaticPageBySlug(pageData.slug);
    if (existingPage) {
      throw new Error(`Static page with slug ${pageData.slug} already exists`);
    }
    
    // Add the page to Firestore
    const docRef = await addDoc(collection(db, "pages"), pageData);
    
    // Return the created page with its ID
    return {
      id: docRef.id,
      ...pageData
    } as FirestoreStaticPage;
  } catch (error) {
    console.error("Error creating static page:", error);
    throw error;
  }
}

export async function updateStaticPage(pageId: string, pageData: {
  slug: string;
  translations: Record<string, string>;
}): Promise<FirestoreStaticPage> {
  try {
    // Update the page document
    await updateDoc(doc(db, "pages", pageId), pageData);
    
    // Return the updated page with its ID
    return {
      id: pageId,
      ...pageData
    } as FirestoreStaticPage;
  } catch (error) {
    console.error("Error updating static page:", error);
    throw error;
  }
}

export async function deleteStaticPage(pageId: string): Promise<boolean> {
  try {
    // Delete the page document
    await deleteDoc(doc(db, "pages", pageId));
    return true;
  } catch (error) {
    console.error("Error deleting static page:", error);
    throw error;
  }
}