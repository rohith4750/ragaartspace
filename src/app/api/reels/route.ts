import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET(request: NextRequest) {
  try {
    const reels = await prisma.reel.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(reels);
  } catch (error: any) {
    console.error('Error fetching reels:', error);
    return NextResponse.json({ error: 'Failed to fetch reels' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, youtubeId, category, views } = body;

    if (!title || !description || !youtubeId || !category) {
      return NextResponse.json({ error: 'Missing required reel fields' }, { status: 400 });
    }

    // Helper to clean youtubeId if full URL is passed
    let cleanYoutubeId = youtubeId;
    if (youtubeId.includes('youtube.com') || youtubeId.includes('youtu.be')) {
      const match = youtubeId.match(/(?:shorts\/|v=|\/embed\/|\/v\/|youtu\.be\/|\/shorts\/)([a-zA-Z0-9_-]{11})/);
      if (match && match[1]) {
        cleanYoutubeId = match[1];
      }
    }

    const newReel = await prisma.reel.create({
      data: {
        title,
        description,
        youtubeId: cleanYoutubeId,
        category,
        views: views || `${Math.floor(Math.random() * 8 + 1)}.${Math.floor(Math.random() * 9)}k views`,
      },
    });

    return NextResponse.json(newReel, { status: 201 });
  } catch (error: any) {
    console.error('Error creating reel:', error);
    return NextResponse.json({ error: 'Failed to post reel' }, { status: 500 });
  }
}
