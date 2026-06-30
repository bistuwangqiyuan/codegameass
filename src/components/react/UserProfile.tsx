// 用户资料卡片组件
import { useEffect, useState } from 'react';
import { useUserStore } from '../../lib/store/userStore';
import { getTrialDaysRemaining, isGuestTrialExpired, isDemoAccount } from '../../lib/auth';
import { BRAND } from '../../lib/branding';
import ProgramBadge from './ProgramBadge';
import { User, Star, Coins, Trophy, Flame, Award } from 'lucide-react';

export default function UserProfile() {
  const { user, isGuest } = useUserStore();
  const [trialDays, setTrialDays] = useState(0);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (user && isGuest) {
      setTrialDays(getTrialDaysRemaining(user));
      setIsExpired(isGuestTrialExpired(user));
    }
  }, [user, isGuest]);

  if (!user) {
    return (
      <div className="rounded-xl border border-bistu-primary/20 bg-white p-6 text-center shadow-md">
        <img src={BRAND.logo} alt="" className="mx-auto mb-3 h-12 w-12" />
        <div className="mb-2 flex justify-center"><ProgramBadge size="sm" /></div>
        <p className="mb-2 text-gray-700">{BRAND.programLabel} — 欢迎，信息科大的同学！</p>
        <p className="text-sm text-gray-500">使用测试账号登录，开始你的 {BRAND.programTag} 之旅</p>
      </div>
    );
  }

  const isDemo = isDemoAccount(user);
  const nextLevelXP = Math.pow(user.level, 2) * 100;
  const currentLevelXP = Math.pow(user.level - 1, 2) * 100;
  const xpProgress = ((user.experience_points - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;

  return (
    <div className="rounded-xl bg-gradient-to-br from-bistu-primary to-bistu-primary-dark p-6 text-white shadow-xl">
      <div className="mb-4 flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur">
          {user.avatar_url ? (
            <img src={user.avatar_url} alt={user.display_name || '用户'} className="h-full w-full rounded-full object-cover" />
          ) : (
            <User size={32} />
          )}
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-xl font-bold">{user.display_name || user.username}</h3>
            {isDemo && (
              <span className="rounded-full bg-bistu-accent px-2 py-0.5 text-xs font-medium">测试账号</span>
            )}
          </div>
          <p className="text-sm text-white/80">{user.title} · {BRAND.programLabel}</p>
          {isGuest && !isDemo && !isExpired && (
            <p className="mt-1 text-xs text-yellow-200">试用剩余 {trialDays} 天</p>
          )}
          {isGuest && !isDemo && isExpired && (
            <p className="mt-1 text-xs text-red-200">试用期已结束，请注册或使用测试账号</p>
          )}
        </div>
      </div>

      <div className="mb-4">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="text-yellow-300" size={20} />
            <span className="font-semibold">等级 {user.level}</span>
          </div>
          <span className="text-sm text-white/80">{user.experience_points} / {nextLevelXP} XP</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-white/20">
          <div className="h-full rounded-full bg-gradient-to-r from-yellow-400 to-yellow-200 transition-all duration-300" style={{ width: `${Math.min(xpProgress, 100)}%` }} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-white/10 p-3 backdrop-blur">
          <div className="mb-1 flex items-center gap-2 text-yellow-300"><Coins size={18} /><span className="text-sm font-medium">金币</span></div>
          <p className="text-2xl font-bold">{user.coins}</p>
        </div>
        <div className="rounded-lg bg-white/10 p-3 backdrop-blur">
          <div className="mb-1 flex items-center gap-2 text-orange-300"><Flame size={18} /><span className="text-sm font-medium">连续天数</span></div>
          <p className="text-2xl font-bold">{user.streak_days}</p>
        </div>
        <div className="rounded-lg bg-white/10 p-3 backdrop-blur">
          <div className="mb-1 flex items-center gap-2 text-green-300"><Trophy size={18} /><span className="text-sm font-medium">挑战完成</span></div>
          <p className="text-2xl font-bold">{user.total_challenges_completed}</p>
        </div>
        <div className="rounded-lg bg-white/10 p-3 backdrop-blur">
          <div className="mb-1 flex items-center gap-2 text-purple-300"><Award size={18} /><span className="text-sm font-medium">作品数</span></div>
          <p className="text-2xl font-bold">{user.total_projects_created}</p>
        </div>
      </div>
    </div>
  );
}
