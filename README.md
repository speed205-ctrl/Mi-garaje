# 🛍️ MI GARAJE. — Marketplace Minimalista & Dropshipping Local

**MI GARAJE** es una plataforma e-commerce moderna, minimalista y de estética editorial (estilo Vercel, Apple Store y Shadcn UI) diseñada para la venta de artículos de garaje personales y dropshipping local con coordinación de compras **directas a través de WhatsApp**.

![Design Preview](https://raw.githubusercontent.com/speed205-ctrl/Mi-garaje/main/homepage_screenshot.png)

---

## 🌟 Características Principales

- **🎨 Diseño Ultramoderno & Editorial**:
  - Paleta de colores neutra (`bg-neutral-50`, `text-neutral-900`).
  - Formas limpias con bordes sutiles (`border-neutral-200`) y tipografía sans-serif geométrica con `tracking-tight`.
  - Tarjetas de catálogo con relación de aspecto 4:3, badges de condición sobrios ("Nuevo", "Como Nuevo", "Usado") y precio destacado.

- **💬 Pedidos Directos por WhatsApp**:
  - Integración nativa con WhatsApp API para generar mensajes precargados con la referencia del producto y precio al instante.

- **🔍 Filtros y Búsqueda Compacta**:
  - Pestañas horizontales de navegación por categorías (*Teclados, Computadoras, Perfumes, Cargadores, Ropa, etc.*).
  - Barra de búsqueda y selectores de filtro por condición y disponibilidad en una sola fila compacta.

- **🔒 Panel Privado de Administración & Finanzas (`/admin`)**:
  - Oculto a los visitantes públicos de la tienda.
  - **Métricas KPI**: Ventas totales acumuladas, ganancia neta por comisiones y saldos por liquidar.
  - **Resumen por Proveedor**: Control de deuda y pagos pendientes a amigos / proveedores.
  - **Histórico & Marcar Pagado**: Control de liquidaciones con estados en tiempo real (*Liquidado / Pendiente*).

---

## 🛠️ Tecnologías Utilizadas

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Lenguaje**: [TypeScript](https://www.typescriptlang.org/)
- **Estilos**: [Tailwind CSS v3](https://tailwindcss.com/)
- **ORM / Base de Datos**: [Prisma ORM](https://www.prisma.io/) (PostgreSQL / SQLite)
- **Iconografía**: [Lucide React](https://lucide.dev/)
- **Integraciones**: WhatsApp Click-to-Chat API & Cloudinary (gestión de imágenes)

---

## 🚀 Instalación y Configuración Local

### 1. Clonar el repositorio

```bash
git clone https://github.com/speed205-ctrl/Mi-garaje.git
cd Mi-garaje
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env` basado en `.env.example`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/migaraje?schema=public"
NEXT_PUBLIC_WHATSAPP_NUMBER="573000000000"
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="demo"
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""
```

### 4. Inicializar Base de Datos

```bash
npm run prisma:db-push
npm run prisma:seed
```

### 5. Iniciar el servidor de desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la tienda en funcionamiento.

---

## 📜 Scripts Disponibles

- `npm run dev`: Inicia el servidor de desarrollo local en `http://localhost:3000`.
- `npm run build`: Genera el bundle de producción compilado.
- `npm run start`: Inicia el servidor optimizado para producción.
- `npm run prisma:db-push`: Sincroniza el esquema de Prisma con la base de datos.
- `npm run prisma:seed`: Puebla la base de datos con datos demo de prueba.

---

## 📝 Licencia

Este proyecto está bajo la Licencia MIT.
