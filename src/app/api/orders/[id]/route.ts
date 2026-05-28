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
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        artwork: true,
        shipments: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error: any) {
    console.error('Error fetching order details:', error);
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
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
    const { orderStatus, paymentStatus, courierPartner, trackingId, shipmentStatus } = body;

    const existingOrder = await prisma.order.findUnique({
      where: { id },
    });

    if (!existingOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const updatedData: any = {};
    if (orderStatus !== undefined) {
      updatedData.orderStatus = orderStatus;
    } else if (shipmentStatus !== undefined) {
      if (shipmentStatus === 'Delivered') {
        updatedData.orderStatus = 'Delivered';
      } else if (['Shipped', 'In Transit', 'Out For Delivery', 'Failed'].includes(shipmentStatus)) {
        updatedData.orderStatus = 'Shipped';
      }
    }
    
    if (paymentStatus !== undefined) updatedData.paymentStatus = paymentStatus;

    // Handle Shipment updates/inserts separately since they reside in the Shipment table
    if (courierPartner !== undefined || trackingId !== undefined || shipmentStatus !== undefined) {
      const existingShipment = await prisma.shipment.findFirst({
        where: { orderId: id },
      });

      if (existingShipment) {
        await prisma.shipment.update({
          where: { id: existingShipment.id },
          data: {
            courierPartner: courierPartner !== undefined ? courierPartner : existingShipment.courierPartner,
            trackingId: trackingId !== undefined ? trackingId : existingShipment.trackingId,
            currentStatus: shipmentStatus !== undefined ? shipmentStatus : (orderStatus === 'Delivered' ? 'Delivered' : existingShipment.currentStatus),
            shippedAt: (orderStatus === 'Shipped' || shipmentStatus === 'Shipped') && !existingShipment.shippedAt ? new Date() : undefined,
            deliveredAt: (orderStatus === 'Delivered' || shipmentStatus === 'Delivered') && !existingShipment.deliveredAt ? new Date() : undefined,
          },
        });
      } else {
        await prisma.shipment.create({
          data: {
            orderId: id,
            courierPartner: courierPartner || 'Art Courier',
            trackingId: trackingId || 'N/A',
            currentStatus: shipmentStatus !== undefined ? shipmentStatus : (orderStatus === 'Delivered' ? 'Delivered' : 'Shipped'),
            shippedAt: new Date(),
            deliveredAt: (orderStatus === 'Delivered' || shipmentStatus === 'Delivered') ? new Date() : null,
          },
        });
      }
    }

    const order = await prisma.order.update({
      where: { id },
      data: updatedData,
      include: {
        artwork: true,
        shipments: true,
      },
    });

    // If orderStatus transitioned to 'Shipped', trigger email notification
    if (orderStatus === 'Shipped' && existingOrder.orderStatus !== 'Shipped') {
      const { sendShippingEmail } = await import('@/lib/mail');
      sendShippingEmail(order, order.artwork).catch((err) => {
        console.error('Failed to send shipping email notification:', err);
      });
    }

    return NextResponse.json(order);
  } catch (error: any) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
