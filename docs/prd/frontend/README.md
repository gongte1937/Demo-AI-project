# Frontend PRD - Temporary Plan Generator
## React Web Application

## 1. Product Overview

### 1.1 Product Name
Temporary Plan Generator · Voice Idea Recording Tool (Web App)

### 1.2 Product Positioning
A web-based voice idea recording tool that helps users quickly capture temporary thoughts and plans via voice. AI automatically organizes and categorizes them by time dimension.

### 1.3 Core Value
- **Fast Capture**: Voice input, hands-free, record in 1 second
- **Smart Organization**: AI automatically extracts time info and key content
- **Clear Categorization**: Auto-categorized by time (Today / This Week / Future)
- **Lightweight & Simple**: Not a complex task manager — focused on quick capture

## 2. Tech Stack

### 2.1 Frontend Framework
- **Framework**: React 18+ (Functional Components + Hooks)
- **Language**: TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v6
- **State Management**: Zustand / React Query
- **UI Component Library**: Ant Design / shadcn/ui
- **Styling**: Tailwind CSS

### 2.2 Core Dependencies
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.20.0",
  "typescript": "^5.3.0",
  "zustand": "^4.4.0",
  "@tanstack/react-query": "^5.0.0",
  "axios": "^1.6.0",
  "dayjs": "^1.11.0",
  "tailwindcss": "^3.4.0"
}
```

## 3. Feature Requirements

### 3.1 User Authentication
- Email/password login and registration
- JWT token authentication
- Stay logged in (7 days)
- Forgot password / reset password
- Profile management

### 3.2 Voice Recording Module
**Recording Features**:
- Web Audio API / MediaRecorder API
- Real-time audio waveform animation
- Pause / resume / cancel recording
- Maximum recording duration: 5 minutes
- Playback preview after recording
- Manual text note addition

**Technical Notes**:
- Recording format: WebM / WAV
- File size limit: 10MB
- Browser permission request handling
- Fallback for recording failures

### 3.3 Idea List Module

**Time-Based Categorization**:
- **Today** - Ideas that need to be addressed today
- **This Week** - Plans for the current week
- **Future** - Future ideas
- **Inbox** - Ideas with no time reference identified by AI

**Idea Card Display**:
- Original recording playback button
- AI transcription text
- Extracted time tag
- Category tag
- Creation time
- Action buttons (Edit / Delete / Complete / Share)

**List Interactions**:
- Pull-to-refresh
- Infinite scroll (pagination)
- Card expand/collapse
- Drag-to-reorder (optional)

### 3.4 Idea Detail Page
- Full recording playback
- AI transcription text editing
- Time information adjustment
- Add/modify tags
- Mark as complete
- Delete confirmation

### 3.5 Search & Filter
- Global search bar
- Keyword search
- Search history
- Filter by time range
- Filter by tag
- Filter by completion status
- Combined filters

### 3.6 Settings Page
- Profile editing (nickname, avatar)
- Password change
- Theme toggle (light/dark)
- Language switch (Chinese/English)
- Recording quality settings
- Data export (JSON/CSV)
- Account deletion
- Logout

## 4. Page Structure

### 4.1 Routing Design
```
/                       Home (shows Landing Page when logged out)
├── /login              Login page
├── /register           Registration page
├── /reset-password     Reset password
├── /app                Main app (requires authentication)
│   ├── /app/home       Idea list (main page)
│   ├── /app/record     Recording page
│   ├── /app/detail/:id Idea detail
│   ├── /app/search     Search page
│   └── /app/settings   Settings page
└── /404                404 page
```

### 4.2 Layout Design

**Mobile Layout** (priority):
```
┌─────────────────────┐
│   Header            │
├─────────────────────┤
│                     │
│   Content           │
│                     │
├─────────────────────┤
│  Bottom Navigation  │
└─────────────────────┘
```

Bottom navigation:
- Home (list)
- Record (center + button)
- Settings

**Desktop Layout**:
```
┌────────┬─────────────┐
│        │   Header    │
│ Sidebar├─────────────┤
│        │   Content   │
│        │             │
└────────┴─────────────┘
```

## 5. UI/UX Design Specifications

### 5.1 Color Scheme
```css
/* Light Theme */
--primary: #4A90E2;
--secondary: #50E3C2;
--accent: #F5A623;
--background: #F8F9FA;
--card-bg: #FFFFFF;
--text-primary: #333333;
--text-secondary: #666666;

/* Dark Theme */
--primary: #4A90E2;
--secondary: #50E3C2;
--accent: #F5A623;
--background: #1A1A1A;
--card-bg: #2D2D2D;
--text-primary: #FFFFFF;
--text-secondary: #B0B0B0;
```

### 5.2 Typography
- Headings: 24–28px, bold
- Body text: 16–18px, regular
- Secondary text: 12–14px, regular

### 5.3 Component Specifications
- Button border radius: 24px
- Card border radius: 12px
- Card spacing: 12px
- Input field height: 48px
- Icon size: 24px

### 5.4 Animations
- Page transition: 300ms ease-in-out
- Button press: scale(0.95)
- Card hover: translateY(-4px)
- Recording animation: audio waveform breathing effect

## 6. Data Flow Design

### 6.1 State Management (Zustand)
```typescript
// User state
interface UserStore {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials) => Promise<void>;
  logout: () => void;
}

// Idea list state
interface IdeaStore {
  ideas: Idea[];
  loading: boolean;
  fetchIdeas: () => Promise<void>;
  addIdea: (idea: Idea) => Promise<void>;
  updateIdea: (id: string, data: Partial<Idea>) => Promise<void>;
  deleteIdea: (id: string) => Promise<void>;
}

// Recording state
interface RecordStore {
  isRecording: boolean;
  audioBlob: Blob | null;
  duration: number;
  startRecording: () => void;
  stopRecording: () => void;
}
```

### 6.2 API Interactions
```
POST   /api/auth/login          Login
POST   /api/auth/register       Register
GET    /api/ideas               Get idea list
POST   /api/ideas               Create idea
PUT    /api/ideas/:id           Update idea
DELETE /api/ideas/:id           Delete idea
POST   /api/upload/audio        Upload recording
GET    /api/ideas/search        Search
```

## 7. Performance Optimization

- Route lazy loading (React.lazy)
- Virtual list (react-window)
- Image lazy loading
- Debounce/throttle (search, scroll)
- Service Worker caching
- Code splitting
- Target first contentful paint: < 2 seconds

## 8. Compatibility

### 8.1 Browsers
- Chrome 90+
- Safari 14+
- Firefox 88+
- Edge 90+

### 8.2 Devices
- iOS 14+
- Android 10+
- Responsive: 375px – 1920px

## 9. Security

- XSS protection (DOMPurify)
- CSRF token validation
- HTTPS enforced
- JWT token encrypted storage
- Confirmation for sensitive operations

## 10. Development Standards

### 10.1 Code Standards
- TypeScript strict mode
- ESLint + Prettier
- Component naming: PascalCase
- File naming: kebab-case
- Function naming: camelCase

### 10.2 Component Structure
```
components/
├── Button/
│   ├── index.tsx
│   ├── Button.test.tsx
│   └── types.ts
```

### 10.3 Git Commit Convention
```
feat: new feature
fix: bug fix
docs: documentation update
refactor: refactoring
test: tests
chore: build/tooling updates
```

## 11. Testing

- Unit tests: Vitest + React Testing Library
- Test coverage: > 80%
- E2E tests: Playwright (core flows)

## 12. Deployment

- Platform: Vercel / Netlify
- Environment variable: `VITE_API_BASE_URL`
- Auto-deploy: triggered on Git push
- CDN acceleration

## 13. Roadmap

### Phase 1: MVP (4 weeks)
- User authentication
- Voice recording
- Idea list
- Basic CRUD

### Phase 2: Feature Completion (3 weeks)
- Search and filters
- Time categorization optimization
- Tag system

### Phase 3: Experience Improvements (2 weeks)
- Dark mode
- Performance optimization
- Animation polish

---

**Document Version**: v1.0
**Created**: 2026-02-10
**Status**: Draft
