import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { sendOrderEmail } from '@/lib/mail';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      include: {
        artwork: true,
        shipments: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(orders);
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerName, email, phone, address, artworkId, quantity, amount, paymentStatus } = body;

    if (!customerName || !email || !phone || !address || !artworkId || !quantity || !amount) {
      return NextResponse.json({ error: 'Missing required order details' }, { status: 400 });
    }

    // Run order placement in a transaction to prevent race conditions on stock deduction
    const { newOrder, artwork } = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const artwork = await tx.artwork.findUnique({
        where: { id: artworkId },
      });

      if (!artwork) {
        throw new Error('Artwork not found');
      }

      if (artwork.stock < quantity) {
        throw new Error('Insufficient stock');
      }

      // 1. Create order
      const newOrder = await tx.order.create({
        data: {
          customerName,
          email,
          phone,
          address,
          artworkId,
          quantity: parseInt(quantity),
          amount: parseFloat(amount),
          paymentStatus: paymentStatus || 'Pending',
          orderStatus: 'Pending',
        },
      });

      // 2. Decrement stock
      await tx.artwork.update({
        where: { id: artworkId },
        data: {
          stock: artwork.stock - parseInt(quantity),
        },
      });

      return { newOrder, artwork };
    });

    // Fire email booking confirmation asynchronously so it doesn't block the API response
    sendOrderEmail(newOrder, artwork).catch((err) => {
      console.error('Failed to send order booking email:', err);
    });

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error: any) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: error.message || 'Failed to create order' }, { status: 400 });
  }
}
