import React, { useState } from 'react';
import {
  Package,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Plus,
  Minus,
  Search,
  Filter,
  History,
  CheckCircle2,
  XCircle,
  RefreshCw,
} from 'lucide-react';
import { usePOS } from '../../context/POSContext';
import { Product } from '../../types/pos';
import { formatRupiah } from '../../utils/pos-logic';

export const StockManagement: React.FC = () => {
  const { products, adjustStock, stockLogs, categories } = usePOS();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'low' | 'out'>('all');
  const [activeTab, setActiveTab] = useState<'inventory' | 'logs'>('inventory');

  // Adjustment Modal State
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [adjustType, setAdjustType] = useState<'in' | 'out'>('in');
  const [adjustAmount, setAdjustAmount] = useState<number>(10);
  const [adjustReason, setAdjustReason] = useState<string>('Restock supplier reguler');

  const filteredProducts = products.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.code.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (filterStatus === 'low') return p.stock > 0 && p.stock <= p.minStockAlert;
    if (filterStatus === 'out') return p.stock === 0;
    return true;
  });

  const lowStockCount = products.filter(p => p.stock > 0 && p.stock <= p.minStockAlert).length;
  const outOfStockCount = products.filter(p => p.stock === 0).length;
  const totalStockUnits = products.reduce((sum, p) => sum + p.stock, 0);

  const handleOpenAdjustModal = (product: Product, type: 'in' | 'out') => {
    setSelectedProduct(product);
    setAdjustType(type);
    setAdjustAmount(10);
    setAdjustReason(type === 'in' ? 'Restock pasokan baru' : 'Barang rusak / kadaluarsa');
  };

  const handleSaveAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct || adjustAmount <= 0) return;

    adjustStock(selectedProduct.id, adjustAmount, adjustType, adjustReason);
    setSelectedProduct(null);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2.5">
            <Package className="w-7 h-7 text-sky-600" />
            <span>Manajemen Stok Barang</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Pantau ketersediaan bahan & produk, restock, dan catat audit perpindahan barang
          </p>
        </div>

        {/* Tab switch between inventory & logs */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl self-start">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'inventory'
                ? 'bg-white dark:bg-slate-700 text-sky-700 dark:text-sky-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Daftar Stok
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
              activeTab === 'logs'
                ? 'bg-white dark:bg-slate-700 text-sky-700 dark:text-sky-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Riwayat Mutasi</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Total Unit Tersedia
            </span>
            <div className="w-9 h-9 rounded-xl bg-sky-50 dark:bg-sky-950/50 flex items-center justify-center text-sky-600">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900 dark:text-slate-100">
            {totalStockUnits.toLocaleString('id-ID')} <span className="text-xs font-medium text-slate-400">porsi/unit</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Stok Menipis
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-amber-600">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-amber-600">
            {lowStockCount} <span className="text-xs font-medium text-slate-400">produk</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Stok Habis
            </span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/50 flex items-center justify-center text-rose-600">
              <XCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-rose-600">
            {outOfStockCount} <span className="text-xs font-medium text-slate-400">produk</span>
          </div>
        </div>
      </div>

      {/* Main Table Content */}
      {activeTab === 'inventory' ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
          {/* Filter Toolbar */}
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari nama produk atau kode..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 mr-1">
                <Filter className="w-3.5 h-3.5" /> Filter:
              </span>
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  filterStatus === 'all'
                    ? 'bg-sky-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                Semua ({products.length})
              </button>
              <button
                onClick={() => setFilterStatus('low')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  filterStatus === 'low'
                    ? 'bg-amber-500 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                Menipis ({lowStockCount})
              </button>
              <button
                onClick={() => setFilterStatus('out')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  filterStatus === 'out'
                    ? 'bg-rose-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                Habis ({outOfStockCount})
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800 uppercase font-semibold text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Produk</th>
                  <th className="py-3 px-4">Kategori</th>
                  <th className="py-3 px-4">Harga Jual</th>
                  <th className="py-3 px-4 text-center">Sisa Stok</th>
                  <th className="py-3 px-4 text-center">Batas Minimum</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Aksi Cepat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                {filteredProducts.map(product => {
                  const category = categories.find(c => c.id === product.categoryId);
                  const isLow = product.stock > 0 && product.stock <= product.minStockAlert;
                  const isOut = product.stock === 0;

                  return (
                    <tr
                      key={product.id}
                      className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition"
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-10 h-10 rounded-lg object-cover border border-slate-200 dark:border-slate-700"
                          />
                          <div>
                            <div className="font-bold text-sm text-slate-900 dark:text-slate-100">
                              {product.name}
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono">
                              Kode: #{product.code}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-600 dark:text-slate-400">
                        {category?.name || '-'}
                      </td>
                      <td className="py-3.5 px-4 font-bold">
                        {formatRupiah(product.basePrice)}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`font-black text-sm ${
                            isOut
                              ? 'text-rose-600'
                              : isLow
                              ? 'text-amber-600'
                              : 'text-slate-900 dark:text-slate-100'
                          }`}
                        >
                          {product.stock}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center text-slate-500">
                        {product.minStockAlert}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {isOut ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                            Habis
                          </span>
                        ) : isLow ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                            Menipis
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300">
                            Aman
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenAdjustModal(product, 'in')}
                            className="px-2.5 py-1.5 rounded-lg bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 hover:bg-sky-100 font-bold flex items-center gap-1 transition"
                            title="Tambah stok (Restock)"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Restock</span>
                          </button>
                          <button
                            onClick={() => handleOpenAdjustModal(product, 'out')}
                            disabled={product.stock === 0}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200 font-semibold disabled:opacity-40 transition"
                            title="Kurangi stok (Koreksi / Rusak)"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Logs Tab */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <History className="w-4 h-4 text-sky-600" />
              <span>Riwayat Mutasi & Perubahan Stok</span>
            </h3>
            <span className="text-xs text-slate-400">
              Total {stockLogs.length} Aktivitas
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 dark:bg-slate-800/50 text-slate-500 uppercase font-semibold text-[10px] border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Waktu</th>
                  <th className="py-3 px-4">Produk</th>
                  <th className="py-3 px-4">Tipe</th>
                  <th className="py-3 px-4 text-center">Jumlah</th>
                  <th className="py-3 px-4 text-center">Sebelum &rarr; Sesudah</th>
                  <th className="py-3 px-4">Keterangan / Alasan</th>
                  <th className="py-3 px-4">Oleh</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {stockLogs.map(log => {
                  const dateStr = new Date(log.timestamp).toLocaleString('id-ID', {
                    day: '2-digit',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  return (
                    <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                        {dateStr}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-slate-100">
                        {log.productName}
                      </td>
                      <td className="py-3 px-4">
                        {log.type === 'in' ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 inline-flex items-center gap-1">
                            <ArrowUpRight className="w-3 h-3" /> Masuk
                          </span>
                        ) : log.type === 'sale' ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 inline-flex items-center gap-1">
                            <ArrowDownRight className="w-3 h-3" /> Terjual
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 inline-flex items-center gap-1">
                            <ArrowDownRight className="w-3 h-3" /> Keluar
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center font-black">
                        {log.type === 'in' ? `+${log.amount}` : `-${log.amount}`}
                      </td>
                      <td className="py-3 px-4 text-center font-mono text-[11px]">
                        {log.previousStock} &rarr;{' '}
                        <span className="font-bold text-sky-600 dark:text-sky-400">
                          {log.newStock}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                        {log.reason}
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-500">
                        {log.cashierName}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Quick Adjustment Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
              {adjustType === 'in' ? (
                <ArrowUpRight className="w-5 h-5 text-sky-600" />
              ) : (
                <ArrowDownRight className="w-5 h-5 text-rose-600" />
              )}
              <span>
                {adjustType === 'in' ? 'Restock / Tambah Stok' : 'Koreksi Stok Keluar'}
              </span>
            </h3>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center gap-3">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div>
                <div className="font-bold text-sm text-slate-900 dark:text-slate-100">
                  {selectedProduct.name}
                </div>
                <div className="text-xs text-slate-500">
                  Stok saat ini:{' '}
                  <span className="font-bold text-sky-600">
                    {selectedProduct.stock} unit
                  </span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSaveAdjustment} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Jumlah Perubahan (Unit)
                </label>
                <input
                  type="number"
                  min={1}
                  max={adjustType === 'out' ? selectedProduct.stock : 9999}
                  value={adjustAmount}
                  onChange={e => setAdjustAmount(Math.max(1, parseInt(e.target.value) || 0))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-bold bg-white dark:bg-slate-800 focus:outline-none focus:border-sky-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Alasan / Sumber
                </label>
                <input
                  type="text"
                  value={adjustReason}
                  onChange={e => setAdjustReason(e.target.value)}
                  placeholder="Contoh: Pengiriman supplier baru / Rusak pecah"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-white dark:bg-slate-800 focus:outline-none focus:border-sky-500"
                  required
                />
              </div>

              <div className="text-xs text-slate-500 font-medium">
                Stok setelah penyesuaian:{' '}
                <span className="font-bold text-slate-900 dark:text-white">
                  {adjustType === 'in'
                    ? selectedProduct.stock + adjustAmount
                    : Math.max(0, selectedProduct.stock - adjustAmount)}{' '}
                  unit
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedProduct(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-xs transition"
                >
                  Simpan Penyesuaian
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
