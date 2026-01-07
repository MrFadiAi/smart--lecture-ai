'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { 
  BookOpen, 
  LogOut, 
  Upload, 
  Clock, 
  Download,
  ChevronDown,
  FileAudio,
  Sparkles,
} from 'lucide-react';

interface Lecture {
  id: string;
  title: string;
  duration: number;
  content: string;
  createdAt: string;
  category: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [usage, setUsage] = useState({ used: 0, limit: 30, plan: 'free' });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [expandedLecture, setExpandedLecture] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push('/auth/login');
        return;
      }
      setUser(user);
      await Promise.all([fetchLectures(user.uid), fetchUsage(user.uid)]);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  const fetchLectures = async (userId: string) => {
    try {
      const response = await fetch(`/api/lectures?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setLectures(data);
      }
    } catch (error) {
      console.error('Error fetching lectures:', error);
    }
  };

  const fetchUsage = async (userId: string) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const limits: Record<string, number> = { free: 30, student: 300, pro: 9999 };
        setUsage({
          used: userData.minutesUsed || 0,
          limit: limits[userData.plan] || 30,
          plan: userData.plan
        });
      }
    } catch (error) {
      console.error('Error fetching usage:', error);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && ['audio/mp3', 'audio/wav', 'audio/m4a'].includes(file.type)) {
      setUploadedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!uploadedFile || !user) return;
    setUploading(true);
    setProcessing(true);

    try {
      const formData = new FormData();
      formData.append('file', uploadedFile);
      formData.append('userId', user.uid);

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadRes.ok) throw new Error('Upload failed');
      const { url, duration } = await uploadRes.json();

      if (usage.used + duration > usage.limit) {
        alert('لقد تجاوزت الحد الشهري لخطةك');
        return;
      }

      const transcribeRes = await fetch('/api/transcribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audioUrl: url }),
      });

      if (!transcribeRes.ok) throw new Error('Transcription failed');
      const { transcription } = await transcribeRes.json();

      const summarizeRes = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcription }),
      });

      if (!summarizeRes.ok) throw new Error('Summarization failed');
      const result = await summarizeRes.json();

      const saveRes = await fetch('/api/lectures', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.uid,
          title: uploadedFile.name,
          duration,
          category: 'عام',
          content: JSON.stringify({ ...result, transcription }),
        }),
      });

      if (saveRes.ok) {
        await fetchLectures(user.uid);
        await fetchUsage(user.uid);
        setUploadedFile(null);
      }
    } catch (error) {
      console.error('Error processing lecture:', error);
      alert('حدث خطأ أثناء معالجة المحاضرة');
    } finally {
      setUploading(false);
      setProcessing(false);
    }
  };

  const parseContent = (content: string) => {
    try {
      return JSON.parse(content);
    } catch {
      return { summary: content, questions: [], mindmap: '' };
    }
  };

  const downloadText = (content: string, title: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <BookOpen className="w-8 h-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">Smart Lecture AI</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-600">مرحباً، {user?.email}</span>
              <button onClick={handleLogout} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline">تسجيل خروج</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Clock className="w-6 h-6 text-primary-600" />
              <h2 className="text-xl font-semibold text-gray-900">الاستخدام الشهري</h2>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${usage.plan === 'free' ? 'bg-gray-100 text-gray-600' : 'bg-primary-100 text-primary-600'}`}>
              {usage.plan === 'free' ? 'مجاني' : usage.plan === 'student' ? 'طالب' : 'محترف'}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
            <div className="bg-primary-600 h-4 rounded-full transition-all" style={{ width: `${Math.min((usage.used / usage.limit) * 100, 100)}%` }}></div>
          </div>
          <p className="text-gray-600">{usage.used} / {usage.limit} دقيقة</p>
        </div>

        <div className="card mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Upload className="w-6 h-6 text-primary-600" />
            رفع محاضرة جديدة
          </h2>
          
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center mb-4">
            <FileAudio className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <label className="cursor-pointer">
              <span className="text-primary-600 font-medium hover:underline">اختر ملف صوتي</span>
              <input type="file" accept="audio/mp3,audio/wav,audio/m4a" onChange={handleFileChange} className="hidden" />
            </label>
            <span className="text-gray-500"> أو اسحب الملف هنا</span>
            <p className="text-sm text-gray-500 mt-2">MP3, WAV, M4A (بحد أقصى 10 ميجابايت)</p>
          </div>

          {uploadedFile && (
            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl mb-4">
              <div className="flex items-center gap-3">
                <FileAudio className="w-8 h-8 text-primary-600" />
                <div>
                  <p className="font-medium text-gray-900">{uploadedFile.name}</p>
                  <p className="text-sm text-gray-500">{(uploadedFile.size / 1024 / 1024).toFixed(2)} ميجابايت</p>
                </div>
              </div>
              <button onClick={() => setUploadedFile(null)} className="text-gray-400 hover:text-gray-600">×</button>
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={!uploadedFile || uploading || processing}
            className="btn-primary w-full disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {uploading || processing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>{uploading ? 'جاري رفع الملف...' : 'جاري المعالجة...'}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>معالجة المحاضرة</span>
              </>
            )}
          </button>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-primary-600" />
            محاضراتي السابقة
          </h2>

          {lectures.length === 0 ? (
            <p className="text-gray-500 text-center py-8">لم تقم برفع أي محاضرات بعد</p>
          ) : (
            <div className="space-y-4">
              {lectures.map((lecture) => {
                const content = parseContent(lecture.content);
                return (
                  <div key={lecture.id} className="border border-gray-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setExpandedLecture(expandedLecture === lecture.id ? null : lecture.id)}
                      className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors text-right"
                    >
                      <div className="flex items-center gap-3">
                        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${expandedLecture === lecture.id ? 'rotate-180' : ''}`} />
                        <div>
                          <p className="font-medium text-gray-900">{lecture.title}</p>
                          <p className="text-sm text-gray-500">{lecture.createdAt?.slice(0, 10) || 'غير معروف'} • {lecture.duration} دقيقة</p>
                        </div>
                      </div>
                    </button>

                    {expandedLecture === lecture.id && (
                      <div className="p-4 border-t border-gray-200">
                        <div className="mb-4">
                          <h4 className="font-semibold text-gray-900 mb-2">📝 الملخص</h4>
                          <p className="text-gray-600 whitespace-pre-wrap">{content.summary || 'غير متوفر'}</p>
                        </div>

                        {content.questions && content.questions.length > 0 && (
                          <div className="mb-4">
                            <h4 className="font-semibold text-gray-900 mb-2">❓ الأسئلة</h4>
                            {content.questions.map((q: any, i: number) => (
                              <div key={i} className="bg-gray-50 p-3 rounded-lg mb-2">
                                <p className="font-medium text-gray-900">{q.question}</p>
                                <p className="text-gray-600">{q.answer}</p>
                              </div>
                            ))}
                          </div>
                        )}

                        {content.mindmap && (
                          <div className="mb-4">
                            <h4 className="font-semibold text-gray-900 mb🧠 الخريطة-2"> الذهنية</h4>
                            <p className="text-gray-600">{content.mindmap}</p>
                          </div>
                        )}

                        <button
                          onClick={() => downloadText(lecture.content, lecture.title)}
                          className="flex items-center gap-2 text-primary-600 hover:text-primary-700"
                        >
                          <Download className="w-5 h-5" />
                          <span>تحميل TXT</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {usage.plan === 'free' && (
          <div className="card mt-8 bg-gradient-to-r from-primary-500 to-primary-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">احصل على المزيد</h3>
                <p className="text-primary-100">ترقية إلى خطة طالب أو محترف للحصول على دقائق إضافية</p>
              </div>
              <Link href="/pricing" className="bg-white text-primary-600 px-6 py-3 rounded-xl font-semibold hover:bg-primary-50 transition-colors">
                اعرض الخطط
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
