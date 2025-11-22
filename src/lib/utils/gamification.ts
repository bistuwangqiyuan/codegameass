// 游戏化系统工具函数

/**
 * 计算用户等级（基于经验值）
 */
export function calculateLevel(xp: number): number {
  // 使用平方根算法，让升级难度逐渐增加
  return Math.floor(Math.sqrt(xp / 100)) + 1;
}

/**
 * 计算达到指定等级所需的经验值
 */
export function getXPForLevel(level: number): number {
  return Math.pow(level - 1, 2) * 100;
}

/**
 * 获取等级称号
 */
export function getLevelTitle(level: number): string {
  if (level === 1) return '编程新手';
  if (level <= 3) return '代码学徒';
  if (level <= 5) return '网页工匠';
  if (level <= 7) return '前端开发者';
  if (level <= 10) return '全栈工程师';
  if (level <= 15) return '代码大师';
  if (level <= 20) return '架构专家';
  return '传奇程序员';
}

/**
 * 获取成就稀有度配置
 */
export function getAchievementRarityConfig(rarity: string) {
  const configs: Record<string, { color: string; label: string; icon: string }> = {
    common: {
      color: 'text-gray-600 bg-gray-100',
      label: '普通',
      icon: '🥉'
    },
    rare: {
      color: 'text-blue-600 bg-blue-100',
      label: '稀有',
      icon: '🥈'
    },
    epic: {
      color: 'text-purple-600 bg-purple-100',
      label: '史诗',
      icon: '🥇'
    },
    legendary: {
      color: 'text-orange-600 bg-orange-100',
      label: '传说',
      icon: '👑'
    }
  };
  return configs[rarity] || configs.common;
}

/**
 * 检查成就解锁条件
 */
export function checkAchievementUnlock(
  criteria: any,
  userStats: any
): boolean {
  switch (criteria.type) {
    case 'first_login':
      return true;
    
    case 'challenges_completed':
      return userStats.total_challenges_completed >= criteria.count;
    
    case 'lessons_completed':
      return userStats.total_lessons_completed >= criteria.count;
    
    case 'projects_created':
      return userStats.total_projects_created >= criteria.count;
    
    case 'streak_days':
      return userStats.streak_days >= criteria.count;
    
    case 'level_reached':
      return userStats.level >= criteria.level;
    
    case 'xp_earned':
      return userStats.experience_points >= criteria.amount;
    
    case 'total_likes':
      return userStats.total_likes_received >= criteria.count;
    
    case 'module_completed':
      // 需要检查特定模块完成情况
      return false; // 需要额外逻辑
    
    default:
      return false;
  }
}

/**
 * 格式化经验值显示
 */
export function formatXP(xp: number): string {
  if (xp >= 1000000) {
    return `${(xp / 1000000).toFixed(1)}M`;
  }
  if (xp >= 1000) {
    return `${(xp / 1000).toFixed(1)}K`;
  }
  return xp.toString();
}

/**
 * 格式化数字显示（带千分位）
 */
export function formatNumber(num: number): string {
  return num.toLocaleString('zh-CN');
}

/**
 * 计算两个日期之间的天数差
 */
export function daysBetween(date1: Date, date2: Date): number {
  const oneDay = 24 * 60 * 60 * 1000;
  return Math.round(Math.abs((date1.getTime() - date2.getTime()) / oneDay));
}

/**
 * 检查是否为连续登录
 */
export function isConsecutiveDay(lastActiveDate: Date | string): boolean {
  const last = new Date(lastActiveDate);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // 重置时间为午夜
  last.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  yesterday.setHours(0, 0, 0, 0);

  return last.getTime() === yesterday.getTime();
}

/**
 * 获取排行榜周期
 */
export function getLeaderboardPeriod(type: string): { start: Date; end: Date } {
  const now = new Date();
  let start: Date;
  let end: Date = new Date(now);

  switch (type) {
    case 'weekly':
      start = new Date(now);
      start.setDate(now.getDate() - now.getDay()); // 本周一
      start.setHours(0, 0, 0, 0);
      end.setDate(start.getDate() + 7);
      break;
    
    case 'monthly':
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      break;
    
    case 'all_time':
    default:
      start = new Date(0); // Unix epoch
      end = new Date(now);
      end.setHours(23, 59, 59, 999);
      break;
  }

  return { start, end };
}

/**
 * 生成随机成就徽章颜色
 */
export function getAchievementGradient(index: number): string {
  const gradients = [
    'from-blue-400 to-blue-600',
    'from-purple-400 to-purple-600',
    'from-pink-400 to-pink-600',
    'from-green-400 to-green-600',
    'from-yellow-400 to-yellow-600',
    'from-red-400 to-red-600',
    'from-indigo-400 to-indigo-600',
    'from-orange-400 to-orange-600'
  ];
  return gradients[index % gradients.length];
}

/**
 * 计算任务完成度百分比
 */
export function calculateProgress(completed: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
}

/**
 * 获取难度颜色配置
 */
export function getDifficultyConfig(difficulty: string) {
  const configs: Record<string, { color: string; label: string }> = {
    beginner: { color: 'bg-green-100 text-green-700', label: '入门' },
    intermediate: { color: 'bg-yellow-100 text-yellow-700', label: '中级' },
    advanced: { color: 'bg-orange-100 text-orange-700', label: '高级' },
    expert: { color: 'bg-red-100 text-red-700', label: '专家' },
    easy: { color: 'bg-green-100 text-green-700', label: '简单' },
    medium: { color: 'bg-yellow-100 text-yellow-700', label: '中等' },
    hard: { color: 'bg-orange-100 text-orange-700', label: '困难' }
  };
  return configs[difficulty] || configs.beginner;
}

