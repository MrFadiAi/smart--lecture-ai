import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { transcription } = await request.json();

    if (!transcription) {
      return NextResponse.json({ error: 'Missing transcription' }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `
    أنت مساعد ذكي متخصص في تلخيص المحاضرات التعليمية.
    
    المطلوب:
    1. قم بتلخيص المحاضرة بشكل شامل ومنظم
    2. استخرج الأسئلة المهمة مع إجاباتها  
    3. أنشئ وصف للخرطة الذهنية
    
    نص المحاضرة:
    ${transcription}
    
    أرجع الإجابة بتنسيق JSON فقط هكذا:
    {
      "summary": "ملخص شامل للمحاضرة",
      "questions": [{"question": "السؤال؟", "answer": "الإجابة"}],
      "mindmap": "وصف الخريطة الذهنية"
    }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    let parsed;
    
    if (jsonMatch) {
      try {
        parsed = JSON.parse(jsonMatch[0]);
      } catch {
        parsed = { summary: text, questions: [], mindmap: '' };
      }
    } else {
      parsed = { summary: text, questions: [], mindmap: '' };
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error('Summarization error:', error);
    return NextResponse.json({ error: 'Summarization failed' }, { status: 500 });
  }
}
