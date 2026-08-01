'use client';

import { Search, X, RotateCcw } from 'lucide-react';

interface ProductFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedCondition: string;
  setSelectedCondition: (cond: string) => void;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  categories: string[];
  resetFilters: () => void;
}

export default function ProductFilters({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedCondition,
  setSelectedCondition,
  selectedStatus,
  setSelectedStatus,
  categories,
  resetFilters,
}: ProductFiltersProps) {
  const hasActiveFilters = Boolean(searchQuery || selectedCategory || selectedCondition || selectedStatus);

  return (
    <div className="space-y-4">
      {/* Flat Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-neutral-200/80">
        <button
          onClick={() => setSelectedCategory('')}
          className={`px-3.5 py-2 text-xs font-semibold whitespace-nowrap transition-colors border-b-2 -mb-px ${
            !selectedCategory
              ? 'border-neutral-900 text-neutral-900'
              : 'border-transparent text-neutral-500 hover:text-neutral-900'
          }`}
        >
          Todos
        </button>
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(isSelected ? '' : cat)}
              className={`px-3.5 py-2 text-xs font-medium whitespace-nowrap transition-colors border-b-2 -mb-px ${
                isSelected
                  ? 'border-neutral-900 text-neutral-900 font-semibold'
                  : 'border-transparent text-neutral-500 hover:text-neutral-900'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Compact One-line Controls */}
      <div className="flex flex-col sm:flex-row items-center gap-2.5">
        {/* Search Field */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Buscar por título o descripción..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 bg-white border border-neutral-200 rounded-lg text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Condition Selector */}
        <div className="w-full sm:w-44">
          <select
            value={selectedCondition}
            onChange={(e) => setSelectedCondition(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg text-xs text-neutral-700 focus:outline-none focus:ring-1 focus:ring-neutral-900 transition cursor-pointer"
          >
            <option value="">Condición (Todas)</option>
            <option value="NUEVO">Nuevo</option>
            <option value="COMO_NUEVO">Como nuevo</option>
            <option value="USADO">Usado</option>
          </select>
        </div>

        {/* Availability Status Selector */}
        <div className="w-full sm:w-44">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg text-xs text-neutral-700 focus:outline-none focus:ring-1 focus:ring-neutral-900 transition cursor-pointer"
          >
            <option value="">Estado (Todos)</option>
            <option value="DISPONIBLE">Disponible</option>
            <option value="RESERVADO">Reservado</option>
            <option value="VENDIDO">Vendido</option>
          </select>
        </div>

        {/* Reset Action */}
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="px-3 py-2 text-xs font-medium text-neutral-600 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200/80 rounded-lg transition-colors flex items-center gap-1.5 shrink-0"
            title="Limpiar todos los filtros"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">Limpiar</span>
          </button>
        )}
      </div>
    </div>
  );
}


