# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**临时计划生成器 (Temporary Plan Generator)** - A voice-based idea recording tool with AI-powered organization and time-based categorization.

This is a multi-component project consisting of:
- **Landing Page**: Marketing site (HTML/CSS/JS)
- **Frontend**: React web application (not yet implemented)
- **Backend**: Node.js/TypeScript/Express API server (not yet implemented)

## Repository Structure

```
Demo-AI-project/
├── landing-page/              # Completed marketing landing page
│   ├── index.html             # Main landing page
│   ├── css/style.css          # Styles with CSS variables
│   ├── js/script.js           # Interactive features (FAQ, menu, animations)
│   └── images/                # Static assets (placeholder)
│
├── echolater-frontend/        # Frontend React app (empty - to be built)
├── echolater-backend/         # Backend Express server (empty - to be built)
│
└── docs/prd/                  # Product Requirements Documents
    ├── landing/README.md      # Landing page PRD
    ├── frontend/README.md     # Frontend PRD
    └── backend/README.md      # Backend PRD
```

## Documentation

All PRDs are located in `docs/prd/`. **Always consult these PRDs before implementing features** - they contain:
- Complete technical specifications
- API contracts
- Database schemas
- UI/UX requirements
- Feature requirements

## Landing Page

**Location**: `landing-page/`

### Preview
Open `landing-page/index.html` directly in browser or use:
```bash
cd landing-page
python -m http.server 8000
# Visit http://localhost:8000
```

### Structure
- Pure HTML/CSS/JS (no build process)
- Responsive design (mobile-first)
- Interactive FAQ accordion and mobile menu
- Scroll animations using Intersection Observer

### Key Files
- `css/style.css`: Uses CSS variables (`:root`) for theming
- `js/script.js`: Contains FAQ toggle, mobile menu, smooth scrolling

## Frontend (To Be Built)

**Location**: `echolater-frontend/`
**PRD**: `docs/prd/frontend/README.md`

### Planned Tech Stack
- React 18+ with TypeScript
- Vite (build tool)
- React Router v6
- Zustand (state management)
- Tailwind CSS
- Ant Design or shadcn/ui

### Core Features (from PRD)
1. **Authentication**: Email/password login with JWT
2. **Voice Recording**: Web Audio API, 5-minute max duration
3. **Idea List**: Time-based categorization (Today/This Week/Future/Inbox)
4. **Search & Filter**: Keyword search, tag filtering
5. **Settings**: Theme toggle, language switch, data export

### API Integration
Base URL pattern: `/api/v1`
- Authentication: `/api/auth/*`
- Ideas CRUD: `/api/ideas/*`
- File upload: `/api/upload/audio`

See `docs/prd/frontend/README.md` section 6.2 for complete API contracts.

## Backend (To Be Built)

**Location**: `echolater-backend/`
**PRD**: `docs/prd/backend/README.md`

### Planned Tech Stack
- Node.js 18+ LTS
- TypeScript 5+
- Express.js 4.18+
- PostgreSQL 15+ (primary database)
- Redis 7+ (sessions, caching)
- Prisma (ORM)
- S3/OSS (file storage)
- OpenAI Whisper API (speech transcription)

### Database Schema (from PRD)
```typescript
// User table
User {
  id: uuid
  email: string (unique)
  passwordHash: string
  nickname: string?
  avatar: string?
}

// Idea table
Idea {
  id: uuid
  userId: uuid
  audioUrl: string
  transcription: text
  extractedTime: datetime?
  timeCategory: enum (today/thisWeek/future/inbox)
  tags: string[]
  isCompleted: boolean
}
```

### Directory Structure (Recommended)
```
echolater-backend/
├── src/
│   ├── config/         # Environment config
│   ├── controllers/    # Request handlers
│   ├── services/       # Business logic
│   ├── models/         # Prisma models
│   ├── middlewares/    # Auth, validation, error handling
│   ├── routes/         # API routes
│   ├── utils/          # Helper functions
│   └── app.ts          # Express app entry
├── prisma/
│   └── schema.prisma   # Database schema
└── tests/
```

### AI Integration Workflow
1. Receive audio file upload
2. Store in S3/OSS
3. Call OpenAI Whisper API for transcription
4. Extract time entities using NLP
5. Categorize by time (today/thisWeek/future/inbox)
6. Save to PostgreSQL

See `docs/prd/backend/README.md` section 6.1 for detailed workflow.

## Design System

### Color Palette (from PRD)
```css
--primary: #4A90E2;      /* Blue - main brand color */
--secondary: #50E3C2;    /* Green - accent */
--accent: #F5A623;       /* Orange - CTA buttons */
--background: #F8F9FA;
--text-primary: #333333;
--text-secondary: #666666;
```

### Component Standards
- Border radius: 12px (cards), 24px (buttons)
- Shadows: `0 2px 8px rgba(0,0,0,0.08)` for cards
- Transitions: 300ms ease-in-out
- Button padding: 14px 32px

## Development Workflow

### When Adding New Features
1. Check corresponding PRD in `docs/prd/`
2. Follow specified tech stack and patterns
3. Maintain consistency with existing code style
4. Frontend components should match design system colors/spacing

### Code Standards
- **Naming**: PascalCase (components), camelCase (functions), kebab-case (files)
- **TypeScript**: Use strict mode
- **Git commits**: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`

### Coding Principles
**CRITICAL: All code generation MUST follow the principles defined in `rules.md`**

When writing ANY code in this project, you MUST strictly adhere to:

1. **SOLID Principles** (see `rules.md` section 1)
   - **S**: Single Responsibility - each class/function does ONE thing
   - **O**: Open/Closed - extend via abstraction, not modification
   - **L**: Liskov Substitution - subtypes must be substitutable for base types
   - **I**: Interface Segregation - small, focused interfaces
   - **D**: Dependency Inversion - depend on abstractions, use dependency injection

2. **DRY Principle** (see `rules.md` section 2)
   - No duplicate code - extract common logic after 2nd occurrence
   - Use functions/classes/modules for reusable logic
   - Avoid code, documentation, data, and logic duplication

3. **KISS Principle** (see `rules.md` section 3)
   - Prefer simple solutions over complex ones
   - Code readability is paramount
   - Avoid over-abstraction, unnecessary design patterns, and premature optimization

**Before generating code, ask yourself:**
- [ ] Does each function/class have a single, clear responsibility?
- [ ] Am I duplicating existing logic?
- [ ] Is this the simplest solution that works?
- [ ] Can a new developer understand this code quickly?
- [ ] Am I depending on abstractions rather than concrete implementations?

**Reference**: See complete examples and guidelines in `rules.md`

### Testing
- Frontend: Vitest + React Testing Library (target >80% coverage)
- Backend: Jest (service layer >80% coverage)

## Key Architectural Notes

### Frontend State Management
- **User state**: Zustand store for auth and user info
- **Idea state**: React Query for server state caching
- **Recording state**: Local Zustand store for audio recording UI

### Backend Authentication Flow
1. User submits email/password
2. bcrypt validates password hash
3. JWT token issued (7-day expiry)
4. Token stored in Redis with user session
5. Middleware validates token on protected routes

### Time Categorization Logic
```typescript
// From backend PRD
if (!extractedTime) return 'inbox';
if (isSameDay(extractedTime, today)) return 'today';
if (extractedTime <= endOfWeek) return 'thisWeek';
return 'future';
```

## Environment Variables

### Frontend (Vite)
```
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

### Backend
```
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
JWT_SECRET=...
AWS_S3_BUCKET=...
OPENAI_API_KEY=...
```

## Deployment

- **Landing Page**: Vercel, Netlify, or GitHub Pages
- **Frontend**: Vercel (automatic Git deployment)
- **Backend**: Railway, Render, or Fly.io (Docker recommended)

## Important Context

- **Product Focus**: This is NOT a task manager - it's specifically for quick voice capture and basic time-based organization
- **User Flow**: Record → AI transcribes → Auto-categorize by time → Display in time buckets
- **MVP Priority**: Authentication → Recording → List view → Basic editing (see PRD Phase 1)
- **AI Provider**: OpenAI Whisper is primary, but backend should support multiple providers (讯飞, Azure Speech as fallbacks)
