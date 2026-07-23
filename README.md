# 信息科大编程实验室（GameCode Lab）

**信工实习 · AI编程** — 北京信息科技大学 Web 编程游戏化学习平台。

**在线访问**: [https://codegameass.netlify.app](https://codegameass.netlify.app)

## 项目简介

面向信息工程学院及相关专业学生的游戏化 Web 编程学习平台，结合实习场景与 AI 智能辅导：

- 🎮 **游戏化闯关**：课程关卡、每日挑战、Boss 战、经验值与金币体系
- 🤖 **AI 编程助教**：DeepSeek 驱动，实时代码讲解与错误诊断
- 💻 **在线代码编辑器**：HTML / CSS / JavaScript 实时预览
- 🏆 **成就与排行榜**：徽章解锁、同学间竞争排名
- 🖼️ **作品社区**：分享作品，点赞评论互动

## 技术栈

| 层次 | 技术 |
| :--- | :--- |
| 前端框架 | Astro 5 (SSR) + React 18 |
| 样式 | Tailwind CSS 4 |
| 数据库 | Neon (Serverless PostgreSQL) |
| 认证 | 自建 JWT（jose + bcryptjs） |
| AI | DeepSeek API |
| 部署 | Netlify |

## 本地开发

```bash
npm install
npm run dev        # 本地开发服务器 http://localhost:4321
npm run build      # 构建（含 astro check 类型检查）
npm run preview    # 预览构建产物
```

### 环境变量

参考 `.env-example`，主要包括：

- `NETLIFY_DATABASE_URL` — Neon 数据库连接串（Netlify Neon 扩展自动注入）
- `AUTH_SECRET` — JWT 签名密钥（≥32 字符随机字符串）
- `DEEPSEEK_API_KEY` — AI 助教所需的 DeepSeek API 密钥

### 数据库初始化

部署后访问 `POST /api/db/init` 即可自动执行迁移、创建演示账号并填充示例数据。

## 测试账号

首页公开展示三个测试账号（学生 / 教师 / 管理员），密码均为 `BistuDemo2026`，无需注册即可体验全部功能。

## 部署

推送到 `main` 分支后由 Netlify 自动构建并部署。

## 联系方式

- 📧 mingxinai@agentmail.to
- 📧 13426086861@139.com

## 许可

详见 [LICENSE](./LICENSE)。本平台仅供教学演示与学习体验使用。
