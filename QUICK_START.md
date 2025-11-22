# 🚀 GameCode Lab - 快速启动指南

> 5 分钟快速部署 GameCode Lab

## ⚡ 快速启动步骤

### 步骤 1: 克隆项目（已完成 ✅）

你已经在项目目录中了！

### 步骤 2: 安装依赖（已完成 ✅）

```bash
npm install
```

### 步骤 3: 配置 Supabase

#### 3.1 创建 Supabase 项目

1. 访问 https://app.supabase.com
2. 点击 "New Project"
3. 填写项目名称: `gamecode-lab`
4. 选择地区: 最近的区域
5. 设置数据库密码并记住
6. 点击 "Create new project"

#### 3.2 获取 API 密钥

项目创建完成后：
1. 进入 "Project Settings" > "API"
2. 复制以下信息：
   - **Project URL** (格式: https://xxxxx.supabase.co)
   - **anon/public key**
   - **service_role key**

#### 3.3 运行数据库迁移

1. 在 Supabase Dashboard 中，进入 "SQL Editor"
2. 点击 "New Query"
3. 打开本地文件 `supabase/migrations/20250415000000_gamecode_lab_schema.sql`
4. 复制全部内容到 SQL Editor
5. 点击 "Run" 执行（大约需要 10 秒）
6. 看到 "Success" 表示成功 ✅

### 步骤 4: 配置 AI API

#### 选项 A: DeepSeek（推荐）

1. 访问 https://platform.deepseek.com
2. 注册/登录账号
3. 进入 "API Keys"
4. 点击 "Create API Key"
5. 复制生成的 Key（格式: sk-xxxxx）

#### 选项 B: 其他 AI（备用）

- **GLM**: https://open.bigmodel.cn
- **Moonshot**: https://platform.moonshot.cn

### 步骤 5: 配置环境变量

在项目根目录创建 `.env` 文件：

```env
# Supabase 配置（必需）
PUBLIC_SUPABASE_URL=https://你的项目ID.supabase.co
PUBLIC_SUPABASE_ANON_KEY=你的_anon_key
SUPABASE_SERVICE_ROLE_KEY=你的_service_role_key

# AI API 配置（至少配置一个）
DEEPSEEK_API_KEY=sk-你的_deepseek_key

# 可选的其他 AI API
GLM_API_KEY=你的_glm_key
MOONSHOT_API_KEY=你的_moonshot_key
```

**重要**: 将上面的占位符替换为你实际的 API 密钥！

### 步骤 6: 启动开发服务器

```bash
npm run dev
```

看到以下输出表示成功：

```
  🚀 astro  v5.1.10 started in 245ms

  ┃ Local    http://localhost:4321/
  ┃ Network  use --host to expose
```

### 步骤 7: 访问应用

在浏览器打开: http://localhost:4321

你应该看到 GameCode Lab 的首页！🎉

### 步骤 8: 初始化示例数据（可选）

在浏览器控制台（F12）运行：

```javascript
fetch('/api/seed-data', { method: 'POST' })
  .then(res => res.json())
  .then(data => console.log('✅ 示例数据加载成功:', data));
```

---

## 🧪 测试功能

### 测试 1: 游客试用

1. 点击首页的 **"免费试用 30 天"** 按钮
2. 自动创建游客账号
3. 进入学习中心
4. ✅ 成功！

### 测试 2: 代码编辑器

1. 进入学习中心
2. 点击任意课程
3. 点击 "开始挑战"
4. 在编辑器中输入代码
5. 点击 "运行" 查看效果
6. ✅ 成功！

### 测试 3: AI 助教

1. 点击右下角的 ✨ 按钮
2. 输入问题: "什么是 HTML?"
3. AI 回复
4. ✅ 成功！

---

## 🐛 常见问题快速解决

### 问题 1: 依赖安装失败

```bash
# 清理并重新安装
rm -rf node_modules package-lock.json
npm install
```

### 问题 2: Supabase 连接失败

**检查：**
- [ ] `.env` 文件是否存在
- [ ] 环境变量是否正确填写
- [ ] URL 格式是否正确（https://xxxxx.supabase.co）
- [ ] 数据库迁移是否运行成功

### 问题 3: AI 不响应

**检查：**
- [ ] DEEPSEEK_API_KEY 是否正确
- [ ] API Key 是否有效（未过期）
- [ ] 网络连接是否正常

### 问题 4: 页面空白

```bash
# 清理缓存并重启
rm -rf .astro dist
npm run dev
```

---

## 📱 移动端测试

在同一 WiFi 网络下：

```bash
# 启动时加 --host 参数
npm run dev -- --host
```

然后在手机浏览器访问显示的 Network 地址。

---

## 🚀 部署到生产环境

### 方法 1: Netlify（推荐）

1. 提交代码到 GitHub
2. 访问 https://app.netlify.com
3. 点击 "New site from Git"
4. 选择你的仓库
5. 配置：
   - Build command: `npm run build`
   - Publish directory: `dist`
6. 添加环境变量（和 .env 文件相同）
7. 点击 "Deploy site"
8. 等待 3-5 分钟
9. ✅ 部署完成！

### 方法 2: 手动构建

```bash
# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

构建产物在 `dist/` 目录，可以部署到任何静态托管服务。

---

## 📚 下一步

- 📖 阅读 [USER_GUIDE.md](./USER_GUIDE.md) 了解详细使用方法
- 🚀 阅读 [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) 了解部署细节
- 📊 阅读 [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) 了解项目架构

---

## 💡 有用的命令

```bash
# 开发模式
npm run dev

# 类型检查
npm run check

# 构建生产版本
npm run build

# 预览生产版本
npm run preview

# 查看所有脚本
npm run
```

---

## 🎯 检查清单

部署前确认：

- [ ] Node.js 18+ 已安装
- [ ] npm 依赖已安装
- [ ] Supabase 项目已创建
- [ ] 数据库迁移已运行
- [ ] .env 文件已配置
- [ ] 环境变量值正确
- [ ] 开发服务器能正常启动
- [ ] 首页能正常访问
- [ ] 游客试用功能正常
- [ ] AI 助教能正常响应

全部打勾 ✅ 就可以部署了！

---

## 📞 需要帮助？

- 💬 查看文档: [README.md](./README_GameCodeLab.md)
- 🐛 提交问题: GitHub Issues
- 💡 交流讨论: Discord 社区
- 📧 联系我们: support@gamecodelab.com

---

<div align="center">

## ✨ 准备好了吗？

**让我们开始编程学习之旅！**

[🚀 启动项目](#步骤-6-启动开发服务器) • [📚 阅读文档](./README_GameCodeLab.md) • [🎮 开始学习](http://localhost:4321)

</div>

