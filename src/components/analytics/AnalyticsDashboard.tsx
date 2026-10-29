import React from 'react';
import {
  LayoutDashboard,
  TrendingUp,
  Clock,
  Award,
  CreditCard,
  Package,
  Zap,
  ArrowUp,
  Users,
} from 'lucide-react';
import { usePOS } from '../../context/POSContext';
import { calculateDailyReportSummary, formatRupiah } from '../../utils/pos-logic';

export const AnalyticsDashboard: React.FC = () => {
  const { transactions, products, categories } = usePOS();

  const todayStr = new Date().toISOString().slice(0, 10);
  const summary = calculateDailyReportSummary(transactions, todayStr);

  // Peak sales hour
  const hourlyEntries = Object.entries(summary.hourlyBreakdown).map(([hour, val]) => ({
    hour: parseInt(hour, 10),
    total: val,
  }));

  const maxHourTotal = Math.max(...hourlyEntries.map(e => e.total), 1);
  const peakHour = hourlyEntries.reduce((max, cur) => (cur.total > max.total ? cur : max), {
    hour: 12,
    total: 0,
  });

  // Food vs Drink breakdown
  let drinkSales = 0;
  let foodSales = 0;
  for (const tx of transactions.filter(t => t.timestamp.startsWith(todayStr))) {
    for (const item of tx.items) {
      const prod = products.find(p => p.id === item.productId);
      if (prod?.type === 'food') {
        foodSales += item.subtotal;
      } else {
        drinkSales += item.subtotal;
      }
    }
  }

  const totalCatSales = drinkSales + foodSales || 1;
  const drinkPercent = Math.round((drinkSales / totalCatSales) * 100);
  const foodPercent = Math.round((foodSales / totalCatSales) * 100);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-black text-stone-900 dark:text-stone-100 tracking-tight flex items-center gap-2.5">
            <LayoutDashboard className="w-7 h-7 text-emerald-600" />
            <span>Dasbor Analitik Real-Time</span>
          </h1>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
            Visualisasi performa penjualan, jam sibuk, dan perilaku pesanan pelanggan
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 self-start">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>Live Synchronized</span>
        </div>
      </div>

      {/* Top Stat Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-stone-500 dark:text-stone-400">
            <span>Pendapatan Hari Ini</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-emerald-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-emerald-700 dark:text-emerald-400">
            {formatRupiah(summary.totalGrossSales)}
          </div>
          <div className="text-[11px] text-emerald-600 flex items-center gap-1 mt-1 font-semibold">
            <ArrowUp className="w-3 h-3" /> Real-time active
          </div>
        </div>

        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-stone-500 dark:text-stone-400">
            <span>Jam Paling Sibuk (Peak Hour)</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950 flex items-center justify-center text-amber-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-stone-900 dark:text-stone-100">
            {peakHour.hour.toString().padStart(2, '0')}:00 - {(peakHour.hour + 1).toString().padStart(2, '0')}:00
          </div>
          <div className="text-[11px] text-stone-400 mt-1">
            Total {formatRupiah(peakHour.total)} pada jam ini
          </div>
        </div>

        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-stone-500 dark:text-stone-400">
            <span>Rata-Rata Keranjang Belanja</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950 flex items-center justify-center text-purple-600">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-stone-900 dark:text-stone-100">
            {formatRupiah(summary.averageOrderValue)}
          </div>
          <div className="text-[11px] text-stone-400 mt-1">
            Dari {summary.totalTransactions} transaksi hari ini
          </div>
        </div>

        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-stone-500 dark:text-stone-400">
            <span>Kesehatan Stok</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-blue-600">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-stone-900 dark:text-stone-100">
            {products.filter(p => p.stock > p.minStockAlert).length} / {products.length}
          </div>
          <div className="text-[11px] text-stone-400 mt-1">
            Produk dalam kondisi stok aman
          </div>
        </div>
      </div>

      {/* Hourly Sales Activity Chart */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-extrabold text-base text-stone-900 dark:text-stone-100">
              Distribusi Penjualan per Jam (Hari Ini)
            </h3>
            <p className="text-xs text-stone-400 mt-0.5">
              Pantau jam sibuk kafe untuk mengatur jadwal pergantian shift barista
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-lg">
            24 Jam Aktif
          </span>
        </div>

        {/* Bar visualization */}
        <div className="h-48 flex items-end gap-1.5 sm:gap-2 pt-6 pb-2 border-b border-stone-200 dark:border-stone-800">
          {hourlyEntries
            .filter(e => e.hour >= 8 && e.hour <= 22)
            .map(entry => {
              const heightPct = Math.max(6, (entry.total / maxHourTotal) * 100);
              const isPeak = entry.hour === peakHour.hour && entry.total > 0;
              return (
                <div key={entry.hour} className="flex-1 flex flex-col items-center gap-1 group relative">
                  {/* Tooltip on hover */}
                  <div className="absolute -top-8 bg-stone-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap z-10 font-bold">
                    {formatRupiah(entry.total)}
                  </div>

                  <div className="w-full h-36 flex items-end justify-center">
                    <div
                      style={{ height: `${heightPct}%` }}
                      className={`w-full max-w-[28px] rounded-t-lg transition-all duration-300 ${
                        isPeak
                          ? 'bg-emerald-600 group-hover:bg-emerald-500 shadow-md shadow-emerald-600/30'
                          : entry.total > 0
                          ? 'bg-emerald-300 dark:bg-emerald-800 group-hover:bg-emerald-400'
                          : 'bg-stone-100 dark:bg-stone-800'
                      }`}
                    />
                  </div>
                  <span className="text-[10px] font-semibold text-stone-400">
                    {entry.hour}h
                  </span>
                </div>
              );
            })}
        </div>
      </div>

      {/* Two Column Section: Category Distribution & Top Rankings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Drink vs Food Contribution */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-xs">
          <h3 className="font-extrabold text-base text-stone-900 dark:text-stone-100 mb-1">
            Proporsi Kategori Menu
          </h3>
          <p className="text-xs text-stone-400 mb-5">
            Perbandingan omzet minuman vs makanan olahan
          </p>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-bold mb-1.5">
                <span className="text-stone-700 dark:text-stone-300">Minuman (Coffee, Tea & Juice)</span>
                <span className="text-emerald-600 font-extrabold">{drinkPercent}% ({formatRupiah(drinkSales)})</span>
              </div>
              <div className="w-full h-3 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
                <div
                  className="h-full bg-emerald-600 rounded-full transition-all duration-700"
                  style={{ width: `${drinkPercent}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1.5">
                <span className="text-stone-700 dark:text-stone-300">Makanan (Burger, Noodle & Cake)</span>
                <span className="text-amber-600 font-extrabold">{foodPercent}% ({formatRupiah(foodSales)})</span>
              </div>
              <div className="w-full h-3 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all duration-700"
                  style={{ width: `${foodPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Best Seller Leaderboard */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-xs">
          <h3 className="font-extrabold text-base text-stone-900 dark:text-stone-100 mb-1 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <span>Peringkat Menu Favorit</span>
          </h3>
          <p className="text-xs text-stone-400 mb-4">
            Item dengan perputaran penjualan tertinggi
          </p>

          <div className="space-y-3">
            {summary.topProducts.slice(0, 4).map((p, i) => (
              <div
                key={p.productId}
                className="flex items-center justify-between p-3 rounded-xl bg-stone-50 dark:bg-stone-800/50"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs ${
                      i === 0
                        ? 'bg-amber-400 text-amber-950 shadow-xs'
                        : i === 1
                        ? 'bg-stone-300 text-stone-900'
                        : 'bg-amber-100 text-amber-800 dark:bg-stone-700 dark:text-stone-200'
                    }`}
                  >
                    {i + 1}
                  </span>
                  <div>
                    <div className="font-bold text-xs text-stone-900 dark:text-stone-100">
                      {p.name}
                    </div>
                    <div className="text-[10px] text-stone-400">
                      Total omzet: {formatRupiah(p.totalRevenue)}
                    </div>
                  </div>
                </div>

                <span className="text-xs font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-1 rounded-md">
                  {p.quantity} porsi
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
