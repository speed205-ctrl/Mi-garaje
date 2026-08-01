export default function Footer() {
  return (
    <footer className="mt-16 border-t border-neutral-200/80 bg-white text-neutral-500 text-xs py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="font-bold text-neutral-900">MI GARAJE.</span>
          <span className="text-neutral-400 ml-2">Marketplace & Dropshipping Local</span>
        </div>

        <p className="text-neutral-500 text-center sm:text-left">
          Compras coordinadas directamente por <span className="font-semibold text-emerald-600">WhatsApp</span>.
        </p>

        <div className="text-neutral-400">
          © {new Date().getFullYear()} MI GARAJE. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}


