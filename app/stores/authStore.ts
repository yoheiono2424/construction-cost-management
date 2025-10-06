import { create } from 'zustand';

type StaffRole = '社長' | '常務' | '管理部長' | '経理' | 'メンバー';

interface User {
  id: string;
  email: string;
  name: string;
  role: StaffRole;
  department?: '建設' | '経理';
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
    // テストアカウント（後でSupabaseに置き換え）
    const testAccounts = [
      {
        email: 'president@example.com',
        password: 'password',
        user: {
          id: '1',
          email: 'president@example.com',
          name: '山田太郎',
          role: '社長' as StaffRole,
          department: '建設' as const,
        },
      },
      {
        email: 'director@example.com',
        password: 'password',
        user: {
          id: '2',
          email: 'director@example.com',
          name: '佐藤次郎',
          role: '常務' as StaffRole,
          department: '建設' as const,
        },
      },
      {
        email: 'manager@example.com',
        password: 'password',
        user: {
          id: '3',
          email: 'manager@example.com',
          name: '鈴木三郎',
          role: '管理部長' as StaffRole,
          department: '建設' as const,
        },
      },
      {
        email: 'accounting@example.com',
        password: 'password',
        user: {
          id: '4',
          email: 'accounting@example.com',
          name: '田中花子',
          role: '経理' as StaffRole,
          department: '経理' as const,
        },
      },
      {
        email: 'member@example.com',
        password: 'password',
        user: {
          id: '5',
          email: 'member@example.com',
          name: '高橋五郎',
          role: 'メンバー' as StaffRole,
          department: '建設' as const,
        },
      },
    ];

    const account = testAccounts.find(
      (acc) => acc.email === email && acc.password === password
    );

    if (account) {
      set({
        user: account.user,
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