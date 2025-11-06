# EldNav - Navigation for Seniors

## Overview

EldNav is a simplified navigation application designed specifically for elderly users (60+) who find traditional navigation apps overwhelming. The application prioritizes clarity, accessibility, and emotional reassurance through a voice-first interface with large text, high-contrast visuals, and calm, confidence-building interactions. Key features include voice-activated navigation, safe route preferences, one-tap emergency family contact, and progressive reassurance messages during trips.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript using Vite as the build tool.

**UI Component System**: Radix UI primitives with shadcn/ui design system, customized for elderly accessibility:
- Larger base font size (20px) compared to standard applications
- Minimum touch target sizes of 56px (3.5rem) for all interactive elements
- High-contrast color scheme with WCAG AAA compliance
- Simplified component variants focusing on clarity over complexity

**Styling**: Tailwind CSS with extensive customization:
- Custom spacing scale emphasizing generous padding (4, 6, 8, 12, 16px units)
- Extended font sizes (base 20px, ranging up to 40px for headings)
- Enhanced border radius for softer, more approachable UI
- Custom color system with semantic tokens for primary, secondary, destructive actions
- Dark mode support with theme switching capability

**State Management**: 
- TanStack Query (React Query) for server state management
- Local React state for UI interactions
- Query invalidation patterns for maintaining data freshness across navigation flows

**Routing**: Wouter for lightweight client-side routing with the following page structure:
- HomePage: Voice input and destination selection
- NavigationPage: Active turn-by-turn guidance
- TripCompletionPage: Post-trip feedback collection
- FamilyLinkPage: Family contact management and trip history
- SettingsPage: User preference controls

**Key Design Decisions**:
- Voice-first interaction model reduces cognitive load for users uncomfortable with typing
- Progressive reassurance messages during navigation build confidence
- Emergency "Call Family" button consistently accessible across all pages
- Single-focus screen design prevents overwhelming users with competing elements
- Feedback loop after each trip helps improve route recommendations

### Backend Architecture

**Server Framework**: Express.js with TypeScript running in ESM mode.

**API Design**: RESTful endpoints organized by resource:
- `/api/trips/*` - Trip creation, progress tracking, completion
- `/api/family-contacts/*` - Emergency contact management
- `/api/destinations/*` - Recent and favorite destination storage
- `/api/preferences/*` - User settings persistence

**Storage Strategy**: In-memory storage implementation (`MemStorage` class) with interface-based design (`IStorage`) allowing future migration to persistent database without API changes. The storage layer abstracts:
- Trip lifecycle management (create, update progress, complete/cancel)
- Family contact CRUD operations
- Destination management with favorites and visit tracking
- User preference persistence

**Key Design Decisions**:
- Interface-based storage design enables easy database migration
- RESTful API structure aligns with standard HTTP semantics
- Stateless request handling for scalability
- Centralized error handling with appropriate HTTP status codes

### Data Schema

**Database ORM**: Drizzle ORM configured for PostgreSQL with the following entities:

**Trips Table**:
- Tracks navigation sessions from start to completion
- Records progress percentage and current step for resumability
- Captures user feedback (wasComfortable) for route optimization
- Supports safe route preference toggle

**Family Contacts Table**:
- Stores emergency contact information
- Primary contact designation for one-tap calling
- Family link sharing capability for remote monitoring

**Destinations Table**:
- Recent and favorite locations with visit frequency tracking
- Type categorization (pharmacy, hospital, grocery, home, friend, other)
- Last visited timestamp for recency-based suggestions

**User Preferences Table**:
- Safe route mode toggle (prefers well-lit, elderly-friendly paths)
- Voice guidance enable/disable
- Text size preferences (medium, large, extra-large)
- High contrast mode toggle

**Key Design Decisions**:
- Single user model (designed for individual elderly user device)
- Soft delete pattern avoided; completed trips archived rather than deleted
- Denormalized destination types for simplicity over normalization
- Boolean flags preferred over enums for settings to reduce complexity

### Design System

**Philosophy**: "Confidence through Clarity" - every UI element serves to reduce cognitive load and build user trust.

**Typography**: System fonts (San Francisco/Roboto) with larger-than-standard sizing:
- 20-24px body text (vs typical 14-16px)
- 32-40px headings
- 1.6-1.8 line height for comfortable reading
- No italics or decorative fonts to maintain legibility

**Layout Principles**:
- Minimum 20px margins on all sides
- Single-focus content areas to avoid competing elements
- Fixed header with emergency access
- Large primary CTA buttons at bottom of screen
- Generous whitespace between interactive elements

**Accessibility Requirements**:
- WCAG AAA contrast standards
- Minimum 56px touch targets
- Sentence case over ALL CAPS
- System font preferences respected
- Dark mode support for varying vision needs

## External Dependencies

### UI Component Libraries
- **Radix UI**: Unstyled, accessible component primitives (accordion, dialog, dropdown, toast, etc.)
- **shadcn/ui**: Pre-built component patterns built on Radix UI
- **Lucide React**: Icon library with consistent visual language

### Data & State Management
- **TanStack Query v5**: Server state synchronization and caching
- **React Hook Form**: Form validation with Zod schema integration
- **Drizzle ORM**: Type-safe database queries with PostgreSQL dialect
- **Drizzle Zod**: Schema validation generation from Drizzle tables

### Database
- **Neon Serverless PostgreSQL**: Configured via DATABASE_URL environment variable
- **connect-pg-simple**: PostgreSQL session store (prepared for authentication if needed)

### Styling & Utilities
- **Tailwind CSS**: Utility-first CSS framework with extensive customization
- **class-variance-authority**: Type-safe component variant generation
- **clsx & tailwind-merge**: Conditional className composition

### Development Tools
- **Vite**: Fast development server and optimized production builds
- **TypeScript**: Type safety across client, server, and shared schemas
- **esbuild**: Server-side bundling for production
- **tsx**: TypeScript execution for development server

### Build & Deployment
- Module type: ESM throughout the stack
- Separate client and server build processes
- Shared schema types between frontend and backend via `@shared/schema`
- Path aliases configured for clean imports (`@/`, `@shared/`, `@assets/`)

### Notable Third-Party Integrations
- **Voice API**: Browser Web Speech API for voice input (no external service)
- **Geolocation**: Browser Geolocation API for current position
- **Speech Synthesis**: Browser Speech Synthesis API for voice guidance

**Key Design Decisions**:
- Browser-native APIs preferred over external services to reduce complexity and cost
- Neon serverless database chosen for automatic scaling without infrastructure management
- In-memory storage used initially with Drizzle schema defined for future PostgreSQL migration
- Minimal external dependencies to reduce cognitive load during development and maintenance