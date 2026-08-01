'use client';

import Image from 'next/image';
import Link from 'next/link';
import WhatsAppButton from './WhatsAppButton';

export interface ProductType {
  id: string;
  titulo: string;
  descripcion: string;
  categoria: string;
  condicion: 'NUEVO' | 'COMO_NUEVO' | 'USADO';
  precioVenta: number;
  imagenes: string[];
  status: 'DISPONIBLE' | 'RESERVADO' | 'VENDIDO';
  seller?: {
    id: string;
    nombre: string;
  };
}

export default function ProductCard({ product }: { product: ProductType }) {
  const mainImage =
    product.imagenes && product.imagenes.length > 0
      ? product.imagenes[0]
      : 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=600&auto=format&fit=crop';

  const formatPrice = (val: number) =>
    new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(val);

  const getConditionLabel = (cond: string) => {
    switch (cond) {
      case 'NUEVO':
        return 'Nuevo';
      case 'COMO_NUEVO':
        return 'Como nuevo';
      default:
        return 'Usado';
    }
  };

  return (
    <div className="group bg-white rounded-xl border border-neutral-200/80 shadow-sm hover:border-neutral-300 transition-all duration-200 flex flex-col overflow-hidden">
      {/* Product Image Frame */}
      <div className="relative aspect-[4/3] w-full bg-neutral-100/70 overflow-hidden border-b border-neutral-100">
        <Link href={`/productos/${product.id}`} className="block w-full h-full">
          <Image
            src={mainImage}
            alt={product.titulo}
            fill
            className="object-cover group-hover:scale-103 transition-transform duration-300 ease-out"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </Link>

        {/* Minimal Badges Overlay */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-md bg-white/95 text-neutral-800 shadow-sm border border-neutral-200/80">
            {getConditionLabel(product.condicion)}
          </span>

          {product.status !== 'DISPONIBLE' && (
            <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-md ${
              product.status === 'RESERVADO'
                ? 'bg-amber-100 text-amber-800 border border-amber-200'
                : 'bg-neutral-200 text-neutral-600 border border-neutral-300'
            }`}>
              {product.status === 'RESERVADO' ? 'Reservado' : 'Vendido'}
            </span>
          )}
        </div>
      </div>

      {/* Product Details Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1">
          <div className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider">
            {product.categoria}
          </div>

          <Link href={`/productos/${product.id}`} className="block">
            <h3 className="font-semibold text-neutral-900 text-base group-hover:text-neutral-600 transition-colors line-clamp-1 tracking-tight">
              {product.titulo}
            </h3>
          </Link>
          
          <p className="text-neutral-500 text-xs line-clamp-2 leading-relaxed">
            {product.descripcion}
          </p>
        </div>

        {/* Price & Action Button */}
        <div className="pt-3 border-t border-neutral-100 flex flex-col gap-2.5">
          <div className="flex items-baseline justify-between">
            <span className="text-[10px] font-medium text-neutral-400 uppercase tracking-wider">Precio</span>
            <span className="text-lg font-bold text-neutral-900 tracking-tight">
              {formatPrice(product.precioVenta)}
            </span>
          </div>

          <WhatsAppButton
            productTitle={product.titulo}
            productId={product.id}
            precioVenta={product.precioVenta}
            status={product.status}
          />
        </div>
      </div>
    </div>
  );
}


