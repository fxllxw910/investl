# Overview

ИНВЕСТ-лизинг is a Russian leasing company's client portal system. This is a full-stack web application that provides a client dashboard for managing leasing documents, contracts, invoices, acts, and payment schedules. The system includes both a public marketing website showcasing the company's services and a secured client area for authenticated users to access their leasing documents and information.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The client-side application is built using React with TypeScript and follows a modern component-based architecture:
- **React with TypeScript** for type-safe component development
- **Wouter** for client-side routing instead of React Router
- **TanStack Query** for server state management and data fetching
- **Radix UI components** with custom styling for accessible UI components
- **Tailwind CSS** with custom CSS variables for theming
- **Shadcn/ui** component library for consistent design system
- **Vite** as the build tool and development server
- **D3.js and TopoJSON** for interactive map visualizations of Russian regions

## Backend Architecture
The server follows a Node.js/Express REST API pattern:
- **Express.js** server with TypeScript for API endpoints
- **Passport.js** with local strategy for authentication
- **Express sessions** with memory store for session management
- **Drizzle ORM** for database operations and schema management
- **Neon Serverless** as the PostgreSQL database provider
- **Basic FTP** client for document synchronization from external FTP servers
- **Zod** for request/response validation and type safety

## Data Storage Solutions
- **PostgreSQL database** via Neon Serverless for primary data storage
- **Drizzle ORM** for type-safe database operations and migrations
- **Express sessions** stored in memory for development (configurable for production)
- **File storage** via FTP integration for document management
- **Local uploads directory** for cached document storage

## Authentication and Authorization
- **Passport.js Local Strategy** for username/password authentication
- **Session-based authentication** with secure cookie configuration
- **Express session middleware** with configurable security settings
- **Password hashing** using Node.js crypto module with scrypt
- **Role-based access** with user context throughout the application
- **Protected routes** on both client and server sides

## External Dependencies

### Database and ORM
- **@neondatabase/serverless** - Serverless PostgreSQL database connection
- **drizzle-orm** and **drizzle-kit** - Type-safe ORM and database toolkit

### Authentication and Security
- **passport** and **passport-local** - Authentication middleware and local strategy
- **express-session** - Session management middleware
- **connect-pg-simple** - PostgreSQL session store (configured but using memory store in development)

### FTP Integration
- **basic-ftp** - FTP client for document synchronization from external servers

### UI and Styling
- **@radix-ui/react-*** - Complete suite of accessible UI components
- **tailwindcss** and **autoprefixer** - Utility-first CSS framework
- **class-variance-authority** and **clsx** - Dynamic styling utilities

### Data Visualization
- **d3** and **@types/d3** - Data visualization library for interactive maps
- **topojson-client** and **@types/topojson-client** - Geographic data format support

### Development and Build Tools
- **vite** and **@vitejs/plugin-react** - Fast build tool and React plugin
- **tsx** - TypeScript execution for Node.js
- **esbuild** - Fast JavaScript bundler for production builds

The architecture supports both development and production environments with appropriate configuration for database connections, session management, and static file serving. The system is designed to be deployed on platforms like Replit with multiple server runner scripts for different deployment scenarios.