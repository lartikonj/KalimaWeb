
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Server-side Firebase configuration using process.env
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: `${process.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${process.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase for server use
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Server-side versions of the functions needed for sitemap
export async function getArticles(options?: { draft?: boolean }) {
  const { collection, query, where, getDocs } = await import("firebase/firestore");
  
  try {
    let articlesQuery = query(collection(db, "articles"));

    if (options?.draft !== undefined) {
      articlesQuery = query(articlesQuery, where("draft", "==", options.draft));
    }

    const articlesSnapshot = await getDocs(articlesQuery);
    return articlesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting articles:", error);
    return [];
  }
}

export async function getCategories() {
  const { collection, getDocs } = await import("firebase/firestore");
  
  try {
    const categoriesSnapshot = await getDocs(collection(db, "categories"));
    return categoriesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export async function getStaticPages() {
  const { collection, getDocs } = await import("firebase/firestore");
  
  try {
    const pagesSnapshot = await getDocs(collection(db, "staticPages"));
    return pagesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error fetching static pages:", error);
    return [];
  }
}
