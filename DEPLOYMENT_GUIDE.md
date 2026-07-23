# GameCode Lab 部署指南

本文档详细说明如何将 GameCode Lab 部署到生产环境。

## 📋 部署前准备

### 1. 环境变量配置

确保以下环境变量已正确配置：

#### Supabase 配置（必需）

```env
PUBLIC_SUPABASE_URL=https://your-project.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

#### AI API 配置（至少配置一个）

```env
DEEPSEEK_API_KEY=your_deepseek_key
GLM_API_KEY=your_glm_key
MOONSHOT_API_KEY=your_moonshot_key
```

### 2. Supabase 数据库设置

#### 步骤 1: 创建 Supabase 项目

1. 访问 [Supabase Dashboard](https://app.supabase.com)
2. 点击 "New Project"
3. 填写项目信息并创建

#### 步骤 2: 运行数据库迁移

1. 在 Supabase Dashboard 中，进入 "SQL Editor"
2. 创建新查询
3. 复制 `supabase/migrations/20250415000000_gamecode_lab_schema.sql` 的内容
4. 粘贴并运行

#### 步骤 3: 配置认证

1. 进入 "Authentication" > "Providers"
2. 启用 Email 认证
3. （可选）配置 OAuth 提供商（Google, GitHub 等）

#### 步骤 4: 配置存储

1. 进入 "Storage"
2. 创建 bucket: `project-thumbnails`
3. 设置为 public access

### 3. 获取 API 密钥

#### DeepSeek API
1. 访问 [DeepSeek Platform](https://platform.deepseek.com)
2. 注册/登录账号
3. 创建 API Key

#### 备用 API（可选）
- **GLM**: https://open.bigmodel.cn
- **Moonshot**: https://platform.moonshot.cn
- **通义千问**: https://dashscope.aliyun.com

---

## 🚀 部署到 Netlify

### 方法 1: 通过 Netlify UI（推荐）

#### 步骤 1: 连接仓库

1. 登录 [Netlify](https://app.netlify.com)
2. 点击 "Add new site" > "Import an existing project"
3. 选择 GitHub/GitLab/Bitbucket
4. 授权并选择 `gamecode-lab` 仓库

#### 步骤 2: 配置构建设置

```
Build command: npm run build
Publish directory: dist
Node version: 18
```

#### 步骤 3: 添加环境变量

在 "Site settings" > "Environment variables" 中添加：

```
PUBLIC_SUPABASE_URL
PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
DEEPSEEK_API_KEY
GLM_API_KEY
MOONSHOT_API_KEY
```

#### 步骤 4: 部署

点击 "Deploy site" 开始部署

### 方法 2: 通过 Netlify CLI

```bash
# 安装 Netlify CLI
npm install -g netlify-cli

# 登录
netlify login

# 初始化站点
netlify init

# 部署
netlify deploy --prod
```

---

## 🐳 Docker 部署（可选）

### Dockerfile

```dockerfile
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app

COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY package.json ./

EXPOSE 4321

CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0"]
```

### 构建和运行

```bash
# 构建镜像
docker build -t gamecode-lab .

# 运行容器
docker run -p 4321:4321 \
  -e PUBLIC_SUPABASE_URL=$PUBLIC_SUPABASE_URL \
  -e PUBLIC_SUPABASE_ANON_KEY=$PUBLIC_SUPABASE_ANON_KEY \
  -e DEEPSEEK_API_KEY=$DEEPSEEK_API_KEY \
  gamecode-lab
```

---

## 🔧 部署后配置

### 1. 初始化示例数据

访问以下端点来创建示例课程和挑战：

```
POST https://your-domain.com/api/seed-data
```

或在浏览器控制台运行：

```javascript
fetch('/api/seed-data', { method: 'POST' })
  .then(res => res.json())
  .then(data => console.log(data));
```

### 2. 配置自定义域名

在 Netlify Dashboard:
1. "Domain settings" > "Add custom domain"
2. 输入你的域名
3. 按照 DNS 配置说明操作

### 3. 启用 HTTPS

Netlify 自动为所有站点提供免费 SSL 证书（Let's Encrypt）。

### 4. 配置缓存

在 `netlify.toml` 中已配置缓存策略：

```toml
[[headers]]
  for = "/*"
  [headers.values]
    Cache-Control = "public, max-age=3600"

[[headers]]
  for = "/_astro/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

---

## 📊 监控和日志

### Netlify 监控

1. "Site overview" 查看实时流量
2. "Functions" 查看 API 调用
3. "Deploys" 查看部署历史和日志

### Supabase 监控

1. "Database" > "Query Performance"
2. "API" > "Logs"
3. "Auth" > "Users" 查看用户活动

### 设置告警

在 Netlify:
1. "Site settings" > "Build & deploy" > "Deploy notifications"
2. 配置 Email/Slack/Webhook 通知

---

## 🔐 安全检查清单

- [ ] 所有环境变量已正确配置
- [ ] Supabase RLS 策略已启用
- [ ] API 密钥未暴露在客户端代码中
- [ ] HTTPS 已启用
- [ ] CORS 正确配置
- [ ] 备份策略已设置

---

## 🐛 常见问题

### 问题 1: 构建失败

**解决方案:**
```bash
# 清理缓存
rm -rf node_modules .astro
npm install
npm run build
```

### 问题 2: 环境变量不生效

**解决方案:**
- 确保环境变量名以 `PUBLIC_` 开头（客户端变量）
- 重新部署站点
- 检查 Netlify 环境变量配置

### 问题 3: Supabase 连接失败

**解决方案:**
- 检查 URL 和 API Key 是否正确
- 确认 Supabase 项目状态正常
- 检查网络连接

### 问题 4: AI API 调用失败

**解决方案:**
- 检查 API Key 是否有效
- 确认 API 配额未超限
- 使用备用 AI API

---

## 📈 性能优化

### 1. 图片优化

使用 Astro 内置图片优化：

```astro
---
import { Image } from 'astro:assets';
---

<Image src="/path/to/image.jpg" alt="Description" width={800} height={600} />
```

### 2. 代码分割

Astro 自动进行代码分割，但可以进一步优化：

```typescript
// 动态导入
const Component = lazy(() => import('./Component'));
```

### 3. 预渲染页面

在 `astro.config.ts` 中配置：

```typescript
export default defineConfig({
  output: 'hybrid', // 混合模式
  // 或
  output: 'static'  // 完全静态
});
```

---

## 🔄 更新和维护

### 更新流程

1. **开发阶段**
   ```bash
   git checkout -b feature/new-feature
   # 开发新功能
   git commit -am "Add new feature"
   git push origin feature/new-feature
   ```

2. **测试阶段**
   - 在 Netlify 自动创建的 Deploy Preview 中测试
   - 确认功能正常

3. **部署阶段**
   ```bash
   git checkout main
   git merge feature/new-feature
   git push origin main
   ```
   - Netlify 自动部署到生产环境

### 数据库迁移

创建新迁移：

```sql
-- supabase/migrations/新的时间戳_描述.sql
-- 在这里编写 SQL
```

在 Supabase Dashboard SQL Editor 中运行。

### 回滚

如果部署出现问题：

1. 在 Netlify "Deploys" 中找到上一个稳定版本
2. 点击 "Publish deploy" 回滚

---

## 📞 技术支持

如遇到问题：

1. 查看 [GitHub Issues](https://github.com/bistuwangqiyuan/codegameass/issues)
2. 发送邮件到 mingxinai@agentmail.to
3. 发送邮件到 13426086861@139.com

---

## ✅ 部署检查清单

部署前确认：

- [ ] 环境变量已配置
- [ ] 数据库迁移已运行
- [ ] 示例数据已加载
- [ ] 所有测试通过
- [ ] 构建成功
- [ ] 性能优化完成
- [ ] 安全检查完成
- [ ] 监控已设置
- [ ] 备份策略已配置
- [ ] 文档已更新

---

**祝部署顺利！🎉**

