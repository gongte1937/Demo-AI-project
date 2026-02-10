# Frontend PRD - 临时计划生成器
## React Web Application

## 1. 产品概述

### 1.1 产品名称
临时计划生成器 · 语音想法记录工具 (Web App)

### 1.2 产品定位
一款基于Web的语音想法记录工具，帮助用户通过语音快速记录临时想法和计划，AI自动整理并按时间维度分类展示。

### 1.3 核心价值
- **快速录入**: 语音输入，解放双手，1秒完成记录
- **智能整理**: AI自动提取时间信息和关键内容
- **清晰分类**: 按时间维度自动分类(今日/本周/未来)
- **轻量简洁**: 不是复杂的任务管理工具，专注快速记录

## 2. 技术栈

### 2.1 前端框架
- **框架**: React 18+ (函数式组件 + Hooks)
- **语言**: TypeScript
- **构建工具**: Vite
- **路由**: React Router v6
- **状态管理**: Zustand / React Query
- **UI组件库**: Ant Design / shadcn/ui
- **样式方案**: Tailwind CSS

### 2.2 核心依赖
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

## 3. 功能需求

### 3.1 用户认证模块
- 邮箱/密码登录注册
- JWT Token认证
- 记住登录状态(7天)
- 忘记密码/重置密码
- 个人信息管理

### 3.2 语音录制模块
**录音功能**:
- Web Audio API / MediaRecorder API
- 实时音波动画显示
- 录音暂停/继续/取消
- 最大录音时长: 5分钟
- 录音后播放预览
- 手动添加文字备注

**技术要点**:
- 录音格式: WebM / WAV
- 文件大小限制: 10MB
- 浏览器权限请求处理
- 录音失败降级方案

### 3.3 想法列表模块

**时间维度分类**:
- **今日事项** (Today) - 今天需要处理的想法
- **本周计划** (This Week) - 本周内的计划
- **未来安排** (Future) - 未来的想法
- **无时间标签** (Inbox) - AI未识别出时间的想法

**想法卡片显示**:
- 原始录音播放按钮
- AI转录文本
- 提取的时间标签
- 分类标签
- 创建时间
- 操作按钮(编辑/删除/完成/分享)

**列表交互**:
- 下拉刷新
- 上滑加载更多(分页)
- 卡片展开/折叠
- 拖拽排序(可选)

### 3.4 想法详情页
- 完整录音播放
- AI转录文本编辑
- 时间信息调整
- 标签添加/修改
- 完成状态标记
- 删除确认

### 3.5 搜索与筛选
- 全局搜索框
- 按关键词搜索
- 搜索历史记录
- 按时间范围筛选
- 按标签筛选
- 按完成状态筛选
- 组合筛选

### 3.6 设置页面
- 个人信息编辑(昵称、头像)
- 密码修改
- 主题切换(浅色/深色)
- 语言切换(中文/英文)
- 录音质量设置
- 数据导出(JSON/CSV)
- 账号注销
- 退出登录

## 4. 页面结构

### 4.1 路由设计
```
/                       首页(未登录展示Landing Page)
├── /login              登录页
├── /register           注册页
├── /reset-password     重置密码
├── /app                主应用(需认证)
│   ├── /app/home       想法列表(主页)
│   ├── /app/record     录音页面
│   ├── /app/detail/:id 想法详情
│   ├── /app/search     搜索页面
│   └── /app/settings   设置页面
└── /404                404页面
```

### 4.2 布局设计

**移动端布局** (优先):
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

底部导航:
- 首页 (列表)
- 录音 (中央+按钮)
- 设置

**桌面端布局**:
```
┌────────┬─────────────┐
│        │   Header    │
│ Sidebar├─────────────┤
│        │   Content   │
│        │             │
└────────┴─────────────┘
```

## 5. UI/UX 设计规范

### 5.1 色彩方案
```css
/* 浅色主题 */
--primary: #4A90E2;
--secondary: #50E3C2;
--accent: #F5A623;
--background: #F8F9FA;
--card-bg: #FFFFFF;
--text-primary: #333333;
--text-secondary: #666666;

/* 深色主题 */
--primary: #4A90E2;
--secondary: #50E3C2;
--accent: #F5A623;
--background: #1A1A1A;
--card-bg: #2D2D2D;
--text-primary: #FFFFFF;
--text-secondary: #B0B0B0;
```

### 5.2 字体规范
- 标题: 24-28px, bold
- 正文: 16-18px, regular
- 辅助文字: 12-14px, regular

### 5.3 组件规范
- 按钮圆角: 24px
- 卡片圆角: 12px
- 卡片间距: 12px
- 输入框高度: 48px
- 图标大小: 24px

### 5.4 动效
- 页面过渡: 300ms ease-in-out
- 按钮点击: scale(0.95)
- 卡片悬浮: translateY(-4px)
- 录音动画: 音波呼吸效果

## 6. 数据流设计

### 6.1 状态管理 (Zustand)
```typescript
// 用户状态
interface UserStore {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials) => Promise<void>;
  logout: () => void;
}

// 想法列表状态
interface IdeaStore {
  ideas: Idea[];
  loading: boolean;
  fetchIdeas: () => Promise<void>;
  addIdea: (idea: Idea) => Promise<void>;
  updateIdea: (id: string, data: Partial<Idea>) => Promise<void>;
  deleteIdea: (id: string) => Promise<void>;
}

// 录音状态
interface RecordStore {
  isRecording: boolean;
  audioBlob: Blob | null;
  duration: number;
  startRecording: () => void;
  stopRecording: () => void;
}
```

### 6.2 API交互
```
POST   /api/auth/login          登录
POST   /api/auth/register       注册
GET    /api/ideas               获取想法列表
POST   /api/ideas               创建想法
PUT    /api/ideas/:id           更新想法
DELETE /api/ideas/:id           删除想法
POST   /api/upload/audio        上传录音
GET    /api/ideas/search        搜索
```

## 7. 性能优化

- 路由懒加载 (React.lazy)
- 虚拟列表 (react-window)
- 图片懒加载
- 防抖/节流 (搜索、滚动)
- Service Worker缓存
- 代码分割
- 首屏加载目标: < 2秒

## 8. 兼容性

### 8.1 浏览器
- Chrome 90+
- Safari 14+
- Firefox 88+
- Edge 90+

### 8.2 设备
- iOS 14+
- Android 10+
- 响应式: 375px - 1920px

## 9. 安全性

- XSS防护 (DOMPurify)
- CSRF Token验证
- HTTPS强制
- JWT Token加密存储
- 敏感操作二次确认

## 10. 开发规范

### 10.1 代码规范
- TypeScript严格模式
- ESLint + Prettier
- 组件命名: PascalCase
- 文件命名: kebab-case
- 函数命名: camelCase

### 10.2 组件结构
```
components/
├── Button/
│   ├── index.tsx
│   ├── Button.test.tsx
│   └── types.ts
```

### 10.3 Git提交规范
```
feat: 新功能
fix: 修复bug
docs: 文档更新
refactor: 重构
test: 测试
chore: 构建/工具更新
```

## 11. 测试

- 单元测试: Vitest + React Testing Library
- 测试覆盖率: > 80%
- E2E测试: Playwright (核心流程)

## 12. 部署

- 平台: Vercel / Netlify
- 环境变量: `VITE_API_BASE_URL`
- 自动部署: Git Push触发
- CDN加速

## 13. 迭代计划

### Phase 1: MVP (4周)
- 用户认证
- 语音录制
- 想法列表
- 基础CRUD

### Phase 2: 功能完善 (3周)
- 搜索筛选
- 时间分类优化
- 标签系统

### Phase 3: 体验优化 (2周)
- 深色模式
- 性能优化
- 动效优化

---

**文档版本**: v1.0
**创建日期**: 2026-02-10
**状态**: Draft
