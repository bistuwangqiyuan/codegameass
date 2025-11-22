// 作品卡片组件
import { Heart, Eye, MessageCircle, Star, ExternalLink } from 'lucide-react';
import type { UserProject } from '../../lib/supabase';

interface ProjectCardProps {
  project: UserProject;
  onLike?: () => void;
  onView?: () => void;
  isLiked?: boolean;
}

export default function ProjectCard({ project, onLike, onView, isLiked = false }: ProjectCardProps) {
  return (
    <div
      className="group cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-white transition-all hover:border-blue-300 hover:shadow-xl"
      onClick={onView}
    >
      {/* 预览图 */}
      <div className="relative aspect-video overflow-hidden bg-gray-100">
        {project.thumbnail_url ? (
          <img
            src={project.thumbnail_url}
            alt={project.title}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-6xl">
            🎨
          </div>
        )}
        
        {/* AI 评分角标 */}
        {project.ai_score && (
          <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-black/70 px-2 py-1 text-xs font-medium text-white backdrop-blur">
            <Star size={12} className="fill-yellow-400 text-yellow-400" />
            <span>{project.ai_score}/100</span>
          </div>
        )}

        {/* 悬停查看按钮 */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
          <button className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 font-medium text-gray-900">
            <ExternalLink size={18} />
            查看详情
          </button>
        </div>
      </div>

      {/* 信息区 */}
      <div className="p-4">
        <h3 className="mb-2 line-clamp-1 text-lg font-bold text-gray-900">
          {project.title}
        </h3>
        
        {project.description && (
          <p className="mb-3 line-clamp-2 text-sm text-gray-600">
            {project.description}
          </p>
        )}

        {/* 标签 */}
        {project.tags && project.tags.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {project.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="rounded-full bg-blue-50 px-2 py-1 text-xs text-blue-600"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* AI 反馈 */}
        {project.ai_feedback && (
          <div className="mb-3 rounded-lg bg-purple-50 p-2 text-xs text-purple-700">
            <div className="mb-1 flex items-center gap-1 font-medium">
              <Star size={12} />
              <span>AI 点评</span>
            </div>
            <p className="line-clamp-2">{project.ai_feedback}</p>
          </div>
        )}

        {/* 互动数据 */}
        <div className="flex items-center justify-between border-t border-gray-100 pt-3 text-sm text-gray-500">
          <div className="flex gap-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onLike?.();
              }}
              className={`flex items-center gap-1 transition ${
                isLiked ? 'text-red-500' : 'hover:text-red-500'
              }`}
            >
              <Heart size={16} className={isLiked ? 'fill-red-500' : ''} />
              <span>{project.likes_count}</span>
            </button>

            <div className="flex items-center gap-1">
              <Eye size={16} />
              <span>{project.views_count}</span>
            </div>

            <div className="flex items-center gap-1">
              <MessageCircle size={16} />
              <span>{project.comments_count}</span>
            </div>
          </div>

          <span className="text-xs text-gray-400">
            {new Date(project.created_at).toLocaleDateString('zh-CN')}
          </span>
        </div>
      </div>
    </div>
  );
}

