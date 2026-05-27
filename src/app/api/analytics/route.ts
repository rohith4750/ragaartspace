import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const orders = await prisma.order.findMany();
    
    // Total Revenue is the sum of amounts of orders with successful payment
    const paidOrders = orders.filter(
      (o) =>
        o.paymentStatus.toLowerCase() === 'success' ||
        o.paymentStatus.toLowerCase() === 'paid'
    );
    const totalRevenue = paidOrders.reduce((sum, o) => sum + o.amount, 0);

    const totalOrders = orders.length;
    const pendingOrders = orders.filter((o) => o.orderStatus === 'Pending').length;
    const totalArtworks = await prisma.artwork.count();

    // Customers count represents unique customer emails
    const uniqueEmails = new Set(orders.map((o) => o.email.toLowerCase()));
    const totalCustomers = uniqueEmails.size;

    return NextResponse.json({
      totalOrders,
      totalRevenue,
      totalCustomers,
      pendingOrders,
      totalArtworks,
    });
  } catch (error: any) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
