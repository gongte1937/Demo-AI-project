# Backend PRD - Temporary Plan Generator
## Node.js TypeScript NestJS Server

## 1. Product Overview

### 1.1 Backend Role
Provides RESTful API services for the Temporary Plan Generator, handling user authentication, voice file upload, AI transcription, and core business logic.

### 1.2 Core Responsibilities
- User authentication and authorization
- Voice file upload and storage
- Calling AI services for speech transcription
- Extracting time information and key content
- Idea data CRUD operations

## 2. Tech Stack

### 2.1 Core Technologies
- **Runtime**: Node.js 18+ LTS
- **Language**: TypeScript 5+
- **Web Framework**: NestJS 10+
- **Database**: PostgreSQL 15+ hosted on Supabase
- **ORM**: Prisma (connects to Supabase via connection pooling)
- **File Storage**: Supabase Storage
- **AI Services**: OpenAI Whisper API / iFlytek Speech / Azure Speech

### 2.2 Core Dependencies
```json
{
  "@nestjs/core": "^10.0.0",
  "@nestjs/common": "^10.0.0",
  "@nestjs/platform-express": "^10.0.0",
  "@nestjs/jwt": "^10.0.0",
  "@nestjs/passport": "^10.0.0",
  "passport-jwt": "^4.0.0",
  "typescript": "^5.3.0",
  "prisma": "^5.7.0",
  "@prisma/client": "^5.7.0",
  "bcrypt": "^5.1.0",
  "multer": "^1.4.5-lts.1",
  "axios": "^1.6.0",
  "class-validator": "^0.14.0",
  "class-transformer": "^0.5.0",
  "@supabase/supabase-js": "^2.0.0"
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
│   NestJS Application        │
│  ┌─────────────────────┐   │
│  │  Guards / Pipes     │   │
│  ├─────────────────────┤   │
│  │  Controllers        │   │
│  ├─────────────────────┤   │
│  │  Services           │   │
│  ├─────────────────────┤   │
│  │  Modules            │   │
│  └─────────────────────┘   │
└────────────┬───────────────┘
             │
             ↓
      ┌─────────────────────────┐
      │       Supabase          │
      │  ┌──────────────────┐  │
      │  │  PostgreSQL DB   │  │
      │  ├──────────────────┤  │
      │  │  Storage (Files) │  │
      │  └──────────────────┘  │
      └─────────────────────────┘
```

### 3.2 Directory Structure
```
src/
├── auth/             # Authentication module
│   ├── auth.module.ts
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── jwt.strategy.ts
│   └── dto/
├── ideas/            # Ideas module
│   ├── ideas.module.ts
│   ├── ideas.controller.ts
│   ├── ideas.service.ts
│   └── dto/
├── users/            # Users module
│   ├── users.module.ts
│   ├── users.controller.ts
│   ├── users.service.ts
│   └── dto/
├── upload/           # File upload module
│   ├── upload.module.ts
│   ├── upload.controller.ts
│   └── upload.service.ts
├── ai/               # AI transcription module
│   ├── ai.module.ts
│   └── ai.service.ts
├── prisma/           # Prisma service
│   └── prisma.service.ts
├── supabase/         # Supabase client
│   └── supabase.service.ts
├── common/           # Shared utilities
│   ├── filters/      # Exception filters
│   ├── guards/       # Auth guards
│   └── pipes/        # Validation pipes
└── main.ts           # App entry point
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
3. Upload to Supabase Storage
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
- **JWT Token**: 7-day expiry
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
// JWT Auth Guard (NestJS)
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

// Resource ownership validation
@Injectable()
export class IdeaOwnerGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const idea = await this.prisma.idea.findUnique({
      where: { id: request.params.id },
    });
    return idea?.userId === request.user.id;
  }
}

// Usage in controller
@UseGuards(JwtAuthGuard, IdeaOwnerGuard)
@Delete(':id')
async deleteIdea(@Param('id') id: string) { ... }
```

## 8. Error Handling

### 8.1 Unified Error Response
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

### 8.2 Error Code Definitions
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

### 8.3 Global Exception Filter (NestJS)
```typescript
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(status).json({
      success: false,
      error: {
        code: ErrorCode.INTERNAL_ERROR,
        message: 'An unexpected error occurred',
      },
    });
  }
}
```

## 9. Logging & Monitoring

### 9.1 Logging System
Using NestJS built-in Logger:
- **Error level**: System errors, exceptions
- **Warn level**: Business warnings
- **Info level**: Important operations (login, create, delete)
- **Debug level**: Debug information (development only)

### 9.2 Monitoring Metrics
- API response time
- Database query latency
- Error rate
- AI transcription success rate
- File upload success rate

## 10. Testing

### 10.1 Unit Tests
- Service layer coverage > 80%
- Testing framework: Jest (NestJS built-in)
- Mocks: database, external APIs

### 10.2 Integration Tests
- API end-to-end tests
- Using NestJS testing utilities + Supertest
- Test database: PostgreSQL test instance

## 11. Deployment

### 11.1 Environment Configuration
```env
NODE_ENV=production
PORT=3000

# Supabase
SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx

# Prisma connects via Supabase connection pooler (port 6543)
DATABASE_URL=postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres

JWT_SECRET=xxx
OPENAI_API_KEY=xxx
```

> **Note**: Prisma requires both `DATABASE_URL` (pooled, for queries) and `DIRECT_URL` (direct, for migrations). Configure both in `prisma/schema.prisma`:
> ```prisma
> datasource db {
>   provider  = "postgresql"
>   url       = env("DATABASE_URL")
>   directUrl = env("DIRECT_URL")
> }
> ```

### 11.2 Deployment Platforms
- **Recommended**: Railway / Render / Fly.io
- **Alternatives**: AWS EC2 / DigitalOcean / Alibaba Cloud ECS
- **Containerization**: Docker + Docker Compose

### 11.3 CI/CD
```yaml
# GitHub Actions
- Build TypeScript
- Run Tests
- Docker Build
- Deploy to Production
```

## 12. Roadmap

### Phase 1: MVP (4 weeks)
- User authentication API
- Idea CRUD API
- File upload
- Basic AI transcription

### Phase 2: Feature Completion (3 weeks)
- Search API
- Time extraction improvement
- Tag system

---

**Document Version**: v1.1
**Created**: 2026-02-10
**Updated**: 2026-02-12
**Status**: Draft
