# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Tiny Tiny RSS (tt-rss) modernization project using React + Spring Boot stack. The application consists of:

- **Backend**: Spring Boot 3.4.x with Java 17+ (Java 21 recommended)
- **Frontend**: React 19 + TypeScript + Vite 6
- **Database**: PostgreSQL 15+ with MyBatis-Plus 3.5.x
- **Testing**: Vitest (frontend), JUnit (backend), Playwright (e2e)

## Development Commands

### Backend (Java/Spring Boot)
```bash
cd backend
./gradlew build              # Build the application
./gradlew bootRun           # Run in development mode
./gradlew test              # Run tests
java -jar build/libs/*.jar  # Run compiled JAR
```

### Frontend (React/TypeScript)
```bash
cd frontend
npm run dev                 # Start development server (http://localhost:3000)
npm run build              # Production build
npm run lint              # Run ESLint
npm run test              # Run unit tests
npm run test:ui           # Run tests with UI
npm run test:run          # Run tests once (CI mode)
```

### E2E Testing (Playwright)
```bash
npm run test:e2e           # Run all e2e tests
npm run test:e2e:headed   # Run with browser visible
npm run test:e2e:ui       # Run with Playwright UI
npm run test:e2e:core     # Run core e2e tests only
npm run test:e2e:report   # Show test report
```

### Docker Development Environment
```bash
cp .env.example .env      # Create environment file
docker compose up -d      # Start all services
docker compose down       # Stop all services
docker compose up -d db   # Start database only
```

Services:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080
- PostgreSQL: localhost:5432

## Architecture

### Backend Structure
```
backend/src/main/java/com/ttrss/
├── TtrssApplication.java
├── config/               # Security configuration
├── module/
│   ├── auth/            # JWT authentication (UserService, JwtService, JwtAuthenticationFilter)
│   ├── article/         # Article management (ArticleService, Entry/UserEntry entities)
│   ├── feed/            # RSS feed handling (FeedService, FeedUpdateService, FeedScheduler)
│   ├── label/           # User labels system
│   └── opml/            # OPML import/export
└── common/
```

Key backend concepts:
- MyBatis-Plus for database operations with XML mappers in `resources/mapper/`
- JWT-based authentication with Spring Security 6.x
- Quartz scheduler for feed updates
- Rome library for RSS/Atom feed parsing
- PostgreSQL with pg_trgm for full-text search

### Frontend Structure
```
frontend/src/
├── components/           # React components
│   ├── article/         # Article list, card, toolbar, view
│   ├── feed/            # Feed tree, dialog, manager
│   ├── label/           # Label picker, manager
│   ├── layout/          # Main layout, sidebar, columns
│   ├── auth/            # Authentication components
│   └── search/          # Search functionality
├── hooks/               # Custom React hooks (useArticles, useFeeds, useAuth, etc.)
├── services/            # API clients (authApi, articleApi, feedApi, labelApi, opmlApi, searchApi)
├── stores/              # Zustand state management (authStore, appStore)
├── types/               # TypeScript type definitions
├── theme/               # Mantine theme configuration
└── utils/               # Utility functions (html parsing, API helpers)
```

Key frontend concepts:
- Mantine v7 for UI components
- Zustand for lightweight state management
- TanStack Query (React Query) for server state
- React Router v7 for routing
- React Hook Form for form handling

### Database Schema
PostgreSQL tables (compatible with PHP tt-rss):
- `ttrss_users` - User accounts
- `ttrss_feeds` - RSS feed subscriptions
- `ttrss_feed_categories` - Feed categories
- `ttrss_entries` - Global article entries
- `ttrss_user_entries` - User-article relationships with read/unread status
- `ttrss_labels2` - User-defined labels
- `ttrss_user_labels2` - Label-article associations
- `ttrss_enclosures` - Article attachments (podcasts, media)
- `ttrss_counters_cache` - Feed unread counters

Database initialization: `scripts/init.sql`

## Environment Configuration

### Backend Environment Variables
| Variable | Default | Description |
|----------|---------|-------------|
| SPRING_PROFILES_ACTIVE | dev | Spring profile (dev/prod) |
| SPRING_DATASOURCE_URL | jdbc:postgresql://localhost:5432/ttrss | Database URL |
| SPRING_DATASOURCE_USERNAME | postgres | Database user |
| SPRING_DATASOURCE_PASSWORD | postgres | Database password |
| JWT_SECRET | your-secret-key | JWT signing key |

### Frontend Environment Variables
| Variable | Default | Description |
|----------|---------|-------------|
| VITE_API_BASE_URL | http://localhost:8080 | Backend API URL |

## Testing Strategy

- **Unit Tests**: Frontend uses Vitest with React Testing Library; Backend uses JUnit with Testcontainers for PostgreSQL integration tests
- **E2E Tests**: Playwright tests in `e2e/` directory, configured to run against local Docker environment
- **CI/CD**: GitHub Actions configured to run on push to main/dev* branches

## Key Dependencies

### Backend (build.gradle)
- Spring Boot 3.4.1
- MyBatis-Plus 3.5.9
- Spring Security 6.x with JWT (jjwt 0.12.6)
- SpringDoc OpenAPI 2.7.0 (Swagger UI at /swagger-ui.html)
- Rome 2.1.0 (RSS/Atom parsing)
- Quartz Scheduler (feed updates)
- Apache HttpClient 5.4 (feed fetching)

### Frontend (package.json)
- React 19.0.0
- Mantine 7.17.0 (UI components)
- TanStack Query 5.66.0 (data fetching)
- Zustand 5.0.3 (state management)
- React Router 7.1.5
- React Hook Form 7.72.0
