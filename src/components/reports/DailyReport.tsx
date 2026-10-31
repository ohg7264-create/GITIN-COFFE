import React, { useState } from 'react';
import {
  FileText,
  Calendar,
  Download,
  Printer,
  TrendingUp,
  Receipt,
  DollarSign,
  CreditCard,
  QrCode,
  Eye,
  Filter,
} from 'lucide-react';
import { usePOS } from '../../context/POSContext';
import { calculateDailyReportSummary, formatRupiah } from '../../utils/pos-logic';
import { Transaction } from '../../types/pos';

export const DailyReport: React.FC = () => {
  const { transactions, setCurrentReceiptTx, setIsReceiptModalOpen, storeSettings } = usePOS();

  const todayStr = new Date().toISOString().slice(0, 10);
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);

  const report = calculateDailyReportSummary(transactions, selectedDate);
  const dailyTransactions = transactions.filter(t => t.timestamp.startsWith(selectedDate));

  const handleViewReceipt = (tx: Transaction) => {
    setCurrentReceiptTx(tx);
    setIsReceiptModalOpen(true);
  };

  const handleExportCSV = () => {
    if (dailyTransactions.length === 0) return;

    const headers = [
      'No. Invoice',
      'Waktu',
      'Kasir',
      'Jumlah Item',
      'Subtotal',
      'Pajak',
      'Total',
      'Metode Bayar',
      'Status',
    ];

    const rows = dailyTransactions.map(tx => [
      tx.invoiceNumber,
      new Date(tx.timestamp).toLocaleTimeString('id-ID'),
      tx.cashierName,
      tx.items.reduce((s, i) => s + i.quantity, 0),
      tx.subTotal,
      tx.tax,
      tx.total,
      tx.paymentMethod,
      tx.status,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Laporan_Penjualan_${selectedDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintDailyReport = () => {
    window.print();
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2.5">
            <FileText className="w-7 h-7 text-sky-600" />
            <span>Laporan Penjualan Harian</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Rekap otomatis pendapatan, pajak, dan rincian transaksi harian toko
          </p>
        </div>

        {/* Date Selector & Action buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="relative">
            <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-sky-500 shadow-xs"
            />
          </div>

          <button
            onClick={() => setSelectedDate(todayStr)}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition ${
              selectedDate === todayStr
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            Hari Ini
          </button>

          <button
            onClick={handleExportCSV}
            disabled={dailyTransactions.length === 0}
            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 text-xs font-bold flex items-center gap-1.5 transition disabled:opacity-40"
            title="Download file CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor CSV</span>
          </button>

          <button
            onClick={handlePrintDailyReport}
            className="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition"
            title="Cetak Rekap"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Rekap</span>
          </button>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Gross */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>Total Pendapatan Kotor</span>
            <div className="w-8 h-8 rounded-xl bg-sky-50 dark:bg-sky-950 flex items-center justify-center text-sky-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900 dark:text-slate-100">
            {formatRupiah(report.totalGrossSales)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Penjualan bersih: {formatRupiah(report.totalNetSales)}
          </div>
        </div>

        {/* Total Transactions */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>Jumlah Transaksi</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-blue-600">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900 dark:text-slate-100">
            {report.totalTransactions} <span className="text-xs font-medium text-slate-400">struk</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Total {report.totalItemsSold} porsi/unit terjual
          </div>
        </div>

        {/* Average Order Value */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>Rata-Rata Nilai Struk</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950 flex items-center justify-center text-purple-600">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900 dark:text-slate-100">
            {formatRupiah(report.averageOrderValue)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Per transaksi pelanggan
          </div>
        </div>

        {/* Taxes Collected */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>Pajak Terkumpul (PPN)</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950 flex items-center justify-center text-amber-600">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-amber-600">
            {formatRupiah(report.totalTax)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Tarif {(storeSettings.taxRate * 100).toFixed(1)}% dari penjualan
          </div>
        </div>
      </div>

      {/* Middle Grid: Payment Breakdown & Best Sellers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payment Methods Breakdown */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-sky-600" />
            <span>Penerimaan per Metode Bayar</span>
          </h3>

          <div className="space-y-3">
            {[
              { key: 'cash', label: 'Tunai / Cash', icon: <DollarSign className="w-3.5 h-3.5 text-sky-600" /> },
              { key: 'qris', label: 'QRIS Dinamis', icon: <QrCode className="w-3.5 h-3.5 text-blue-600" /> },
              { key: 'card', label: 'Kartu Debit/Kredit', icon: <CreditCard className="w-3.5 h-3.5 text-purple-600" /> },
              { key: 'gopay', label: 'GoPay / E-Wallet', icon: <DollarSign className="w-3.5 h-3.5 text-amber-600" /> },
            ].map(m => {
              const data = report.paymentMethodBreakdown[m.key] || { count: 0, total: 0 };
              const pct = report.totalGrossSales > 0 ? (data.total / report.totalGrossSales) * 100 : 0;
              return (
                <div key={m.key} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                      {m.icon} {m.label} ({data.count}x)
                    </span>
                    <span className="font-bold text-slate-900 dark:text-slate-100">
                      {formatRupiah(data.total)}
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-sky-600 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top 5 Products Today */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 mb-3 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-sky-600" />
              <span>Produk Terlaris Hari Ini</span>
            </span>
            <span className="text-xs text-slate-400 font-normal">
              {report.topProducts.length} varian terjual
            </span>
          </h3>

          {report.topProducts.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              Belum ada penjualan pada tanggal ini
            </div>
          ) : (
            <div className="space-y-2.5">
              {report.topProducts.slice(0, 5).map((p, idx) => (
                <div
                  key={p.productId}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs font-medium"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 font-extrabold flex items-center justify-center text-[11px]">
                      #{idx + 1}
                    </span>
                    <span className="font-bold text-slate-900 dark:text-slate-100">
                      {p.name}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-sky-600 dark:text-sky-400 mr-3">
                      {p.quantity} terjual
                    </span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {formatRupiah(p.totalRevenue)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Transaction Log Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Receipt className="w-4 h-4 text-sky-600" />
            <span>Daftar Transaksi ({dailyTransactions.length})</span>
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            Tanggal: {selectedDate}
          </span>
        </div>

        {dailyTransactions.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            Tidak ada transaksi pada tanggal ini
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 dark:bg-slate-800/50 text-slate-500 uppercase font-semibold text-[10px] border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">No. Invoice</th>
                  <th className="py-3 px-4">Waktu</th>
                  <th className="py-3 px-4">Kasir</th>
                  <th className="py-3 px-4">Pesanan</th>
                  <th className="py-3 px-4">Metode Bayar</th>
                  <th className="py-3 px-4 text-right">Total Transaksi</th>
                  <th className="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                {dailyTransactions.map(tx => {
                  const time = new Date(tx.timestamp).toLocaleTimeString('id-ID', {
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  return (
                    <tr
                      key={tx.id}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition"
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-slate-100">
                        {tx.invoiceNumber}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">{time}</td>
                      <td className="py-3.5 px-4 font-semibold text-slate-700 dark:text-slate-300">
                        {tx.cashierName}
                      </td>
                      <td className="py-3.5 px-4 max-w-xs truncate text-slate-600 dark:text-slate-400">
                        {tx.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {tx.paymentMethod}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-black text-sky-700 dark:text-sky-400">
                        {formatRupiah(tx.total)}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => handleViewReceipt(tx)}
                          className="px-2.5 py-1 rounded-lg bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 hover:bg-sky-100 font-bold inline-flex items-center gap-1 transition text-[11px]"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Struk</span>
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
    </div>
  );
};
