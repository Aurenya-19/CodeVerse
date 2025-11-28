# TechHive - Gamified Tech Learning Platform

## Overview

TechHive is a gamified learning platform that transforms tech education into an immersive gaming experience. It combines elements from Discord (community structure), Duolingo (gamification), Linear (modern design), GitHub (project collaboration), and gaming platforms like Steam. The platform enables users to level up through skill arenas, complete daily quests, join tech clans, collaborate on projects, and compete on global leaderboards while receiving personalized AI assistance.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System:**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server for fast HMR and optimized production builds
- Wouter for lightweight client-side routing
- React Query (TanStack Query) for server state management with automatic caching and background refetching

**UI Component System:**
- Radix UI primitives for accessible, unstyled components
- shadcn/ui component library with custom theming
- Tailwind CSS for utility-first styling with custom design tokens
- Class Variance Authority (CVA) for type-safe component variants
- Custom CSS variables for light/dark theme support

**State Management:**
- React Query for server state (user data, arenas, challenges, etc.)
- React hooks for local component state
- Context API for theme preferences

**Design System:**
- Custom color palette using HSL values with CSS custom properties
- Typography system with Inter (UI), Space Grotesk (display), and JetBrains Mono (code)
- Spacing primitives based on Tailwind's scale
- Responsive grid system for different view layouts
- Gaming-inspired visual language with progress bars, badges, and achievement celebrations

### Backend Architecture

**Server Framework:**
- Express.js as the HTTP server
- Node.js runtime with ES modules
- TypeScript for type safety across the stack

**API Design:**
- RESTful API endpoints organized by feature (auth, profile, arenas, clans, etc.)
- JSON request/response format
- Session-based authentication with cookie storage
- Middleware for request logging and error handling

**Database Layer:**
- Drizzle ORM for type-safe database operations
- Schema-first design with Zod validation
- Relations defined between entities (users, profiles, arenas, challenges, projects, clans, etc.)
- Migration system via drizzle-kit

**Authentication:**
- Replit Auth integration using OpenID Connect
- Passport.js strategy for OAuth flow
- Session management with PostgreSQL-backed session store (connect-pg-simple)
- Secure cookie-based sessions with 1-week TTL

**Data Models:**
- Users: Core authentication and profile data
- UserProfiles: Extended user data including interests, XP, level, learning preferences
- Arenas: Skill-based learning domains (AI, Web Dev, Cybersecurity, etc.)
- Challenges: Time-bound coding challenges within arenas
- Projects: Collaborative open-source projects with team features
- Clans: User-created groups for hackathons and competitions
- Quests: Daily achievement-based tasks
- Courses: Structured mini-learning paths
- Roadmaps: Guided learning journeys with milestones
- Leaderboards: Global and category-specific rankings
- Messages: Direct messaging between users
- FeedItems: Tech news and content aggregation
- AiChats: Conversation history with AI copilot

### External Dependencies

**Database:**
- Neon Database (Serverless PostgreSQL) via `@neondatabase/serverless`
- WebSocket support for connection pooling

**Authentication:**
- Replit Auth OIDC provider for user authentication
- OpenID Client library for OAuth integration

**UI Component Libraries:**
- Radix UI for 20+ accessible component primitives
- Lucide React for consistent icon system

**Development Tools:**
- Replit-specific plugins for development banner, runtime error overlay, and cartographer integration
- ESBuild for server bundling with selective dependency inclusion
- TypeScript compiler for type checking

**Form Management:**
- React Hook Form for performant form handling
- Zod for schema validation
- @hookform/resolvers for Zod integration

**Utilities:**
- date-fns for date manipulation
- nanoid for unique ID generation
- clsx and tailwind-merge for conditional class names

**Future Integration Points:**
- AI services (Google Generative AI, OpenAI) for copilot features
- Stripe for potential premium features
- Email services (Nodemailer) for notifications
- WebSocket (ws) for real-time features like live challenges and chat

### Build & Deployment

**Development Mode:**
- Vite dev server with HMR at `/vite-hmr`
- Server runs with tsx for TypeScript execution
- Environment variables loaded from `.env`

**Production Build:**
- Client: Vite builds to `dist/public` directory
- Server: ESBuild bundles to single `dist/index.cjs` file
- Selective bundling of dependencies to reduce cold start times
- Static file serving from Express for SPA fallback

**Environment Requirements:**
- DATABASE_URL: PostgreSQL connection string (Neon)
- SESSION_SECRET: Secure session encryption key
- ISSUER_URL: Replit OIDC endpoint (defaults to replit.com/oidc)
- REPL_ID: Replit environment identifier