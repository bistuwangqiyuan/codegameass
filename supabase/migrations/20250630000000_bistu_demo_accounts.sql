-- BISTU 测试账号、RLS 修复与课程发布
-- 信息科大编程实验室

-- ========================================
-- 1. 新增 is_demo 字段
-- ========================================
ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT FALSE;

-- ========================================
-- 2. 修复 RLS：允许用户创建自己的 profile
-- ========================================
CREATE POLICY "Users can insert own profile" ON public.user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- ========================================
-- 3. 发布全部课程模块
-- ========================================
UPDATE public.course_modules SET is_published = TRUE;
UPDATE public.lessons SET is_published = TRUE WHERE is_published = FALSE;
UPDATE public.challenges SET is_published = TRUE WHERE is_published = FALSE;

-- ========================================
-- 4. 更新课程描述为 BISTU 主题
-- ========================================
UPDATE public.course_modules SET
    title = 'HTML5 基础',
    description = '搭建信息科大新生欢迎页，学习网页结构与语义化标签'
WHERE slug = 'html5-basics';

UPDATE public.course_modules SET
    title = 'CSS 样式设计',
    description = '设计校园社团活动海报页面，掌握布局与响应式设计'
WHERE slug = 'css-styling';

UPDATE public.course_modules SET
    title = 'JavaScript 基础',
    description = '制作信息科大课程表查询小工具，学习 JS 核心语法'
WHERE slug = 'javascript-basics';

UPDATE public.course_modules SET
    title = 'DOM 操作',
    description = '为校园活动页添加动态交互，操作网页元素'
WHERE slug = 'dom-manipulation';

UPDATE public.course_modules SET
    title = '综合实战项目',
    description = '完成信息科大主题完整网页项目，展示你的 Web 开发技能'
WHERE slug = 'final-projects';

UPDATE public.achievements SET
    title = '首次登录',
    description = '欢迎来到信息科大编程实验室！'
WHERE unlock_criteria->>'type' = 'first_login';

-- ========================================
-- 5. 创建测试账号（固定 UUID）
-- ========================================
-- 密码均为 BistuDemo2026（bcrypt via crypt）

DO $$
DECLARE
  demo_student_id UUID := 'a0000001-0000-4000-8000-000000000001';
  demo_teacher_id UUID := 'a0000001-0000-4000-8000-000000000002';
  demo_admin_id   UUID := 'a0000001-0000-4000-8000-000000000003';
  instance_uuid   UUID;
  encrypted_pw    TEXT;
BEGIN
  SELECT id INTO instance_uuid FROM auth.instances LIMIT 1;
  IF instance_uuid IS NULL THEN
    instance_uuid := '00000000-0000-0000-0000-000000000000';
  END IF;

  encrypted_pw := crypt('BistuDemo2026', gen_salt('bf'));

  -- 学生账号
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
    created_at, updated_at, confirmation_token, recovery_token,
    email_change_token_new, email_change
  ) VALUES (
    demo_student_id, instance_uuid, 'authenticated', 'authenticated',
    'demo.student@bistu.edu.cn', encrypted_pw, NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"display_name":"测试学生"}',
    NOW(), NOW(), '', '', '', ''
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
  ) VALUES (
    demo_student_id, demo_student_id,
    jsonb_build_object('sub', demo_student_id::text, 'email', 'demo.student@bistu.edu.cn'),
    'email', demo_student_id::text, NOW(), NOW(), NOW()
  ) ON CONFLICT (provider, provider_id) DO NOTHING;

  INSERT INTO public.user_profiles (
    id, username, display_name, user_type, level, experience_points, coins, title,
    is_guest, is_demo, total_lessons_completed, total_challenges_completed, total_projects_created, streak_days
  ) VALUES (
    demo_student_id, 'demo_student', '测试学生', 'student', 5, 1200, 500, '网页工匠',
    FALSE, TRUE, 8, 12, 3, 7
  ) ON CONFLICT (id) DO UPDATE SET
    is_demo = TRUE, level = 5, experience_points = 1200, coins = 500,
    title = '网页工匠', total_lessons_completed = 8, total_challenges_completed = 12,
    total_projects_created = 3, streak_days = 7;

  INSERT INTO public.user_settings (user_id) VALUES (demo_student_id)
  ON CONFLICT (user_id) DO NOTHING;

  -- 教师账号
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
    created_at, updated_at, confirmation_token, recovery_token,
    email_change_token_new, email_change
  ) VALUES (
    demo_teacher_id, instance_uuid, 'authenticated', 'authenticated',
    'demo.teacher@bistu.edu.cn', encrypted_pw, NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"display_name":"测试教师"}',
    NOW(), NOW(), '', '', '', ''
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
  ) VALUES (
    demo_teacher_id, demo_teacher_id,
    jsonb_build_object('sub', demo_teacher_id::text, 'email', 'demo.teacher@bistu.edu.cn'),
    'email', demo_teacher_id::text, NOW(), NOW(), NOW()
  ) ON CONFLICT (provider, provider_id) DO NOTHING;

  INSERT INTO public.user_profiles (
    id, username, display_name, user_type, is_demo, level, experience_points, coins, title
  ) VALUES (
    demo_teacher_id, 'demo_teacher', '测试教师', 'teacher', TRUE, 10, 5000, 1000, '代码大师'
  ) ON CONFLICT (id) DO UPDATE SET is_demo = TRUE, user_type = 'teacher';

  INSERT INTO public.user_settings (user_id) VALUES (demo_teacher_id)
  ON CONFLICT (user_id) DO NOTHING;

  -- 管理员账号
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
    created_at, updated_at, confirmation_token, recovery_token,
    email_change_token_new, email_change
  ) VALUES (
    demo_admin_id, instance_uuid, 'authenticated', 'authenticated',
    'demo.admin@bistu.edu.cn', encrypted_pw, NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"display_name":"测试管理员"}',
    NOW(), NOW(), '', '', '', ''
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
  ) VALUES (
    demo_admin_id, demo_admin_id,
    jsonb_build_object('sub', demo_admin_id::text, 'email', 'demo.admin@bistu.edu.cn'),
    'email', demo_admin_id::text, NOW(), NOW(), NOW()
  ) ON CONFLICT (provider, provider_id) DO NOTHING;

  INSERT INTO public.user_profiles (
    id, username, display_name, user_type, is_demo, level, experience_points, coins, title
  ) VALUES (
    demo_admin_id, 'demo_admin', '测试管理员', 'admin', TRUE, 15, 10000, 2000, '传奇程序员'
  ) ON CONFLICT (id) DO UPDATE SET is_demo = TRUE, user_type = 'admin';

  INSERT INTO public.user_settings (user_id) VALUES (demo_admin_id)
  ON CONFLICT (user_id) DO NOTHING;

  -- 学生示例社区作品
  IF NOT EXISTS (SELECT 1 FROM public.user_projects WHERE user_id = demo_student_id LIMIT 1) THEN
    INSERT INTO public.user_projects (
      user_id, title, description, html_code, css_code, js_code,
      is_public, likes_count, views_count, comments_count, tags
    ) VALUES
    (
      demo_student_id,
      '信息科大新生欢迎页',
      '为信息科大2026级新生设计的欢迎页面，包含校区介绍与入学指南',
      '<!DOCTYPE html><html><head><title>欢迎加入信息科大</title></head><body><h1>欢迎来到北京信息科技大学</h1><p>五育并举，信以立身</p></body></html>',
      'body { font-family: sans-serif; background: #f0f4fa; color: #003087; } h1 { color: #C8102E; }',
      '',
      TRUE, 42, 156, 8, ARRAY['HTML', '信息科大', '新生指南']
    ),
    (
      demo_student_id,
      '校园社团活动报名页',
      '信息科大计算机协会招新活动页面，含表单与响应式布局',
      '<!DOCTYPE html><html><body><h1>计算机协会招新</h1><form><input placeholder="姓名"><button>报名</button></form></body></html>',
      'body { max-width: 600px; margin: 0 auto; padding: 2rem; } button { background: #003087; color: white; }',
      '',
      TRUE, 28, 89, 5, ARRAY['CSS', '社团', '表单']
    ),
    (
      demo_student_id,
      '课程表查询小工具',
      '支持按星期筛选的信息科大课程表查询工具',
      '<!DOCTYPE html><html><body><h1>我的课表</h1><div id="schedule"></div></body></html>',
      'body { font-family: monospace; }',
      'document.getElementById("schedule").innerHTML = "<p>周一: Web编程实践</p>";',
      TRUE, 35, 120, 12, ARRAY['JavaScript', '工具', '课表']
    );
  END IF;

END $$;
