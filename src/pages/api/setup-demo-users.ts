import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';
import { DEMO_ACCOUNTS, DEMO_PASSWORD } from '../../lib/demo-accounts';

export const POST: APIRoute = async () => {
  const serviceKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;

  if (!serviceKey || !supabaseUrl) {
    return new Response(
      JSON.stringify({ error: 'Missing SUPABASE_SERVICE_ROLE_KEY or PUBLIC_SUPABASE_URL' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const admin = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const results: Record<string, string> = {};

  for (const account of DEMO_ACCOUNTS) {
    const { data: existingUsers } = await admin.auth.admin.listUsers();
    const exists = existingUsers?.users?.some((u) => u.email === account.email);

    if (!exists) {
      const { data, error } = await admin.auth.admin.createUser({
        email: account.email,
        password: DEMO_PASSWORD,
        email_confirm: true,
        user_metadata: { display_name: account.displayName },
      });

      if (error) {
        results[account.role] = `create failed: ${error.message}`;
        continue;
      }

      const userId = data.user.id;
      const profileData = {
        id: userId,
        username: account.username,
        display_name: account.displayName,
        user_type: account.role === 'student' ? 'student' : account.role,
        is_demo: true,
        is_guest: false,
        ...(account.role === 'student' && {
          level: 5,
          experience_points: 1200,
          coins: 500,
          title: '网页工匠',
          total_lessons_completed: 8,
          total_challenges_completed: 12,
          total_projects_created: 3,
          streak_days: 7,
        }),
        ...(account.role === 'teacher' && { level: 10, experience_points: 5000, coins: 1000, title: '代码大师' }),
        ...(account.role === 'admin' && { level: 15, experience_points: 10000, coins: 2000, title: '传奇程序员' }),
      };

      await admin.from('user_profiles').upsert(profileData);
      await admin.from('user_settings').upsert({ user_id: userId });
      results[account.role] = 'created';
    } else {
      results[account.role] = 'already exists';
    }
  }

  await admin.from('course_modules').update({ is_published: true }).neq('id', '00000000-0000-0000-0000-000000000000');

  return new Response(JSON.stringify({ success: true, results }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
