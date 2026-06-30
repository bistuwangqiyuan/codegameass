import { getSql } from '../db';
import { hashPassword } from '../auth-server';
import { DEMO_ACCOUNTS } from '../demo-accounts';

const DEMO_IDS = {
  student: 'a0000001-0000-4000-8000-000000000001',
  teacher: 'a0000001-0000-4000-8000-000000000002',
  admin: 'a0000001-0000-4000-8000-000000000003',
} as const;

export async function seedDemoAccounts(): Promise<void> {
  const sql = getSql();
  const passwordHash = await hashPassword('BistuDemo2026');

  const profiles = [
    {
      id: DEMO_IDS.student,
      username: 'demo_student',
      display_name: '测试学生',
      user_type: 'student',
      level: 5,
      experience_points: 1200,
      coins: 500,
      title: '网页工匠',
      is_demo: true,
      total_lessons_completed: 8,
      total_challenges_completed: 12,
      total_projects_created: 3,
      streak_days: 7,
    },
    {
      id: DEMO_IDS.teacher,
      username: 'demo_teacher',
      display_name: '测试教师',
      user_type: 'teacher',
      level: 10,
      experience_points: 5000,
      coins: 1000,
      title: '代码大师',
      is_demo: true,
    },
    {
      id: DEMO_IDS.admin,
      username: 'demo_admin',
      display_name: '测试管理员',
      user_type: 'admin',
      level: 15,
      experience_points: 10000,
      coins: 2000,
      title: '传奇程序员',
      is_demo: true,
    },
  ];

  for (const profile of profiles) {
    const account = DEMO_ACCOUNTS.find((a) => a.username === profile.username);
    if (!account) continue;

    await sql`
      INSERT INTO user_profiles (
        id, username, display_name, user_type, level, experience_points, coins, title,
        is_guest, is_demo, total_lessons_completed, total_challenges_completed,
        total_projects_created, streak_days
      ) VALUES (
        ${profile.id}::uuid, ${profile.username}, ${profile.display_name}, ${profile.user_type},
        ${profile.level}, ${profile.experience_points}, ${profile.coins}, ${profile.title},
        FALSE, ${profile.is_demo}, ${profile.total_lessons_completed ?? 0},
        ${profile.total_challenges_completed ?? 0}, ${profile.total_projects_created ?? 0},
        ${profile.streak_days ?? 0}
      )
      ON CONFLICT (id) DO UPDATE SET
        username = EXCLUDED.username,
        display_name = EXCLUDED.display_name,
        user_type = EXCLUDED.user_type,
        is_demo = TRUE,
        level = EXCLUDED.level,
        experience_points = EXCLUDED.experience_points,
        coins = EXCLUDED.coins,
        title = EXCLUDED.title
    `;

    await sql`
      INSERT INTO auth_credentials (user_id, email, password_hash)
      VALUES (${profile.id}::uuid, ${account.email}, ${passwordHash})
      ON CONFLICT (user_id) DO UPDATE SET
        email = EXCLUDED.email,
        password_hash = EXCLUDED.password_hash
    `;

    await sql`
      INSERT INTO user_settings (user_id) VALUES (${profile.id}::uuid)
      ON CONFLICT (user_id) DO NOTHING
    `;
  }

  const existing = await sql`
    SELECT id FROM user_projects WHERE user_id = ${DEMO_IDS.student}::uuid LIMIT 1
  `;

  if (!existing.length) {
    await sql`
      INSERT INTO user_projects (
        user_id, title, description, html_code, css_code, js_code,
        is_public, likes_count, views_count, comments_count, tags
      ) VALUES
      (
        ${DEMO_IDS.student}::uuid,
        '信息科大新生欢迎页',
        '为信息科大2026级新生设计的欢迎页面，包含校区介绍与入学指南',
        '<!DOCTYPE html><html><head><title>欢迎加入信息科大</title></head><body><h1>欢迎来到北京信息科技大学</h1><p>五育并举，信以立身</p></body></html>',
        'body { font-family: sans-serif; background: #f0f4fa; color: #003087; } h1 { color: #C8102E; }',
        '',
        TRUE, 42, 156, 8, ARRAY['HTML', '信息科大', '新生指南']::text[]
      ),
      (
        ${DEMO_IDS.student}::uuid,
        '校园社团活动报名页',
        '信息科大计算机协会招新活动页面，含表单与响应式布局',
        '<!DOCTYPE html><html><body><h1>计算机协会招新</h1><form><input placeholder="姓名"><button>报名</button></form></body></html>',
        'body { max-width: 600px; margin: 0 auto; padding: 2rem; } button { background: #003087; color: white; }',
        '',
        TRUE, 28, 89, 5, ARRAY['CSS', '社团', '表单']::text[]
      ),
      (
        ${DEMO_IDS.student}::uuid,
        '课程表查询小工具',
        '支持按星期筛选的信息科大课程表查询工具',
        '<!DOCTYPE html><html><body><h1>我的课表</h1><div id="schedule"></div></body></html>',
        'body { font-family: monospace; }',
        'document.getElementById("schedule").innerHTML = "<p>周一: Web编程实践</p>";',
        TRUE, 35, 120, 12, ARRAY['JavaScript', '工具', '课表']::text[]
      )
    `;
  }
}
