import { NextRequest, NextResponse } from 'next/server';
import { openai } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    const { audioUrl } = await request.json();

    if (!audioUrl) {
      return NextResponse.json({ error: 'Missing audioUrl' }, { status: 400 });
    }

    // Fetch the audio file from the URL
    const response = await fetch(audioUrl);
    const audioBuffer = await response.arrayBuffer();

    // Create a proper File object for OpenAI
    const audioBlob = new Blob([audioBuffer], { type: 'audio/mp3' });
    const fileName = `audio-${Date.now()}.mp3`;
    const audioFile = new File([audioBlob], fileName, { type: 'audio/mp3' });

    // Transcribe using Whisper
    const transcription = await openai.audio.transcriptions.create({
      model: 'whisper-1',
      file: audioFile,
      language: 'ar', // Arabic
    });

    return NextResponse.json({ transcription: transcription.text });
  } catch (error) {
    console.error('Transcription error:', error);
    return NextResponse.json({ error: 'Transcription failed' }, { status: 500 });
  }
}
