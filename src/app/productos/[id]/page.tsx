'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, AlertCircle, MessageSquare } from 'lucide-react';
import WhatsAppButton from '@/components/WhatsAppButton';
import { ProductType } from '@/components/ProductCard';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string>('');

  useEffect(() => {
    async function loadProduct() {
      try {
        const res = await fetch(`/api/products/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data);
          if (data.imagenes && data.imagenes.length > 0) {
            setSelectedImage(data.imagenes[0]);
          }
        }
      } catch (err) {
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [params.id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-12 animate-pulse space-y-6">
        <div className="h-6 bg-neutral-200/60 rounded w-28" />
        <div className="bg-white rounded-xl p-8 grid grid-cols-1 md:grid-cols-2 gap-8 border border-neutral-200">
          <div className="h-80 bg-neutral-200/60 rounded-lg" />
          <div className="space-y-4">
            <div className="h-8 bg-neutral-200/60 rounded" />
            <div className="h-5 bg-neutral-200/60 rounded w-1/3" />
            <div className="h-28 bg-neutral-200/60 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-sm mx-auto text-center py-20 space-y-3">
        <AlertCircle className="w-8 h-8 text-neutral-400 mx-auto" />
        <h2 className="text-lg font-semibold text-neutral-900">Artículo no disponible</h2>
        <p className="text-neutral-500 text-xs">El artículo solicitado no existe o fue retirado.</p>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white font-medium text-xs rounded-lg transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Volver al catálogo
        </Link>
      </div>
    );
  }

  const formatPrice = (val: number) =>
    new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(val);

  const images =
    product.imagenes && product.imagenes.length > 0
      ? product.imagenes
      : ['https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=800&auto=format&fit=crop'];

  const currentMainImage = selectedImage || images[0];

  const previewWhatsappText = `Hola, quiero comprar ${product.titulo} (ID: ${product.id}) por ${formatPrice(product.precioVenta)}.`;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back Button */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-neutral-500 hover:text-neutral-900 text-xs font-semibold transition"
      >
        <ArrowLeft className="w-4 h-4" /> Volver al catálogo
      </Link>

      <div className="bg-white rounded-xl border border-neutral-200/80 shadow-sm p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: Image Viewer */}
        <div className="space-y-3">
          <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-neutral-100/70 border border-neutral-200/80">
            <Image
              src={currentMainImage}
              alt={product.titulo}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((imgUrl, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(imgUrl)}
                  className={`relative w-16 h-16 rounded-lg overflow-hidden border transition-all ${
                    currentMainImage === imgUrl ? 'border-neutral-900 ring-1 ring-neutral-900' : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <Image src={imgUrl} alt={`Thumbnail ${i}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Information & Purchasing */}
        <div className="flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-semibold text-neutral-600 bg-neutral-100 px-2.5 py-0.5 rounded uppercase tracking-wider">
                {product.categoria}
              </span>
              <span className="text-[11px] font-semibold text-neutral-700 bg-neutral-100 px-2.5 py-0.5 rounded border border-neutral-200">
                {product.condicion.replace('_', ' ')}
              </span>
              {product.seller && (
                <span className="text-[11px] font-medium text-neutral-500">
                  Vendedor: <strong className="text-neutral-800">{product.seller.nombre}</strong>
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-semibold text-neutral-900 tracking-tight leading-snug">
              {product.titulo}
            </h1>

            <div className="py-2 border-y border-neutral-100 flex items-baseline justify-between">
              <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Precio Final</span>
              <span className="text-2xl font-bold text-neutral-900 tracking-tight">
                {formatPrice(product.precioVenta)}
              </span>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Descripción</h3>
              <p className="text-neutral-600 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                {product.descripcion}
              </p>
            </div>

            {/* WhatsApp Message Preview Box */}
            <div className="bg-neutral-900 text-neutral-300 p-3.5 rounded-lg text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 text-neutral-400 font-medium text-[11px]">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-400" /> Mensaje automático para WhatsApp:
              </div>
              <p className="font-mono text-[11px] text-emerald-400 bg-neutral-950 p-2.5 rounded border border-neutral-800 leading-relaxed select-all">
                "{previewWhatsappText}"
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-neutral-500 bg-neutral-50 p-3 rounded-lg border border-neutral-200/80">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Compra directa sin pasarelas ni comisiones adicionales.</span>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <WhatsAppButton
              productTitle={product.titulo}
              productId={product.id}
              precioVenta={product.precioVenta}
              status={product.status}
            />
            <p className="text-center text-[10px] text-neutral-400">
              ID de referencia: <span className="font-mono">{product.id}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


