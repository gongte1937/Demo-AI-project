# 临时计划生成器 - Landing Page

## 概述

这是基于 PRD 文档创建的"临时计划生成器"产品 Landing Page，采用纯 HTML/CSS/JavaScript 实现，无需框架依赖。

## 目录结构

```
landing-page/
├── index.html          # 主页面
├── css/
│   └── style.css       # 样式文件
├── js/
│   └── script.js       # 交互脚本
├── images/             # 图片资源目录(待添加)
└── README.md           # 说明文档
```

## 页面结构

### 1. 导航栏 (Navigation)
- 固定顶部
- 响应式设计
- 移动端汉堡菜单

### 2. 首屏 (Hero Section)
- 主标题: "说出来，就不会忘"
- 副标题和核心卖点
- CTA 按钮
- 手机界面 Mockup

### 3. 痛点场景 (Problem Section)
- 4个场景卡片
- 引发用户共鸣

### 4. 功能介绍 (Features Section)
- 4个核心功能
- 详细说明和标签

### 5. 使用流程 (How It Works)
- 3步使用流程
- 可视化展示

### 6. 使用场景 (Scenarios)
- 4个实际应用场景

### 7. 用户评价 (Testimonials)
- 3条用户评价
- 头像和职业信息

### 8. 常见问题 (FAQ)
- 手风琴式展开
- 4个常见问题

### 9. 最终CTA (Download Section)
- App Store 和 Google Play 下载按钮
- Web 版入口

### 10. 页脚 (Footer)
- 产品信息
- 快速链接
- 社交媒体

## 功能特性

### 交互功能
- ✅ 移动端菜单切换
- ✅ FAQ 手风琴展开/折叠
- ✅ 平滑滚动锚点链接
- ✅ 导航栏滚动效果
- ✅ 元素滚动动画
- ✅ 音波动画效果
- ✅ 页面加载动画

### 响应式设计
- ✅ 桌面端 (1024px+)
- ✅ 平板端 (768px - 1024px)
- ✅ 移动端 (< 768px)

### 性能优化
- ✅ 使用 Google Fonts
- ✅ CSS 变量管理
- ✅ 平滑过渡动画
- ✅ Intersection Observer 优化

## 使用方法

### 本地预览

直接在浏览器中打开 `index.html` 即可预览。

或使用本地服务器:

```bash
# Python 3
python -m http.server 8000

# Node.js (需要安装 http-server)
npx http-server

# VS Code Live Server 插件
右键 index.html -> Open with Live Server
```

然后访问 `http://localhost:8000`

## 自定义修改

### 修改颜色主题

编辑 `css/style.css` 中的 CSS 变量:

```css
:root {
    --primary: #4A90E2;      /* 主色调 */
    --secondary: #50E3C2;    /* 辅助色 */
    --accent: #F5A623;       /* 强调色 */
}
```

### 修改文案

直接编辑 `index.html` 中的文本内容。

### 添加图片

1. 将图片放入 `images/` 目录
2. 在 HTML 中引用: `<img src="images/your-image.png" alt="描述">`

### 修改字体

在 `index.html` 的 `<head>` 部分修改 Google Fonts 链接。

## 待完成事项

- [ ] 替换手机 Mockup 为真实产品截图
- [ ] 添加产品 Logo
- [ ] 添加功能图标 (麦克风、AI、日历等)
- [ ] 添加场景插图
- [ ] 集成真实的下载链接
- [ ] 添加邮件订阅表单
- [ ] 集成 Google Analytics
- [ ] SEO 优化 (meta 标签完善)
- [ ] 添加演示视频

## 浏览器兼容性

- ✅ Chrome 90+
- ✅ Safari 14+
- ✅ Firefox 88+
- ✅ Edge 90+

## 部署建议

### 静态托管平台
- Vercel
- Netlify
- GitHub Pages
- Cloudflare Pages

### 部署步骤 (以 Vercel 为例)

1. 将代码推送到 GitHub
2. 在 Vercel 中导入项目
3. 设置根目录为 `landing-page`
4. 部署完成

## 性能优化建议

1. **图片优化**
   - 使用 WebP 格式
   - 压缩图片大小
   - 使用懒加载

2. **代码优化**
   - 压缩 CSS/JS
   - 启用 Gzip
   - 使用 CDN

3. **SEO 优化**
   - 完善 meta 标签
   - 添加 sitemap.xml
   - 添加 robots.txt
   - 结构化数据标记

## 联系方式

如有问题或建议，请联系开发团队。

---

**版本**: v1.0
**创建日期**: 2026-02-10
**最后更新**: 2026-02-10
