export function getWhatsAppUrl(
  productTitle: string,
  productId: string,
  precioVenta: number,
  customPhoneNumber?: string
): string {
  const rawNumber = customPhoneNumber || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '573000000000';
  // Clean phone number (digits only)
  const phoneNumber = rawNumber.replace(/\D/g, '');

  const formattedPrice = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(precioVenta);

  // Plantilla requerida en Spec.md:
  // "Hola, quiero comprar [Nombre del Producto] (ID: [ID_PRODUCTO]) por [Precio Venta]."
  const message = `Hola, quiero comprar ${productTitle} (ID: ${productId}) por ${formattedPrice}.`;

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
}
