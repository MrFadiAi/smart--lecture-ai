'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { 
  BookOpen, 
  LogOut, 
  Menu,
  X
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  const features = [
    { icon: '📝', title: 'ملخصات ذكية', description: 'احصل على ملخص شامل ومنظم لمحاضراتك خلال دقائق' },
    { icon: '❓', title: 'أسئلة امتحانية', description: 'أسئلة تجريبية مع إجاباتها لاختبار فهمك للمحتوى' },
    { icon: '🧠', title: 'خرائط ذهنية', description: 'تنظيم بصري للمعلومات لتسهيل الحفظ والمراجعة' },
    { icon: '💾', title: 'حفظ المحاضرات', description: 'احتفظ بجميع محاضراتك ونتائجها في مكان واحد' }
  ];

  const howItWorks = [
    { step: '1', title: 'ارفع المحاضرة', desc: 'حمّل ملف الصوت الخاص بك' },
    { step: '2', title: 'اختر المخرجات', desc: 'حدد نوع المحتوى الذي تريده' },
    { step: '3', title: 'احصل على النتائج', desc: 'تلقي الملخص والأسئلة فوراً' }
  ];

  const targetAudience = ['الطلاب', 'الأساتذة', 'الجامعات', 'المنصات التعليمية'];

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <BookOpen className="w-8 h-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">Smart Lecture AI</span>
            </div>

            <div className="hidden md:flex items-center gap-4">
              {user ? (
                <>
                  <Link href="/dashboard" className="btn-primary">لوحة التحكم</Link>
                  <button onClick={handleLogout} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                    <LogOut className="w-5 h-5" />
                    <span>تسجيل خروج</span>
                  </button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" className="text-gray-600 hover:text-gray-900 font-medium">تسجيل الدخول</Link>
                  <Link href="/auth/signup" className="btn-primary">ابدأ مجاناً</Link>
                </>
              )}
            </div>

            <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 py-4 px-4">
            <div className="flex flex-col gap-4">
              {user ? (
                <>
                  <Link href="/dashboard" className="btn-primary text-center">لوحة التحكم</Link>
                  <button onClick={handleLogout} className="btn-secondary">تسجيل خروج</button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" className="text-center py-2 text-gray-600">تسجيل الدخول</Link>
                  <Link href="/auth/signup" className="btn-primary text-center">ابدأ مجاناً</Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <span>🎓</span>
            <span>الذكاء الاصطناعي لطلاب المستقبل</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            حوّل محاضراتك الصوتية إلى
            <span className="text-primary-600"> محتوى ذكي </span>
            خلال دقائق
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
            منصة متطورة لتحويل المحاضرات الصوتية إلى ملخصات ذكية، أسئلة امتحانية، وخرائط ذهنية باستخدام أحدث تقنيات الذكاء الاصطناعي
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup" className="btn-primary text-lg">🚀 ابدأ مجاناً الآن</Link>
            <Link href="#how-it-works" className="btn-secondary text-lg">شاهد كيف يعمل</Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">مميزات المنصة</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            كل ما تحتاجه لتحسين فهمك للمحاضرات وزيادة إنتاجيتك الدراسية
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="card hover:shadow-xl transition-shadow">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">كيف يعمل؟</h2>
          <p className="text-center text-gray-600 mb-12">ثلاث خطوات بسيطة لتحصل على ملخص محاضرتك</p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-20 h-20 bg-primary-600 text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4">{step.step}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Target Audience */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-8">لمن هذا المنتج؟</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {targetAudience.map((item, index) => (
              <span key={index} className="bg-white text-primary-600 px-6 py-3 rounded-full text-lg font-semibold">{item}</span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">جاهز لتحويل محاضراتك؟</h2>
          <p className="text-xl text-gray-600 mb-8">انضم الآن واحصل على 30 دقيقة مجانية لتجربة المنصة</p>
          <Link href="/auth/signup" className="btn-primary text-lg">أنشئ حسابك المجاني</Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-8 h-8 text-primary-400" />
              <span className="text-xl font-bold">Smart Lecture AI</span>
            </div>
            <p className="text-gray-400">© 2024 جميع الحقوق محفوظة</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
