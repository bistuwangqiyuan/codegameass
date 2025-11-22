-- GameCode Lab 完整数据库架构
-- 游戏化HTML5编程教育平台

-- ========================================
-- 1. 用户相关表
-- ========================================

-- 用户扩展信息表
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username VARCHAR(50) UNIQUE,
    display_name VARCHAR(100),
    avatar_url TEXT,
    user_type VARCHAR(20) DEFAULT 'student' CHECK (user_type IN ('guest', 'student', 'teacher', 'admin')),
    
    -- 游戏化属性
    level INTEGER DEFAULT 1,
    experience_points INTEGER DEFAULT 0,
    coins INTEGER DEFAULT 100,
    title VARCHAR(100) DEFAULT '编程新手',
    
    -- 游客相关
    is_guest BOOLEAN DEFAULT FALSE,
    guest_trial_start TIMESTAMP WITH TIME ZONE,
    guest_trial_end TIMESTAMP WITH TIME ZONE,
    
    -- 学习统计
    total_lessons_completed INTEGER DEFAULT 0,
    total_challenges_completed INTEGER DEFAULT 0,
    total_projects_created INTEGER DEFAULT 0,
    streak_days INTEGER DEFAULT 0,
    last_active_date DATE,
    
    -- 时间戳
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 用户设置表
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

-- ========================================
-- 2. 课程与学习内容
-- ========================================

-- 课程模块表
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

-- 课程关卡表
CREATE TABLE IF NOT EXISTS public.lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id UUID REFERENCES public.course_modules(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL,
    
    -- 内容
    content_markdown TEXT,
    learning_objectives JSONB DEFAULT '[]',
    
    -- 游戏化
    xp_reward INTEGER DEFAULT 10,
    coin_reward INTEGER DEFAULT 5,
    required_level INTEGER DEFAULT 1,
    
    -- 状态
    is_published BOOLEAN DEFAULT FALSE,
    is_locked BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(module_id, slug)
);

-- 编程挑战/任务表
CREATE TABLE IF NOT EXISTS public.challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    instructions TEXT NOT NULL,
    
    -- 挑战类型
    challenge_type VARCHAR(50) CHECK (challenge_type IN ('code_completion', 'bug_fix', 'build_from_scratch', 'quiz', 'boss_challenge')),
    difficulty VARCHAR(20) CHECK (difficulty IN ('easy', 'medium', 'hard', 'expert')),
    
    -- 代码相关
    starter_html TEXT DEFAULT '',
    starter_css TEXT DEFAULT '',
    starter_js TEXT DEFAULT '',
    solution_html TEXT,
    solution_css TEXT,
    solution_js TEXT,
    
    -- 测试用例
    test_cases JSONB DEFAULT '[]',
    validation_rules JSONB DEFAULT '{}',
    
    -- 提示系统
    hints JSONB DEFAULT '[]',
    
    -- 奖励
    xp_reward INTEGER DEFAULT 20,
    coin_reward INTEGER DEFAULT 10,
    time_limit_seconds INTEGER,
    
    -- 状态
    order_index INTEGER NOT NULL,
    is_published BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 3. 用户进度与成就
-- ========================================

-- 用户课程进度
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

-- 用户挑战进度
CREATE TABLE IF NOT EXISTS public.user_challenge_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    challenge_id UUID REFERENCES public.challenges(id) ON DELETE CASCADE,
    
    status VARCHAR(20) DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed', 'failed')),
    attempts INTEGER DEFAULT 0,
    hints_used INTEGER DEFAULT 0,
    best_score INTEGER DEFAULT 0,
    completion_time_seconds INTEGER,
    
    -- 用户代码
    last_saved_html TEXT,
    last_saved_css TEXT,
    last_saved_js TEXT,
    
    -- AI 反馈记录
    ai_feedback_history JSONB DEFAULT '[]',
    
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, challenge_id)
);

-- 成就系统
CREATE TABLE IF NOT EXISTS public.achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    category VARCHAR(50) CHECK (category IN ('learning', 'streak', 'challenge', 'social', 'special')),
    
    -- 解锁条件
    unlock_criteria JSONB NOT NULL,
    
    -- 奖励
    xp_reward INTEGER DEFAULT 50,
    coin_reward INTEGER DEFAULT 25,
    badge_image_url TEXT,
    
    rarity VARCHAR(20) CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 用户成就
CREATE TABLE IF NOT EXISTS public.user_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    achievement_id UUID REFERENCES public.achievements(id) ON DELETE CASCADE,
    
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_showcased BOOLEAN DEFAULT FALSE,
    
    UNIQUE(user_id, achievement_id)
);

-- ========================================
-- 4. 作品与社区
-- ========================================

-- 用户作品
CREATE TABLE IF NOT EXISTS public.user_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    challenge_id UUID REFERENCES public.challenges(id) ON DELETE SET NULL,
    
    title VARCHAR(200) NOT NULL,
    description TEXT,
    
    -- 代码
    html_code TEXT NOT NULL,
    css_code TEXT DEFAULT '',
    js_code TEXT DEFAULT '',
    
    -- 截图
    thumbnail_url TEXT,
    preview_url TEXT,
    
    -- 社交
    is_public BOOLEAN DEFAULT FALSE,
    likes_count INTEGER DEFAULT 0,
    views_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    
    -- AI 评分
    ai_score INTEGER,
    ai_feedback TEXT,
    
    -- 标签
    tags TEXT[] DEFAULT '{}',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 作品点赞
CREATE TABLE IF NOT EXISTS public.project_likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    project_id UUID REFERENCES public.user_projects(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, project_id)
);

-- 作品评论
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

-- ========================================
-- 5. 游戏化系统
-- ========================================

-- 每日挑战
CREATE TABLE IF NOT EXISTS public.daily_challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    challenge_id UUID REFERENCES public.challenges(id) ON DELETE CASCADE,
    challenge_date DATE NOT NULL UNIQUE,
    bonus_xp INTEGER DEFAULT 50,
    bonus_coins INTEGER DEFAULT 30,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 排行榜（缓存表）
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

-- 经验值历史记录
CREATE TABLE IF NOT EXISTS public.xp_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    
    amount INTEGER NOT NULL,
    reason VARCHAR(100) NOT NULL,
    source_type VARCHAR(50),
    source_id UUID,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 金币交易记录
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

-- ========================================
-- 6. AI 交互记录
-- ========================================

-- AI 对话历史
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

-- AI 代码评估记录
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

-- ========================================
-- 7. 系统管理
-- ========================================

-- 系统公告
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

-- ========================================
-- 8. 索引优化
-- ========================================

CREATE INDEX idx_user_profiles_username ON public.user_profiles(username);
CREATE INDEX idx_user_profiles_user_type ON public.user_profiles(user_type);
CREATE INDEX idx_user_profiles_level ON public.user_profiles(level DESC);

CREATE INDEX idx_lessons_module_id ON public.lessons(module_id);
CREATE INDEX idx_lessons_slug ON public.lessons(slug);

CREATE INDEX idx_challenges_lesson_id ON public.challenges(lesson_id);
CREATE INDEX idx_challenges_type ON public.challenges(challenge_type);

CREATE INDEX idx_user_lesson_progress_user_id ON public.user_lesson_progress(user_id);
CREATE INDEX idx_user_lesson_progress_lesson_id ON public.user_lesson_progress(lesson_id);

CREATE INDEX idx_user_challenge_progress_user_id ON public.user_challenge_progress(user_id);
CREATE INDEX idx_user_challenge_progress_challenge_id ON public.user_challenge_progress(challenge_id);

CREATE INDEX idx_user_projects_user_id ON public.user_projects(user_id);
CREATE INDEX idx_user_projects_public ON public.user_projects(is_public) WHERE is_public = TRUE;
CREATE INDEX idx_user_projects_created_at ON public.user_projects(created_at DESC);

CREATE INDEX idx_leaderboards_type_rank ON public.leaderboards(leaderboard_type, rank);

CREATE INDEX idx_ai_conversations_user_session ON public.ai_conversations(user_id, session_id);

-- ========================================
-- 9. Row Level Security (RLS) 策略
-- ========================================

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_challenge_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.xp_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coin_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_code_evaluations ENABLE ROW LEVEL SECURITY;

-- 用户可以查看和更新自己的资料
CREATE POLICY "Users can view own profile" ON public.user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
    FOR UPDATE USING (auth.uid() = id);

-- 用户可以查看和更新自己的设置
CREATE POLICY "Users can manage own settings" ON public.user_settings
    FOR ALL USING (auth.uid() = user_id);

-- 用户可以查看和更新自己的进度
CREATE POLICY "Users can manage own progress" ON public.user_lesson_progress
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own challenge progress" ON public.user_challenge_progress
    FOR ALL USING (auth.uid() = user_id);

-- 公开作品所有人可见，私有作品仅作者可见
CREATE POLICY "Public projects visible to all" ON public.user_projects
    FOR SELECT USING (is_public = TRUE OR auth.uid() = user_id);

CREATE POLICY "Users can manage own projects" ON public.user_projects
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects" ON public.user_projects
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects" ON public.user_projects
    FOR DELETE USING (auth.uid() = user_id);

-- 课程和挑战公开可见
ALTER TABLE public.course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published modules visible to all" ON public.course_modules
    FOR SELECT USING (is_published = TRUE);

CREATE POLICY "Published lessons visible to all" ON public.lessons
    FOR SELECT USING (is_published = TRUE);

CREATE POLICY "Published challenges visible to all" ON public.challenges
    FOR SELECT USING (is_published = TRUE);

-- ========================================
-- 10. 触发器和函数
-- ========================================

-- 自动更新 updated_at 时间戳
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lessons_updated_at BEFORE UPDATE ON public.lessons
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_projects_updated_at BEFORE UPDATE ON public.user_projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 等级计算函数
CREATE OR REPLACE FUNCTION calculate_level(xp INTEGER)
RETURNS INTEGER AS $$
BEGIN
    -- 每 100 XP 升 1 级，带递增系数
    RETURN FLOOR(SQRT(xp / 100.0)) + 1;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 更新用户等级触发器
CREATE OR REPLACE FUNCTION update_user_level()
RETURNS TRIGGER AS $$
BEGIN
    NEW.level = calculate_level(NEW.experience_points);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_level_on_xp_change BEFORE INSERT OR UPDATE OF experience_points ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_user_level();

-- ========================================
-- 11. 初始化数据
-- ========================================

-- 插入基础课程模块
INSERT INTO public.course_modules (title, slug, description, order_index, difficulty, icon, color) VALUES
    ('HTML5 基础', 'html5-basics', '学习 HTML5 的基础知识，了解网页结构和语义化标签', 1, 'beginner', '📄', 'blue'),
    ('CSS 样式设计', 'css-styling', '掌握 CSS 样式，学会布局、颜色、动画等技巧', 2, 'beginner', '🎨', 'purple'),
    ('JavaScript 基础', 'javascript-basics', '学习 JavaScript 基本语法，变量、函数、控制流', 3, 'intermediate', '⚡', 'yellow'),
    ('DOM 操作', 'dom-manipulation', '学会操作网页元素，添加交互功能', 4, 'intermediate', '🎮', 'green'),
    ('综合实战项目', 'final-projects', '完成完整的网页项目，展示你的技能', 5, 'advanced', '🚀', 'red');

-- 插入示例成就
INSERT INTO public.achievements (title, description, icon, category, unlock_criteria, xp_reward, coin_reward, rarity) VALUES
    ('首次登录', '欢迎来到 GameCode Lab!', '👋', 'special', '{"type": "first_login"}', 10, 5, 'common'),
    ('代码新手', '完成第一个编程挑战', '🌟', 'learning', '{"type": "challenges_completed", "count": 1}', 20, 10, 'common'),
    ('HTML 大师', '完成所有 HTML5 基础课程', '📄', 'learning', '{"type": "module_completed", "module": "html5-basics"}', 100, 50, 'rare'),
    ('连续学习者', '连续登录 7 天', '🔥', 'streak', '{"type": "streak_days", "count": 7}', 150, 75, 'epic'),
    ('社区之星', '获得 100 个点赞', '⭐', 'social', '{"type": "total_likes", "count": 100}', 200, 100, 'legendary');

