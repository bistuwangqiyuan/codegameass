import { create } from 'zustand';

type AuthMode = 'signin' | 'signup' | 'guest' | 'demo';

interface UIState {
  authModalOpen: boolean;
  authMode: AuthMode;
  aiAssistantOpen: boolean;
  openAuthModal: (mode?: AuthMode) => void;
  closeAuthModal: () => void;
  openAIAssistant: () => void;
  closeAIAssistant: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  authModalOpen: false,
  authMode: 'demo',
  aiAssistantOpen: false,
  openAuthModal: (mode = 'demo') => set({ authModalOpen: true, authMode: mode }),
  closeAuthModal: () => set({ authModalOpen: false }),
  openAIAssistant: () => set({ aiAssistantOpen: true }),
  closeAIAssistant: () => set({ aiAssistantOpen: false }),
}));
