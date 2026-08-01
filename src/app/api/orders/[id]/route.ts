import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { pagadoAmigo } = body;

    const order = await prisma.order.update({
      where: { id: params.id },
      data: {
        pagadoAmigo: Boolean(pagadoAmigo),
      },
      include: {
        product: {
          include: {
            seller: true,
          },
        },
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error updating order settlement status:', error);
    return NextResponse.json({ error: 'Error al actualizar estado de liquidación' }, { status: 500 });
  }
}
