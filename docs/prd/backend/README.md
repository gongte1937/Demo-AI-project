# Backend PRD - Temporary Plan Generator
## Node.js TypeScript Express Server

## 1. Product Overview

### 1.1 Backend Role
Provides RESTful API services for the Temporary Plan Generator, handling user authentication, voice file upload, AI transcription, data storage, and other core business logic.

### 1.2 Core Responsibilities
- User authentication and authorization
- Voice file upload and storage
- Calling AI services for speech transcription
- Extracting time information and key content
- Idea data CRUD operations
- Data persistence and caching

## 2. Tech Stack

### 2.1 Core Technologies
- **Runtime**: Node.js 18+ LTS
- **Language**: TypeScript 5+
- **Web Framework**: Express.js 4.18+
- **Database**: PostgreSQL 15+ (primary database)
- **Cache**: Redis 7+ (sessions, caching)
- **ORM**: Prisma / TypeORM
- **File Storage**: AWS S3 / Alibaba Cloud OSS / MinIO
- **AI Services**: OpenAI Whisper API / iFlytek Speech / Azure Speech

### 2.2 Core Dependencies
```json
{
  "express": "^4.18.0",
  "typescript": "^5.3.0",
  "prisma": "^5.7.0",
  "@prisma/client": "^5.7.0",
  "jsonwebtoken": "^9.0.0",
  "bcrypt": "^5.1.0",
  "multer": "^1.4.5-lts.1",
  "axios": "^1.6.0",
  "redis": "^4.6.0",
  "joi": "^17.11.0",
  "winston": "^3.11.0"
}
```

## 3. System Architecture

### 3.1 Architecture Design
```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │ HTTPS
       ↓
┌─────────────┐
│  Nginx/CDN  │ (Reverse proxy / load balancer)
└──────┬──────┘
       │
       ↓
┌─────────────────────────────┐
│   Express Application       │
│  ┌─────────────────────┐   │
│  │  Auth Middleware    │   │
│  ├─────────────────────┤   │
│  │  Routes             │   │
│  ├─────────────────────┤   │
│  │  Controllers        │   │
│  ├─────────────────────┤   │
│  │  Services           │   │
│  └─────────────────────┘   │
└────┬─────────┬──────────┬──┘
     │         │          │
     ↓         ↓          ↓
┌─────────┐ ┌──────┐ ┌──────┐
│PostgreSQL│ │Redis │ │ S3   │
└─────────┘ └──────┘ └──────┘
```

### 3.2 Directory Structure
```
src/
├── config/           # Configuration files
├── controllers/      # Request handlers
├── services/         # Business logic
├── models/           # Data models
├── middlewares/      # Middleware
├── routes/           # API routes
├── utils/            # Utility functions
├── validators/       # Data validation
├── types/            # TypeScript type definitions
└── app.ts            # App entry point
```

## 4. Database Design

### 4.1 Data Models

#### User Table
```typescript
model User {
  id            String    @id @default(uuid())
  email         String    @unique
  passwordHash  String
  nickname      String?
  avatar        String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  ideas         Idea[]
}
```

#### Idea Table
```typescript
model Idea {
  id              String    @id @default(uuid())
  userId          String
  user            User      @relation(fields: [userId], references: [id])
  audioUrl        String    // Recording file URL
  audioFileName   String    // File name
  audioDuration   Int       // Recording duration (seconds)
  transcription   String    @db.Text // AI transcription text
  extractedTime   DateTime? // Extracted time information
  timeCategory    String    // today/thisWeek/future/inbox
  tags            String[]  // Tag array
  isCompleted     Boolean   @default(false)
  completedAt     DateTime?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  @@index([userId, timeCategory])
  @@index([userId, createdAt])
}
```

#### Session Table (Redis)
```typescript
interface Session {
  userId: string;
  token: string;
  expiresAt: number;
}
```

## 5. API Design

### 5.1 Authentication

#### POST /api/auth/register
Register a new user
```typescript
Request Body:
{
  email: string;
  password: string;
  nickname?: string;
}

Response:
{
  success: true,
  data: {
    user: { id, email, nickname },
    token: string
  }
}
```

#### POST /api/auth/login
User login
```typescript
Request Body:
{
  email: string;
  password: string;
}

Response:
{
  success: true,
  data: {
    user: { id, email, nickname, avatar },
    token: string
  }
}
```

#### POST /api/auth/logout
Logout
```typescript
Headers:
Authorization: Bearer <token>

Response:
{
  success: true,
  message: "Logged out successfully"
}
```

### 5.2 Ideas

#### GET /api/ideas
Get idea list
```typescript
Query Params:
{
  page?: number;         // Page number, default 1
  limit?: number;        // Items per page, default 20
  timeCategory?: string; // today/thisWeek/future/inbox
  isCompleted?: boolean;
  search?: string;       // Search keyword
}

Response:
{
  success: true,
  data: {
    ideas: Idea[],
    pagination: {
      total: number,
      page: number,
      limit: number,
      totalPages: number
    }
  }
}
```

#### POST /api/ideas
Create a new idea (upload recording)
```typescript
Request (multipart/form-data):
{
  audio: File,           // Recording file
  manualNote?: string    // Manual note
}

Response:
{
  success: true,
  data: {
    idea: Idea
  }
}
```

#### GET /api/ideas/:id
Get idea details
```typescript
Response:
{
  success: true,
  data: {
    idea: Idea
  }
}
```

#### PUT /api/ideas/:id
Update idea
```typescript
Request Body:
{
  transcription?: string;
  extractedTime?: string;
  timeCategory?: string;
  tags?: string[];
  isCompleted?: boolean;
}

Response:
{
  success: true,
  data: {
    idea: Idea
  }
}
```

#### DELETE /api/ideas/:id
Delete idea
```typescript
Response:
{
  success: true,
  message: "Idea deleted successfully"
}
```

### 5.3 User

#### GET /api/user/profile
Get user profile
```typescript
Response:
{
  success: true,
  data: {
    user: { id, email, nickname, avatar, createdAt }
  }
}
```

#### PUT /api/user/profile
Update user profile
```typescript
Request Body:
{
  nickname?: string;
  avatar?: string;
}

Response:
{
  success: true,
  data: {
    user: User
  }
}
```

#### POST /api/user/change-password
Change password
```typescript
Request Body:
{
  oldPassword: string;
  newPassword: string;
}

Response:
{
  success: true,
  message: "Password changed successfully"
}
```

### 5.4 File Upload

#### POST /api/upload/audio
Upload audio file
```typescript
Request (multipart/form-data):
{
  file: File
}

Response:
{
  success: true,
  data: {
    url: string,
    filename: string,
    size: number,
    duration: number
  }
}
```

## 6. Core Business Logic

### 6.1 Speech Transcription Flow
```
1. Receive audio file
   ↓
2. Validate file format and size
   ↓
3. Upload to object storage (S3)
   ↓
4. Call AI transcription service (OpenAI Whisper)
   ↓
5. Extract time information (NLP processing)
   ↓
6. Auto-categorize (today/thisWeek/future)
   ↓
7. Save to database
   ↓
8. Return result to client
```

### 6.2 Time Extraction and Categorization

**Time extraction rules**:
- "Tomorrow" → next day's date
- "Next Wednesday" → calculate the specific date
- "March 15th" → convert to standard date
- "8pm tonight" → append date info

**Categorization logic**:
```typescript
function categorizeByTime(extractedTime: Date | null): string {
  if (!extractedTime) return 'inbox';

  const now = new Date();
  const today = startOfDay(now);
  const weekEnd = endOfWeek(now);

  if (isSameDay(extractedTime, today)) return 'today';
  if (extractedTime <= weekEnd) return 'thisWeek';
  return 'future';
}
```

### 6.3 AI Service Integration

**OpenAI Whisper API**:
```typescript
async function transcribeAudio(audioUrl: string): Promise<string> {
  const response = await openai.audio.transcriptions.create({
    file: audioUrl,
    model: "whisper-1",
    language: "zh"
  });
  return response.text;
}
```

**Fallback providers**: iFlytek Speech, Azure Speech, Google Cloud Speech

## 7. Security Design

### 7.1 Authentication & Authorization
- **JWT Token**: 7-day expiry, stored in Redis
- **Password hashing**: bcrypt (salt rounds: 10)
- **Rate limiting**: Restrict API request frequency
- **CORS configuration**: Allow whitelisted domains only

### 7.2 Data Security
- **SQL injection protection**: Use Prisma ORM parameterized queries
- **XSS protection**: Input content filtering and escaping
- **File upload validation**: Restrict file types and sizes
- **Sensitive data encryption**: Store secrets in environment variables

### 7.3 Access Control
```typescript
// Authentication middleware
async function authenticate(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  const decoded = jwt.verify(token, JWT_SECRET);
  req.user = await prisma.user.findUnique({ where: { id: decoded.userId } });
  next();
}

// Resource ownership validation
async function authorizeIdeaOwner(req, res, next) {
  const idea = await prisma.idea.findUnique({ where: { id: req.params.id } });
  if (idea.userId !== req.user.id) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
}
```

## 8. Performance Optimization

### 8.1 Caching Strategy
- **Redis cache**: User sessions, hot data
- **Cache TTL**: User info (1 hour), idea list (5 minutes)
- **Cache invalidation**: Proactively clear on data updates

### 8.2 Database Optimization
- **Indexes**: userId, timeCategory, createdAt
- **Paginated queries**: Limit per-query result size
- **Connection pooling**: Reuse database connections

### 8.3 File Handling
- **Async upload**: Background task queue (Bull)
- **CDN acceleration**: Serve static assets via CDN
- **File compression**: Compress audio files for storage

## 9. Error Handling

### 9.1 Unified Error Response
```typescript
{
  success: false,
  error: {
    code: string,      // ERROR_CODE
    message: string,   // User-friendly error message
    details?: any      // Detailed error info (development only)
  }
}
```

### 9.2 Error Code Definitions
```typescript
enum ErrorCode {
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  FILE_TOO_LARGE = 'FILE_TOO_LARGE',
  TRANSCRIPTION_FAILED = 'TRANSCRIPTION_FAILED',
  INTERNAL_ERROR = 'INTERNAL_ERROR'
}
```

## 10. Logging & Monitoring

### 10.1 Logging System
Using Winston for logging:
- **Error level**: System errors, exceptions
- **Warn level**: Business warnings
- **Info level**: Important operations (login, create, delete)
- **Debug level**: Debug information (development only)

### 10.2 Monitoring Metrics
- API response time
- Database query latency
- Error rate
- AI transcription success rate
- File upload success rate

## 11. Testing

### 11.1 Unit Tests
- Service layer coverage > 80%
- Testing framework: Jest
- Mocks: database, external APIs

### 11.2 Integration Tests
- API end-to-end tests
- Using Supertest
- Test database: PostgreSQL test instance

### 11.3 Performance Tests
- Load testing: Apache Bench / k6
- Target: API response time < 500ms

## 12. Deployment

### 12.1 Environment Configuration
```env
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://user:pass@host:5432/db
REDIS_URL=redis://host:6379
JWT_SECRET=xxx
AWS_S3_BUCKET=xxx
OPENAI_API_KEY=xxx
```

### 12.2 Deployment Platforms
- **Recommended**: Railway / Render / Fly.io
- **Alternatives**: AWS EC2 / DigitalOcean / Alibaba Cloud ECS
- **Containerization**: Docker + Docker Compose

### 12.3 CI/CD
```yaml
# GitHub Actions
- Build TypeScript
- Run Tests
- Docker Build
- Deploy to Production
```

## 13. Extensibility Design

### 13.1 Microservice Split (Future)
- Auth service
- Core business service
- AI transcription service
- File service

### 13.2 Message Queue
- Use Bull/BullMQ for async task processing
- Tasks: AI transcription, email sending, data export

## 14. Roadmap

### Phase 1: MVP (4 weeks)
- User authentication API
- Idea CRUD API
- File upload
- Basic AI transcription

### Phase 2: Feature Completion (3 weeks)
- Search API
- Time extraction optimization
- Tag system
- Cache optimization

### Phase 3: Performance Optimization (2 weeks)
- Database optimization
- Redis caching
- Async task queue
- Monitoring & alerting

---

**Document Version**: v1.0
**Created**: 2026-02-10
**Status**: Draft
