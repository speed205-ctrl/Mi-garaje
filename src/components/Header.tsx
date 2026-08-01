'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-neutral-200/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Editorial Logo */}
        <Link href="/" className="group flex items-center gap-1.5">
          <span className="font-bold text-xl tracking-tight text-neutral-900 group-hover:text-neutral-600 transition-colors">
            MI GARAJE<span className="text-emerald-600">.</span>
          </span>
          <span className="hidden sm:inline-block text-[11px] font-medium text-neutral-400 border-l border-neutral-200 pl-2 ml-1 uppercase tracking-wider">
            Boutique & Dropshipping
          </span>
        </Link>

        {/* Minimal Navigation */}
        <nav className="flex items-center gap-3">
          <Link
            href="/"
            className={`text-xs font-semibold px-3.5 py-2 rounded-lg transition-colors ${
              pathname === '/'
                ? 'text-neutral-900 bg-neutral-100'
                : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50'
            }`}
          >
            Catálogo
          </Link>
        </nav>
      </div>

      {/* Admin Contextual Sub-bar */}
      {isAdmin && (
        <div className="bg-neutral-900 text-neutral-300 text-xs py-2 px-4 border-t border-neutral-800">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Modo Administrador Privado
            </span>
            <div className="flex gap-4 font-medium text-neutral-400">
              <Link
                href="/admin"
                className={`hover:text-white transition ${pathname === '/admin' ? 'text-white font-semibold underline underline-offset-4 decoration-emerald-500' : ''}`}
              >
                Finanzas
              </Link>
              <Link
                href="/admin/productos"
                className={`hover:text-white transition ${pathname.startsWith('/admin/productos') ? 'text-white font-semibold underline underline-offset-4 decoration-emerald-500' : ''}`}
              >
                Inventario
              </Link>
              <Link
                href="/admin/vendedores"
                className={`hover:text-white transition ${pathname.startsWith('/admin/vendedores') ? 'text-white font-semibold underline underline-offset-4 decoration-emerald-500' : ''}`}
              >
                Proveedores
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}


