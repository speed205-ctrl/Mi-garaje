import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const DEMO_ORDERS = [
  {
    id: 'ord-1',
    productId: 'demo-5',
    precioTotal: 160000,
    ganancia: 60000,
    pagadoAmigo: false,
    createdAt: new Date().toISOString(),
    product: {
      id: 'demo-5',
      titulo: 'Chaqueta de Cuero Sintético Zara Talla M',
      precioCosto: 100000,
      precioVenta: 160000,
      categoria: 'Ropa',
      seller: {
        id: 's2',
        nombre: 'Sofía Martínez',
        telefono: '573114445566',
      },
    },
  },
];

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        product: {
          include: {
            seller: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(orders.length > 0 ? orders : DEMO_ORDERS);
  } catch (error) {
    console.error('Error fetching orders, returning DEMO_ORDERS fallback:', error);
    return NextResponse.json(DEMO_ORDERS);
  }
}
