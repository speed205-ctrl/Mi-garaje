Actúa como un desarrollador Fullstack Senior experto en Next.js (App Router), Tailwind CSS, Prisma ORM y PostgreSQL.

Vamos a construir la plataforma web llamada "Mi Venta de Garaje". Es un marketplace personal y de dropshipping local donde vendo productos propios y de mis amigos (ropa, perfumes, cargadores, computadoras, teclados, etc.).

REQUISITOS CLAVE:
1. ARQUITECTURA:
   - Frontend/Backend: Next.js + Tailwind CSS.
   - Base de Datos: PostgreSQL hospedada en Render (usando Prisma ORM).
   - Imágenes: Integración con Cloudinary para almacenar fotos de productos.
   - Hosting objetivo: Render.

2. FLUJO DE COMPRA (SOLO MI WHATSAPP):
   - El comprador navega, filtra por categoría/estado y ve la ficha del producto.
   - El botón de compra envía un mensaje directo a MI número de WhatsApp con la plantilla:
     "Hola, quiero comprar [Nombre del Producto] (ID: [ID_PRODUCTO]) por [Precio Venta]."
   - No hay pasarela de pago pública; el cobro y la logística los gestiono yo directamente.

3. PANEL ADMIN PRIVADO (SOLO PARA MÍ):
   - Crear, editar, marcar como 'Reservado' o 'Vendido' cualquier producto.
   - Registrar la asignación de cada producto a un "Amigo / Proveedor".
   - Control de finanzas automático:
     * Precio de Costo (lo que le corresponde a mi amigo)
     * Precio de Venta (precio al público)
     * Ganancia/Comisión Neta (Precio Venta - Precio Costo)
   - Vista de liquidaciones pendientes a mis amigos (cuánto le debo a cada uno por productos vendidos).

4. ESTRUCTURA DE BASE DE DATOS (Prisma Schema):
   - Schema con las tablas: Seller (Amigo), Product (Producto) y Order (Venta).

Crea la estructura de archivos, la configuración de Tailwind, la conexión con Prisma y el schema.prisma inicial.