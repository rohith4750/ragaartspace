import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const artwork = await prisma.artwork.findUnique({
      where: { id },
    });

    if (!artwork) {
      return NextResponse.json({ error: 'Artwork not found' }, { status: 404 });
    }

    return NextResponse.json(artwork);
  } catch (error: any) {
    console.error('Error fetching artwork details:', error);
    return NextResponse.json({ error: 'Failed to fetch artwork' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { title, description, price, category, imageUrl, stock, dimensions } = body;

    const updatedData: any = {};
    if (title !== undefined) updatedData.title = title;
    if (description !== undefined) updatedData.description = description;
    if (price !== undefined) updatedData.price = parseFloat(price);
    if (category !== undefined) updatedData.category = category;
    if (imageUrl !== undefined) updatedData.imageUrl = imageUrl;
    if (stock !== undefined) updatedData.stock = parseInt(stock);
    if (dimensions !== undefined) updatedData.dimensions = dimensions;

    const artwork = await prisma.artwork.update({
      where: { id },
      data: updatedData,
    });

    return NextResponse.json(artwork);
  } catch (error: any) {
    console.error('Error updating artwork:', error);
    return NextResponse.json({ error: 'Failed to update artwork' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await prisma.artwork.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Artwork deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting artwork:', error);
    return NextResponse.json({ error: 'Failed to delete artwork' }, { status: 500 });
  }
}
