-- BISTU 测试账号资料与社区作品（密码哈希由 /api/db/init 通过 bcrypt 写入 auth_credentials）

-- 发布全部课程
UPDATE public.course_modules SET is_published = TRUE;
UPDATE public.lessons SET is_published = TRUE WHERE is_published = FALSE;
UPDATE public.challenges SET is_published = TRUE WHERE is_published = FALSE;
