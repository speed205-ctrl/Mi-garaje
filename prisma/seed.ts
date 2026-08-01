import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding initial data for Mi Venta de Garaje...');

  // Create Sellers (Amigos)
  const carlos = await prisma.seller.create({
    data: {
      nombre: 'Carlos Ramírez (Amigo Tech)',
      telefono: '573001112233',
    },
  });

  const sofia = await prisma.seller.create({
    data: {
      nombre: 'Sofía Martínez (Moda & Fragancias)',
      telefono: '573114445566',
    },
  });

  const yo = await prisma.seller.create({
    data: {
      nombre: 'Mis Productos Propios',
      telefono: '573000000000',
    },
  });

  // Create Products
  const p1 = await prisma.product.create({
    data: {
      titulo: 'Teclado Mecánico RGB Redragon K552',
      descripcion: 'Teclado mecánico para gaming, switches blue, retroiluminación RGB configurable. Excelente estado con caja original.',
      categoria: 'Teclados',
      condicion: 'COMO_NUEVO',
      precioCosto: 120000,
      precioVenta: 180000,
      imagenes: [
        'https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=800&auto=format&fit=crop',
      ],
      status: 'DISPONIBLE',
      sellerId: carlos.id,
    },
  });

  const p2 = await prisma.product.create({
    data: {
      titulo: 'MacBook Air M1 (2020) 8GB / 256GB SSD',
      descripcion: 'Laptop ultraligera en color gris espacial. Salud de batería 91%, incluye cargador original MagSafe y funda de regalo.',
      categoria: 'Computadoras',
      condicion: 'USADO',
      precioCosto: 2400000,
      precioVenta: 2950000,
      imagenes: [
        'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=800&auto=format&fit=crop',
      ],
      status: 'DISPONIBLE',
      sellerId: carlos.id,
    },
  });

  const p3 = await prisma.product.create({
    data: {
      titulo: 'Perfume Bleu de Chanel Eau de Parfum 100ml',
      descripcion: 'Perfume original importado, frasco al 95% de contenido. Fragancia amaderada aromática de alta fijación.',
      categoria: 'Perfumes',
      condicion: 'COMO_NUEVO',
      precioCosto: 450000,
      precioVenta: 580000,
      imagenes: [
        'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=800&auto=format&fit=crop',
      ],
      status: 'DISPONIBLE',
      sellerId: sofia.id,
    },
  });

  const p4 = await prisma.product.create({
    data: {
      titulo: 'Chaqueta de Cuero Sintético Zara Talla M',
      descripcion: 'Chaqueta estilo biker negra, forro suave interno. Usada un par de veces únicamente.',
      categoria: 'Ropa',
      condicion: 'COMO_NUEVO',
      precioCosto: 100000,
      precioVenta: 160000,
      imagenes: [
        'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800&auto=format&fit=crop',
      ],
      status: 'VENDIDO',
      sellerId: sofia.id,
    },
  });

  const p5 = await prisma.product.create({
    data: {
      titulo: 'Cargador Anker 65W GaN Carga Rápida USB-C',
      descripcion: 'Cargador compacto de alta potencia con 2 puertos USB-C y 1 USB-A. Nuevo sellado en caja.',
      categoria: 'Cargadores',
      condicion: 'NUEVO',
      precioCosto: 90000,
      precioVenta: 135000,
      imagenes: [
        'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?q=80&w=800&auto=format&fit=crop',
      ],
      status: 'DISPONIBLE',
      sellerId: yo.id,
    },
  });

  // Create order for the sold product
  await prisma.order.create({
    data: {
      productId: p4.id,
      precioTotal: 160000,
      ganancia: 60000,
      pagadoAmigo: false, // Liquidación pendiente a Sofía
    },
  });

  console.log('Seed database completed successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
