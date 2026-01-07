'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signInWithEmailAndPassword, onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { BookOpen, Mail, Lock, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push('/dashboard');
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(getErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  const getErrorMessage = (code: string): string => {
    const messages: Record<string, string> = {
      'auth/user-not-found': 'الحساب غير موجود',
      'auth/wrong-password': 'كلمة المرور غير صحيحة',
      'auth/invalid-email': 'البريد الإلكتروني غير صالح',
      'auth/too-many-requests': 'عدد محاولات كثيرة، حاول لاحقاً',
    };
    return messages[code] || 'حدث خطأ، حاول مجدداً';
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <BookOpen className="w-10 h-10 text-primary-600" />
          <span className="text-2xl font-bold text-gray-900">Smart Lecture AI</span>
        </Link>

        {/* Form Card */}
        <div className="card">
          <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">
            مرحباً بعودتك
          </h1>
          <p className="text-center text-gray-600 mb-8">
            سجّل دخولك للوصول إلى محاضراتك
          </p>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 text-red-600 p-4 rounded-xl mb-6">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pr-12"
                  placeholder="أدخل بريدك الإلكتروني"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                كلمة المرور
              </label>
              <div className="relative">
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pr-12"
                  placeholder="أدخل كلمة المرور"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              ليس لديك حساب؟{' '}
              <Link href="/auth/signup" className="text-primary-600 font-semibold hover:underline">
                أنشئ حساباً الآن
              </Link>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <Link 
          href="/" 
          className="block text-center mt-6 text-gray-600 hover:text-gray-900"
        >
          ← العودة للرئيسية
        </Link>
      </div>
    </div>
  );
}
