'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { DollarSign, TrendingUp, Clock, AlertCircle, CheckCircle2, Package, ArrowUpRight } from 'lucide-react';

interface OrderItem {
  id: string;
  productId: string;
  precioTotal: number;
  ganancia: number;
  pagadoAmigo: boolean;
  createdAt: string;
  product: {
    id: string;
    titulo: string;
    precioCosto: number;
    precioVenta: number;
    categoria: string;
    seller: {
      id: string;
      nombre: string;
      telefono?: string;
    };
  };
}

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const toggleLiquidado = async (orderId: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pagadoAmigo: !currentStatus }),
      });
      if (res.ok) {
        fetchOrders();
      }
    } catch (err) {
      console.error('Error actualizando liquidación:', err);
    }
  };

  const formatPrice = (val: number) =>
    new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(val);

  // Financial calculations
  const totalVentas = orders.reduce((acc, o) => acc + o.precioTotal, 0);
  const totalGananciasNetas = orders.reduce((acc, o) => acc + o.ganancia, 0);
  
  // Pending payouts to friends (where pagadoAmigo === false)
  const pendingOrders = orders.filter((o) => !o.pagadoAmigo);
  const totalDeudaAmigos = pendingOrders.reduce((acc, o) => acc + o.product.precioCosto, 0);

  // Group pending payouts by seller
  const pendingBySeller: { [sellerName: string]: { total: number; count: number; phone?: string } } = {};
  pendingOrders.forEach((o) => {
    const sName = o.product.seller.nombre;
    if (!pendingBySeller[sName]) {
      pendingBySeller[sName] = { total: 0, count: 0, phone: o.product.seller.telefono || undefined };
    }
    pendingBySeller[sName].total += o.product.precioCosto;
    pendingBySeller[sName].count += 1;
  });

  return (
    <div className="space-y-8">
      {/* Top Banner Header */}
      <div className="bg-white p-6 sm:p-8 rounded-xl border border-neutral-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-widest">
            Panel Privado — Finanzas
          </span>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Liquidaciones & Comisiones</h1>
          <p className="text-neutral-500 text-xs sm:text-sm">
            Control de comisiones netas y registro de liquidaciones a proveedores y amigos.
          </p>
        </div>
        <Link
          href="/admin/productos"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm self-start sm:self-auto"
        >
          <span>Gestor de Inventario</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-xl border border-neutral-200/80 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">Ventas totales</p>
            <p className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">{formatPrice(totalVentas)}</p>
            <p className="text-xs text-neutral-500">{orders.length} ventas registradas</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-neutral-100 text-neutral-700 flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-neutral-200/80 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">Ganancia neta</p>
            <p className="text-xl sm:text-2xl font-bold text-emerald-700 tracking-tight">{formatPrice(totalGananciasNetas)}</p>
            <p className="text-xs text-emerald-600 font-medium">Comisión acumulada</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-neutral-200/80 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">Por liquidar a amigos</p>
            <p className="text-xl sm:text-2xl font-bold text-amber-700 tracking-tight">{formatPrice(totalDeudaAmigos)}</p>
            <p className="text-xs text-amber-600 font-medium">{pendingOrders.length} pagos pendientes</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-100">
            <Clock className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Pending Payouts Card */}
      {Object.keys(pendingBySeller).length > 0 && (
        <div className="bg-white p-5 rounded-xl border border-amber-200/80 space-y-3 shadow-sm">
          <h2 className="text-xs font-semibold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            Liquidaciones pendientes por proveedor
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {Object.entries(pendingBySeller).map(([sellerName, info]) => (
              <div key={sellerName} className="bg-neutral-50 p-3.5 rounded-lg border border-neutral-200/80 space-y-1">
                <p className="font-semibold text-neutral-900 text-xs">{sellerName}</p>
                <div className="flex justify-between items-baseline text-xs">
                  <span className="text-neutral-500">{info.count} artículo(s)</span>
                  <span className="font-bold text-neutral-900">{formatPrice(info.total)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-neutral-200/80 shadow-sm p-6 space-y-4">
        <h2 className="text-sm font-semibold text-neutral-900 uppercase tracking-wider">
          Histórico de ventas & Liquidaciones
        </h2>

        {loading ? (
          <div className="py-12 text-center text-neutral-400 text-xs">Cargando datos...</div>
        ) : orders.length === 0 ? (
          <div className="py-12 text-center text-neutral-400 text-xs space-y-2">
            <Package className="w-8 h-8 mx-auto text-neutral-300" />
            <p className="font-medium text-neutral-700">Sin ventas registradas aún</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-100/70 text-neutral-500 uppercase font-semibold border-b border-neutral-200 text-[11px]">
                <tr>
                  <th className="py-3 px-3">Producto</th>
                  <th className="py-3 px-3">Proveedor / Amigo</th>
                  <th className="py-3 px-3">Costo (Deuda)</th>
                  <th className="py-3 px-3">Precio Venta</th>
                  <th className="py-3 px-3">Ganancia Neta</th>
                  <th className="py-3 px-3">Estado</th>
                  <th className="py-3 px-3 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="py-3.5 px-3 font-semibold text-neutral-900">
                      {order.product.titulo}
                    </td>
                    <td className="py-3.5 px-3 text-neutral-600">
                      {order.product.seller.nombre}
                    </td>
                    <td className="py-3.5 px-3 font-semibold text-amber-800">
                      {formatPrice(order.product.precioCosto)}
                    </td>
                    <td className="py-3.5 px-3 font-semibold text-neutral-900">
                      {formatPrice(order.precioTotal)}
                    </td>
                    <td className="py-3.5 px-3 font-semibold text-emerald-700">
                      {formatPrice(order.ganancia)}
                    </td>
                    <td className="py-3.5 px-3">
                      {order.pagadoAmigo ? (
                        <span className="badge-disponible text-[11px] px-2.5 py-0.5 rounded font-medium inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Liquidado
                        </span>
                      ) : (
                        <span className="badge-reservado text-[11px] px-2.5 py-0.5 rounded font-medium inline-flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Pendiente
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <button
                        onClick={() => toggleLiquidado(order.id, order.pagadoAmigo)}
                        className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                          order.pagadoAmigo
                            ? 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        }`}
                      >
                        {order.pagadoAmigo ? 'Marcar Pendiente' : 'Marcar Pagado'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}


