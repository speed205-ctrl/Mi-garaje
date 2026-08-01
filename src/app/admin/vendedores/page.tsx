'use client';

import { useState, useEffect } from 'react';
import { UserPlus, Users, Phone, Package, ShieldCheck } from 'lucide-react';

interface Product {
  id: string;
  titulo: string;
  precioVenta: number;
  status: string;
}

interface Seller {
  id: string;
  nombre: string;
  telefono?: string;
  products?: Product[];
}

export default function AdminSellersPage() {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchSellers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/sellers');
      if (res.ok) {
        const data = await res.json();
        setSellers(data);
      }
    } catch (err) {
      console.error('Error al obtener vendedores:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellers();
  }, []);

  const handleCreateSeller = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/sellers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, telefono }),
      });

      if (res.ok) {
        setNombre('');
        setTelefono('');
        fetchSellers();
      }
    } catch (err) {
      console.error('Error al registrar amigo:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Registro de Amigos y Proveedores</h1>
        <p className="text-slate-500 text-sm mt-1">
          Gestiona las personas de quienes recibes productos en consignación o dropshipping local.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Column */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 h-fit">
          <h2 className="font-bold text-slate-800 text-lg flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-emerald-600" />
            Nuevo Amigo / Proveedor
          </h2>

          <form onSubmit={handleCreateSeller} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Nombre Completo *
              </label>
              <input
                type="text"
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="ej. Juan Pérez (Consignación)"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Teléfono / WhatsApp (Opcional)
              </label>
              <input
                type="text"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="ej. 573001234567"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl transition shadow"
            >
              {isSubmitting ? 'Guardando...' : 'Registrar Vendedor'}
            </button>
          </form>
        </div>

        {/* Sellers List Column */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="font-bold text-slate-800 text-lg flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-600" />
            Amigos Registrados ({sellers.length})
          </h2>

          {loading ? (
            <div className="py-12 text-center text-slate-400 text-sm">Cargando lista...</div>
          ) : sellers.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-sm">
              No hay amigos registrados. Utiliza el formulario lateral para agregar el primero.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {sellers.map((s) => (
                <div key={s.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-slate-900 text-base">{s.nombre}</h3>
                  </div>

                  {s.telefono && (
                    <p className="text-xs text-slate-600 flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-emerald-600" />
                      {s.telefono}
                    </p>
                  )}

                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Package className="w-3.5 h-3.5 text-slate-400" />
                      {s.products?.length || 0} producto(s) asignados
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
