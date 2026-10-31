import React, { useRef, useState, useEffect } from 'react';
import {
  Printer,
  X,
  CheckCircle2,
  Copy,
  Check,
  Volume2,
  Sparkles,
} from 'lucide-react';
import { usePOS } from '../../context/POSContext';
import { formatRupiah } from '../../utils/pos-logic';
import { soundEffects } from '../../utils/sound';
import { CelebrationEffect } from './CelebrationEffect';

export const ReceiptModal: React.FC = () => {
  const {
    isReceiptModalOpen,
    setIsReceiptModalOpen,
    currentReceiptTx,
    storeSettings,
  } = usePOS();

  const [paperWidth, setPaperWidth] = useState<'58mm' | '80mm'>(
    storeSettings.paperSize || '58mm'
  );
  const [copied, setCopied] = useState(false);
  const [isPlayingSound, setIsPlayingSound] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const receiptPrintRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isReceiptModalOpen) {
      setShowCelebration(true);
      const timer = setTimeout(() => {
        setShowCelebration(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isReceiptModalOpen]);

  if (!isReceiptModalOpen || !currentReceiptTx) return null;

  const tx = currentReceiptTx;
  const formattedDate = new Date(tx.timestamp).toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const handlePrint = () => {
    window.print();
  };

  const handlePlaySound = () => {
    soundEffects.playPaymentSuccess();
    setIsPlayingSound(true);
    setTimeout(() => setIsPlayingSound(false), 1200);
  };

  const handleCopyReceiptText = () => {
    const lines = [
      `==============================`,
      `${storeSettings.storeName.toUpperCase()}`,
      `${storeSettings.address}`,
      `Telp: ${storeSettings.phone}`,
      `==============================`,
      `No. Struk : ${tx.invoiceNumber}`,
      `Waktu     : ${formattedDate}`,
      `Kasir     : ${tx.cashierName}`,
      tx.notes ? `Catatan   : ${tx.notes}` : '',
      `------------------------------`,
      ...tx.items.map(
        i =>
          `${i.name} (${i.size})\n  ${i.quantity} x ${formatRupiah(i.unitPrice, false)} = ${formatRupiah(i.subtotal, false)}${
            i.toppings.length ? `\n  + ${i.toppings.map(t => t.name).join(', ')}` : ''
          }`
      ),
      `------------------------------`,
      `Subtotal   : ${formatRupiah(tx.subTotal)}`,
      `Pajak      : ${formatRupiah(tx.tax)}`,
      `TOTAL      : ${formatRupiah(tx.total)}`,
      `Metode     : ${tx.paymentMethod.toUpperCase()}`,
      `Bayar      : ${formatRupiah(tx.amountPaid)}`,
      `Kembali    : ${formatRupiah(tx.change)}`,
      `==============================`,
      `${storeSettings.receiptFooter}`,
    ]
      .filter(Boolean)
      .join('\n');

    navigator.clipboard.writeText(lines).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <>
      {/* Visual Celebration Confetti & Banner */}
      <CelebrationEffect
        isOpen={showCelebration}
        onClose={() => setShowCelebration(false)}
        invoiceNumber={tx.invoiceNumber}
        totalAmount={formatRupiah(tx.total)}
        paymentMethod={tx.paymentMethod}
      />

      <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200 print:p-0 print:bg-white print:fixed print:inset-0">
        <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-sky-100 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh] print:border-none print:shadow-none print:max-w-none print:h-auto">
          {/* Modal Toolbar (hidden on print) */}
          <div className="p-3.5 sm:p-4 border-b border-sky-100 dark:border-slate-800 bg-gradient-to-r from-sky-50/50 to-white dark:from-slate-900 dark:to-slate-800/50 flex items-center justify-between print:hidden">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-sky-500 text-white flex items-center justify-center shadow-xs">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                  Transaksi Berhasil
                </h3>
                <span className="text-[10px] text-sky-600 dark:text-sky-400 font-semibold">
                  Gitin Coffe POS
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Play sound again button */}
              <button
                onClick={handlePlaySound}
                className={`p-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 transition ${
                  isPlayingSound
                    ? 'bg-sky-500 text-white border-sky-500'
                    : 'bg-white dark:bg-slate-800 border-sky-200 dark:border-slate-700 text-sky-600 dark:text-sky-400 hover:bg-sky-50'
                }`}
                title="Putar suara efek pembayaran"
              >
                <Volume2 className={`w-3.5 h-3.5 ${isPlayingSound ? 'animate-pulse' : ''}`} />
                <span className="hidden sm:inline text-[11px]">Suara</span>
              </button>

              {/* Paper size toggle */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-xs font-semibold">
                <button
                  onClick={() => setPaperWidth('58mm')}
                  className={`px-2 py-0.5 rounded-md transition ${
                    paperWidth === '58mm'
                      ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-300 shadow-xs'
                      : 'text-slate-500'
                  }`}
                >
                  58mm
                </button>
                <button
                  onClick={() => setPaperWidth('80mm')}
                  className={`px-2 py-0.5 rounded-md transition ${
                    paperWidth === '80mm'
                      ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-300 shadow-xs'
                      : 'text-slate-500'
                  }`}
                >
                  80mm
                </button>
              </div>

              <button
                onClick={() => setIsReceiptModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="Tutup struk"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Receipt Preview Body (Styled like thermal receipt paper) */}
          <div className="flex-1 overflow-y-auto p-4 bg-slate-100/60 dark:bg-slate-950/70 flex justify-center">
            <div
              id="thermal-receipt"
              ref={receiptPrintRef}
              className={`bg-white text-slate-900 p-4 sm:p-5 rounded-lg shadow-sm border border-slate-200 font-mono text-xs transition-all ${
                paperWidth === '58mm' ? 'max-w-[280px] w-full' : 'max-w-[340px] w-full'
              }`}
              style={{
                fontFamily: `'JetBrains Mono', 'Courier New', monospace`,
              }}
            >
              {/* Receipt Header */}
              <div className="text-center space-y-1 pb-3 border-b border-dashed border-slate-400">
                <div className="flex items-center justify-center gap-1 text-slate-900">
                  <span className="font-extrabold text-base tracking-tight uppercase">
                    {storeSettings.storeName}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 font-sans">{storeSettings.storeTagline}</p>
                <p className="text-[10px] text-slate-600 font-sans leading-tight mt-1">
                  {storeSettings.address}
                </p>
                <p className="text-[10px] text-slate-600 font-sans">Telp: {storeSettings.phone}</p>
              </div>

              {/* Transaction Metadata */}
              <div className="py-2.5 text-[11px] space-y-1 border-b border-dashed border-slate-400 text-slate-700">
                <div className="flex justify-between">
                  <span>No. Struk</span>
                  <span className="font-bold text-slate-900">{tx.invoiceNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span>Waktu</span>
                  <span>{formattedDate}</span>
                </div>
                <div className="flex justify-between">
                  <span>Kasir</span>
                  <span>{tx.cashierName}</span>
                </div>
                {tx.notes && (
                  <div className="flex justify-between text-slate-500">
                    <span>Catatan</span>
                    <span className="italic">{tx.notes}</span>
                  </div>
                )}
              </div>

              {/* Items List */}
              <div className="py-2.5 space-y-2 border-b border-dashed border-slate-400">
                {tx.items.map(item => (
                  <div key={item.cartItemId} className="text-[11px]">
                    <div className="font-bold flex justify-between text-slate-900">
                      <span>{item.name}</span>
                      <span>{formatRupiah(item.subtotal)}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 flex justify-between pl-2">
                      <span>
                        {item.quantity} x {formatRupiah(item.unitPrice, false)}
                        {item.size ? ` • Size: ${item.size}` : ''}
                      </span>
                    </div>
                    {item.toppings.length > 0 && (
                      <div className="text-[9px] text-slate-500 pl-2">
                        + Topping: {item.toppings.map(t => t.name).join(', ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Calculation Summary */}
              <div className="py-2.5 space-y-1 text-[11px]">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span>{formatRupiah(tx.subTotal)}</span>
                </div>
                {tx.tax > 0 && (
                  <div className="flex justify-between text-slate-600">
                    <span>Pajak (PB1)</span>
                    <span>{formatRupiah(tx.tax)}</span>
                  </div>
                )}
                {tx.discount > 0 && (
                  <div className="flex justify-between text-sky-600">
                    <span>Diskon</span>
                    <span>-{formatRupiah(tx.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-extrabold text-sm text-slate-900 pt-1 border-t border-slate-200">
                  <span>TOTAL</span>
                  <span>{formatRupiah(tx.total)}</span>
                </div>

                <div className="pt-2 border-t border-dashed border-slate-300 space-y-1 text-slate-700">
                  <div className="flex justify-between uppercase">
                    <span>Metode</span>
                    <span className="font-bold text-slate-900">
                      {tx.paymentMethod === 'cash'
                        ? 'TUNAI / CASH'
                        : tx.paymentMethod === 'qris'
                        ? 'QRIS DIGITAL'
                        : tx.paymentMethod === 'card'
                        ? 'KARTU DEBIT/KREDIT'
                        : 'E-WALLET'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bayar</span>
                    <span>{formatRupiah(tx.amountPaid)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>Kembalian</span>
                    <span>{formatRupiah(tx.change)}</span>
                  </div>
                </div>

                {tx.referenceNumber && (
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>Ref No</span>
                    <span>{tx.referenceNumber}</span>
                  </div>
                )}
              </div>

              {/* Dashed line */}
              <div className="border-t border-dashed border-slate-400 my-2" />

              {/* Barcode & Footer Greetings */}
              <div className="text-center pt-1 space-y-1 text-[10px] text-slate-600">
                {/* Emulated Code128 / barcode lines */}
                <div className="flex justify-center items-center py-1 gap-[2px]">
                  {Array.from({ length: 42 }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-6 bg-slate-900 ${
                        i % 3 === 0 ? 'w-[2px]' : i % 5 === 0 ? 'w-[3px]' : 'w-[1px]'
                      }`}
                    />
                  ))}
                </div>
                <div className="tracking-widest uppercase text-[9px] text-slate-500">
                  {tx.invoiceNumber}
                </div>
                <div className="whitespace-pre-line pt-1 font-sans text-[10px] text-slate-700">
                  {storeSettings.receiptFooter}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons Footer (hidden on print) */}
          <div className="p-3.5 sm:p-4 border-t border-sky-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2 print:hidden">
            <button
              type="button"
              onClick={handleCopyReceiptText}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5 transition"
              title="Salin teks struk"
            >
              {copied ? <Check className="w-4 h-4 text-sky-600" /> : <Copy className="w-4 h-4" />}
              <span className="hidden sm:inline">{copied ? 'Tersalin' : 'Salin'}</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-sky-500/25 transition active:scale-98"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Struk (Thermal)</span>
            </button>

            <button
              type="button"
              onClick={() => setIsReceiptModalOpen(false)}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold transition"
              title="Selesai & Buka Transaksi Baru"
            >
              <span>Tutup</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
