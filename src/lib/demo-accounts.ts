/** 公开测试账号 — 凭据展示于首页，供所有人体验全功能 */

export type DemoRole = 'student' | 'teacher' | 'admin';

export interface DemoAccount {
  role: DemoRole;
  roleLabel: string;
  email: string;
  password: string;
  description: string;
  displayName: string;
  username: string;
}

export const DEMO_PASSWORD = 'BistuDemo2026';

export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    role: 'student',
    roleLabel: '学生',
    email: 'demo.student@bistu.edu.cn',
    password: DEMO_PASSWORD,
    description: '含预置学习进度、金币与成就，推荐首次体验',
    displayName: '测试学生',
    username: 'demo_student',
  },
  {
    role: 'teacher',
    roleLabel: '教师',
    email: 'demo.teacher@bistu.edu.cn',
    password: DEMO_PASSWORD,
    description: '教师角色体验，可查看教学相关功能',
    displayName: '测试教师',
    username: 'demo_teacher',
  },
  {
    role: 'admin',
    roleLabel: '管理员',
    email: 'demo.admin@bistu.edu.cn',
    password: DEMO_PASSWORD,
    description: '管理员角色，可访问系统诊断等管理功能',
    displayName: '测试管理员',
    username: 'demo_admin',
  },
];

export function getDemoAccount(role: DemoRole): DemoAccount {
  const account = DEMO_ACCOUNTS.find((a) => a.role === role);
  if (!account) throw new Error(`Unknown demo role: ${role}`);
  return account;
}

export function isDemoAccountsEnabled(): boolean {
  if (typeof import.meta !== 'undefined' && import.meta.env?.PUBLIC_ENABLE_DEMO_ACCOUNTS === 'false') {
    return false;
  }
  return true;
}
