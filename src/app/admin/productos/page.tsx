'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Plus, Edit, Trash2, Tag, CheckCircle2, AlertCircle, RefreshCw, X, ShieldAlert } from 'lucide-react';
import ImageUploader from '@/components/ImageUploader';

interface Seller {
  id: string;
  nombre: string;
}

interface Product {
  id: string;
  titulo: string;
  descripcion: string;
  categoria: string;
  condicion: 'NUEVO' | 'COMO_NUEVO' | 'USADO';
  precioCosto: number;
  precioVenta: number;
  imagenes: string[];
  status: 'DISPONIBLE' | 'RESERVADO' | 'VENDIDO';
  sellerId: string;
  seller: Seller;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);

  // Form Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form Fields
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [categoria, setCategoria] = useState('Teclados');
  const [condicion, setCondicion] = useState<'NUEVO' | 'COMO_NUEVO' | 'USADO'>('USADO');
  const [precioCosto, setPrecioCosto] = useState('');
  const [precioVenta, setPrecioVenta] = useState('');
  const [imagenes, setImagenes] = useState<string[]>([]);
  const [status, setStatus] = useState<'DISPONIBLE' | 'RESERVADO' | 'VENDIDO'>('DISPONIBLE');
  const [sellerId, setSellerId] = useState('');

  const categories = [
    'Ropa',
    'Perfumes',
    'Cargadores',
    'Computadoras',
    'Teclados',
    'Accesorios',
    'Otros',
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, sellRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/sellers'),
      ]);
      if (prodRes.ok) {
        const prodData = await prodRes.json();
        setProducts(prodData);
      }
      if (sellRes.ok) {
        const sellData = await sellRes.json();
        setSellers(sellData);
        if (sellData.length > 0 && !sellerId) {
          setSellerId(sellData[0].id);
        }
      }
    } catch (err) {
      console.error('Error al cargar inventario:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreateModal = () => {
    setEditingProduct(null);
    setTitulo('');
    setDescripcion('');
    setCategoria('Teclados');
    setCondicion('USADO');
    setPrecioCosto('');
    setPrecioVenta('');
    setImagenes([]);
    setStatus('DISPONIBLE');
    if (sellers.length > 0) setSellerId(sellers[0].id);
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setTitulo(p.titulo);
    setDescripcion(p.descripcion);
    setCategoria(p.categoria);
    setCondicion(p.condicion);
    setPrecioCosto(p.precioCosto.toString());
    setPrecioVenta(p.precioVenta.toString());
    setImagenes(p.imagenes || []);
    setStatus(p.status);
    setSellerId(p.sellerId);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo || !precioCosto || !precioVenta || !sellerId) {
      alert('Por favor completa todos los campos requeridos.');
      return;
    }

    const payload = {
      titulo,
      descripcion,
      categoria,
      condicion,
      precioCosto: parseFloat(precioCosto),
      precioVenta: parseFloat(precioVenta),
      imagenes,
      status,
      sellerId,
    };

    try {
      if (editingProduct) {
        await fetch(`/api/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      console.error('Error al guardar producto:', err);
    }
  };

  const quickChangeStatus = async (productId: string, newStatus: 'DISPONIBLE' | 'RESERVADO' | 'VENDIDO') => {
    try {
      await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchData();
    } catch (err) {
      console.error('Error actualizando estado:', err);
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;
    try {
      await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      });
      fetchData();
    } catch (err) {
      console.error('Error eliminando producto:', err);
    }
  };

  const formatPrice = (val: number) =>
    new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(val);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gestión de Inventario de Productos</h1>
          <p className="text-slate-500 text-sm">
            Agrega productos, ajusta costos y precios de venta, y actualiza el estado de consignación.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl transition shadow"
        >
          <Plus className="w-4 h-4" /> Nuevo Producto
        </button>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6">
        {loading ? (
          <div className="py-12 text-center text-slate-400 text-sm">Cargando inventario...</div>
        ) : products.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-sm space-y-3">
            <ShieldAlert className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="font-semibold text-slate-700">No hay productos en inventario</p>
            <button
              onClick={openCreateModal}
              className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold hover:bg-emerald-700 transition"
            >
              Agregar Primer Producto
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Foto</th>
                  <th className="py-3 px-4">Título</th>
                  <th className="py-3 px-4">Categoría</th>
                  <th className="py-3 px-4">Amigo / Proveedor</th>
                  <th className="py-3 px-4">Costo / Venta</th>
                  <th className="py-3 px-4">Comisión Neta</th>
                  <th className="py-3 px-4">Estado</th>
                  <th className="py-3 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((p) => {
                  const ganancia = p.precioVenta - p.precioCosto;
                  const thumb = p.imagenes && p.imagenes.length > 0 ? p.imagenes[0] : 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=200&auto=format&fit=crop';

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-4">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                          <Image src={thumb} alt={p.titulo} fill className="object-cover" />
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-bold text-slate-900 line-clamp-1">{p.titulo}</p>
                        <span className="text-xs text-slate-400 font-mono">ID: {p.id.slice(0, 8)}</span>
                      </td>
                      <td className="py-3 px-4 text-slate-600 font-medium">{p.categoria}</td>
                      <td className="py-3 px-4 font-medium text-slate-800">{p.seller?.nombre || 'N/A'}</td>
                      <td className="py-3 px-4">
                        <div className="text-xs">
                          <span className="text-slate-400">Costo:</span> <span className="font-bold text-amber-700">{formatPrice(p.precioCosto)}</span>
                        </div>
                        <div className="text-xs">
                          <span className="text-slate-400">Venta:</span> <span className="font-extrabold text-slate-900">{formatPrice(p.precioVenta)}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-bold text-emerald-700">
                        {formatPrice(ganancia)}
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={p.status}
                          onChange={(e) => quickChangeStatus(p.id, e.target.value as any)}
                          className={`text-xs font-semibold px-2.5 py-1 rounded-lg border focus:outline-none transition ${
                            p.status === 'DISPONIBLE'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : p.status === 'RESERVADO'
                              ? 'bg-amber-50 text-amber-800 border-amber-300'
                              : 'bg-rose-50 text-rose-800 border-rose-300'
                          }`}
                        >
                          <option value="DISPONIBLE">DISPONIBLE</option>
                          <option value="RESERVADO">RESERVADO</option>
                          <option value="VENDIDO">VENDIDO</option>
                        </select>
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-2 text-slate-600 hover:text-emerald-700 hover:bg-slate-100 rounded-lg transition"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Create/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="text-xl font-bold text-slate-900">
                {editingProduct ? 'Editar Producto' : 'Crear Nuevo Producto'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Título del Producto *</label>
                <input
                  type="text"
                  required
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  placeholder="ej. Teclado Mecánico RGB Redragon"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Categoría *</label>
                  <select
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Condición *</label>
                  <select
                    value={condicion}
                    onChange={(e) => setCondicion(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="NUEVO">Nuevo</option>
                    <option value="COMO_NUEVO">Como Nuevo</option>
                    <option value="USADO">Usado</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Precio de Costo (A tu Amigo) *</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={precioCosto}
                    onChange={(e) => setPrecioCosto(e.target.value)}
                    placeholder="ej. 100000"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-amber-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Precio de Venta (Público) *</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={precioVenta}
                    onChange={(e) => setPrecioVenta(e.target.value)}
                    placeholder="ej. 150000"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-slate-900"
                  />
                </div>
              </div>

              {precioCosto && precioVenta && (
                <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 text-xs flex justify-between font-bold text-emerald-900">
                  <span>Ganancia Neta Estimada:</span>
                  <span>{formatPrice(parseFloat(precioVenta) - parseFloat(precioCosto))}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Amigo / Proveedor *</label>
                  <select
                    value={sellerId}
                    onChange={(e) => setSellerId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {sellers.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Estado del Producto</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
                  >
                    <option value="DISPONIBLE">DISPONIBLE</option>
                    <option value="RESERVADO">RESERVADO</option>
                    <option value="VENDIDO">VENDIDO</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Descripción</label>
                <textarea
                  rows={3}
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="Detalles sobre el estado, accesorios incluidos..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <ImageUploader images={imagenes} onChange={setImagenes} />

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 text-slate-600 hover:bg-slate-100 text-sm font-semibold rounded-xl transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl shadow transition"
                >
                  {editingProduct ? 'Guardar Cambios' : 'Crear Producto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
