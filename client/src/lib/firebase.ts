import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  User as FirebaseUser,
  updateProfile,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult
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
export interface FirestoreArticle {
  id: string;
  slug: string;
  title: string;
  category: string;
  subcategory: string;
  createdAt: Timestamp;
  draft: boolean;
  featured: boolean;
  popular: boolean;
  imageUrls: string[];
  imageDescriptions: string[];
  author: {
    uid: string;
    displayName: string;
    photoURL?: string;
  };
  availableLanguages: string[];
  translations: Record<string, {
    title: string;
    summary: string;
    keywords: string[];
    content: Array<{
      title: string;
      paragraph: string;
      references?: string[];
    }>;
  }>;
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
  availableLanguages: string[];
  translations: Record<string, {
    title: string;
    content: string;
    keywords?: string[];
  }>;
  updatedAt: Timestamp;
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
export const auth = getAuth(app);
export const db = getFirestore(app);

// Set up providers
export const googleProvider = new GoogleAuthProvider();
export const appleProvider = new OAuthProvider('apple.com');

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

// Google sign-in
export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const user = result.user;
    
    // Check if user exists in our database, if not create a document
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (!userDoc.exists()) {
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        displayName: user.displayName || "",
        email: user.email || "",
        photoURL: user.photoURL || "",
        favorites: [],
        suggestedArticles: [],
        isAdmin: false,
        createdAt: Timestamp.now()
      });
    }
    
    return user;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
}

// Apple sign-in
export async function signInWithApple() {
  try {
    // Apple provider authentication
    const result = await signInWithPopup(auth, appleProvider);
    // You can get the Apple OAuth access token and ID token from result.user
    const user = result.user;
    
    // Check if user exists in our database, if not create a document
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (!userDoc.exists()) {
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        displayName: user.displayName || "",
        email: user.email || "",
        photoURL: user.photoURL || "",
        favorites: [],
        suggestedArticles: [],
        isAdmin: false,
        createdAt: Timestamp.now()
      });
    }
    
    return user;
  } catch (error) {
    console.error("Error signing in with Apple:", error);
    throw error;
  }
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
          // Check both the top-level category and within translations
          const articleCategory = article.category;
          let matchesCategory = articleCategory === options.category;
          
          // If no match at top level, check inside translations
          if (!matchesCategory && article.translations) {
            // Check if any translation has this category
            matchesCategory = Object.values(article.translations).some(
              (trans: any) => trans.category === options.category
            );
          }
          
          if (!matchesCategory) {
            return false;
          }
        }
        
        // Filter by subcategory if specified
        if (options?.subcategory && options.subcategory !== 'all') {
          // Check both the top-level subcategory and within translations
          const articleSubcategory = article.subcategory;
          let matchesSubcategory = articleSubcategory === options.subcategory;
          
          // If no match at top level, check inside translations
          if (!matchesSubcategory && article.translations) {
            // Check if any translation has this subcategory
            matchesSubcategory = Object.values(article.translations).some(
              (trans: any) => trans.subcategory === options.subcategory
            );
          }
          
          if (!matchesSubcategory) {
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

export async function createArticle(inputData: {
  slug: string;
  title?: string;
  category?: string;
  subcategory?: string;
  author?: {
    uid: string;
    displayName: string;
    photoURL?: string;
  };
  availableLanguages: string[];
  translations: Record<string, {
    title: string;
    summary: string;
    keywords?: string[];
    content: Array<{
      title: string;
      paragraph: string;
      references?: string[];
    }>;
  }>;
  draft?: boolean;
  featured?: boolean;
  popular?: boolean;
  imageUrls?: string[];
  imageDescriptions?: string[];
  createdAt?: Timestamp;
}): Promise<FirestoreArticle> {
  try {
    // First, verify what type of data we're receiving for slug
    console.log("Creating article with initial data:", {
      slugType: typeof inputData.slug,
      isSlugObject: typeof inputData.slug === 'object',
      hasCategory: !!inputData.category
    });
    
    // Handle all inputData values with safety checks
    // For slug, use the provided string or generate one if needed
    const slug = typeof inputData.slug === 'string' && inputData.slug.trim() !== '' 
      ? inputData.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-{2,}/g, '-')
      : `article-${Date.now()}`;
      
    // Find a main title from translations if title is missing
    let title = inputData.title;
    if (!title && inputData.translations) {
      // Try to get title from English translation first
      if (inputData.translations.en?.title) {
        title = inputData.translations.en.title;
      } else {
        // Or use the first available translation title
        const firstTranslation = Object.values(inputData.translations)[0];
        if (firstTranslation?.title) {
          title = firstTranslation.title;
        }
      }
    }
    
    // Default title if still none found
    if (!title) {
      title = "Untitled Article";
    }
        
    // Validate and set category/subcategory
    const category = typeof inputData.category === 'string' && inputData.category.trim() !== '' 
      ? inputData.category 
      : 'general';
      
    const subcategory = typeof inputData.subcategory === 'string' && inputData.subcategory.trim() !== '' 
      ? inputData.subcategory 
      : 'other';
    
    console.log("Processed article data:", {
      slug,
      category,
      hasTranslations: !!Object.keys(inputData.translations || {}).length
    });
    
    console.log("Setting default category:", category);
    console.log("Setting default subcategory:", subcategory);
    
    // Handle available languages
    const availableLanguages = Array.isArray(inputData.availableLanguages) && inputData.availableLanguages.length > 0
      ? inputData.availableLanguages
      : ['en'];
      
    if (availableLanguages.length === 0) {
      throw new Error("At least one language must be available");
    }
    
    // Check for translations and provide defaults if needed
    let translations = inputData.translations;
    if (!translations || Object.keys(translations).length === 0) {
      // Create a default translation in English
      translations = {
        en: {
          title: title,
          summary: "This article was created without content.",
          keywords: ["article", "default"],
          content: [{
            title: "Introduction",
            paragraph: "This is a placeholder content for an article that was created without specific content.",
            references: []
          }]
        }
      };
      console.log("Created default translation for article");
      
      // Ensure English is in availableLanguages
      if (!availableLanguages.includes('en')) {
        availableLanguages.push('en');
      }
    } else {
      // Use the provided translations as-is, don't overwrite with defaults
      console.log("Using provided translations:", Object.keys(translations));
    }
    
    // Just ensure every translation has the required fields but don't replace content
    Object.keys(translations).forEach(langCode => {
      // Add keywords array if missing
      if (!translations[langCode].keywords) {
        translations[langCode].keywords = [];
      }
      
      // Only add default content if content array is completely missing
      if (!translations[langCode].content || !Array.isArray(translations[langCode].content) || translations[langCode].content.length === 0) {
        console.log(`Adding default content for language ${langCode} because it was missing`);
        translations[langCode].content = [{
          title: "Content",
          paragraph: "No content provided.",
          references: []
        }];
      }
      
      // Ensure each content item has the required fields
      translations[langCode].content = translations[langCode].content.map(item => {
        // Handle the case where item might be a string instead of an object
        if (typeof item === 'string') {
          return {
            title: "Section",
            paragraph: item,
            references: []
          };
        }
        
        // Ensure title and paragraph exist
        return {
          title: item.title || "Section",
          paragraph: item.paragraph || "",
          references: item.references || []
        };
      });
    });
    
    // Set up author information
    const author = inputData.author || {
      uid: "system",
      displayName: "System"
    };
    
    // Handle image URLs
    const imageUrls = Array.isArray(inputData.imageUrls) && inputData.imageUrls.length > 0
      ? inputData.imageUrls
      : ["https://images.unsplash.com/photo-1637332203993-ab33850d8b7b?q=80&w=1760&auto=format&fit=crop"];
      
    if (!inputData.imageUrls || inputData.imageUrls.length === 0) {
      console.log("Using placeholder image URL");
    }
    
    // Handle image descriptions
    let imageDescriptions: string[] = [];
    if (Array.isArray(inputData.imageDescriptions) && inputData.imageDescriptions.length > 0) {
      imageDescriptions = inputData.imageDescriptions;
    }
    
    // Add default descriptions if needed
    while (imageDescriptions.length < imageUrls.length) {
      imageDescriptions.push(`Image ${imageDescriptions.length + 1} for ${title}`);
    }
    
    // Create a clean copy of the article data with defaults for optional fields
    const cleanArticleData = {
      slug,
      title,
      category,
      subcategory,
      author,
      availableLanguages,
      translations,
      createdAt: inputData.createdAt || Timestamp.now(),
      draft: inputData.draft !== undefined ? inputData.draft : true,
      featured: inputData.featured !== undefined ? inputData.featured : false,
      popular: inputData.popular !== undefined ? inputData.popular : false,
      imageUrls,
      imageDescriptions
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
  title?: string;
  category: string;
  subcategory: string;
  author?: {
    uid: string;
    displayName: string;
    photoURL?: string;
  };
  availableLanguages: string[];
  translations: Record<string, {
    title: string;
    summary: string;
    keywords?: string[];
    content: Array<{
      title: string;
      paragraph: string;
      references?: string[];
    }>;
  }>;
  draft: boolean;
  featured?: boolean;
  popular?: boolean;
  imageUrls?: string[];
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
    const pagesSnapshot = await getDocs(collection(db, "staticPages"));
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
      collection(db, "staticPages"), 
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
  availableLanguages: string[];
  translations: Record<string, {
    title: string;
    content: string;
    keywords?: string[];
  }>;
}): Promise<FirestoreStaticPage> {
  try {
    // Check if slug already exists
    const existingPage = await getStaticPageBySlug(pageData.slug);
    if (existingPage) {
      throw new Error(`Static page with slug ${pageData.slug} already exists`);
    }
    
    // Add the page to Firestore with a timestamp
    const data = {
      ...pageData,
      updatedAt: Timestamp.now()
    };
    
    const docRef = await addDoc(collection(db, "staticPages"), data);
    
    // Return the created page with its ID
    return {
      id: docRef.id,
      ...data
    } as FirestoreStaticPage;
  } catch (error) {
    console.error("Error creating static page:", error);
    throw error;
  }
}

export async function updateStaticPage(pageId: string, pageData: {
  slug?: string;
  availableLanguages?: string[];
  translations?: Record<string, {
    title: string;
    content: string;
    keywords?: string[];
  }>;
}): Promise<FirestoreStaticPage> {
  try {
    // Update the page document with current timestamp
    const updateData = {
      ...pageData,
      updatedAt: Timestamp.now()
    };
    
    await updateDoc(doc(db, "staticPages", pageId), updateData);
    
    // Get the full updated document
    const updatedDocSnap = await getDoc(doc(db, "staticPages", pageId));
    
    if (!updatedDocSnap.exists()) {
      throw new Error(`Static page with ID ${pageId} not found after update`);
    }
    
    // Return the updated page
    return {
      id: pageId,
      ...updatedDocSnap.data()
    } as FirestoreStaticPage;
  } catch (error) {
    console.error("Error updating static page:", error);
    throw error;
  }
}

export async function deleteStaticPage(pageId: string): Promise<boolean> {
  try {
    // Delete the page document
    await deleteDoc(doc(db, "staticPages", pageId));
    return true;
  } catch (error) {
    console.error("Error deleting static page:", error);
    throw error;
  }
}