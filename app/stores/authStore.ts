import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'member';
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  login: async (email: string, password: string) => {
    // 仮の認証処理（後でSupabaseに置き換え）
    if (email === 'admin@example.com' && password === 'password') {
      set({
        user: {
          id: '1',
          email: 'admin@example.com',
          name: '管理者',
          role: 'admin',
        },
        isAuthenticated: true,
      });
      return true;
    } else if (email === 'user@example.com' && password === 'password') {
      set({
        user: {
          id: '2',
          email: 'user@example.com',
          name: 'メンバー',
          role: 'member',
        },
        isAuthenticated: true,
      });
      return true;
    }
    return false;
  },

  logout: () => {
    set({ user: null, isAuthenticated: false });
  },
}));