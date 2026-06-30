// 初始化示例数据 — 信息科大主题
import { supabase } from '../supabase';

export async function seedSampleData() {
  try {
    const { data: modules } = await supabase
      .from('course_modules')
      .select('*')
      .order('order_index');

    if (!modules || modules.length === 0) {
      console.log('No modules found, skipping lesson seed');
      return;
    }

    await supabase.from('course_modules').update({ is_published: true }).neq('id', '00000000-0000-0000-0000-000000000000');

    const htmlModule = modules.find((m: { slug: string }) => m.slug === 'html5-basics');
    if (htmlModule) {
      const sampleLessons = [
        {
          module_id: htmlModule.id,
          title: '认识 HTML — 信息科大新生页',
          slug: 'intro-to-html',
          description: '学习 HTML 基本概念，搭建信息科大新生欢迎页结构',
          order_index: 1,
          content_markdown: `# 认识 HTML — 信息科大新生欢迎页

HTML 是创建网页的标准标记语言。我们将为**北京信息科技大学**新生设计欢迎页面。

## 基本结构

\`\`\`html
<!DOCTYPE html>
<html>
  <head>
    <title>欢迎加入信息科大</title>
  </head>
  <body>
    <h1>欢迎来到北京信息科技大学</h1>
    <p>勤以为学，信以立身</p>
  </body>
</html>
\`\`\``,
          learning_objectives: JSON.stringify([
            '理解 HTML 的基本概念',
            '掌握 HTML 文档结构',
            '创建信息科大主题欢迎页',
          ]),
          xp_reward: 10,
          coin_reward: 5,
          is_published: true,
        },
        {
          module_id: htmlModule.id,
          title: '文本标签 — 校园介绍',
          slug: 'text-tags',
          description: '使用文本标签编写信息科大校区与学院介绍',
          order_index: 2,
          content_markdown: `# HTML 文本标签

为信息科大五校区（小营、健翔桥、清河、金台路、新校区）编写介绍内容。

\`\`\`html
<h1>北京信息科技大学</h1>
<h2>小营校区</h2>
<p>主校区，信息学科优势突出。</p>
\`\`\``,
          learning_objectives: JSON.stringify([
            '掌握标题与段落标签',
            '编写校园介绍内容',
          ]),
          xp_reward: 15,
          coin_reward: 8,
          is_published: true,
        },
      ];

      for (const lesson of sampleLessons) {
        await supabase.from('lessons').upsert(lesson, { onConflict: 'module_id,slug' });
      }

      const { data: htmlLesson } = await supabase
        .from('lessons')
        .select('*')
        .eq('slug', 'intro-to-html')
        .single();

      if (htmlLesson) {
        const sampleChallenge = {
          lesson_id: htmlLesson.id,
          title: '创建信息科大新生欢迎页',
          description: '为北京信息科技大学2026级新生创建一个简单的 HTML 欢迎页面',
          instructions: `创建一个包含以下内容的 HTML 页面：

1. 使用正确的 HTML5 文档结构
2. 添加标题 "欢迎来到北京信息科技大学"
3. 写一段介绍信息科大的段落（可提及信息特色、五育并举）
4. 添加列表，列出 3 个你想参加的信息科大社团

提示：使用 <h1>, <p>, <ul>, <li> 等标签`,
          challenge_type: 'build_from_scratch',
          difficulty: 'easy',
          starter_html: `<!DOCTYPE html>
<html>
  <head>
    <title>欢迎加入信息科大</title>
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
    <title>欢迎加入信息科大</title>
  </head>
  <body>
    <h1>欢迎来到北京信息科技大学</h1>
    <p>我是信息科大2026级新生，正在学习 Web 编程。</p>
    <h2>我想参加的社团</h2>
    <ul>
      <li>计算机协会</li>
      <li>机器人协会</li>
      <li>摄影协会</li>
    </ul>
  </body>
</html>`,
          hints: JSON.stringify([
            '在 body 内添加信息科大相关内容',
            '使用 h1 创建主标题',
            '使用 ul 和 li 创建社团列表',
          ]),
          xp_reward: 20,
          coin_reward: 10,
          order_index: 1,
          is_published: true,
        };

        await supabase.from('challenges').upsert(sampleChallenge);
      }
    }

    console.log('BISTU sample data seeded successfully');
  } catch (error) {
    console.error('Error seeding sample data:', error);
  }
}
