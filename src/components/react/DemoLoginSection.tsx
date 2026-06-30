import { signInWithDemoAccount } from '../../lib/auth';
import { DEMO_ACCOUNTS, DEMO_PASSWORD, type DemoRole } from '../../lib/demo-accounts';
import { useUserStore } from '../../lib/store/userStore';
import { useState } from 'react';
import { GraduationCap, UserCog, Shield } from 'lucide-react';

const roleIcons = { student: GraduationCap, teacher: UserCog, admin: Shield };

interface DemoLoginSectionProps {
  compact?: boolean;
  onSuccess?: () => void;
  variant?: 'default' | 'light';
}

export default function DemoLoginSection({ compact = false, onSuccess, variant = 'default' }: DemoLoginSectionProps) {
  const [loading, setLoading] = useState<DemoRole | null>(null);
  const [error, setError] = useState('');
  const { setUser } = useUserStore();

  const btnClass =
    variant === 'light'
      ? 'rounded-lg bg-white px-4 py-2 text-sm font-medium text-bistu-primary hover:bg-gray-100 disabled:opacity-50'
      : 'rounded-lg bg-bistu-primary px-4 py-2 text-sm font-medium text-white hover:bg-bistu-primary-light disabled:opacity-50';

  const handleLogin = async (role: DemoRole) => {
    setLoading(role);
    setError('');
    const result = await signInWithDemoAccount(role);
    if (result.success && result.user) {
      setUser(result.user);
      onSuccess?.();
      if (!onSuccess) window.location.href = '/learn';
    } else {
      setError(result.error || '登录失败，请运行数据库 migration 创建测试账号');
    }
    setLoading(null);
  };

  if (compact) {
    return (
      <div className="flex flex-wrap gap-2">
        {DEMO_ACCOUNTS.map((a) => (
          <button
            key={a.role}
            onClick={() => handleLogin(a.role)}
            disabled={!!loading}
            className={btnClass}
          >
            {loading === a.role ? '登录中...' : `${a.roleLabel}账号`}
          </button>
        ))}
        {error && <p className={`w-full text-sm ${variant === 'light' ? 'text-red-200' : 'text-red-600'}`}>{error}</p>}
      </div>
    );
  }

  return (
    <div>
      {error && <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>}
      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-bistu-primary/5">
            <tr>
              <th className="px-4 py-3 font-semibold text-bistu-primary">角色</th>
              <th className="px-4 py-3 font-semibold text-bistu-primary">邮箱</th>
              <th className="px-4 py-3 font-semibold text-bistu-primary">密码</th>
              <th className="px-4 py-3 font-semibold text-bistu-primary">操作</th>
            </tr>
          </thead>
          <tbody>
            {DEMO_ACCOUNTS.map((account) => {
              const Icon = roleIcons[account.role];
              return (
                <tr key={account.role} className="border-t border-gray-100">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Icon size={16} className="text-bistu-primary" />
                      <span className="font-medium">{account.roleLabel}</span>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">{account.description}</p>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">{account.email}</td>
                  <td className="px-4 py-3 font-mono text-xs">{DEMO_PASSWORD}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleLogin(account.role)}
                      disabled={!!loading}
                      className="rounded-lg bg-bistu-accent px-4 py-2 text-xs font-semibold text-white hover:bg-bistu-accent-light disabled:opacity-50"
                    >
                      {loading === account.role ? '登录中...' : '一键登录'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
