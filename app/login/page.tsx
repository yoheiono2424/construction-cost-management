'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/app/stores/authStore';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const success = await login(email, password);

    if (success) {
      // ログイン成功後、ユーザー情報を取得
      const user = useAuthStore.getState().user;

      // 社長の場合は承認待ちページへ、それ以外は工事一覧ページへ
      if (user?.role === '社長') {
        router.push('/approvals');
      } else {
        router.push('/projects');
      }
    } else {
      setError('メールアドレスまたはパスワードが正しくありません');
    }

    setIsLoading(false);
  };

  const fillTestAccount = (testEmail: string, testPassword: string) => {
    setEmail(testEmail);
    setPassword(testPassword);
    setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-[460px] w-full space-y-[26px] p-[26px] bg-white rounded-lg shadow">
        <div>
          <h2 className="text-center text-[19px] font-bold text-gray-900 whitespace-nowrap">
            建設業向け原価管理システム
          </h2>
          <p className="mt-[6px] text-center text-[11px] text-gray-600">
            アカウントにログインしてください
          </p>
        </div>

        <form className="mt-[26px] space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-[13px]">
            <div>
              <label htmlFor="email" className="block text-[11px] font-medium text-gray-700">
                メールアドレス
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1 block w-full px-[10px] py-[6px] border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@company.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-[11px] font-medium text-gray-700">
                パスワード
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="mt-1 block w-full px-[10px] py-[6px] border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-[11px] text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-[6px] px-[13px] border border-transparent rounded-md shadow-sm text-[11px] font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
          >
            {isLoading ? 'ログイン中...' : 'ログイン'}
          </button>

          <div className="mt-5 text-[11px] text-gray-600 bg-gray-50 p-[13px] rounded-md">
            <p className="font-semibold mb-[6px]">テスト用アカウント: <span className="text-[10px] font-normal text-gray-500">（クリックで自動入力）</span></p>
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => fillTestAccount('president@example.com', 'password')}
                className="w-full flex items-center p-[6px] rounded hover:bg-gray-100 transition-colors cursor-pointer text-left"
              >
                <span className="inline-block w-16 px-[6px] py-[2px] text-[10px] bg-purple-100 text-purple-800 rounded mr-[6px]">社長</span>
                president@example.com / password
              </button>
              <button
                type="button"
                onClick={() => fillTestAccount('director@example.com', 'password')}
                className="w-full flex items-center p-[6px] rounded hover:bg-gray-100 transition-colors cursor-pointer text-left"
              >
                <span className="inline-block w-16 px-[6px] py-[2px] text-[10px] bg-indigo-100 text-indigo-800 rounded mr-[6px]">常務</span>
                director@example.com / password
              </button>
              <button
                type="button"
                onClick={() => fillTestAccount('manager@example.com', 'password')}
                className="w-full flex items-center p-[6px] rounded hover:bg-gray-100 transition-colors cursor-pointer text-left"
              >
                <span className="inline-block w-16 px-[6px] py-[2px] text-[10px] bg-blue-100 text-blue-800 rounded mr-[6px]">部長</span>
                manager@example.com / password
              </button>
              <button
                type="button"
                onClick={() => fillTestAccount('admin@example.com', 'password')}
                className="w-full flex items-center p-[6px] rounded hover:bg-gray-100 transition-colors cursor-pointer text-left"
              >
                <span className="inline-block w-16 px-[6px] py-[2px] text-[10px] bg-green-100 text-green-800 rounded mr-[6px]">管理者</span>
                admin@example.com / password
              </button>
              <button
                type="button"
                onClick={() => fillTestAccount('registrar@example.com', 'password')}
                className="w-full flex items-center p-[6px] rounded hover:bg-gray-100 transition-colors cursor-pointer text-left"
              >
                <span className="inline-block w-16 px-[6px] py-[2px] text-[10px] bg-yellow-100 text-yellow-800 rounded mr-[6px]">案件登録者</span>
                registrar@example.com / password
              </button>
              <button
                type="button"
                onClick={() => fillTestAccount('member@example.com', 'password')}
                className="w-full flex items-center p-[6px] rounded hover:bg-gray-100 transition-colors cursor-pointer text-left"
              >
                <span className="inline-block w-16 px-[6px] py-[2px] text-[10px] bg-gray-100 text-gray-800 rounded mr-[6px]">現場メンバー</span>
                member@example.com / password
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}