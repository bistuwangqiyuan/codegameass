// Zustand 状态管理 - 用户状态
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserProfile } from '../supabase';

interface UserState {
  user: UserProfile | null;
  isGuest: boolean;
  isAuthenticated: boolean;
  loading: boolean;
  
  // Actions
  setUser: (user: UserProfile | null) => void;
  setGuest: (isGuest: boolean) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
  
  // 游戏化状态
  addXP: (amount: number) => void;
  addCoins: (amount: number) => void;
  updateLevel: (level: number) => void;
  incrementStreak: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isGuest: false,
      isAuthenticated: false,
      loading: true,

      setUser: (user) => set({ 
        user, 
        isAuthenticated: !!user,
        isGuest: user?.is_guest || false 
      }),
      
      setGuest: (isGuest) => set({ isGuest }),
      
      setLoading: (loading) => set({ loading }),
      
      logout: () => set({ 
        user: null, 
        isAuthenticated: false, 
        isGuest: false 
      }),

      addXP: (amount) => set((state) => {
        if (!state.user) return state;
        return {
          user: {
            ...state.user,
            experience_points: state.user.experience_points + amount
          }
        };
      }),

      addCoins: (amount) => set((state) => {
        if (!state.user) return state;
        return {
          user: {
            ...state.user,
            coins: state.user.coins + amount
          }
        };
      }),

      updateLevel: (level) => set((state) => {
        if (!state.user) return state;
        return {
          user: {
            ...state.user,
            level
          }
        };
      }),

      incrementStreak: () => set((state) => {
        if (!state.user) return state;
        return {
          user: {
            ...state.user,
            streak_days: state.user.streak_days + 1
          }
        };
      })
    }),
    {
      name: 'gamecode-user-storage'
    }
  )
);

