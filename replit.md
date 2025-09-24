# Overview

Giedo Mall is an Arabic e-commerce affiliate marketing platform that allows users to browse and shop products through affiliate links. The application features a modern React frontend with Arabic RTL support and an Express.js backend with PostgreSQL database integration. Users can browse products by categories, add items to cart, manage favorites, and complete purchases through external affiliate links.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state, custom hooks for local state (cart, favorites)
- **UI Components**: Shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming, RTL support for Arabic layout
- **Build Tool**: Vite with custom configuration for development and production

## Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Design**: RESTful endpoints with proper error handling and validation
- **Data Validation**: Zod schemas for request/response validation
- **Development Server**: Custom Vite integration for hot module replacement
- **Storage**: In-memory storage with interface pattern for easy database migration

## Data Storage Solutions
- **Database**: PostgreSQL with Drizzle ORM for schema management
- **Schema**: Categories and products tables with proper relationships
- **Migrations**: Drizzle Kit for database schema migrations
- **Local Storage**: Browser localStorage for cart and favorites persistence

## Authentication and Authorization
- **Current State**: No authentication system implemented
- **Session Management**: Express session configuration present but not actively used
- **Security**: Basic CORS and request parsing middleware

## External Dependencies
- **Database Provider**: Neon serverless PostgreSQL
- **UI Framework**: Radix UI for accessible component primitives
- **State Management**: TanStack React Query for server state synchronization
- **Form Handling**: React Hook Form with Zod validation
- **Styling**: Tailwind CSS with PostCSS processing
- **Icons**: Font Awesome and Lucide React icons
- **Development Tools**: Replit-specific plugins for development experience

The application follows a modern full-stack architecture with clear separation between frontend and backend concerns, type safety throughout, and proper data validation. The affiliate marketing model redirects users to external sites for purchases while maintaining a rich browsing experience.