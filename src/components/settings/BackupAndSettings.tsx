import React, { useRef, useState } from 'react';
import {
  Database,
  Download,
  Upload,
  RefreshCw,
  Moon,
  Sun,
  Store,
  Printer,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
} from 'lucide-react';
import { usePOS } from '../../context/POSContext';

export const BackupAndSettings: React.FC = () => {
  const {
    storeSettings,
    updateStoreSettings,
    exportBackupJSON,
    importBackupJSON,
    resetToDemoData,
    isDarkMode,
    toggleDarkMode,
    products,
    transactions,
    stockLogs,
  } = usePOS();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );

  // Store form state
  const [storeName, setStoreName] = useState(storeSettings.storeName);
  const [storeTagline, setStoreTagline] = useState(storeSettings.storeTagline);
  const [address, setAddress] = useState(storeSettings.address);
  const [phone, setPhone] = useState(storeSettings.phone);
  const [taxRatePercent, setTaxRatePercent] = useState(
    ((storeSettings.taxRate || 0.0408) * 100).toFixed(1)
  );
  const [paperSize, setPaperSize] = useState<'58mm' | '80mm'>(
    storeSettings.paperSize || '58mm'
  );
  const [receiptFooter, setReceiptFooter] = useState(storeSettings.receiptFooter);
  const [enableTax, setEnableTax] = useState(storeSettings.enableTax);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const rate = parseFloat(taxRatePercent) / 100;
    updateStoreSettings({
      storeName,
      storeTagline,
      address,
      phone,
      taxRate: isNaN(rate) ? 0.0408 : rate,
      paperSize,
      receiptFooter,
      enableTax,
    });

    setNotification({
      type: 'success',
      text: 'Pengaturan toko & printer struk berhasil disimpan!',
    });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      const content = event.target?.result as string;
      if (content) {
        const result = importBackupJSON(content);
        if (result.success) {
          setNotification({ type: 'success', text: result.message });
        } else {
          setNotification({ type: 'error', text: result.message });
        }
        setTimeout(() => setNotification(null), 4000);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleResetData = () => {
    if (
      confirm(
        'Apakah Anda yakin ingin mereset seluruh data kembali ke kondisi demo awal? Semua transaksi tambahan akan dihapus.'
      )
    ) {
      resetToDemoData();
      setNotification({
        type: 'success',
        text: 'Data telah berhasil direset ke konfigurasi awal!',
      });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-stone-900 dark:text-stone-100 tracking-tight flex items-center gap-2.5">
          <Database className="w-7 h-7 text-emerald-600" />
          <span>Backup Data & Pengaturan Toko</span>
        </h1>
        <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
          Amankan database transaksi, atur printer thermal, dan sesuaikan profil toko Anda
        </p>
      </div>

      {notification && (
        <div
          className={`p-4 rounded-xl flex items-center gap-2.5 text-xs font-bold ${
            notification.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800'
              : 'bg-rose-50 text-rose-800 dark:bg-rose-950/80 dark:text-rose-200 border border-rose-200 dark:border-rose-800'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600" />
          )}
          <span>{notification.text}</span>
        </div>
      )}

      {/* Grid Section: Backup & Appearance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Backup Database Section */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-stone-900 dark:text-stone-100">
                Sistem Backup Database
              </h3>
              <p className="text-xs text-stone-400">
                Ekspor & Pulihkan cadangan data kapan saja
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-100 dark:border-stone-700/60 space-y-1 text-xs text-stone-600 dark:text-stone-300">
            <div className="flex justify-between">
              <span>Total Produk Aktif:</span>
              <span className="font-bold text-stone-900 dark:text-stone-100">{products.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Riwayat Transaksi:</span>
              <span className="font-bold text-stone-900 dark:text-stone-100">{transactions.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Catatan Log Stok:</span>
              <span className="font-bold text-stone-900 dark:text-stone-100">{stockLogs.length}</span>
            </div>
          </div>

          <div className="space-y-2.5 pt-1">
            <button
              onClick={exportBackupJSON}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition"
            >
              <Download className="w-4 h-4" />
              <span>Unduh File Backup Database (.JSON)</span>
            </button>

            <div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".json"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2.5 px-4 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 hover:bg-stone-50 dark:hover:bg-stone-700/60 text-stone-700 dark:text-stone-200 font-bold text-xs flex items-center justify-center gap-2 transition"
              >
                <Upload className="w-4 h-4" />
                <span>Pulihkan Database dari File (.JSON)</span>
              </button>
            </div>

            <button
              onClick={handleResetData}
              className="w-full py-2 px-4 rounded-xl text-stone-400 hover:text-rose-600 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset ke Pengaturan Awal Demo</span>
            </button>
          </div>
        </div>

        {/* Tampilan & Mode Gelap */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center text-amber-600">
              {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-extrabold text-base text-stone-900 dark:text-stone-100">
                Tampilan & Bahasa
              </h3>
              <p className="text-xs text-stone-400">
                Dukungan Bahasa Indonesia & Mode Gelap
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between p-3.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800/40">
              <div>
                <div className="text-xs font-bold text-stone-900 dark:text-stone-100">
                  Mode Gelap (Dark Theme)
                </div>
                <div className="text-[11px] text-stone-400">
                  Mengurangi kelelahan mata kasir saat shift malam
                </div>
              </div>
              <button
                onClick={toggleDarkMode}
                className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                  isDarkMode ? 'bg-emerald-600' : 'bg-stone-300'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    isDarkMode ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="p-3.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800/40">
              <div className="text-xs font-bold text-stone-900 dark:text-stone-100">
                Bahasa Sistem
              </div>
              <div className="text-[11px] text-stone-400 mt-0.5">
                Bahasa Indonesia (Standar POS Nasional & Mata Uang Rupiah)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profil Toko & Pengaturan Struk Form */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-stone-100 dark:border-stone-800">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-stone-900 dark:text-stone-100">
              Profil Toko & Printer Thermal
            </h3>
            <p className="text-xs text-stone-400">
              Sesuaikan informasi toko yang akan dicetak pada header & footer struk thermal
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveSettings} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                Nama Toko / Kafe
              </label>
              <input
                type="text"
                value={storeName}
                onChange={e => setStoreName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 text-xs bg-white dark:bg-stone-800 font-bold text-stone-900 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                Slogan / Tagline
              </label>
              <input
                type="text"
                value={storeTagline}
                onChange={e => setStoreTagline(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 text-xs bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                Alamat Lengkap Toko
              </label>
              <input
                type="text"
                value={address}
                onChange={e => setAddress(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 text-xs bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                Nomor Telepon / Kontak
              </label>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 text-xs bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                Format Kertas Printer Thermal
              </label>
              <select
                value={paperSize}
                onChange={e => setPaperSize(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 text-xs bg-white dark:bg-stone-800 font-bold"
              >
                <option value="58mm">58mm (Printer Kasir Mini / Bluetooth)</option>
                <option value="80mm">80mm (Printer Kasir Standar Resto)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                Tarif Pajak PPN (%)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="50"
                  value={taxRatePercent}
                  onChange={e => setTaxRatePercent(e.target.value)}
                  className="w-28 px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 text-xs bg-white dark:bg-stone-800 font-bold"
                />
                <label className="flex items-center gap-2 text-xs text-stone-600 dark:text-stone-400">
                  <input
                    type="checkbox"
                    checked={enableTax}
                    onChange={e => setEnableTax(e.target.checked)}
                    className="rounded text-emerald-600"
                  />
                  <span>Aktifkan Pajak pada Transaksi</span>
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
              Catatan Penutup Struk (Footer)
            </label>
            <textarea
              rows={2}
              value={receiptFooter}
              onChange={e => setReceiptFooter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 text-xs bg-white dark:bg-stone-800"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition"
            >
              Simpan Semua Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
