import React, { useRef, useState } from 'react';
import {
  Printer,
  X,
  CheckCircle2,
  Share2,
  Copy,
  Check,
  RotateCcw,
} from 'lucide-react';
import { usePOS } from '../../context/POSContext';
import { formatRupiah } from '../../utils/pos-logic';

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
  const receiptPrintRef = useRef<HTMLDivElement>(null);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200 print:p-0 print:bg-white print:fixed print:inset-0">
      <div className="bg-white dark:bg-stone-900 w-full max-w-md rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden flex flex-col max-h-[95vh] print:border-none print:shadow-none print:max-w-none print:h-auto">
        {/* Modal Toolbar (hidden on print) */}
        <div className="p-4 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <h3 className="font-extrabold text-sm text-stone-900 dark:text-stone-100">
              Transaksi Berhasil
            </h3>
          </div>

          {/* Paper size toggle */}
          <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800 p-0.5 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setPaperWidth('58mm')}
              className={`px-2 py-0.5 rounded-md transition ${
                paperWidth === '58mm'
                  ? 'bg-white dark:bg-stone-700 text-emerald-700 dark:text-emerald-300 shadow-xs'
                  : 'text-stone-500'
              }`}
            >
              58mm
            </button>
            <button
              onClick={() => setPaperWidth('80mm')}
              className={`px-2 py-0.5 rounded-md transition ${
                paperWidth === '80mm'
                  ? 'bg-white dark:bg-stone-700 text-emerald-700 dark:text-emerald-300 shadow-xs'
                  : 'text-stone-500'
              }`}
            >
              80mm
            </button>
          </div>

          <button
            onClick={() => setIsReceiptModalOpen(false)}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800"
            aria-label="Tutup struk"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Receipt Container */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 flex justify-center bg-stone-100 dark:bg-stone-950/70 print:bg-white print:p-0">
          {/* Printable ESC/POS Monospaced Thermal Ticket */}
          <div
            ref={receiptPrintRef}
            id="thermal-receipt"
            className={`bg-white text-stone-900 p-5 shadow-lg border border-stone-200 print:shadow-none print:border-none print:m-0 font-mono text-[12px] leading-relaxed select-text ${
              paperWidth === '58mm' ? 'w-[280px]' : 'w-[360px]'
            }`}
            style={{
              fontFamily: "'JetBrains Mono', 'Courier New', Courier, monospace",
            }}
          >
            {/* Header / Store Info */}
            <div className="text-center space-y-0.5 pb-2">
              <div className="font-extrabold text-sm tracking-wider uppercase">
                {storeSettings.storeName}
              </div>
              <div className="text-[10px] text-stone-600">
                {storeSettings.storeTagline}
              </div>
              <div className="text-[10px] text-stone-600 leading-tight">
                {storeSettings.address}
              </div>
              <div className="text-[10px] text-stone-600">
                Telp: {storeSettings.phone}
              </div>
            </div>

            {/* Dashed line */}
            <div className="border-t border-dashed border-stone-400 my-2" />

            {/* Metadata */}
            <div className="text-[11px] space-y-0.5 text-stone-700">
              <div className="flex justify-between">
                <span>No. Struk</span>
                <span className="font-bold">{tx.invoiceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>Tanggal</span>
                <span>{formattedDate}</span>
              </div>
              <div className="flex justify-between">
                <span>Kasir</span>
                <span>{tx.cashierName}</span>
              </div>
              {tx.notes && (
                <div className="flex justify-between">
                  <span>Catatan</span>
                  <span className="font-semibold">{tx.notes}</span>
                </div>
              )}
            </div>

            {/* Dashed line */}
            <div className="border-t border-dashed border-stone-400 my-2" />

            {/* Itemized Table */}
            <div className="space-y-2 py-1 text-[11px]">
              {tx.items.map((item, index) => (
                <div key={index} className="space-y-0.5">
                  <div className="flex justify-between font-bold">
                    <span className="truncate pr-1">
                      {item.name} ({item.size})
                    </span>
                    <span>{formatRupiah(item.subtotal, false)}</span>
                  </div>
                  <div className="text-[10px] text-stone-600 pl-1">
                    <span>
                      {item.quantity} x {formatRupiah(item.unitPrice, false)}
                    </span>
                    {(item.sugar !== '100%' || item.ice !== '0%') && (
                      <span className="ml-1 text-stone-500">
                        [{item.sugar} Gula, {item.ice} Es]
                      </span>
                    )}
                  </div>
                  {item.toppings.length > 0 && (
                    <div className="text-[10px] text-stone-500 pl-2 italic">
                      + {item.toppings.map(t => t.name).join(', ')}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Dashed line */}
            <div className="border-t border-dashed border-stone-400 my-2" />

            {/* Financial Breakdown */}
            <div className="space-y-1 text-[11px]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatRupiah(tx.subTotal, false)}</span>
              </div>
              {tx.tax > 0 && (
                <div className="flex justify-between">
                  <span>Pajak (PPN)</span>
                  <span>{formatRupiah(tx.tax, false)}</span>
                </div>
              )}
              <div className="flex justify-between font-extrabold text-[13px] pt-1 border-t border-stone-300">
                <span>TOTAL</span>
                <span>{formatRupiah(tx.total, false)}</span>
              </div>
              <div className="flex justify-between text-[11px] pt-1 text-stone-700">
                <span className="uppercase">Bayar ({tx.paymentMethod})</span>
                <span>{formatRupiah(tx.amountPaid, false)}</span>
              </div>
              {tx.paymentMethod === 'cash' && (
                <div className="flex justify-between text-[11px] text-stone-700">
                  <span>Kembali</span>
                  <span className="font-bold">{formatRupiah(tx.change, false)}</span>
                </div>
              )}
              {tx.referenceNumber && (
                <div className="flex justify-between text-[10px] text-stone-500">
                  <span>Ref No</span>
                  <span>{tx.referenceNumber}</span>
                </div>
              )}
            </div>

            {/* Dashed line */}
            <div className="border-t border-dashed border-stone-400 my-2" />

            {/* Barcode & Footer Greetings */}
            <div className="text-center pt-1 space-y-1 text-[10px] text-stone-600">
              {/* Emulated Code128 / barcode lines */}
              <div className="flex justify-center items-center py-1 gap-[2px]">
                {Array.from({ length: 42 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-6 bg-stone-900 ${
                      i % 3 === 0 ? 'w-[2px]' : i % 5 === 0 ? 'w-[3px]' : 'w-[1px]'
                    }`}
                  />
                ))}
              </div>
              <div className="tracking-widest uppercase text-[9px] text-stone-500">
                {tx.invoiceNumber}
              </div>
              <div className="whitespace-pre-line pt-1 font-sans text-[10px] text-stone-700">
                {storeSettings.receiptFooter}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons Footer (hidden on print) */}
        <div className="p-4 border-t border-stone-100 dark:border-stone-800 bg-white dark:bg-stone-900 flex items-center gap-2 print:hidden">
          <button
            type="button"
            onClick={handleCopyReceiptText}
            className="p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 text-xs font-semibold flex items-center gap-1.5 transition"
            title="Salin teks struk"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span className="hidden sm:inline">{copied ? 'Tersalin' : 'Salin'}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-600/25 transition active:scale-98"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Struk (Thermal)</span>
          </button>

          <button
            type="button"
            onClick={() => setIsReceiptModalOpen(false)}
            className="p-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 text-xs font-bold transition"
            title="Selesai & Buka Transaksi Baru"
          >
            <span>Tutup</span>
          </button>
        </div>
      </div>
    </div>
  );
};
