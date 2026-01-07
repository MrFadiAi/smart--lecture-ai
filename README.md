# 🎓 Smart Lecture AI

تحويل محاضراتك الصوتية إلى ملخصات، أسئلة، وخرائط ذهنية ذكية باستخدام الذكاء الاصطناعي.

[![Deploy on Vercel](https://vercel.com/button)](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=smart-lecture-ai)

## 📋 المحتوى

- [المميزات](#-المميزات)
- [التقنيات المستخدمة](#-التقنيات-المستخدمة)
- [البدء](#-البدء)
- [إعداد Firebase](#-إعداد-firebase)
- [إعداد OpenAI Whisper](#-إعداد-openai-whisper)
- [إعداد Google Gemini](#-إعداد-google-gemini)
- [إعداد Stripe](#-إعداد-stripe)
- [النشر على Vercel](#-النشر-on-vercel)
- [هيكل المشروع](#-هيكل-المشروع)
- [خطط الاستخدام](#-خطط-الاستخدام)
- [حل المشاكل](#-حل-المشاكل)
- [المساهمة](#-المساهمة)
- [الترخيص](#-الترخيص)

---

## 🎯 المميزات

| الميزة | الوصف |
|--------|-------|
| 📝 **ملخصات ذكية** | احصل على ملخص شامل لمحاضراتك خلال دقائق باستخدام Gemini |
| ❓ **أسئلة امتحانية** | أسئلة تجريبية مع إجاباتها لاختبار فهمك للمحتوى |
| 🧠 **خرائط ذهنية** | تنظيم بصري للمعلومات لتسهيل الحفظ والمراجعة |
| 💾 **حفظ المحاضرات** | احتفظ بجميع محاضراتك ونتائجها في مكان واحد |
| 🔐 **تسجيل آمن** | Firebase Authentication |
| 📊 **تتبع الاستخدام** | دقائق شهرية لكل خطة |
| 💳 **دفع آمن** | Stripe Checkout |

---

## 🛠 التقنيات المستخدمة

| التقنية | الاستخدام |
|---------|----------|
| **Next.js 14** | Frontend & API Routes |
| **React 18** | UI Components |
| **Tailwind CSS** | Styling (Arabic RTL) |
| **Firebase** | Auth, Firestore, Storage |
| **OpenAI Whisper** | Transcription (Arabic) |
| **Google Gemini** | Summarization & Q&A |
| **Stripe** | Payments |
| **Vercel** | Deployment |

---

## 🚀 البدء

### المتطلبات

- Node.js 18+
- Git
- Firebase Account
- OpenAI API Key
- Google Gemini API Key
- Stripe Account

### استنساخ المشروع

```bash
# استنسخ المشروع
git clone https://github.com/YOUR_USERNAME/smart-lecture-ai.git
cd smart-lecture-ai

# تثبيت الاعتماديات
npm install
```

### ملف البيئة

```bash
# نسخ ملف البيئة
cp .env.local.example .env.local

# تعديل ملف .env.local بالمفاتيح الخاصة بك
nano .env.local
```

---

## 🔥 إعداد Firebase

### الخطوة 1: إنشاء مشروع Firebase

1. اذهب إلى [Firebase Console](https://console.firebase.google.com)
2. اضغط "Add project"
3. أدخل اسم المشروع: `smart-lecture-ai`
4. تفعيل Google Analytics (اختياري)
5. انتظر حتى ينتهي الإنشاء

### الخطوة 2: تفعيل Authentication

1. في Firebase Console، اذهب إلى **Authentication**
2. اضغط "Get started"
3. اذهب إلى **Sign-in method**
4. فعّل **Email/Password**
5. اضغط "Save"

### الخطوة 3: تفعيل Firestore Database

1. اذهب إلى **Firestore Database**
2. اضغط "Create database"
3. اختر موقع قريب منك
4. ابدأ في **Start in test mode** (للتطوير)
5. اضغط "Enable"

### الخطوة 4: تفعيل Storage

1. اذهب إلى **Storage**
2. اضغط "Get started"
3. ابدأ في **Start in test mode** (للتطوير)
4. اضغط "Done"

### الخطوة 5: الحصول على إعدادات المشروع

1. اذهب إلى **Project Settings** (أيقونة الترس ⚙️)
2. اذهب إلى **Your apps** → **Web app** (</>)
3. سجل اسم التطبيق
4. انسخ إعدادات Firebase

### الخطوة 6: إعداد Admin SDK

1. في Project Settings → **Service accounts**
2. اضغط "Generate new private key"
3. ستحصل على ملف JSON
4. أضف القيم لـ `.env.local`:

```env
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@YOUR_PROJECT.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY...\n-----END PRIVATE KEY-----"
```

---

## 🎤 إعداد OpenAI Whisper

### إنشاء حساب OpenAI

1. اذهب إلى [OpenAI Platform](https://platform.openai.com)
2. سجل دخولك أو أنشئ حساب
3. اذهب إلى [API Keys](https://platform.openai.com/api-keys)
4. اضغط "Create new secret key"
5. انسخ المفتاح وأضفه لـ `.env.local`:

```env
OPENAI_API_KEY=sk-your_openai_api_key_here
```

**ملاحظة:** Whisper يدعم اللغة العربية بشكل ممتاز

---

## 🧠 إعداد Google Gemini

### إنشاء حساب Google AI

1. اذهب إلى [Google AI Studio](https://aistudio.google.com)
2. سجل دخولك بحساب Google
3. اذهب إلى [API Keys](https://aistudio.google.com/app/apikey)
4. اضغط "Create API Key"
5. أضفه لـ `.env.local`:

```env
GEMINI_API_KEY=AIzaSyYourGeminiKeyHere
```

---

## 💳 إعداد Stripe

### إنشاء حساب Stripe

1. اذهب إلى [Stripe Dashboard](https://dashboard.stripe.com)
2. سجل حسابك

### إعداد المنتجات

1. اذهب إلى **Products**
2. أنشئ 3 منتجات:

| المنتج | السعر | Price ID |
|--------|-------|----------|
| Free | $0/month | null |
| Student | $9.99/month | `price_student_xxx` |
| Pro | $19.99/month | `price_pro_xxx` |

### الحصول على مفاتيح API

1. اذهب إلى **Developers** → **API keys**
2. انسخ المفاتيح:

```env
STRIPE_SECRET_KEY=sk_test_your_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_secret
```

### إعداد Webhook

1. اذهب إلى **Developers** → **Webhooks**
2. أضف endpoint: `https://YOUR_DOMAIN/api/stripe/webhook`
3. اختر events:
   - `checkout.session.completed`
   - `customer.subscription.updated`

---

## 🚀 النشر على Vercel

### الطريقة 1: من GitHub

1. ارفع المشروع:
```bash
git add .
git commit -m "Initial commit: Smart Lecture AI"
git push origin main
```

2. اذهب إلى [Vercel Dashboard](https://vercel.com/dashboard)
3. اضغط "Add New Project"
4. اختر Repository
5. أضف Environment Variables
6. اضغط "Deploy"

### الطريقة 2: من CLI

```bash
# تسجيل دخول
vercel login

# نشر
vercel --prod
```

### Environment Variables المطلوبة

| Variable | Required |
|----------|----------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | ✅ |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | ✅ |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | ✅ |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | ✅ |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | ✅ |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | ✅ |
| `FIREBASE_ADMIN_CLIENT_EMAIL` | ✅ |
| `FIREBASE_ADMIN_PRIVATE_KEY` | ✅ |
| `OPENAI_API_KEY` | ✅ |
| `GEMINI_API_KEY` | ✅ |
| `STRIPE_SECRET_KEY` | ✅ |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | ✅ |
| `STRIPE_WEBHOOK_SECRET` | ✅ |
| `NEXT_PUBLIC_APP_URL` | ✅ |

---

## 📁 هيكل المشروع

```
smart-lecture-ai/
├── app/
│   ├── page.tsx              # الصفحة الرئيسية (Landing)
│   ├── layout.tsx            # Layout رئيسي (RTL + Font)
│   ├── globals.css           # أنماط Tailwind + CSS
│   ├── auth/
│   │   ├── login/            # صفحة تسجيل الدخول
│   │   └── signup/           # صفحة إنشاء حساب
│   ├── dashboard/            # لوحة التحكم
│   │   └── page.tsx          # Dashboard الرئيسي
│   └── api/
│       ├── upload/           # رفع الملفات لـ Firebase Storage
│       ├── transcribe/       # OpenAI Whisper
│       ├── summarize/        # Google Gemini
│       ├── lectures/         # Firestore CRUD
│       └── stripe/
│           ├── checkout/     # إنشاء Checkout Session
│           └── webhook/      # معالجة Stripe Webhooks
├── lib/
│   ├── firebase.ts           # Firebase Client SDK
│   ├── firebase-admin.ts     # Firebase Admin SDK
│   ├── openai.ts             # OpenAI Whisper
│   ├── gemini.ts             # Google Gemini
│   └── stripe.ts             # Stripe Config
├── .env.local.example        # قالب المتغيرات
├── firebase.json             # Firebase Config
├── firestore.rules           # Firestore Security Rules
├── storage.rules             # Storage Security Rules
├── tailwind.config.ts        # Tailwind Config
├── next.config.js            # Next.js Config
├── package.json              # Dependencies
└── README.md                 # هذا الملف
```

---

## 💰 خطط الاستخدام

| الميزة | مجاني | طالب | محترف |
|--------|:-----:|:----:|:-----:|
| **دقائق شهرية** | 30 | 300 | ∞ |
| **ملخصات** | ✅ | ✅ | ✅ |
| **أسئلة** | ✅ | ✅ | ✅ |
| **خرائط ذهنية** | ✅ | ✅ | ✅ |
| **السعر** | $0 | $9.99 | $19.99 |

---

## 🧪 الاختبار المحلي

```bash
# تشغيل خادم التطوير
npm run dev

# فتح http://localhost:3000
```

---

## 🔧 الأوامر المفيدة

```bash
# تطوير محلي
npm run dev

# بناء للإنتاج
npm run build

# تشغيل الإنتاج المحلي
npm start

# فحص الأخطاء
npm run lint
```

---

## 🐛 حل المشاكل

### Firebase Auth Error
- تأكد من تفعيل Email/Password في Firebase Console
- تأكد من صحة API keys في .env.local

### OpenAI Whisper Error
- تأكد من وجود OPENAI_API_KEY
- تأكد من أن المفتاح صحيح

### Stripe Webhook Error
- تأكد من إضافة Webhook URL في Stripe Dashboard
- تأكد من STRIPE_WEBHOOK_SECRET

### Build Error
```bash
rm -rf .next && npm run build
```

---

## 📝 قواعد الأمان

### Firestore Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /lectures/{lectureId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    match /usage/{usageId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

### Storage Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /lectures/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

## 🤝 المساهمة

1. Fork المشروع
2. أنشئ فرع جديد: `git checkout -b feature/amazing-feature`
3. Commit تغييراتك: `git commit -m 'Add amazing feature'`
4. Push للفرع: `git push origin feature/amazing-feature`
5. افتح Pull Request

---

## 📄 الترخيص

MIT License - انظر ملف [LICENSE](LICENSE) للمزيد من التفاصيل.

---

<div align="center">

### 🎓 Made with ❤️ for students everywhere

**Smart Lecture AI** © 2024

</div>
