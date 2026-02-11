# Landing Page PRD - Temporary Plan Generator
## FoodMart Template Customization Guide

## 1. Product Overview

### 1.1 Project Description
- **Template Source**: FoodMart-1.0.0 HTML Template
- **Goal**: Modify the template copy and content for presenting the "Temporary Plan Generator · Voice Idea Recording Tool"
- **Tech Stack**: HTML/CSS/JavaScript (existing template)
- **Scope of Work**: Copy changes, image replacement, and minor style tweaks only — no structural changes

### 1.2 Product Positioning
**Temporary Plan Generator** - Voice Idea Recording Tool
- Helps users quickly capture temporary ideas and plans
- Voice input with AI-powered organization
- Automatic time-based categorization

## 2. Page Structure Mapping

### 2.1 Original Template → New Product Mapping

| FoodMart Original Section | Updated to New Product Content |
|--------------------------|-------------------------------|
| Navigation (Food Categories) | Product feature navigation (Features, Use Cases, Download) |
| Hero Banner (food display) | Core product value showcase |
| Category Icons (food categories) | Core feature icons (Voice Input, AI Organization, Time Categorization) |
| Product Grid (product list) | Use case cards |
| Testimonials (customer reviews) | User reviews |
| Blog/News Section | FAQ or usage tips |
| Footer | Download links, social media, contact info |

## 3. Copy Modification Checklist

### 3.1 Navigation

**Original copy**:
```
Home | Shop | Pages | Blog | Contact
```

**New copy**:
```
Home | Features | Use Cases | Download | Help Center
```

### 3.2 Hero Section

**Main Headline (H1)**:
```
Say it. Never forget it.
```

**Subtitle**:
```
Record ideas by voice, let AI organize them, and never lose a thought again.
```

**Primary CTA Button**:
```
Get Started Now
```

**Secondary Button**:
```
Watch Demo Video
```

### 3.3 Core Features Section

Replace the original food category icon area with 3 core feature cards:

#### Feature Card 1: Quick Voice Input
- **Icon**: Microphone icon (replaces vegetable icon)
- **Title**: "Record anywhere, anytime"
- **Description**: "No typing needed — voice-to-text captures your idea in 1 second"
- **Tags**: Bilingual support · 95%+ accuracy

#### Feature Card 2: AI-Powered Organization
- **Icon**: AI/brain icon (replaces bread icon)
- **Title**: "Let AI do the thinking"
- **Description**: "Automatically extracts key info, identifies time references, and categorizes intelligently"
- **Tags**: Auto time extraction · Smart categorization

#### Feature Card 3: Time-Based Categorization
- **Icon**: Calendar/clock icon (replaces meat icon)
- **Title**: "Organized by time, at a glance"
- **Description**: "Today's tasks, this week's plans, future ideas — auto-categorized and clear"
- **Tags**: Today · This Week · Future

### 3.4 Use Cases Section (replaces Product Grid)

Replace the original product grid with use case cards:

#### Use Case 1: On Your Commute
- **Icon**: 🚇
- **Title**: "Never miss a commute idea"
- **Description**: "Hands-free voice capture while walking — no need to stop and type"

#### Use Case 2: In a Meeting
- **Icon**: 💬
- **Title**: "Capture meeting ideas instantly"
- **Description**: "One tap to record great ideas during discussions — never forget them after"

#### Use Case 3: Before Bed
- **Icon**: 💡
- **Title**: "Save bedtime thoughts effortlessly"
- **Description**: "Remember tomorrow's tasks while lying down — no need to get up and write"

#### Use Case 4: Capturing Inspiration
- **Icon**: ✨
- **Title**: "AI organizes scattered thoughts"
- **Description**: "Capture ideas on the go, let AI categorize them, and review with ease"

### 3.5 Testimonials

**Keep the testimonial section structure**, update the content:

#### Review 1:
```
"I used to forget things I thought of while walking. Now I just say it out loud, and it's all clear when I review later that evening."
— Zhang, Product Manager
```

#### Review 2:
```
"Great ideas always came up during meetings, but I'd forget the details afterwards. This tool lets me record on the spot — so convenient."
— Li, Entrepreneur
```

#### Review 3:
```
"I'd think of things to do the next day while lying in bed. Now I don't have to get up — just record by voice. Super easy."
— Wang, Freelancer
```

### 3.6 FAQ Section (replaces Blog Section)

**Heading**: "Frequently Asked Questions"

**Q1**: Is the voice recognition accurate?
**A1**: We use leading AI speech recognition technology with over 95% accuracy, supporting bilingual (Chinese/English) input.

**Q2**: Will it automatically remind me to execute my plans?
**A2**: The product currently focuses on idea capture and basic organization. Complex reminder features are not available yet.

**Q3**: Is my data secure?
**A3**: All data is encrypted and only visible to you. We never access or share your data.

### 3.7 Footer

**Brand Info**:
```
Temporary Plan Generator
Never lose a thought again.
```

**Quick Links**:
```
Features
Use Cases
Download App
Help Center
Privacy Policy
```

**Download Buttons**:
```
Download on App Store
Get it on Google Play
```

**Social Media**:
```
WeChat Official Account
Xiaohongshu
Twitter
```

## 4. Image Replacement Checklist

### 4.1 Key Images

| Original Image Use | New Image Requirement | Size Reference |
|-------------------|-----------------------|----------------|
| Banner background | Clean, modern background (blue/green gradient) | 1920x800px |
| Logo | Product logo | 200x60px |
| Product thumbnails | Phone UI screenshots (App mockup) | 400x600px |
| Icons | Microphone, AI, calendar icons | 100x100px |
| Use case images | Commute, meeting, bedtime scenario illustrations | 600x400px |

### 4.2 Image File Mapping

```
images/logo.png → Replace with product logo
images/banner-image-1.jpg → Hero product showcase image
images/product-thumb-*.png → Phone UI screenshots
images/icon-vegetables-broccoli.png → Microphone icon
images/icon-bread-baguette.png → AI icon
images/icon-wine-glass-bottle.png → Calendar icon
```

## 5. Style Adjustments

### 5.1 Color Scheme

**Primary Colors**:
```css
--primary-color: #4A90E2; /* Comfortable blue */
--secondary-color: #50E3C2; /* Accent green */
--accent-color: #F5A623; /* Highlight orange - CTA buttons */
```

**Background Colors**:
```css
--bg-light: #F8F9FA;
--bg-white: #FFFFFF;
```

### 5.2 Font Adjustments

**Chinese Font**:
```css
font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
```

**English Font** (keep original):
```css
font-family: 'Nunito', 'Open Sans', sans-serif;
```

### 5.3 Button Styles

**Primary CTA Button**:
```css
background: linear-gradient(135deg, #F5A623, #FF8C00);
border-radius: 30px;
padding: 15px 40px;
font-size: 18px;
font-weight: bold;
```

## 6. Implementation Priority

### 6.1 High Priority (P0)
- [x] Navigation copy update
- [x] Hero headline and subtitle
- [x] CTA button copy
- [x] Core feature card copy
- [x] Logo replacement

### 6.2 Medium Priority (P1)
- [x] Use case card content
- [x] Testimonial content
- [x] FAQ copy
- [x] Footer information

### 6.3 Low Priority (P2)
- [ ] Full image replacement
- [ ] Style fine-tuning
- [ ] Animations
- [ ] Multi-language support

## 7. Implementation Steps

### Step 1: Copy Replacement
1. Update all text content in `index.html`
2. Replace copy item by item following the checklist above
3. Keep the HTML structure unchanged

### Step 2: Logo and Icon Replacement
1. Prepare new logo and feature icons
2. Replace corresponding files in the `images/` directory
3. Keep filenames consistent to avoid updating HTML references

### Step 3: Style Adjustments
1. Update color variables in `style.css`
2. Adjust button styles
3. Optimize font rendering

### Step 4: Testing
1. Test in desktop browsers
2. Test responsive layout on mobile
3. Verify all links and buttons

## 8. Considerations

### 8.1 Preserve Original Strengths
- ✅ Maintain the template's responsive layout
- ✅ Keep animations and interactive effects
- ✅ Maintain good performance

### 8.2 Avoid Over-Modification
- ❌ Do not change the page structure
- ❌ Do not rewrite JavaScript logic
- ❌ Do not add complex new features

### 8.3 Optimization Recommendations
- Remove e-commerce-related features from the original template (shopping cart, payment, etc.)
- Remove unnecessary product listing pages
- Keep a single-page layout and optimize load speed

## 9. Acceptance Criteria

### 9.1 Content Completeness
- [x] All copy updated to product-related content
- [x] No remaining FoodMart-related text
- [x] Logo and major images updated

### 9.2 Functionality
- [ ] Navigation links are clickable (can temporarily point to anchors)
- [ ] CTA buttons are clickable (can temporarily use placeholder links)
- [ ] Responsive layout works correctly
- [ ] Mobile display is correct

### 9.3 Visual Quality
- [ ] Brand colors applied
- [ ] Fonts display clearly
- [ ] Images load correctly
- [ ] Overall style is consistent

## 10. Future Improvements

- Add real product screenshots and demo video
- Integrate email capture form
- Add Google Analytics tracking
- SEO optimization (meta tags, sitemap)
- Performance optimization (image compression, code minification)

---

**Document Version**: v1.0
**Created**: 2026-02-10
**Owner**: [TBD]
**Status**: Draft
