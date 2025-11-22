// 认证模态框组件
import { useState } from 'react';
import { X } from 'lucide-react';
import { signInWithEmail, signUpWithEmail, createGuestAccount } from '../../lib/auth';
import { useUserStore } from '../../lib/store/userStore';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'signin' | 'signup' | 'guest';
}

export default function AuthModal({ isOpen, onClose, defaultMode = 'guest' }: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup' | 'guest'>(defaultMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { setUser, setGuest } = useUserStore();

  if (!isOpen) return null;

  const handleGuestLogin = async () => {
    setLoading(true);
    setError('');

    const result = await createGuestAccount();
    
    if (result.success && result.user) {
      setUser(result.user);
      setGuest(true);
      onClose();
    } else {
      setError(result.error || '创建游客账号失败');
    }

    setLoading(false);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await signInWithEmail(email, password);
    
    if (result.success && result.user) {
      setUser(result.user);
      onClose();
    } else {
      setError(result.error || '登录失败');
    }

    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password.length < 6) {
      setError('密码至少需要 6 个字符');
      setLoading(false);
      return;
    }

    const result = await signUpWithEmail(email, password, username, displayName);
    
    if (result.success && result.user) {
      setUser(result.user);
      onClose();
    } else {
      setError(result.error || '注册失败');
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <X size={24} />
        </button>

        <div className="mb-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            {mode === 'guest' ? '开始免费试用' : mode === 'signin' ? '登录' : '注册'}
          </h2>
          <p className="mt-2 text-gray-600">
            {mode === 'guest' ? '无需注册，立即体验 30 天' : '欢迎来到 GameCode Lab'}
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {mode === 'guest' && (
          <div className="space-y-4">
            <div className="rounded-lg bg-blue-50 p-4">
              <h3 className="mb-2 font-semibold text-blue-900">🎮 游客试用包含：</h3>
              <ul className="space-y-1 text-sm text-blue-700">
                <li>✓ 完整课程体系访问</li>
                <li>✓ AI 助教实时辅导</li>
                <li>✓ 所有编程挑战</li>
                <li>✓ 作品保存与分享</li>
                <li>✓ 30 天全功能使用</li>
              </ul>
            </div>

            <button
              onClick={handleGuestLogin}
              disabled={loading}
              className="w-full rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 font-semibold text-white transition hover:from-blue-600 hover:to-purple-700 disabled:opacity-50"
            >
              {loading ? '正在创建...' : '立即开始免费试用'}
            </button>

            <div className="text-center text-sm text-gray-500">
              已有账号？
              <button
                onClick={() => setMode('signin')}
                className="ml-1 font-semibold text-blue-600 hover:text-blue-700"
              >
                立即登录
              </button>
            </div>
          </div>
        )}

        {mode === 'signin' && (
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">邮箱</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">密码</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? '登录中...' : '登录'}
            </button>

            <div className="text-center text-sm text-gray-500">
              还没有账号？
              <button
                type="button"
                onClick={() => setMode('signup')}
                className="ml-1 font-semibold text-blue-600 hover:text-blue-700"
              >
                立即注册
              </button>
              <span className="mx-2">或</span>
              <button
                type="button"
                onClick={() => setMode('guest')}
                className="font-semibold text-purple-600 hover:text-purple-700"
              >
                游客试用
              </button>
            </div>
          </form>
        )}

        {mode === 'signup' && (
          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">用户名</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">昵称</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="显示名称"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">邮箱</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">密码</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="至少 6 个字符"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? '注册中...' : '注册'}
            </button>

            <div className="text-center text-sm text-gray-500">
              已有账号？
              <button
                type="button"
                onClick={() => setMode('signin')}
                className="ml-1 font-semibold text-blue-600 hover:text-blue-700"
              >
                立即登录
              </button>
              <span className="mx-2">或</span>
              <button
                type="button"
                onClick={() => setMode('guest')}
                className="font-semibold text-purple-600 hover:text-purple-700"
              >
                游客试用
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

