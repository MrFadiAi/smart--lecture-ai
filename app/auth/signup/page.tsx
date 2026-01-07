'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, getFirestore } from 'firebase/firestore';
import { auth } from '@/lib/firebase';
import { BookOpen, Mail, Lock, AlertCircle } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) router.push('/dashboard');
    });
    return () => unsubscribe();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('كلمتا المرور غير متطابقتين');
      return;
    }
    if (password.length < 6) {
      setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      return;
    }
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const db = getFirestore();
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email,
        plan: 'free',
        minutesUsed: 0,
        createdAt: new Date().toISOString(),
      });
      const currentMonth = new Date().toISOString().slice(0, 7);
      await setDoc(doc(db, 'usage', `${userCredential.user.uid}_${currentMonth}`), {
        userId: userCredential.user.uid,
        month: currentMonth,
        minutesUsed: 0,
      });
      router.push('/dashboard');
    } catch (err: any) {
      const messages: Record<string, string> = {
        'auth/email-already-in-use': 'البريد الإلكتروني مسجل بالفعل',
      };
      setError(messages[err.code] || 'حدث خطأ، حاول مجدداً');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <BookOpen className="w-10 h-10 text-primary-600" />
          <span className="text-2xl font-bold text-gray-900">Smart Lecture AI</span>
        </Link>
        <div className="card">
          <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">أنشئ حسابك المجاني</h1>
          <p className="text-center text-gray-600 mb-8">احصل على 30 دقيقة مجانية لتجربة المنصة</p>
          {error && (
            <div className="flex items-center gap-2 bg-red-50 text-red-600 p-4 rounded-xl mb-6">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">البريد الإلكتروني</label>
              <div className="relative">
                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field pr-12" placeholder="أدخل بريدك الإلكتروني" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">كلمة المرور</label>
              <div className="relative">
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-field pr-12" placeholder="أنشئ كلمة مرور" required minLength={6} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">تأكيد كلمة المرور</label>
              <div className="relative">
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="input-field pr-12" placeholder="أعد إدخال كلمة المرور" required />
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">{loading ? 'جاري إنشاء الحساب...' : 'إنشاء حساب'}</button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-gray-600">لديك حساب بالفعل؟ <Link href="/auth/login" className="text-primary-600 font-semibold hover:underline">سجل دخولك</Link></p>
          </div>
        </div>
        <Link href="/" className="block text-center mt-6 text-gray-600 hover:text-gray-900">← العودة للرئيسية</Link>
      </div>
    </div>
  );
}
