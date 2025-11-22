import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 类型定义
export type UserProfile = {
  id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  user_type: 'guest' | 'student' | 'teacher' | 'admin';
  level: number;
  experience_points: number;
  coins: number;
  title: string;
  is_guest: boolean;
  guest_trial_start: string | null;
  guest_trial_end: string | null;
  total_lessons_completed: number;
  total_challenges_completed: number;
  total_projects_created: number;
  streak_days: number;
  last_active_date: string | null;
  created_at: string;
  updated_at: string;
};

export type CourseModule = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  order_index: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  icon: string | null;
  color: string | null;
  estimated_hours: number | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type Lesson = {
  id: string;
  module_id: string;
  title: string;
  slug: string;
  description: string | null;
  order_index: number;
  content_markdown: string | null;
  learning_objectives: string[];
  xp_reward: number;
  coin_reward: number;
  required_level: number;
  is_published: boolean;
  is_locked: boolean;
  created_at: string;
  updated_at: string;
};

export type Challenge = {
  id: string;
  lesson_id: string;
  title: string;
  description: string;
  instructions: string;
  challenge_type: 'code_completion' | 'bug_fix' | 'build_from_scratch' | 'quiz' | 'boss_challenge';
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  starter_html: string;
  starter_css: string;
  starter_js: string;
  solution_html: string | null;
  solution_css: string | null;
  solution_js: string | null;
  test_cases: any[];
  validation_rules: any;
  hints: any[];
  xp_reward: number;
  coin_reward: number;
  time_limit_seconds: number | null;
  order_index: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type UserProject = {
  id: string;
  user_id: string;
  challenge_id: string | null;
  title: string;
  description: string | null;
  html_code: string;
  css_code: string;
  js_code: string;
  thumbnail_url: string | null;
  preview_url: string | null;
  is_public: boolean;
  likes_count: number;
  views_count: number;
  comments_count: number;
  ai_score: number | null;
  ai_feedback: string | null;
  tags: string[];
  created_at: string;
  updated_at: string;
};

