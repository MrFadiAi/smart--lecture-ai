import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb, getAdminAuth } from '@/lib/firebase-admin';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    // Verify user is authenticated
    await getAdminAuth().verifyIdToken(request.headers.get('Authorization') || '');

    // Fetch lectures from Firestore
    const adminDb = getAdminDb();
    const lecturesSnapshot = await adminDb
      .collection('lectures')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();

    const lectures = lecturesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt,
    }));

    return NextResponse.json(lectures);
  } catch (error) {
    console.error('Error fetching lectures:', error);
    return NextResponse.json({ error: 'Failed to fetch lectures' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, title, duration, category, content } = body;

    if (!userId || !title || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Verify user is authenticated
    await getAdminAuth().verifyIdToken(request.headers.get('Authorization') || '');

    // Save lecture to Firestore
    const adminDb = getAdminDb();
    const lectureRef = await adminDb.collection('lectures').add({
      userId,
      title,
      duration,
      category,
      content,
      createdAt: new Date().toISOString(),
    });

    // Update user's minutes used
    const currentMonth = new Date().toISOString().slice(0, 7);
    const usageRef = adminDb.collection('usage').doc(`${userId}_${currentMonth}`);
    const usageDoc = await usageRef.get();

    if (usageDoc.exists) {
      await usageRef.update({
        minutesUsed: (usageDoc.data()?.minutesUsed || 0) + duration,
      });
    } else {
      await usageRef.set({
        userId,
        month: currentMonth,
        minutesUsed: duration,
      });
    }

    // Update user document
    const userRef = adminDb.collection('users').doc(userId);
    const userDoc = await userRef.get();
    if (userDoc.exists) {
      await userRef.update({
        minutesUsed: (userDoc.data()?.minutesUsed || 0) + duration,
      });
    }

    return NextResponse.json({ id: lectureRef.id, success: true });
  } catch (error) {
    console.error('Error saving lecture:', error);
    return NextResponse.json({ error: 'Failed to save lecture' }, { status: 500 });
  }
}
