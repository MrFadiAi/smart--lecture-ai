import OpenAI from 'openai';

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function transcribeAudio(audioBuffer: any): Promise<string> {
  const audioBlob = new Blob([audioBuffer], { type: 'audio/mp3' });
  const audioFile = new File([audioBlob], 'audio.mp3', { type: 'audio/mp3' });
  
  const response = await openai.audio.transcriptions.create({
    model: 'whisper-1',
    file: audioFile,
    language: 'ar', // Arabic
  });
  return response.text;
}
