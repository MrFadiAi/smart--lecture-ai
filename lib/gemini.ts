import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generateSummary(transcription: string): Promise<string> {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const prompt = `
  أنت مساعد ذكي متخصص في تلخيص المحاضرات التعليمية.
  
  المطلوب:
  1. قم بتلخيص المحاضرة بشكل شامل ومنظم
  2. استخرج الأسئلة المهمة مع إجاباتها
  3. أنشئ خريطة ذهنية للمحتوى
  
  نص المحاضرة:
  ${transcription}
  
  أرجع الإجابة بتنسيق JSON فقط هكذا:
  {
    "summary": "ملخص شامل للمحاضرة",
    "questions": [
      {"question": "السؤال؟", "answer": "الإجابة"}
    ],
    "mindmap": "رابط أو وصف للخرطة الذهنية"
  }
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  
  // Extract JSON from response
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return jsonMatch[0];
  }
  return text;
}

export async function generateMindMap(summary: string): Promise<string> {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  
  const prompt = `
  أنشئ خريطة ذهنية نصية لهذا الملخص:
  ${summary}
  
  استخدم تنسيق Markdown مع روابط.
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}
