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
    }, 400);
  };

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-stone-900 w-full max-w-xl rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-lg text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <span>Pembayaran Pesanan</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 font-bold">
                {cartTotals.itemCount} Item
              </span>
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              Pilih metode pembayaran dan verifikasi nominal
            </p>
          </div>
          <button
            onClick={() => setIsPaymentModalOpen(false)}
            className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
            aria-label="Tutup modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Total Banner */}
        <div className="px-5 py-3.5 bg-emerald-50/80 dark:bg-emerald-950/30 border-b border-emerald-100 dark:border-emerald-900/40 flex items-center justify-between">
          <span className="text-xs font-semibold text-emerald-900 dark:text-emerald-200">
            Total Tagihan:
          </span>
          <span className="text-2xl font-black text-emerald-700 dark:text-emerald-400">
            {formatRupiah(grandTotal)}
          </span>
        </div>

        {/* Method Selector Tabs */}
        <div className="px-5 pt-3 grid grid-cols-4 gap-2 border-b border-stone-100 dark:border-stone-800 pb-3">
          <button
            type="button"
            onClick={() => setActivePaymentMethod('cash')}
            className={`py-2 px-1 rounded-xl text-xs font-bold flex flex-col items-center gap-1.5 transition ${
              activePaymentMethod === 'cash'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
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
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
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
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
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
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
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
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                  Uang Diterima (Rp)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-stone-400">
                    Rp
                  </span>
                  <input
                    type="text"
                    value={customCashInput ? parseInt(customCashInput, 10).toLocaleString('id-ID') : ''}
                    onChange={handleCustomCashChange}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-stone-200 dark:border-stone-700 font-extrabold text-xl text-stone-900 dark:text-white focus:border-emerald-500 focus:outline-none bg-white dark:bg-stone-800"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Quick Cash Buttons */}
              <div>
                <label className="block text-xs font-semibold text-stone-500 dark:text-stone-400 mb-1.5">
                  Nominal Cepat
                </label>
                <div className="flex flex-wrap gap-2">
                  {quickTenderOptions.map(opt => (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() => handleCashTenderClick(opt.value)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition ${
                        cashTendered === opt.value
                          ? 'bg-emerald-700 text-white border-emerald-700'
                          : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:border-emerald-400'
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
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
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
              <div className="bg-white p-4 rounded-2xl border-2 border-stone-200 shadow-md">
                {/* Visual QR Code Generator */}
                <div className="w-48 h-48 bg-stone-900 p-2 rounded-xl flex flex-col items-center justify-center relative overflow-hidden">
                  {/* Stylized QR pattern */}
                  <div className="w-full h-full bg-white p-2 rounded-lg flex flex-col items-center justify-center">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=00020101021226600016ID.CO.QRIS.WWW01189360000201112233440215ID102026102800153033605802ID5914AKSARA%20CAFE6007JAKARTA62070703A016304`}
                      alt="QRIS Dinamis"
                      className="w-40 h-40 object-contain"
                    />
                  </div>
                </div>
                <div className="mt-2 text-[11px] font-bold tracking-wider text-stone-500 uppercase">
                  NMID: ID1020261028001
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-semibold">
                <Clock className="w-4 h-4" />
                <span>Berlaku hingga: {formatTimer(qrisTimer)}</span>
              </div>

              <p className="text-xs text-stone-500 dark:text-stone-400 max-w-xs">
                Mendukung BCA, Mandiri, BRI, BNI, GoPay, OVO, Dana, ShopeePay, LinkAja & semua bank.
              </p>

              {/* Simulation button for cashier testing */}
              <button
                type="button"
                onClick={() => handleCompleteTransaction('qris', `QRIS-${Date.now().toString().slice(-6)}`)}
                disabled={isProcessing}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Simulasikan Pembayaran Pelanggan Berhasil</span>
              </button>
            </div>
          )}

          {/* TAB 3: CARD / EDC */}
          {activePaymentMethod === 'card' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
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
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300'
                      }`}
                    >
                      {bank}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  4 Digit Terakhir Kartu / Kode Otorisasi EDC
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={cardNumber}
                  onChange={e => setCardNumber(e.target.value)}
                  placeholder="Contoh: 4321 atau APPROV-901"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 text-sm font-semibold text-stone-900 dark:text-white bg-white dark:bg-stone-800 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="p-3 bg-stone-50 dark:bg-stone-800 rounded-xl flex items-center gap-2.5 text-xs text-stone-600 dark:text-stone-400">
                <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
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
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                  Pilih Layanan E-Wallet
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'gopay', label: 'GoPay', color: 'bg-emerald-600' },
                    { id: 'ovo', label: 'OVO', color: 'bg-purple-600' },
                    { id: 'dana', label: 'DANA', color: 'bg-blue-600' },
                  ].map(ew => (
                    <button
                      key={ew.id}
                      type="button"
                      onClick={() => {
                        setEWalletProvider(ew.id as any);
                        setActivePaymentMethod(ew.id as any);
                      }}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                        eWalletProvider === ew.id
                          ? 'bg-stone-900 text-white dark:bg-white dark:text-stone-900'
                          : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300'
                      }`}
                    >
                      {ew.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Nomor HP Pelanggan
                </label>
                <div className="relative">
                  <Smartphone className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={eWalletNumber}
                    onChange={e => setEWalletNumber(e.target.value)}
                    placeholder="08xxxxxxxxxx"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 text-sm font-semibold text-stone-900 dark:text-white bg-white dark:bg-stone-800 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Optional order notes (e.g. Table number) */}
          <div className="pt-2">
            <label className="block text-[11px] font-semibold text-stone-500 dark:text-stone-400 mb-1">
              Catatan Pesanan / Meja (Opsional)
            </label>
            <input
              type="text"
              value={orderNotes}
              onChange={e => setOrderNotes(e.target.value)}
              placeholder="Contoh: Meja 04 / Takeaway tanpa sedotan"
              className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 text-xs text-stone-800 dark:text-stone-200 bg-white dark:bg-stone-800 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="p-4 sm:p-5 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between gap-3 bg-stone-50/50 dark:bg-stone-900">
          <button
            type="button"
            onClick={() => setIsPaymentModalOpen(false)}
            className="px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 font-semibold text-xs hover:bg-stone-100 dark:hover:bg-stone-800 transition"
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
            className="flex-1 py-3 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:pointer-events-none text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-600/25 transition active:scale-98"
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
