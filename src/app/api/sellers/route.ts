import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const sellers = await prisma.seller.findMany({
      include: {
        products: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(sellers);
  } catch (error) {
    console.error('Error fetching sellers:', error);
    return NextResponse.json({ error: 'Error al obtener vendedores' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nombre, telefono } = body;

    if (!nombre) {
      return NextResponse.json({ error: 'El nombre es obligatorio' }, { status: 400 });
    }

    const seller = await prisma.seller.create({
      data: {
        nombre,
        telefono: telefono || null,
      },
    });

    return NextResponse.json(seller, { status: 201 });
  } catch (error) {
    console.error('Error creating seller:', error);
    return NextResponse.json({ error: 'Error al crear vendedor' }, { status: 500 });
  }
}
