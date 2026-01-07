import { NextRequest, NextResponse } from 'next/server';
import { getAdminStorage } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const userId = formData.get('userId') as string;

    if (!file || !userId) {
      return NextResponse.json({ error: 'Missing file or userId' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create storage reference using adminStorage bucket
    const adminStorage = getAdminStorage();
    const bucket = adminStorage.bucket();
    const fileName = `lectures/${userId}/${Date.now()}_${file.name}`;
    const fileUpload = bucket.file(fileName);
    
    // Upload file
    await fileUpload.save(buffer, {
      metadata: {
        contentType: file.type,
      },
    });
    
    // Get download URL using signed URL or make public
    await fileUpload.makePublic();
    const url = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

    // Get audio duration (approximate based on file size)
    // For accurate duration, you'd need to process the audio file server-side
    const duration = Math.ceil(file.size / (16000 * 60)); // Rough estimate: 16kbps = 2KB/min

    return NextResponse.json({ url, duration });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
