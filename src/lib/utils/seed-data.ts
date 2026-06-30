// 初始化示例数据 — 信息科大主题（Neon PostgreSQL）
import { getSql } from '../db';

export async function seedSampleData(): Promise<void> {
  const sql = getSql();

  const modules = await sql`
    SELECT * FROM course_modules ORDER BY order_index
  `;

  if (!modules.length) {
    console.log('No modules found, skipping lesson seed');
    return;
  }

  await sql`UPDATE course_modules SET is_published = TRUE`;

  const htmlModule = modules.find((m) => (m as { slug: string }).slug === 'html5-basics') as
    | { id: string }
    | undefined;

  if (!htmlModule) return;

  await sql`
    INSERT INTO lessons (
      module_id, title, slug, description, order_index, content_markdown,
      learning_objectives, xp_reward, coin_reward, is_published
    ) VALUES (
      ${htmlModule.id}::uuid,
      '认识 HTML — 信息科大新生页',
      'intro-to-html',
      '学习 HTML 基本概念，搭建信息科大新生欢迎页结构',
      1,
      ${'# 认识 HTML — 信息科大新生页\n\nHTML 是创建网页的标准标记语言。'},
      ${JSON.stringify(['理解 HTML 的基本概念', '掌握 HTML 文档结构', '创建信息科大主题欢迎页'])}::jsonb,
      10, 5, TRUE
    )
    ON CONFLICT (module_id, slug) DO UPDATE SET
      title = EXCLUDED.title,
      description = EXCLUDED.description,
      is_published = TRUE
  `;

  await sql`
    INSERT INTO lessons (
      module_id, title, slug, description, order_index, content_markdown,
      learning_objectives, xp_reward, coin_reward, is_published
    ) VALUES (
      ${htmlModule.id}::uuid,
      '文本标签 — 校园介绍',
      'text-tags',
      '使用文本标签编写信息科大校区与学院介绍',
      2,
      ${'# HTML 文本标签\n\n为信息科大五校区编写介绍内容。'},
      ${JSON.stringify(['掌握标题与段落标签', '编写校园介绍内容'])}::jsonb,
      15, 8, TRUE
    )
    ON CONFLICT (module_id, slug) DO UPDATE SET
      title = EXCLUDED.title,
      is_published = TRUE
  `;

  const lessons = await sql`
    SELECT id FROM lessons WHERE slug = 'intro-to-html' AND module_id = ${htmlModule.id}::uuid LIMIT 1
  `;

  if (!lessons.length) return;

  const lessonId = (lessons[0] as { id: string }).id;

  const existingChallenge = await sql`
    SELECT id FROM challenges WHERE lesson_id = ${lessonId}::uuid LIMIT 1
  `;

  if (existingChallenge.length) return;

  await sql`
    INSERT INTO challenges (
      lesson_id, title, description, instructions, challenge_type, difficulty,
      starter_html, starter_css, starter_js, solution_html, hints,
      test_cases, xp_reward, coin_reward, order_index, is_published
    ) VALUES (
      ${lessonId}::uuid,
      '创建信息科大新生欢迎页',
      '为北京信息科技大学2026级新生创建一个简单的 HTML 欢迎页面',
      ${'创建一个包含 HTML5 结构、标题、段落和社团列表的页面。'},
      'build_from_scratch',
      'easy',
      ${'<!DOCTYPE html>\n<html>\n  <head><title>欢迎加入信息科大</title></head>\n  <body><!-- 在这里编写 --></body>\n</html>'},
      '',
      '',
      ${'<!DOCTYPE html>\n<html><body><h1>欢迎来到北京信息科技大学</h1></body></html>'},
      ${JSON.stringify(['在 body 内添加信息科大相关内容', '使用 h1 创建主标题', '使用 ul 和 li 创建社团列表'])}::jsonb,
      ${JSON.stringify([{ description: '检查页面是否包含 h1 标题' }])}::jsonb,
      20, 10, 1, TRUE
    )
  `;

  console.log('BISTU sample data seeded successfully');
}
