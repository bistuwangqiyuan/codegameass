import { useUserStore } from '../../lib/store/userStore';
import { useUIStore } from '../../lib/store/uiStore';
import { signOut, isDemoAccount } from '../../lib/auth';

export default function NavAuthButton() {
  const { user, isAuthenticated, logout } = useUserStore();
  const { openAuthModal } = useUIStore();

  const handleLogout = async () => {
    await signOut();
    logout();
  };

  if (isAuthenticated && user) {
    return (
      <div className="flex items-center gap-2">
        {isDemoAccount(user) && (
          <span className="rounded-full bg-bistu-accent/10 px-2 py-0.5 text-xs font-medium text-bistu-accent">
            测试账号
          </span>
        )}
        <a
          href="/learn"
          className="hidden rounded-lg bg-bistu-primary/10 px-3 py-1.5 text-sm font-medium text-bistu-primary no-underline hover:bg-bistu-primary/20 sm:inline-block"
        >
          {user.display_name || user.username}
        </a>
        <button
          onClick={handleLogout}
          className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-600 transition hover:bg-gray-50"
        >
          退出
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => openAuthModal('demo')}
      className="btn-bistu-primary px-4 py-2 text-sm"
    >
      登录 / 测试账号
    </button>
  );
}
