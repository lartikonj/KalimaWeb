# Kalima - Multi-language Learning Platform

## Overview

Kalima is a multi-language learning platform that allows users to access educational articles in different languages. The application supports user authentication, favorite articles, content suggestions, and an admin panel for content management. It features a responsive UI with dark/light mode support and RTL text direction for languages like Arabic.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

- **Framework**: React with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library 
- **State Management**: Context APIs for auth, language, and theme preferences
- **Routing**: Wouter for lightweight client-side routing
- **Data Fetching**: TanStack Query for server state management

The frontend is organized as a single-page application with multiple views for articles, categories, user authentication, and admin functionality.

### Backend Architecture

- **Server**: Express.js running on Node.js
- **Database**: PostgreSQL with Drizzle ORM for database operations
- **Authentication**: Firebase Authentication (as indicated in the code)
- **API**: RESTful endpoints serving JSON data

The backend provides API endpoints for user management, article CRUD operations, and user suggestions.

### Data Storage

- **Database**: PostgreSQL using Drizzle ORM
- **Schema**: Defined in `shared/schema.ts` for users and articles
- **Storage Interface**: Abstraction layer allowing for different implementations

## Key Components

### Shared

- **Schema**: Defined in `shared/schema.ts` with tables for users and articles
- **Types**: Common TypeScript interfaces shared between client and server

### Frontend

- **Pages**: Home, Categories, Article, Login, Register, Favorites, Profile, Admin sections
- **Components**: 
  - UI: Complete shadcn/ui component library
  - Layout: Header, Footer
  - Articles: ArticleGrid, ArticleDetail
  - Categories: CategoryList
- **Contexts**: 
  - AuthContext: User authentication and profile data
  - LanguageContext: Multi-language support (en, ar, fr, es, de)
  - ThemeContext: Light/dark mode toggle

### Backend

- **API Routes**: RESTful endpoints for users and articles
- **Storage**: Abstract interface with implementation for database operations
- **Authentication**: User management and verification

## Data Flow

1. **Authentication Flow**:
   - User registers/logs in via Firebase Authentication
   - User data is stored in PostgreSQL
   - AuthContext maintains user state throughout the application

2. **Article Reading Flow**:
   - Articles are fetched from the database via API
   - Content is filtered by language preference
   - Users can bookmark favorites which are stored in their profile

3. **Content Creation Flow**:
   - Admin users can create/edit articles
   - Articles are stored with translations for multiple languages
   - Draft status allows for content preparation before publication

4. **User Suggestions Flow**:
   - Users can submit article suggestions
   - Admins review suggestions and can convert them to articles

## External Dependencies

### Frontend Dependencies

- **UI Components**: @radix-ui/* components, shadcn/ui
- **Styling**: Tailwind CSS
- **Routing**: Wouter
- **Forms**: React Hook Form with Zod validation
- **Data Fetching**: TanStack Query

### Backend Dependencies

- **Database**: Drizzle ORM with PostgreSQL
- **Authentication**: Firebase Auth
- **Session Management**: connect-pg-simple for PostgreSQL sessions
- **API**: Express.js

### Third-party Services

- **Firebase**: Authentication and possibly storage
- **Unsplash API**: Image integration for article thumbnails

## Deployment Strategy

The application is configured for deployment on Replit with:

- **Development Mode**: `npm run dev` using tsx for TypeScript execution
- **Production Build**: Vite builds the frontend, esbuild bundles the server
- **Database Setup**: PostgreSQL module in Replit
- **PORT**: Exposed on port 5000 locally, mapped to port 80 externally

The deployment process:
1. Build frontend with Vite
2. Bundle server code with esbuild
3. Start production server with Node.js
4. Serve static assets from dist/public directory

## Database Schema

### Users Table
- `id`: Serial primary key
- `uid`: Unique user identifier from authentication
- `displayName`: User's display name
- `email`: User's email address
- `favorites`: Array of article IDs
- `suggestedArticles`: JSON array of suggested article objects

### Articles Table
- `id`: Serial primary key
- `slug`: Unique URL-friendly identifier
- `availableLanguages`: Array of language codes
- `translations`: JSON object containing translations keyed by language code
- `createdAt`: Timestamp of creation
- `draft`: Boolean flag for draft status
- `imageUrl`: URL to article image