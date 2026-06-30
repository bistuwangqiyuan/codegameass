-- Neon 数据库架构 — 信息科大编程实验室
-- 无 Supabase auth / RLS，权限由 API 层控制

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 用户资料
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE,
    display_name VARCHAR(100),
    avatar_url TEXT,
    user_type VARCHAR(20) DEFAULT 'student' CHECK (user_type IN ('guest', 'student', 'teacher', 'admin')),
    level INTEGER DEFAULT 1,
    experience_points INTEGER DEFAULT 0,
    coins INTEGER DEFAULT 100,
    title VARCHAR(100) DEFAULT '编程新手',
    is_guest BOOLEAN DEFAULT FALSE,
    is_demo BOOLEAN DEFAULT FALSE,
    guest_trial_start TIMESTAMP WITH TIME ZONE,
    guest_trial_end TIMESTAMP WITH TIME ZONE,
    total_lessons_completed INTEGER DEFAULT 0,
    total_challenges_completed INTEGER DEFAULT 0,
    total_projects_created INTEGER DEFAULT 0,
    streak_days INTEGER DEFAULT 0,
    last_active_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 登录凭据
CREATE TABLE IF NOT EXISTS public.auth_credentials (
    user_id UUID PRIMARY KEY REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_settings (
    user_id UUID PRIMARY KEY REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    theme VARCHAR(20) DEFAULT 'light',
    language VARCHAR(10) DEFAULT 'zh-CN',
    notifications_enabled BOOLEAN DEFAULT TRUE,
    sound_enabled BOOLEAN DEFAULT TRUE,
    editor_theme VARCHAR(50) DEFAULT 'vs-dark',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.course_modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL,
    difficulty VARCHAR(20) CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    icon VARCHAR(50),
    color VARCHAR(20),
    estimated_hours INTEGER,
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id UUID REFERENCES public.course_modules(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL,
    content_markdown TEXT,
    learning_objectives JSONB DEFAULT '[]',
    xp_reward INTEGER DEFAULT 10,
    coin_reward INTEGER DEFAULT 5,
    required_level INTEGER DEFAULT 1,
    is_published BOOLEAN DEFAULT FALSE,
    is_locked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(module_id, slug)
);

CREATE TABLE IF NOT EXISTS public.challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    instructions TEXT NOT NULL,
    challenge_type VARCHAR(50) CHECK (challenge_type IN ('code_completion', 'bug_fix', 'build_from_scratch', 'quiz', 'boss_challenge')),
    difficulty VARCHAR(20) CHECK (difficulty IN ('easy', 'medium', 'hard', 'expert')),
    starter_html TEXT DEFAULT '',
    starter_css TEXT DEFAULT '',
    starter_js TEXT DEFAULT '',
    solution_html TEXT,
    solution_css TEXT,
    solution_js TEXT,
    test_cases JSONB DEFAULT '[]',
    validation_rules JSONB DEFAULT '{}',
    hints JSONB DEFAULT '[]',
    xp_reward INTEGER DEFAULT 20,
    coin_reward INTEGER DEFAULT 10,
    time_limit_seconds INTEGER,
    order_index INTEGER NOT NULL,
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_lesson_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
    progress_percentage INTEGER DEFAULT 0,
    time_spent_seconds INTEGER DEFAULT 0,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, lesson_id)
);

CREATE TABLE IF NOT EXISTS public.user_challenge_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    challenge_id UUID REFERENCES public.challenges(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed', 'failed')),
    attempts INTEGER DEFAULT 0,
    hints_used INTEGER DEFAULT 0,
    best_score INTEGER DEFAULT 0,
    completion_time_seconds INTEGER,
    last_saved_html TEXT,
    last_saved_css TEXT,
    last_saved_js TEXT,
    ai_feedback_history JSONB DEFAULT '[]',
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, challenge_id)
);

CREATE TABLE IF NOT EXISTS public.achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    category VARCHAR(50) CHECK (category IN ('learning', 'streak', 'challenge', 'social', 'special')),
    unlock_criteria JSONB NOT NULL,
    xp_reward INTEGER DEFAULT 50,
    coin_reward INTEGER DEFAULT 25,
    badge_image_url TEXT,
    rarity VARCHAR(20) CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    achievement_id UUID REFERENCES public.achievements(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_showcased BOOLEAN DEFAULT FALSE,
    UNIQUE(user_id, achievement_id)
);

CREATE TABLE IF NOT EXISTS public.user_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    challenge_id UUID REFERENCES public.challenges(id) ON DELETE SET NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    html_code TEXT NOT NULL,
    css_code TEXT DEFAULT '',
    js_code TEXT DEFAULT '',
    thumbnail_url TEXT,
    preview_url TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    likes_count INTEGER DEFAULT 0,
    views_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    ai_score INTEGER,
    ai_feedback TEXT,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.project_likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    project_id UUID REFERENCES public.user_projects(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, project_id)
);

CREATE TABLE IF NOT EXISTS public.project_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    project_id UUID REFERENCES public.user_projects(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    parent_comment_id UUID REFERENCES public.project_comments(id) ON DELETE CASCADE,
    likes_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.daily_challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    challenge_id UUID REFERENCES public.challenges(id) ON DELETE CASCADE,
    challenge_date DATE NOT NULL UNIQUE,
    bonus_xp INTEGER DEFAULT 50,
    bonus_coins INTEGER DEFAULT 30,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.leaderboards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    leaderboard_type VARCHAR(50) CHECK (leaderboard_type IN ('xp_weekly', 'xp_monthly', 'xp_all_time', 'challenges_completed', 'projects_created')),
    score INTEGER NOT NULL,
    rank INTEGER,
    period_start DATE,
    period_end DATE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, leaderboard_type, period_start)
);

CREATE TABLE IF NOT EXISTS public.xp_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL,
    reason VARCHAR(100) NOT NULL,
    source_type VARCHAR(50),
    source_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.coin_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL,
    transaction_type VARCHAR(20) CHECK (transaction_type IN ('earn', 'spend')),
    reason VARCHAR(100) NOT NULL,
    source_type VARCHAR(50),
    source_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ai_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    session_id UUID NOT NULL,
    message_role VARCHAR(20) CHECK (message_role IN ('user', 'assistant', 'system')),
    message_content TEXT NOT NULL,
    context_type VARCHAR(50),
    context_id UUID,
    ai_model VARCHAR(50) DEFAULT 'deepseek',
    tokens_used INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ai_code_evaluations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    challenge_id UUID REFERENCES public.challenges(id) ON DELETE CASCADE,
    submitted_code TEXT NOT NULL,
    evaluation_result JSONB NOT NULL,
    score INTEGER,
    feedback TEXT,
    suggestions TEXT[],
    ai_model VARCHAR(50) DEFAULT 'deepseek',
    processing_time_ms INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    announcement_type VARCHAR(20) CHECK (announcement_type IN ('info', 'warning', 'success', 'event')),
    is_active BOOLEAN DEFAULT TRUE,
    priority INTEGER DEFAULT 0,
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    created_by UUID REFERENCES public.user_profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_profiles_username ON public.user_profiles(username);
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_type ON public.user_profiles(user_type);
CREATE INDEX IF NOT EXISTS idx_lessons_module_id ON public.lessons(module_id);
CREATE INDEX IF NOT EXISTS idx_challenges_lesson_id ON public.challenges(lesson_id);
CREATE INDEX IF NOT EXISTS idx_user_projects_public ON public.user_projects(is_public) WHERE is_public = TRUE;
CREATE INDEX IF NOT EXISTS idx_auth_credentials_email ON public.auth_credentials(email);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON public.user_profiles;
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_projects_updated_at ON public.user_projects;
CREATE TRIGGER update_user_projects_updated_at BEFORE UPDATE ON public.user_projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE FUNCTION calculate_level(xp INTEGER)
RETURNS INTEGER AS $$
BEGIN
    RETURN FLOOR(SQRT(xp / 100.0)) + 1;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

CREATE OR REPLACE FUNCTION update_user_level()
RETURNS TRIGGER AS $$
BEGIN
    NEW.level = calculate_level(NEW.experience_points);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_level_on_xp_change ON public.user_profiles;
CREATE TRIGGER update_level_on_xp_change BEFORE INSERT OR UPDATE OF experience_points ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_user_level();

INSERT INTO public.course_modules (title, slug, description, order_index, difficulty, icon, color, is_published) VALUES
    ('HTML5 基础', 'html5-basics', '搭建信息科大新生欢迎页，学习网页结构与语义化标签', 1, 'beginner', '📄', 'blue', TRUE),
    ('CSS 样式设计', 'css-styling', '设计校园社团活动海报页面，掌握布局与响应式设计', 2, 'beginner', '🎨', 'purple', TRUE),
    ('JavaScript 基础', 'javascript-basics', '制作信息科大课程表查询小工具，学习 JS 核心语法', 3, 'intermediate', '⚡', 'yellow', TRUE),
    ('DOM 操作', 'dom-manipulation', '为校园活动页添加动态交互，操作网页元素', 4, 'intermediate', '🎮', 'green', TRUE),
    ('综合实战项目', 'final-projects', '完成信息科大主题完整网页项目，展示你的 Web 开发技能', 5, 'advanced', '🚀', 'red', TRUE)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    is_published = TRUE;

INSERT INTO public.achievements (title, description, icon, category, unlock_criteria, xp_reward, coin_reward, rarity) VALUES
    ('首次登录', '欢迎来到信息科大编程实验室！', '👋', 'special', '{"type": "first_login"}', 10, 5, 'common'),
    ('代码新手', '完成第一个编程挑战', '🌟', 'learning', '{"type": "challenges_completed", "count": 1}', 20, 10, 'common'),
    ('HTML 大师', '完成所有 HTML5 基础课程', '📄', 'learning', '{"type": "module_completed", "module": "html5-basics"}', 100, 50, 'rare'),
    ('连续学习者', '连续登录 7 天', '🔥', 'streak', '{"type": "streak_days", "count": 7}', 150, 75, 'epic'),
    ('社区之星', '获得 100 个点赞', '⭐', 'social', '{"type": "total_likes", "count": 100}', 200, 100, 'legendary')
ON CONFLICT DO NOTHING;
