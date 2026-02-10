# Backend PRD - 临时计划生成器
## Node.js TypeScript Express Server

## 1. 产品概述

### 1.1 后端定位
为"临时计划生成器"提供RESTful API服务，处理用户认证、语音文件上传、AI转录、数据存储等核心业务逻辑。

### 1.2 核心职责
- 用户认证与授权
- 语音文件上传与存储
- 调用AI服务进行语音转录
- 提取时间信息和关键内容
- 想法数据的CRUD操作
- 数据持久化与缓存

## 2. 技术栈

### 2.1 核心技术
- **运行环境**: Node.js 18+ LTS
- **语言**: TypeScript 5+
- **Web框架**: Express.js 4.18+
- **数据库**: PostgreSQL 15+ (主数据库)
- **缓存**: Redis 7+ (会话、缓存)
- **ORM**: Prisma / TypeORM
- **文件存储**: AWS S3 / 阿里云OSS / MinIO
- **AI服务**: OpenAI Whisper API / 讯飞语音 / Azure Speech

### 2.2 核心依赖
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

## 3. 系统架构

### 3.1 架构设计
```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │ HTTPS
       ↓
┌─────────────┐
│  Nginx/CDN  │ (反向代理/负载均衡)
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

### 3.2 目录结构
```
src/
├── config/           # 配置文件
├── controllers/      # 控制器
├── services/         # 业务逻辑
├── models/          # 数据模型
├── middlewares/     # 中间件
├── routes/          # 路由
├── utils/           # 工具函数
├── validators/      # 数据验证
├── types/           # TypeScript类型定义
└── app.ts           # 应用入口
```

## 4. 数据库设计

### 4.1 数据模型

#### User (用户表)
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

#### Idea (想法表)
```typescript
model Idea {
  id              String    @id @default(uuid())
  userId          String
  user            User      @relation(fields: [userId], references: [id])
  audioUrl        String    // 录音文件URL
  audioFileName   String    // 文件名
  audioDuration   Int       // 录音时长(秒)
  transcription   String    @db.Text // AI转录文本
  extractedTime   DateTime? // 提取的时间信息
  timeCategory    String    // today/thisWeek/future/inbox
  tags            String[]  // 标签数组
  isCompleted     Boolean   @default(false)
  completedAt     DateTime?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  @@index([userId, timeCategory])
  @@index([userId, createdAt])
}
```

#### Session (会话表 - Redis)
```typescript
interface Session {
  userId: string;
  token: string;
  expiresAt: number;
}
```

## 5. API 设计

### 5.1 认证相关

#### POST /api/auth/register
注册新用户
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
用户登录
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
退出登录
```typescript
Headers:
Authorization: Bearer <token>

Response:
{
  success: true,
  message: "Logged out successfully"
}
```

### 5.2 想法相关

#### GET /api/ideas
获取想法列表
```typescript
Query Params:
{
  page?: number;         // 页码，默认1
  limit?: number;        // 每页数量，默认20
  timeCategory?: string; // today/thisWeek/future/inbox
  isCompleted?: boolean;
  search?: string;       // 搜索关键词
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
创建新想法(上传录音)
```typescript
Request (multipart/form-data):
{
  audio: File,           // 录音文件
  manualNote?: string    // 手动备注
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
获取想法详情
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
更新想法
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
删除想法
```typescript
Response:
{
  success: true,
  message: "Idea deleted successfully"
}
```

### 5.3 用户相关

#### GET /api/user/profile
获取用户信息
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
更新用户信息
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
修改密码
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

### 5.4 文件上传

#### POST /api/upload/audio
上传录音文件
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

## 6. 核心业务逻辑

### 6.1 语音转录流程
```
1. 接收录音文件
   ↓
2. 验证文件格式和大小
   ↓
3. 上传到对象存储(S3)
   ↓
4. 调用AI转录服务(OpenAI Whisper)
   ↓
5. 提取时间信息(NLP处理)
   ↓
6. 智能分类(today/thisWeek/future)
   ↓
7. 保存到数据库
   ↓
8. 返回结果给客户端
```

### 6.2 时间提取与分类

**时间提取规则**:
- "明天" → 次日日期
- "下周三" → 计算具体日期
- "3月15日" → 转换为标准日期
- "晚上8点" → 补充日期信息

**分类逻辑**:
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

### 6.3 AI服务集成

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

**备选方案**: 讯飞语音、Azure Speech、Google Cloud Speech

## 7. 安全设计

### 7.1 认证与授权
- **JWT Token**: 有效期7天，存储在Redis
- **密码加密**: bcrypt (salt rounds: 10)
- **Rate Limiting**: 限制API请求频率
- **CORS配置**: 仅允许白名单域名

### 7.2 数据安全
- **SQL注入防护**: 使用Prisma ORM参数化查询
- **XSS防护**: 输入内容过滤和转义
- **文件上传验证**: 限制文件类型、大小
- **敏感数据加密**: 环境变量存储密钥

### 7.3 访问控制
```typescript
// 认证中间件
async function authenticate(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  const decoded = jwt.verify(token, JWT_SECRET);
  req.user = await prisma.user.findUnique({ where: { id: decoded.userId } });
  next();
}

// 资源所有权验证
async function authorizeIdeaOwner(req, res, next) {
  const idea = await prisma.idea.findUnique({ where: { id: req.params.id } });
  if (idea.userId !== req.user.id) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
}
```

## 8. 性能优化

### 8.1 缓存策略
- **Redis缓存**: 用户会话、热点数据
- **缓存时间**: 用户信息(1小时)、想法列表(5分钟)
- **缓存失效**: 数据更新时主动清除

### 8.2 数据库优化
- **索引**: userId, timeCategory, createdAt
- **分页查询**: 限制单次查询数量
- **连接池**: 复用数据库连接

### 8.3 文件处理
- **异步上传**: 后台任务队列(Bull)
- **CDN加速**: 静态资源通过CDN分发
- **文件压缩**: 录音文件压缩存储

## 9. 错误处理

### 9.1 统一错误响应
```typescript
{
  success: false,
  error: {
    code: string,      // ERROR_CODE
    message: string,   // 用户友好的错误信息
    details?: any      // 详细错误信息(开发环境)
  }
}
```

### 9.2 错误码定义
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

## 10. 日志与监控

### 10.1 日志系统
使用Winston记录日志:
- **Error级别**: 系统错误、异常
- **Warn级别**: 业务警告
- **Info级别**: 重要操作(登录、创建、删除)
- **Debug级别**: 调试信息(开发环境)

### 10.2 监控指标
- API响应时间
- 数据库查询耗时
- 错误率
- AI转录成功率
- 文件上传成功率

## 11. 测试

### 11.1 单元测试
- Service层测试覆盖率 > 80%
- 测试框架: Jest
- Mock: 数据库、外部API

### 11.2 集成测试
- API端到端测试
- 使用Supertest
- 测试数据库: PostgreSQL Test Instance

### 11.3 性能测试
- 负载测试: Apache Bench / k6
- 目标: API响应时间 < 500ms

## 12. 部署方案

### 12.1 环境配置
```env
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://user:pass@host:5432/db
REDIS_URL=redis://host:6379
JWT_SECRET=xxx
AWS_S3_BUCKET=xxx
OPENAI_API_KEY=xxx
```

### 12.2 部署平台
- **推荐**: Railway / Render / Fly.io
- **备选**: AWS EC2 / DigitalOcean / 阿里云ECS
- **容器化**: Docker + Docker Compose

### 12.3 CI/CD
```yaml
# GitHub Actions
- Build TypeScript
- Run Tests
- Docker Build
- Deploy to Production
```

## 13. 扩展性设计

### 13.1 微服务拆分(未来)
- 认证服务
- 核心业务服务
- AI转录服务
- 文件服务

### 13.2 消息队列
- 使用Bull/BullMQ处理异步任务
- 任务: AI转录、邮件发送、数据导出

## 14. 迭代计划

### Phase 1: MVP (4周)
- 用户认证API
- 想法CRUD API
- 文件上传
- 基础AI转录

### Phase 2: 功能完善 (3周)
- 搜索API
- 时间提取优化
- 标签系统
- 缓存优化

### Phase 3: 性能优化 (2周)
- 数据库优化
- Redis缓存
- 异步任务队列
- 监控告警

---

**文档版本**: v1.0
**创建日期**: 2026-02-10
**状态**: Draft
