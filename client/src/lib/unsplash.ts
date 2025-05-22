// This file contains the Unsplash API integration

// API base URL
const UNSPLASH_API_URL = "https://api.unsplash.com";

// Get API key from environment variables
const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

// Function to search for photos
export async function searchPhotos(query: string, perPage: number = 1): Promise<any[]> {
  try {
    const response = await fetch(
      `${UNSPLASH_API_URL}/search/photos?query=${encodeURIComponent(
        query
      )}&per_page=${perPage}`,
      {
        headers: {
          Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error fetching images from Unsplash:", error);
    return [];
  }
}

// Function to get a random photo
export async function getRandomPhoto(query: string): Promise<string> {
  try {
    const response = await fetch(
      `${UNSPLASH_API_URL}/photos/random?query=${encodeURIComponent(query)}`,
      {
        headers: {
          Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.urls.regular;
  } catch (error) {
    console.error("Error fetching random image from Unsplash:", error);
    
    // Return a fallback image URL if API fails
    return "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&h=600&q=80";
  }
}

// Function to get a specific photo by ID
export async function getPhoto(photoId: string): Promise<any> {
  try {
    const response = await fetch(`${UNSPLASH_API_URL}/photos/${photoId}`, {
      headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`
      }
    });

    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching specific image from Unsplash:", error);
    return null;
  }
}

export default {
  searchPhotos,
  getRandomPhoto,
  getPhoto
};
