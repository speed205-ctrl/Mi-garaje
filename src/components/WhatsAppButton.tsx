'use client';

import { MessageCircle, ArrowRight } from 'lucide-react';
import { getWhatsAppUrl } from '@/lib/whatsapp';

interface WhatsAppButtonProps {
  productTitle: string;
  productId: string;
  precioVenta: number;
  status: 'DISPONIBLE' | 'RESERVADO' | 'VENDIDO';
  className?: string;
}

export default function WhatsAppButton({
  productTitle,
  productId,
  precioVenta,
  status,
  className = '',
}: WhatsAppButtonProps) {
  const isAvailable = status === 'DISPONIBLE';

  if (!isAvailable) {
    return (
      <button
        disabled
        className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-medium text-xs text-neutral-400 bg-neutral-100 cursor-not-allowed border border-neutral-200 ${className}`}
      >
        <MessageCircle className="w-3.5 h-3.5" />
        <span>{status === 'RESERVADO' ? 'Reservado' : 'Vendido'}</span>
      </button>
    );
  }

  const whatsappUrl = getWhatsAppUrl(productTitle, productId, precioVenta);

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`group w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-semibold text-xs sm:text-sm text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 transition-all shadow-sm ${className}`}
    >
      <MessageCircle className="w-4 h-4 fill-white stroke-emerald-600" />
      <span>Pedir por WhatsApp</span>
      <ArrowRight className="w-3.5 h-3.5 opacity-60 group-hover:translate-x-0.5 transition-transform" />
    </a>
  );
}


