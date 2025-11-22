// 课程卡片组件
import { Lock, CheckCircle, Clock } from 'lucide-react';
import type { CourseModule } from '../../lib/supabase';

interface CourseCardProps {
  module: CourseModule;
  progress?: number;
  isLocked?: boolean;
  onClick?: () => void;
}

export default function CourseCard({ module, progress = 0, isLocked = false, onClick }: CourseCardProps) {
  const difficultyColors = {
    beginner: 'bg-green-100 text-green-700',
    intermediate: 'bg-yellow-100 text-yellow-700',
    advanced: 'bg-red-100 text-red-700'
  };

  const difficultyLabels = {
    beginner: '入门',
    intermediate: '中级',
    advanced: '高级'
  };

  return (
    <div
      onClick={!isLocked ? onClick : undefined}
      className={`group relative overflow-hidden rounded-xl bg-white p-6 shadow-lg transition-all hover:shadow-xl ${
        isLocked ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:-translate-y-1'
      }`}
    >
      {/* 背景渐变 */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          background: `linear-gradient(135deg, ${module.color || '#3b82f6'} 0%, transparent 100%)`
        }}
      />

      {/* 锁定标识 */}
      {isLocked && (
        <div className="absolute right-4 top-4">
          <Lock className="text-gray-400" size={24} />
        </div>
      )}

      {/* 完成标识 */}
      {progress === 100 && !isLocked && (
        <div className="absolute right-4 top-4">
          <CheckCircle className="text-green-500" size={24} />
        </div>
      )}

      <div className="relative">
        {/* 图标 */}
        <div className="mb-4 text-4xl">{module.icon}</div>

        {/* 标题和描述 */}
        <h3 className="mb-2 text-xl font-bold text-gray-900">{module.title}</h3>
        <p className="mb-4 line-clamp-2 text-sm text-gray-600">{module.description}</p>

        {/* 元数据 */}
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className={`rounded-full px-3 py-1 text-xs font-medium ${difficultyColors[module.difficulty]}`}>
            {difficultyLabels[module.difficulty]}
          </span>
          {module.estimated_hours && (
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <Clock size={14} />
              {module.estimated_hours} 小时
            </span>
          )}
        </div>

        {/* 进度条 */}
        {progress > 0 && !isLocked && (
          <div>
            <div className="mb-1 flex items-center justify-between text-xs text-gray-600">
              <span>进度</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-4">
          {isLocked ? (
            <button
              disabled
              className="w-full rounded-lg bg-gray-300 py-2 text-sm font-medium text-gray-500"
            >
              未解锁
            </button>
          ) : progress === 100 ? (
            <button className="w-full rounded-lg bg-green-500 py-2 text-sm font-medium text-white transition hover:bg-green-600">
              复习课程
            </button>
          ) : progress > 0 ? (
            <button className="w-full rounded-lg bg-blue-500 py-2 text-sm font-medium text-white transition hover:bg-blue-600">
              继续学习
            </button>
          ) : (
            <button className="w-full rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 py-2 text-sm font-medium text-white transition hover:from-blue-600 hover:to-purple-700">
              开始学习
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

