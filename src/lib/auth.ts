// 用户认证工具函数
import { supabase } from './supabase';
import type { UserProfile } from './supabase';

/**
 * 创建游客账号（免费试用 1 个月）
 */
export async function createGuestAccount(): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
  try {
    // 生成随机游客 ID
    const guestId = `guest_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const guestEmail = `${guestId}@guest.gamecodelab.com`;
    const guestPassword = Math.random().toString(36).substring(2, 15);

    // 创建游客账号
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: guestEmail,
      password: guestPassword,
      options: {
        data: {
          is_guest: true,
          display_name: '游客'
        }
      }
    });

    if (signUpError) throw signUpError;
    if (!authData.user) throw new Error('Failed to create guest user');

    // 设置试用期（30天）
    const trialStart = new Date();
    const trialEnd = new Date();
    trialEnd.setDate(trialEnd.getDate() + 30);

    // 创建用户资料
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .insert({
        id: authData.user.id,
        username: guestId,
        display_name: '游客',
        user_type: 'guest',
        is_guest: true,
        guest_trial_start: trialStart.toISOString(),
        guest_trial_end: trialEnd.toISOString()
      })
      .select()
      .single();

    if (profileError) throw profileError;

    // 保存游客凭证到 localStorage（用于自动登录）
    if (typeof window !== 'undefined') {
      localStorage.setItem('guest_credentials', JSON.stringify({
        email: guestEmail,
        password: guestPassword
      }));
    }

    return { success: true, user: profile };
  } catch (error) {
    console.error('Error creating guest account:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * 检查游客试用是否过期
 */
export function isGuestTrialExpired(profile: UserProfile): boolean {
  if (!profile.is_guest || !profile.guest_trial_end) return false;
  
  const trialEnd = new Date(profile.guest_trial_end);
  return new Date() > trialEnd;
}

/**
 * 获取试用剩余天数
 */
export function getTrialDaysRemaining(profile: UserProfile): number {
  if (!profile.is_guest || !profile.guest_trial_end) return 0;
  
  const trialEnd = new Date(profile.guest_trial_end);
  const now = new Date();
  const diffTime = trialEnd.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return Math.max(0, diffDays);
}

/**
 * 邮箱注册
 */
export async function signUpWithEmail(
  email: string,
  password: string,
  username: string,
  displayName: string
): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
  try {
    // 检查用户名是否已存在
    const { data: existingUser } = await supabase
      .from('user_profiles')
      .select('username')
      .eq('username', username)
      .single();

    if (existingUser) {
      return { success: false, error: '用户名已被使用' };
    }

    // 创建账号
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          display_name: displayName
        }
      }
    });

    if (signUpError) throw signUpError;
    if (!authData.user) throw new Error('Failed to create user');

    // 创建用户资料
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .insert({
        id: authData.user.id,
        username,
        display_name: displayName,
        user_type: 'student',
        is_guest: false
      })
      .select()
      .single();

    if (profileError) throw profileError;

    return { success: true, user: profile };
  } catch (error) {
    console.error('Error signing up:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * 邮箱登录
 */
export async function signInWithEmail(
  email: string,
  password: string
): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
  try {
    const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (signInError) throw signInError;
    if (!authData.user) throw new Error('Failed to sign in');

    // 获取用户资料
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (profileError) throw profileError;

    return { success: true, user: profile };
  } catch (error) {
    console.error('Error signing in:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * 登出
 */
export async function signOut(): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    // 清除游客凭证
    if (typeof window !== 'undefined') {
      localStorage.removeItem('guest_credentials');
    }

    return { success: true };
  } catch (error) {
    console.error('Error signing out:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * 获取当前用户资料
 */
export async function getCurrentUserProfile(): Promise<UserProfile | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) throw error;
    return profile;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
}

/**
 * 转换游客为正式用户
 */
export async function convertGuestToUser(
  email: string,
  password: string,
  username: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No user logged in');

    // 检查用户名是否已存在
    const { data: existingUser } = await supabase
      .from('user_profiles')
      .select('username')
      .eq('username', username)
      .neq('id', user.id)
      .single();

    if (existingUser) {
      return { success: false, error: '用户名已被使用' };
    }

    // 更新用户资料
    const { error: updateError } = await supabase
      .from('user_profiles')
      .update({
        username,
        user_type: 'student',
        is_guest: false,
        guest_trial_start: null,
        guest_trial_end: null
      })
      .eq('id', user.id);

    if (updateError) throw updateError;

    // 更新认证信息（注意：Supabase 不支持直接更新邮箱，需要通过 email change 流程）
    // 这里可以根据实际需求调整

    // 清除游客凭证
    if (typeof window !== 'undefined') {
      localStorage.removeItem('guest_credentials');
    }

    return { success: true };
  } catch (error) {
    console.error('Error converting guest:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

