// 认证模态框组件
import { useState, useEffect } from 'react';
import { X, GraduationCap, UserCog, Shield } from 'lucide-react';
import { signInWithEmail, signUpWithEmail, createGuestAccount, signInWithDemoAccount } from '../../lib/auth';
import { useUserStore } from '../../lib/store/userStore';
import { BRAND } from '../../lib/branding';
import { DEMO_ACCOUNTS, DEMO_PASSWORD, type DemoRole } from '../../lib/demo-accounts';
import ProgramBadge from './ProgramBadge';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'signin' | 'signup' | 'guest' | 'demo';
  onSuccess?: () => void;
}

const roleIcons = {
  student: GraduationCap,
  teacher: UserCog,
  admin: Shield,
};

export default function AuthModal({ isOpen, onClose, defaultMode = 'demo', onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup' | 'guest' | 'demo'>(defaultMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { setUser, setGuest } = useUserStore();

  useEffect(() => {
    if (isOpen) setMode(defaultMode);
  }, [isOpen, defaultMode]);

  if (!isOpen) return null;

  const handleSuccess = (user: NonNullable<Awaited<ReturnType<typeof signInWithEmail>>['user']>, guest = false) => {
    setUser(user);
    setGuest(guest);
    onClose();
    onSuccess?.();
  };

  const handleGuestLogin = async () => {
    setLoading(true);
    setError('');
    const result = await createGuestAccount();
    if (result.success && result.user) {
      handleSuccess(result.user, true);
    } else {
      setError(result.error || '创建游客账号失败');
    }
    setLoading(false);
  };

  const handleDemoLogin = async (role: DemoRole) => {
    setLoading(true);
    setError('');
    const result = await signInWithDemoAccount(role);
    if (result.success && result.user) {
      handleSuccess(result.user);
    } else {
      setError(result.error || '测试账号登录失败，请确认已在 Supabase 中创建测试账号');
    }
    setLoading(false);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await signInWithEmail(email, password);
    if (result.success && result.user) {
      handleSuccess(result.user);
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
      handleSuccess(result.user);
    } else {
      setError(result.error || '注册失败');
    }
    setLoading(false);
  };

  const tabs = [
    { id: 'demo' as const, label: '测试账号' },
    { id: 'guest' as const, label: '游客试用' },
    { id: 'signin' as const, label: '登录' },
    { id: 'signup' as const, label: '注册' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600">
          <X size={24} />
        </button>

        <div className="mb-4 text-center">
          <img src={BRAND.logo} alt={BRAND.university} className="mx-auto mb-3 h-12 w-12" />
          <h2 className="text-2xl font-bold text-bistu-primary">{BRAND.name}</h2>
          <div className="mt-2 flex justify-center"><ProgramBadge size="sm" /></div>
          <p className="mt-2 text-sm text-gray-600">{BRAND.subtitle}</p>
        </div>

        <div className="mb-4 flex gap-1 rounded-lg bg-gray-100 p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setMode(tab.id); setError(''); }}
              className={`flex-1 rounded-md py-2 text-xs font-medium transition sm:text-sm ${
                mode === tab.id ? 'bg-white text-bistu-primary shadow' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>
        )}

        {mode === 'demo' && (
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              使用以下公开测试账号，一键体验{BRAND.program} · {BRAND.programTag} 全部功能：
            </p>
            {DEMO_ACCOUNTS.map((account) => {
              const Icon = roleIcons[account.role];
              return (
                <div key={account.role} className="rounded-xl border border-bistu-primary/20 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <Icon className="text-bistu-primary" size={20} />
                    <span className="font-semibold text-gray-900">{account.roleLabel}测试账号</span>
                  </div>
                  <p className="mb-2 text-xs text-gray-500">{account.description}</p>
                  <div className="mb-3 rounded-lg bg-gray-50 p-2 font-mono text-xs text-gray-700">
                    <div>邮箱：{account.email}</div>
                    <div>密码：{DEMO_PASSWORD}</div>
                  </div>
                  <button
                    onClick={() => handleDemoLogin(account.role)}
                    disabled={loading}
                    className="w-full rounded-lg bg-bistu-primary py-2 text-sm font-semibold text-white transition hover:bg-bistu-primary-light disabled:opacity-50"
                  >
                    {loading ? '登录中...' : `一键登录（${account.roleLabel}）`}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {mode === 'guest' && (
          <div className="space-y-4">
            <div className="rounded-lg bg-bistu-primary/5 p-4">
              <h3 className="mb-2 font-semibold text-bistu-primary">游客试用包含：</h3>
              <ul className="space-y-1 text-sm text-gray-700">
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
              className="w-full rounded-lg bg-bistu-accent py-3 font-semibold text-white transition hover:bg-bistu-accent-light disabled:opacity-50"
            >
              {loading ? '正在创建...' : '立即开始游客试用'}
            </button>
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
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-bistu-primary focus:outline-none focus:ring-2 focus:ring-bistu-primary/20"
                placeholder="your@bistu.edu.cn"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">密码</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-bistu-primary focus:outline-none focus:ring-2 focus:ring-bistu-primary/20"
              />
            </div>
            <button type="submit" disabled={loading} className="btn-bistu-primary w-full disabled:opacity-50">
              {loading ? '登录中...' : '登录'}
            </button>
          </form>
        )}

        {mode === 'signup' && (
          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">用户名</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-bistu-primary focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">昵称</label>
              <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} required className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-bistu-primary focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">邮箱</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-bistu-primary focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">密码</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-bistu-primary focus:outline-none" placeholder="至少 6 个字符" />
            </div>
            <button type="submit" disabled={loading} className="btn-bistu-primary w-full disabled:opacity-50">
              {loading ? '注册中...' : '注册'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
