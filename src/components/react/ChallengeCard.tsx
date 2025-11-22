// 挑战卡片组件
import { Code, Trophy, Clock, Star, CheckCircle2 } from 'lucide-react';
import type { Challenge } from '../../lib/supabase';

interface ChallengeCardProps {
  challenge: Challenge;
  isCompleted?: boolean;
  bestScore?: number;
  onClick?: () => void;
}

export default function ChallengeCard({ challenge, isCompleted = false, bestScore, onClick }: ChallengeCardProps) {
  const difficultyConfig = {
    easy: {
      color: 'text-green-600',
      bg: 'bg-green-50',
      label: '简单'
    },
    medium: {
      color: 'text-yellow-600',
      bg: 'bg-yellow-50',
      label: '中等'
    },
    hard: {
      color: 'text-orange-600',
      bg: 'bg-orange-50',
      label: '困难'
    },
    expert: {
      color: 'text-red-600',
      bg: 'bg-red-50',
      label: '专家'
    }
  };

  const typeConfig = {
    code_completion: { icon: Code, label: '代码补全' },
    bug_fix: { icon: Code, label: '修复Bug' },
    build_from_scratch: { icon: Code, label: '从零构建' },
    quiz: { icon: Code, label: '知识问答' },
    boss_challenge: { icon: Trophy, label: 'Boss挑战' }
  };

  const config = difficultyConfig[challenge.difficulty];
  const typeInfo = typeConfig[challenge.challenge_type];
  const Icon = typeInfo.icon;

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer overflow-hidden rounded-lg border border-gray-200 bg-white transition-all hover:border-blue-300 hover:shadow-lg"
    >
      {/* 头部 */}
      <div className={`p-4 ${config.bg}`}>
        <div className="mb-2 flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Icon className={config.color} size={20} />
            <span className={`text-xs font-medium ${config.color}`}>
              {typeInfo.label}
            </span>
          </div>
          {isCompleted && (
            <CheckCircle2 className="text-green-500" size={20} />
          )}
        </div>
        <h3 className="text-lg font-bold text-gray-900">{challenge.title}</h3>
      </div>

      {/* 内容 */}
      <div className="p-4">
        <p className="mb-4 line-clamp-2 text-sm text-gray-600">
          {challenge.description}
        </p>

        {/* 奖励和元数据 */}
        <div className="mb-4 flex flex-wrap items-center gap-3 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Star className="text-yellow-500" size={14} />
            <span>{challenge.xp_reward} XP</span>
          </div>
          <div className="flex items-center gap-1">
            <Trophy className="text-yellow-500" size={14} />
            <span>{challenge.coin_reward} 金币</span>
          </div>
          {challenge.time_limit_seconds && (
            <div className="flex items-center gap-1">
              <Clock size={14} />
              <span>{Math.floor(challenge.time_limit_seconds / 60)} 分钟</span>
            </div>
          )}
        </div>

        {/* 难度标签 */}
        <div className="flex items-center justify-between">
          <span className={`rounded-full px-3 py-1 text-xs font-medium ${config.color} ${config.bg}`}>
            {config.label}
          </span>

          {/* 最佳分数 */}
          {isCompleted && bestScore !== undefined && (
            <div className="flex items-center gap-1 text-sm font-medium text-green-600">
              <Trophy size={16} />
              <span>{bestScore} 分</span>
            </div>
          )}
        </div>
      </div>

      {/* 底部悬停提示 */}
      <div className="border-t border-gray-100 bg-gray-50 px-4 py-2 text-center text-xs text-gray-500 transition-colors group-hover:bg-blue-50 group-hover:text-blue-600">
        {isCompleted ? '再次挑战' : '开始挑战'}
      </div>
    </div>
  );
}

