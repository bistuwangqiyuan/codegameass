import { useEffect } from 'react';
import AuthModal from './AuthModal';
import AIAssistant from './AIAssistant';
import { useUIStore } from '../../lib/store/uiStore';
import { getCurrentUserProfile } from '../../lib/auth';
import { useUserStore } from '../../lib/store/userStore';

export default function AppProviders() {
  const { authModalOpen, authMode, aiAssistantOpen, closeAuthModal, closeAIAssistant, openAuthModal, openAIAssistant } = useUIStore();
  const { setUser, setLoading } = useUserStore();

  useEffect(() => {
    getCurrentUserProfile().then((profile) => {
      if (profile) setUser(profile);
      setLoading(false);
    });

    const handleOpenAuth = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      openAuthModal(detail?.mode ?? 'demo');
    };
    const handleOpenAI = () => openAIAssistant();

    window.addEventListener('open-auth-modal', handleOpenAuth);
    window.addEventListener('open-ai-assistant', handleOpenAI);

    return () => {
      window.removeEventListener('open-auth-modal', handleOpenAuth);
      window.removeEventListener('open-ai-assistant', handleOpenAI);
    };
  }, [openAuthModal, openAIAssistant, setUser, setLoading]);

  return (
    <>
      <AuthModal
        isOpen={authModalOpen}
        onClose={closeAuthModal}
        defaultMode={authMode === 'demo' ? 'demo' : authMode}
      />
      <AIAssistant isOpen={aiAssistantOpen} onClose={closeAIAssistant} />
    </>
  );
}

export function dispatchOpenAuth(mode: 'signin' | 'signup' | 'guest' | 'demo' = 'demo') {
  window.dispatchEvent(new CustomEvent('open-auth-modal', { detail: { mode } }));
}

export function dispatchOpenAI() {
  window.dispatchEvent(new CustomEvent('open-ai-assistant'));
}
