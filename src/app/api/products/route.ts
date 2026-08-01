import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const DEMO_PRODUCTS = [
  {
    id: 'demo-1',
    titulo: 'Teclado Mecánico RGB Redragon K552',
    descripcion: 'Teclado mecánico gaming compacto, switches blue de rápida respuesta táctil, retroiluminación RGB. Excelente estado con empaque original.',
    categoria: 'Teclados',
    condicion: 'COMO_NUEVO',
    precioCosto: 120000,
    precioVenta: 180000,
    imagenes: ['https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=800&auto=format&fit=crop'],
    status: 'DISPONIBLE',
    seller: { id: 's1', nombre: 'Carlos Ramírez' },
  },
  {
    id: 'demo-2',
    titulo: 'MacBook Air M1 (2020) 8GB / 256GB SSD',
    descripcion: 'Laptop ultraligera en color gris espacial. Salud de batería al 91%, incluye cargador original MagSafe y funda protectora.',
    categoria: 'Computadoras',
    condicion: 'USADO',
    precioCosto: 2400000,
    precioVenta: 2950000,
    imagenes: ['https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=800&auto=format&fit=crop'],
    status: 'DISPONIBLE',
    seller: { id: 's1', nombre: 'Carlos Ramírez' },
  },
  {
    id: 'demo-3',
    titulo: 'Perfume Bleu de Chanel EDP 100ml',
    descripcion: 'Perfume original importado con el 95% del contenido. Fragancia aromática amaderada de alta fijación.',
    categoria: 'Perfumes',
    condicion: 'COMO_NUEVO',
    precioCosto: 450000,
    precioVenta: 580000,
    imagenes: ['https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=800&auto=format&fit=crop'],
    status: 'DISPONIBLE',
    seller: { id: 's2', nombre: 'Sofía Martínez' },
  },
  {
    id: 'demo-4',
    titulo: 'Cargador Anker 65W GaN Carga Rápida',
    descripcion: 'Cargador ultrafino de alta potencia con doble puerto USB-C y USB-A. Producto totalmente nuevo en caja sellada.',
    categoria: 'Cargadores',
    condicion: 'NUEVO',
    precioCosto: 90000,
    precioVenta: 135000,
    imagenes: ['https://images.unsplash.com/photo-1583863788434-e58a36330cf0?q=80&w=800&auto=format&fit=crop'],
    status: 'DISPONIBLE',
    seller: { id: 's3', nombre: 'Mi Garaje' },
  },
  {
    id: 'demo-5',
    titulo: 'Chaqueta de Cuero Sintético Zara Talla M',
    descripcion: 'Chaqueta estilo biker en color negro mate, forro interno suave. Estado impecable usada 2 veces.',
    categoria: 'Ropa',
    condicion: 'COMO_NUEVO',
    precioCosto: 100000,
    precioVenta: 160000,
    imagenes: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800&auto=format&fit=crop'],
    status: 'VENDIDO',
    seller: { id: 's2', nombre: 'Sofía Martínez' },
  },
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const categoria = searchParams.get('categoria');
    const condicion = searchParams.get('condicion');
    const status = searchParams.get('status');

    const whereClause: any = {};

    if (search) {
      whereClause.OR = [
        { titulo: { contains: search, mode: 'insensitive' } },
        { descripcion: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (categoria) {
      whereClause.categoria = categoria;
    }

    if (condicion) {
      whereClause.condicion = condicion;
    }

    if (status) {
      whereClause.status = status;
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      include: {
        seller: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(products.length > 0 ? products : DEMO_PRODUCTS);
  } catch (error) {
    console.error('Error fetching products, returning DEMO_PRODUCTS fallback:', error);
    return NextResponse.json(DEMO_PRODUCTS);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      titulo,
      descripcion,
      categoria,
      condicion,
      precioCosto,
      precioVenta,
      imagenes,
      sellerId,
      status,
    } = body;

    if (!titulo || !categoria || !precioCosto || !precioVenta || !sellerId) {
      return NextResponse.json({ error: 'Campos requeridos faltantes' }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        titulo,
        descripcion: descripcion || '',
        categoria,
        condicion: condicion || 'USADO',
        precioCosto: parseFloat(precioCosto),
        precioVenta: parseFloat(precioVenta),
        imagenes: imagenes || [],
        status: status || 'DISPONIBLE',
        sellerId,
      },
      include: {
        seller: true,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Error al crear el producto' }, { status: 500 });
  }
}
