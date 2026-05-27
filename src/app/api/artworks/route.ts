import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    
    const where: any = {};
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    if (category && category !== 'All') {
      where.category = { equals: category, mode: 'insensitive' };
    }

    const artworks = await prisma.artwork.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(artworks);
  } catch (error: any) {
    console.error('Error fetching artworks:', error);
    return NextResponse.json({ error: 'Failed to fetch artworks' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, price, category, imageUrl, stock, dimensions } = body;

    if (!title || price === undefined || !category || !imageUrl || stock === undefined || !dimensions) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const artwork = await prisma.artwork.create({
      data: {
        title,
        description: description || '',
        price: parseFloat(price),
        category,
        imageUrl,
        stock: parseInt(stock),
        dimensions,
      }
    });

    return NextResponse.json(artwork, { status: 201 });
  } catch (error: any) {
    console.error('Error creating artwork:', error);
    return NextResponse.json({ error: 'Failed to create artwork' }, { status: 500 });
  }
}
