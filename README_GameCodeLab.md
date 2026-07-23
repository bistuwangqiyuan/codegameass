# 信息科大编程实验室

<div align="center">

**信工实习 · AI编程 · 北京信息科技大学 Web 编程学习平台**

[北京信息科技大学官网](https://www.bistu.edu.cn/) • [学校 VI 系统](https://vi.bistu.edu.cn/)

</div>

---

## 项目概述

信息科大编程实验室是面向北京信息科技大学大学生的**信工实习 · AI编程** Web 学习平台，通过任务闯关、AI 实时反馈、积分与成就机制，系统掌握 HTML5、CSS、JavaScript 等技能。

### 公开测试账号

| 角色 | 邮箱 | 密码 |
|------|------|------|
| 学生 | demo.student@bistu.edu.cn | BistuDemo2026 |
| 教师 | demo.teacher@bistu.edu.cn | BistuDemo2026 |
| 管理员 | demo.admin@bistu.edu.cn | BistuDemo2026 |

---

## 🚀 快速开始

### 前置要求

- Node.js 18+ 
- npm 或 pnpm
- Supabase 账号
- DeepSeek API Key（或其他 AI API）

### 安装步骤

1. **克隆项目**

```bash
git clone https://github.com/yourusername/gamecode-lab.git
cd gamecode-lab
```

2. **安装依赖**

```bash
npm install
# 或
pnpm install
```

3. **配置环境变量**

创建 `.env` 文件并填入以下配置：

```env
# Supabase 配置
PUBLIC_SUPABASE_URL=your_supabase_url
PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# AI API 配置（至少配置一个）
DEEPSEEK_API_KEY=your_deepseek_api_key
GLM_API_KEY=your_glm_api_key
MOONSHOT_API_KEY=your_moonshot_api_key
```

4. **初始化数据库**

在 Supabase 控制台运行数据库迁移文件：
- 导航到 SQL Editor
- 运行 `supabase/migrations/20250415000000_gamecode_lab_schema.sql`

5. **启动开发服务器**

```bash
npm run dev
```

访问 `http://localhost:4321` 查看应用。

---

## ✨ 核心功能

### 🎓 学习模块

#### 1. 课程体系
- **Level 1: HTML5 基础** - 标签结构、语义化 HTML
- **Level 2: CSS 样式** - 布局、动画、响应式设计
- **Level 3: JavaScript 基础** - 变量、函数、事件
- **Level 4: DOM 操作** - 动态交互、事件处理
- **Level 5: 综合实战** - 完整项目开发

#### 2. 编程挑战
- 代码补全挑战
- Bug 修复任务
- 从零构建项目
- 知识问答
- Boss 挑战（限时高难度）

#### 3. AI 助教功能
- 实时代码讲解
- 错误诊断和修复建议
- 个性化学习路径
- 智能提示系统
- 对话式编程指导

### 🎮 游戏化系统

#### 等级与经验
- 完成任务获得 XP（经验值）
- 等级提升解锁新内容
- 10 个等级从新手到专家

#### 金币系统
- 完成挑战获得金币
- 金币可用于购买提示
- 解锁高级功能

#### 成就徽章
- 40+ 种成就可解锁
- 普通、稀有、史诗、传说四种稀有度
- 展示个人成就墙

#### 排行榜
- 周榜、月榜、总榜
- 按 XP、挑战数、作品数排名
- 激励良性竞争

### 👥 社区功能

- 作品展示墙
- 点赞和评论系统
- AI 作品评分
- 每日精选推荐
- 标签分类浏览

---

## 🏗️ 技术架构

### 前端技术栈

```
astro           - 现代 Web 框架，支持 SSR 和组件化
React           - UI 组件库
TypeScript      - 类型安全
Tailwind CSS    - 原子化 CSS 框架
Zustand         - 轻量状态管理
CodeMirror      - 代码编辑器
Framer Motion   - 动画库
```

### 后端技术栈

```
Supabase        - 数据库、认证、存储
  ├─ PostgreSQL - 关系型数据库
  ├─ Auth       - 用户认证系统
  ├─ Storage    - 文件存储
  └─ Edge Functions - 服务端逻辑
```

### AI 服务

```
DeepSeek API    - 主要 AI 引擎
备用 AI APIs    - 多个备用方案确保可用性
  ├─ GLM
  ├─ Moonshot
  ├─ Tongyi
  └─ 其他...
```

### 部署平台

```
Netlify         - 自动化部署和 CDN
```

---

## 📁 项目结构

```
gamecode-lab/
├── src/
│   ├── components/
│   │   ├── react/              # React 组件
│   │   │   ├── AuthModal.tsx   # 认证模态框
│   │   │   ├── CodeEditor.tsx  # 代码编辑器
│   │   │   ├── AIAssistant.tsx # AI 助教
│   │   │   ├── UserProfile.tsx # 用户资料
│   │   │   ├── CourseCard.tsx  # 课程卡片
│   │   │   └── ...
│   │   └── *.astro             # Astro 组件
│   ├── pages/
│   │   ├── index.astro         # 首页
│   │   ├── learn.astro         # 学习中心
│   │   ├── community.astro     # 作品社区
│   │   ├── challenge/
│   │   │   └── [id].astro      # 挑战页面
│   │   └── api/                # API 路由
│   │       ├── ai/
│   │       │   ├── chat.ts     # AI 对话
│   │       │   └── evaluate.ts # 代码评估
│   │       └── seed-data.ts    # 数据初始化
│   ├── lib/
│   │   ├── supabase.ts         # Supabase 客户端
│   │   ├── auth.ts             # 认证工具
│   │   ├── ai/
│   │   │   └── deepseek.ts     # AI 服务
│   │   ├── store/              # 状态管理
│   │   │   ├── userStore.ts
│   │   │   └── editorStore.ts
│   │   └── utils/              # 工具函数
│   │       ├── gamification.ts
│   │       └── seed-data.ts
│   └── styles/
│       └── globals.css
├── supabase/
│   ├── migrations/             # 数据库迁移
│   │   └── 20250415000000_gamecode_lab_schema.sql
│   └── types.ts                # 数据库类型定义
├── public/                     # 静态资源
├── package.json
├── astro.config.ts
├── tsconfig.json
├── tailwind.config.js
└── netlify.toml
```

---

## 🗄️ 数据库设计

### 核心表结构

```sql
user_profiles              -- 用户资料
user_settings              -- 用户设置
course_modules             -- 课程模块
lessons                    -- 课程关卡
challenges                 -- 编程挑战
user_lesson_progress       -- 用户课程进度
user_challenge_progress    -- 用户挑战进度
achievements               -- 成就系统
user_achievements          -- 用户成就
user_projects              -- 用户作品
project_likes              -- 作品点赞
project_comments           -- 作品评论
leaderboards               -- 排行榜
xp_transactions            -- 经验值交易
coin_transactions          -- 金币交易
ai_conversations           -- AI 对话历史
ai_code_evaluations        -- AI 代码评估
```

详细设计请参考 `supabase/migrations/20250415000000_gamecode_lab_schema.sql`

---

## 🔐 安全性

- **Row Level Security (RLS)** - Supabase RLS 策略保护数据
- **JWT 认证** - 安全的用户认证机制
- **代码沙盒** - iframe 沙盒隔离用户代码执行
- **API 限流** - 防止 AI API 滥用
- **输入验证** - 所有用户输入都经过验证

---

## 📊 性能优化

- **SSR/SSG** - Astro 静态站点生成
- **代码分割** - 按需加载组件
- **图片优化** - 自动压缩和懒加载
- **CDN 分发** - Netlify 全球 CDN
- **缓存策略** - 合理的缓存设置

---

## 🎨 设计理念

### UI/UX 原则

1. **简洁现代** - 清爽的界面设计
2. **游戏化元素** - 丰富的视觉反馈
3. **响应式设计** - 完美适配移动端
4. **无障碍性** - WCAG 2.1 AA 标准

### 颜色方案

- **主色调**: Blue (#3B82F6) + Purple (#9333EA)
- **辅助色**: Green, Yellow, Orange, Red
- **中性色**: Gray 系列

---

## 🧪 测试

```bash
# 运行测试
npm test

# 类型检查
npm run type-check

# 代码检查
npm run lint
```

---

## 📦 部署

### Netlify 部署

1. 连接 GitHub 仓库
2. 配置构建命令：`npm run build`
3. 配置发布目录：`dist`
4. 添加环境变量
5. 部署！

### 手动部署

```bash
# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

---

## 🛣️ 路线图

### V1.0 ✅ (当前版本)
- [x] 基础课程体系
- [x] AI 助教功能
- [x] 游戏化机制
- [x] 作品社区
- [x] 游客试用系统

### V1.1 (计划中)
- [ ] Python 编程课程
- [ ] 多人协作编程
- [ ] 实时对战模式
- [ ] 移动端 APP

### V2.0 (未来)
- [ ] AI 自动生成课程
- [ ] VR/AR 编程体验
- [ ] 企业培训版本
- [ ] 全球化多语言支持

---

## 🤝 贡献指南

欢迎贡献！请遵循以下步骤：

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

---

## 📄 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

---

## 👥 团队

- **项目负责人**: Your Name
- **AI 集成**: AI Team
- **UI/UX 设计**: Design Team
- **后端开发**: Backend Team

---

## 📞 联系方式

- **在线地址**: https://codegameass.netlify.app
- **邮箱**: mingxinai@agentmail.to
- **邮箱**: 13426086861@139.com

---

## 🙏 致谢

感谢以下开源项目：

- [Astro](https://astro.build)
- [Supabase](https://supabase.com)
- [DeepSeek](https://deepseek.com)
- [React](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [CodeMirror](https://codemirror.net)

---

<div align="center">

**用 ❤️ 和 ☕ 打造**

[⬆ 回到顶部](#gamecode-lab---游戏化的-html5-编程教育平台)

</div>

