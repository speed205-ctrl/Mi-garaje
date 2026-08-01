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

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const demo = DEMO_PRODUCTS.find((p) => p.id === params.id);
    if (demo) {
      return NextResponse.json(demo);
    }

    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: {
        seller: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product detail:', error);
    return NextResponse.json({ error: 'Error al obtener producto' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    const existingProduct = await prisma.product.findUnique({
      where: { id: params.id },
      include: { Order: true },
    });

    if (!existingProduct) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
    }

    const updatedProduct = await prisma.product.update({
      where: { id: params.id },
      data: {
        titulo: titulo ?? existingProduct.titulo,
        descripcion: descripcion ?? existingProduct.descripcion,
        categoria: categoria ?? existingProduct.categoria,
        condicion: condicion ?? existingProduct.condicion,
        precioCosto: precioCosto !== undefined ? parseFloat(precioCosto) : existingProduct.precioCosto,
        precioVenta: precioVenta !== undefined ? parseFloat(precioVenta) : existingProduct.precioVenta,
        imagenes: imagenes ?? existingProduct.imagenes,
        sellerId: sellerId ?? existingProduct.sellerId,
        status: status ?? existingProduct.status,
      },
      include: {
        seller: true,
      },
    });

    // Si el estado cambia a VENDIDO y no existe un Order previo para este producto, creamos el Order automático de venta
    if (status === 'VENDIDO') {
      const pCosto = updatedProduct.precioCosto;
      const pVenta = updatedProduct.precioVenta;
      const gananciaNeta = pVenta - pCosto;

      const existingOrder = await prisma.order.findFirst({
        where: { productId: params.id },
      });

      if (!existingOrder) {
        await prisma.order.create({
          data: {
            productId: params.id,
            precioTotal: pVenta,
            ganancia: gananciaNeta,
            pagadoAmigo: false,
          },
        });
      }
    }

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Error al actualizar producto' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.product.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true, message: 'Producto eliminado correctamente' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Error al eliminar producto' }, { status: 500 });
  }
}
