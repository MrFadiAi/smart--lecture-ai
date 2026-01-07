import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Smart Lecture AI | تحويل المحاضرات إلى ملخصات ذكية',
  description: 'حوّل محاضراتك الصوتية إلى ملخصات، أسئلة، وخرائط ذهنية ذكية باستخدام الذكاء الاصطناعي',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        {children}
      </body>
    </html>
  );
}
