import bcrypt from 'bcryptjs';
import { getSql } from './db';
import type { UserProfile } from './supabase';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function mapProfile(row: Record<string, unknown>): UserProfile {
  return {
    id: String(row.id),
    username: row.username as string | null,
    display_name: row.display_name as string | null,
    avatar_url: row.avatar_url as string | null,
    user_type: row.user_type as UserProfile['user_type'],
    level: Number(row.level ?? 1),
    experience_points: Number(row.experience_points ?? 0),
    coins: Number(row.coins ?? 0),
    title: String(row.title ?? '编程新手'),
    is_guest: Boolean(row.is_guest),
    is_demo: Boolean(row.is_demo),
    guest_trial_start: row.guest_trial_start as string | null,
    guest_trial_end: row.guest_trial_end as string | null,
    total_lessons_completed: Number(row.total_lessons_completed ?? 0),
    total_challenges_completed: Number(row.total_challenges_completed ?? 0),
    total_projects_created: Number(row.total_projects_created ?? 0),
    streak_days: Number(row.streak_days ?? 0),
    last_active_date: row.last_active_date as string | null,
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}

export async function getProfileById(userId: string): Promise<UserProfile | null> {
  const sql = getSql();
  const rows = await sql`
    SELECT * FROM user_profiles WHERE id = ${userId} LIMIT 1
  `;
  if (!rows.length) return null;
  return mapProfile(rows[0] as Record<string, unknown>);
}

export async function getProfileByEmail(email: string): Promise<UserProfile | null> {
  const sql = getSql();
  const rows = await sql`
    SELECT p.* FROM user_profiles p
    JOIN auth_credentials c ON c.user_id = p.id
    WHERE LOWER(c.email) = LOWER(${email})
    LIMIT 1
  `;
  if (!rows.length) return null;
  return mapProfile(rows[0] as Record<string, unknown>);
}

export async function getPasswordHash(email: string): Promise<string | null> {
  const sql = getSql();
  const rows = await sql`
    SELECT password_hash FROM auth_credentials WHERE LOWER(email) = LOWER(${email}) LIMIT 1
  `;
  if (!rows.length) return null;
  return String((rows[0] as { password_hash: string }).password_hash);
}
