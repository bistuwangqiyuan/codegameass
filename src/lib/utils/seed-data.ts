// 初始化示例数据
import { supabase } from '../supabase';

/**
 * 创建示例课程和挑战
 */
export async function seedSampleData() {
  try {
    // 1. 获取已存在的课程模块
    const { data: modules } = await supabase
      .from('course_modules')
      .select('*')
      .order('order_index');

    if (!modules || modules.length === 0) {
      console.log('No modules found, skipping lesson seed');
      return;
    }

    // 2. 为 HTML5 基础模块创建示例课程
    const htmlModule = modules.find((m: any) => m.slug === 'html5-basics');
    if (htmlModule) {
      const sampleLessons = [
        {
          module_id: htmlModule.id,
          title: '认识 HTML',
          slug: 'intro-to-html',
          description: '学习 HTML 的基本概念和文档结构',
          order_index: 1,
          content_markdown: `# 认识 HTML

HTML (HyperText Markup Language) 是用于创建网页的标准标记语言。

## 什么是 HTML？

- HTML 使用"标签"来描述网页内容
- 浏览器读取 HTML 文件并将其渲染成可视化网页
- HTML 文档由元素组成，元素由标签包围

## 基本结构

\`\`\`html
<!DOCTYPE html>
<html>
  <head>
    <title>网页标题</title>
  </head>
  <body>
    <h1>欢迎来到 HTML 世界！</h1>
    <p>这是你的第一个网页。</p>
  </body>
</html>
\`\`\``,
          learning_objectives: JSON.stringify([
            '理解 HTML 的基本概念',
            '掌握 HTML 文档结构',
            '学会使用基本的 HTML 标签'
          ]),
          xp_reward: 10,
          coin_reward: 5,
          is_published: true
        },
        {
          module_id: htmlModule.id,
          title: '文本标签',
          slug: 'text-tags',
          description: '学习常用的文本相关 HTML 标签',
          order_index: 2,
          content_markdown: `# HTML 文本标签

学习如何使用 HTML 标签来格式化文本内容。

## 标题标签

HTML 提供了 6 级标题，从 h1 到 h6：

\`\`\`html
<h1>一级标题</h1>
<h2>二级标题</h2>
<h3>三级标题</h3>
\`\`\`

## 段落和换行

\`\`\`html
<p>这是一个段落。</p>
<br> <!-- 换行标签 -->
\`\`\`

## 文本格式化

\`\`\`html
<strong>加粗文本</strong>
<em>斜体文本</em>
<mark>高亮文本</mark>
\`\`\``,
          learning_objectives: JSON.stringify([
            '掌握标题标签的使用',
            '学会创建段落和换行',
            '了解文本格式化标签'
          ]),
          xp_reward: 15,
          coin_reward: 8,
          is_published: true
        }
      ];

      for (const lesson of sampleLessons) {
        const { error } = await supabase
          .from('lessons')
          .upsert(lesson, { onConflict: 'module_id,slug' });
        
        if (error) {
          console.error('Error creating lesson:', error);
        }
      }

      // 3. 创建示例挑战
      const { data: htmlLesson } = await supabase
        .from('lessons')
        .select('*')
        .eq('slug', 'intro-to-html')
        .single();

      if (htmlLesson) {
        const sampleChallenge = {
          lesson_id: htmlLesson.id,
          title: '创建你的第一个网页',
          description: '使用 HTML 基本结构创建一个简单的个人介绍页面',
          instructions: `创建一个包含以下内容的 HTML 页面：

1. 使用正确的 HTML5 文档结构
2. 添加一个标题 "关于我"
3. 写一个段落介绍你自己
4. 添加一个列表，列出你的 3 个爱好

提示：使用 <h1>, <p>, <ul>, <li> 等标签`,
          challenge_type: 'build_from_scratch',
          difficulty: 'easy',
          starter_html: `<!DOCTYPE html>
<html>
  <head>
    <title>关于我</title>
  </head>
  <body>
    <!-- 在这里编写你的代码 -->
    
  </body>
</html>`,
          starter_css: '',
          starter_js: '',
          solution_html: `<!DOCTYPE html>
<html>
  <head>
    <title>关于我</title>
  </head>
  <body>
    <h1>关于我</h1>
    <p>我是一名编程爱好者，正在学习 HTML5。</p>
    <h2>我的爱好</h2>
    <ul>
      <li>编程</li>
      <li>阅读</li>
      <li>运动</li>
    </ul>
  </body>
</html>`,
          hints: JSON.stringify([
            '记得在 body 标签内添加内容',
            '使用 h1 标签创建主标题',
            '使用 ul 和 li 标签创建无序列表'
          ]),
          xp_reward: 20,
          coin_reward: 10,
          order_index: 1,
          is_published: true
        };

        const { error } = await supabase
          .from('challenges')
          .upsert(sampleChallenge);

        if (error) {
          console.error('Error creating challenge:', error);
        }
      }
    }

    console.log('Sample data seeded successfully');
  } catch (error) {
    console.error('Error seeding sample data:', error);
  }
}

