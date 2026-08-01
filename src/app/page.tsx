'use client';

import { useState, useEffect } from 'react';
import ProductCard, { ProductType } from '@/components/ProductCard';
import ProductFilters from '@/components/ProductFilters';
import { ShoppingBag, ShieldCheck, Zap, Truck, PackageX } from 'lucide-react';

export default function HomePage() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  const categories = [
    'Ropa',
    'Perfumes',
    'Cargadores',
    'Computadoras',
    'Teclados',
    'Accesorios',
    'Otros',
  ];

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.error('Error al cargar productos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedCondition('');
    setSelectedStatus('');
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      !searchQuery ||
      p.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.descripcion.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCat = !selectedCategory || p.categoria === selectedCategory;
    const matchesCond = !selectedCondition || p.condicion === selectedCondition;
    const matchesStatus = !selectedStatus || p.status === selectedStatus;

    return matchesSearch && matchesCat && matchesCond && matchesStatus;
  });

  return (
    <div className="space-y-8">
      {/* Editorial Boutique Hero */}
      <div className="bg-neutral-100/70 border border-neutral-200/80 rounded-xl p-8 sm:p-12 space-y-4">
        <div className="max-w-3xl space-y-3">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-neutral-500">
            Catálogo Personal & Dropshipping
          </span>

          <h1 className="text-3xl sm:text-5xl font-semibold text-neutral-900 tracking-tight leading-[1.15]">
            Artículos únicos, directo a tu <span className="text-emerald-600 font-semibold">WhatsApp</span>.
          </h1>

          <p className="text-neutral-600 text-sm sm:text-base leading-relaxed max-w-xl">
            Computadoras, ropa, perfumes, teclados y tecnología seleccionada de mi garaje y de amigos. Trato directo sin comisiones externas.
          </p>
        </div>

        {/* Minimalist Single-Line Badges Bar */}
        <div className="pt-3 border-t border-neutral-200/60 flex flex-wrap items-center gap-4 text-xs font-medium text-neutral-600">
          <div className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-neutral-900" />
            <span>Respuesta inmediata</span>
          </div>
          <span className="text-neutral-300">•</span>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-neutral-900" />
            <span>Sin intermediarios</span>
          </div>
          <span className="text-neutral-300">•</span>
          <div className="flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-neutral-900" />
            <span>Entrega local acordada</span>
          </div>
        </div>
      </div>

      {/* Categories & Filter Controls */}
      <ProductFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedCondition={selectedCondition}
        setSelectedCondition={setSelectedCondition}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        categories={categories}
        resetFilters={resetFilters}
      />

      {/* Catalog Grid Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-neutral-900" />
            <h2 className="text-sm font-semibold text-neutral-900 tracking-tight uppercase">
              Catálogo ({filteredProducts.length})
            </h2>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-80 rounded-xl bg-neutral-200/50 animate-pulse border border-neutral-200" />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-neutral-200 shadow-sm max-w-sm mx-auto space-y-3">
            <PackageX className="w-8 h-8 text-neutral-400 mx-auto" />
            <h3 className="font-semibold text-neutral-900 text-base">Sin resultados</h3>
            <p className="text-neutral-500 text-xs leading-relaxed">
              No hay productos que coincidan con los filtros seleccionados.
            </p>
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-medium transition-colors"
            >
              Restablecer filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


