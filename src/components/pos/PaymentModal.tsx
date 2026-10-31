import React, { useState, useEffect } from 'react';
import {
  X,
  Banknote,
  QrCode,
  CreditCard,
  Wallet,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Smartphone,
  Sparkles,
} from 'lucide-react';
import { usePOS } from '../../context/POSContext';
import { PaymentMethod } from '../../types/pos';
import { formatRupiah, calculateChange } from '../../utils/pos-logic';

export const PaymentModal: React.FC = () => {
  const {
    isPaymentModalOpen,
    setIsPaymentModalOpen,
    activePaymentMethod,
    setActivePaymentMethod,
    cartTotals,
    processCheckout,
  } = usePOS();

  const [cashTendered, setCashTendered] = useState<number>(0);
  const [customCashInput, setCustomCashInput] = useState<string>('');
  const [qrisTimer, setQrisTimer] = useState<number>(300); // 5 minutes countdown
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [cardNumber, setCardNumber] = useState<string>('');
  const [cardBank, setCardBank] = useState<string>('BCA');
  const [eWalletNumber, setEWalletNumber] = useState<string>('081234567890');
  const [eWalletProvider, setEWalletProvider] = useState<'gopay' | 'ovo' | 'dana'>('gopay');
  const [orderNotes, setOrderNotes] = useState<string>('');

  const grandTotal = cartTotals.total;

  // Initialize cash tender to total when modal opens
  useEffect(() => {
    if (isPaymentModalOpen) {
      setCashTendered(grandTotal);
      setCustomCashInput(grandTotal.toString());
      setQrisTimer(300);
      setIsProcessing(false);
    }
  }, [isPaymentModalOpen, grandTotal]);

  // QRIS countdown timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPaymentModalOpen && activePaymentMethod === 'qris' && qrisTimer > 0) {
      interval = setInterval(() => {
        setQrisTimer(prev => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPaymentModalOpen, activePaymentMethod, qrisTimer]);

  if (!isPaymentModalOpen) return null;

  const change = calculateChange(grandTotal, cashTendered);
  const isCashSufficient = cashTendered >= grandTotal;

  // Suggested tender denominations
  const quickTenderOptions = [
    { label: 'Uang Pas', value: grandTotal },
    { label: 'Rp 50.000', value: 50000 },
    { label: 'Rp 100.000', value: 100000 },
    { label: 'Rp 150.000', value: 150000 },
    { label: 'Rp 200.000', value: 200000 },
  ].filter(opt => opt.value >= grandTotal || opt.label === 'Uang Pas');

  const handleCashTenderClick = (value: number) => {
    setCashTendered(value);
    setCustomCashInput(value.toString());
  };

  const handleCustomCashChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '');
    const num = raw ? parseInt(raw, 10) : 0;
    setCashTendered(num);
    setCustomCashInput(raw);
  };

  const handleCompleteTransaction = (method: PaymentMethod, refNo?: string) => {
    setIsProcessing(true);
    setTimeout(() => {
      processCheckout(
        method,
        method === 'cash' ? cashTendered : grandTotal,
        refNo || `REF-${Date.now().toString().slice(-6)}`,
        orderNotes
      );
      setIsProcessing(false);
    }, 350);
  };

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-2xl shadow-2xl border border-sky-100 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-sky-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-sky-50/40 to-white dark:from-slate-900 dark:to-slate-900">
          <div>
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <span>Pembayaran Pesanan</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300 font-bold border border-sky-200 dark:border-sky-800">
                {cartTotals.itemCount} Item
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Gitin Coffe • Pilih metode pembayaran dan selesaikan transaksi
            </p>
          </div>
          <button
            onClick={() => setIsPaymentModalOpen(false)}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="Tutup modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Total Banner */}
        <div className="px-5 py-4 bg-gradient-to-r from-sky-50 to-blue-50/40 dark:from-sky-950/40 dark:to-slate-900 border-b border-sky-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-sky-800 dark:text-sky-300 uppercase tracking-wide">
              Total Tagihan
            </span>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Sudah termasuk pajak & diskon</p>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-sky-600 dark:text-sky-400 tracking-tight">
            {formatRupiah(grandTotal)}
          </span>
        </div>

        {/* Method Selector Tabs */}
        <div className="px-5 pt-3.5 grid grid-cols-4 gap-2 border-b border-sky-100 dark:border-slate-800 pb-3.5 bg-slate-50/50 dark:bg-slate-900">
          <button
            type="button"
            onClick={() => setActivePaymentMethod('cash')}
            className={`py-2 px-1 rounded-xl text-xs font-bold flex flex-col items-center gap-1.5 transition ${
              activePaymentMethod === 'cash'
                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/25 ring-2 ring-sky-500/20'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700 hover:bg-sky-50/60'
            }`}
          >
            <Banknote className="w-4 h-4" />
            <span>Tunai / Cash</span>
          </button>

          <button
            type="button"
            onClick={() => setActivePaymentMethod('qris')}
            className={`py-2 px-1 rounded-xl text-xs font-bold flex flex-col items-center gap-1.5 transition ${
              activePaymentMethod === 'qris'
                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/25 ring-2 ring-sky-500/20'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700 hover:bg-sky-50/60'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>QRIS Dinamis</span>
          </button>

          <button
            type="button"
            onClick={() => setActivePaymentMethod('card')}
            className={`py-2 px-1 rounded-xl text-xs font-bold flex flex-col items-center gap-1.5 transition ${
              activePaymentMethod === 'card'
                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/25 ring-2 ring-sky-500/20'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700 hover:bg-sky-50/60'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Kartu EDC</span>
          </button>

          <button
            type="button"
            onClick={() => setActivePaymentMethod('gopay')}
            className={`py-2 px-1 rounded-xl text-xs font-bold flex flex-col items-center gap-1.5 transition ${
              activePaymentMethod === 'gopay' || activePaymentMethod === 'ovo' || activePaymentMethod === 'dana'
                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/25 ring-2 ring-sky-500/20'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700 hover:bg-sky-50/60'
            }`}
          >
            <Wallet className="w-4 h-4" />
            <span>E-Wallet</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {/* TAB 1: CASH */}
          {activePaymentMethod === 'cash' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Uang Diterima (Rp)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400">
                    Rp
                  </span>
                  <input
                    type="text"
                    value={customCashInput ? parseInt(customCashInput, 10).toLocaleString('id-ID') : ''}
                    onChange={handleCustomCashChange}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 font-extrabold text-xl text-slate-900 dark:text-white focus:border-sky-500 focus:outline-none bg-white dark:bg-slate-800 shadow-xs"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Quick Cash Buttons */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                  Pilihan Cepat Nominal
                </label>
                <div className="flex flex-wrap gap-2">
                  {quickTenderOptions.map(opt => (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() => handleCashTenderClick(opt.value)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition ${
                        cashTendered === opt.value
                          ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-sky-400 hover:text-sky-600'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Kembalian Calculation */}
              <div
                className={`p-4 rounded-xl border ${
                  isCashSufficient
                    ? 'bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800 text-sky-900 dark:text-sky-200'
                    : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider">
                    {isCashSufficient ? 'Uang Kembalian:' : 'Uang Kurang:'}
                  </span>
                  <span className="text-xl font-black">
                    {isCashSufficient
                      ? formatRupiah(change)
                      : formatRupiah(grandTotal - cashTendered)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: QRIS */}
          {activePaymentMethod === 'qris' && (
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="bg-white p-4 rounded-2xl border-2 border-sky-100 shadow-lg shadow-sky-500/10">
                {/* Visual QR Code Generator */}
                <div className="w-48 h-48 bg-slate-900 p-2 rounded-xl flex flex-col items-center justify-center relative overflow-hidden">
                  <div className="w-full h-full bg-white p-2 rounded-lg flex flex-col items-center justify-center">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=00020101021226600016ID.CO.QRIS.WWW01189360000201112233440215ID102026102800153033605802ID5914GITIN%20COFFE6007JAKARTA62070703A016304`}
                      alt="QRIS Dinamis Gitin Coffe"
                      className="w-40 h-40 object-contain"
                    />
                  </div>
                </div>
                <div className="mt-2 text-[11px] font-bold tracking-wider text-sky-700 uppercase">
                  NMID: ID1020261028001 • GITIN COFFE
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-semibold">
                <Clock className="w-4 h-4" />
                <span>Berlaku hingga: {formatTimer(qrisTimer)}</span>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs">
                Mendukung BCA, Mandiri, BRI, BNI, GoPay, OVO, Dana, ShopeePay & LinkAja.
              </p>

              {/* Simulation button for cashier testing */}
              <button
                type="button"
                onClick={() => handleCompleteTransaction('qris', `QRIS-${Date.now().toString().slice(-6)}`)}
                disabled={isProcessing}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Simulasikan Pembayaran QRIS Pelanggan Berhasil</span>
              </button>
            </div>
          )}

          {/* TAB 3: CARD / EDC */}
          {activePaymentMethod === 'card' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Bank / Mesin EDC
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {['BCA', 'Mandiri', 'BRI', 'BNI'].map(bank => (
                    <button
                      key={bank}
                      type="button"
                      onClick={() => setCardBank(bank)}
                      className={`py-2 rounded-xl text-xs font-bold border transition ${
                        cardBank === bank
                          ? 'bg-sky-500 text-white border-sky-500 shadow-xs'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-sky-300'
                      }`}
                    >
                      {bank}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  4 Digit Terakhir Kartu / Kode Otorisasi EDC
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={cardNumber}
                  onChange={e => setCardNumber(e.target.value)}
                  placeholder="Contoh: 4321 atau APPROV-901"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white bg-white dark:bg-slate-800 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="p-3 bg-sky-50/70 dark:bg-sky-950/30 rounded-xl flex items-center gap-2.5 text-xs text-sky-800 dark:text-sky-300 border border-sky-100 dark:border-sky-900/40">
                <ShieldCheck className="w-5 h-5 text-sky-600 flex-shrink-0" />
                <span>Gesek atau tap kartu pelanggan pada mesin EDC kemudian masukkan nomor referensi.</span>
              </div>
            </div>
          )}

          {/* TAB 4: E-WALLET */}
          {(activePaymentMethod === 'gopay' ||
            activePaymentMethod === 'ovo' ||
            activePaymentMethod === 'dana') && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Pilih Layanan E-Wallet
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'gopay', label: 'GoPay', color: 'bg-sky-600' },
                    { id: 'ovo', label: 'OVO', color: 'bg-purple-600' },
                    { id: 'dana', label: 'DANA', color: 'bg-blue-600' },
                  ].map(ew => (
                    <button
                      key={ew.id}
                      type="button"
                      onClick={() => {
                        setEWalletProvider(ew.id as 'gopay' | 'ovo' | 'dana');
                        setActivePaymentMethod(ew.id as 'gopay' | 'ovo' | 'dana');
                      }}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                        eWalletProvider === ew.id
                          ? 'bg-sky-500 text-white border-sky-500 shadow-xs'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {ew.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nomor HP Pelanggan
                </label>
                <div className="relative">
                  <Smartphone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={eWalletNumber}
                    onChange={e => setEWalletNumber(e.target.value)}
                    placeholder="08xxxxxxxxxx"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white bg-white dark:bg-slate-800 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Optional order notes (e.g. Table number) */}
          <div className="pt-2">
            <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
              Catatan Pesanan / Meja (Opsional)
            </label>
            <input
              type="text"
              value={orderNotes}
              onChange={e => setOrderNotes(e.target.value)}
              placeholder="Contoh: Meja 04 / Takeaway tanpa sedotan"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800 focus:outline-none focus:border-sky-500"
            />
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="p-4 sm:p-5 border-t border-sky-100 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50/70 dark:bg-slate-900">
          <button
            type="button"
            onClick={() => setIsPaymentModalOpen(false)}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            Batal
          </button>

          <button
            type="button"
            disabled={
              isProcessing ||
              (activePaymentMethod === 'cash' && !isCashSufficient)
            }
            onClick={() => {
              if (activePaymentMethod === 'cash') {
                handleCompleteTransaction('cash');
              } else if (activePaymentMethod === 'card') {
                handleCompleteTransaction('card', `${cardBank}-${cardNumber || 'EDC'}`);
              } else if (
                activePaymentMethod === 'gopay' ||
                activePaymentMethod === 'ovo' ||
                activePaymentMethod === 'dana'
              ) {
                handleCompleteTransaction(activePaymentMethod, `${eWalletProvider.toUpperCase()}-${eWalletNumber.slice(-4)}`);
              } else {
                handleCompleteTransaction('qris');
              }
            }}
            className="flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 disabled:opacity-40 disabled:pointer-events-none text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-sky-500/25 transition active:scale-98"
          >
            <span>
              {isProcessing ? 'Memproses Transaksi...' : 'Konfirmasi & Selesaikan'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
