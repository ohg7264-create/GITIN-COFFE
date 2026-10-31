import React from 'react';
import {
  Banknote,
  CreditCard,
  Printer,
  Trash2,
  Minus,
  Plus,
  ShoppingBag,
  QrCode,
  UserCheck,
} from 'lucide-react';
import { usePOS } from '../../context/POSContext';
import { formatRupiah } from '../../utils/pos-logic';

interface BillPanelProps {
  onOpenLoginModal: () => void;
}

export const BillPanel: React.FC<BillPanelProps> = ({ onOpenLoginModal }) => {
  const {
    cart,
    cartTotals,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    currentUser,
    setIsPaymentModalOpen,
    setActivePaymentMethod,
    setIsReceiptModalOpen,
    setCurrentReceiptTx,
    transactions,
  } = usePOS();

  const handleOpenCashPayment = () => {
    if (cart.length === 0) return;
    setActivePaymentMethod('cash');
    setIsPaymentModalOpen(true);
  };

  const handleOpenDigitalPayment = () => {
    if (cart.length === 0) return;
    setActivePaymentMethod('qris');
    setIsPaymentModalOpen(true);
  };

  const handleDirectPrintOrPreview = () => {
    if (cart.length > 0) {
      // If there are cart items, open payment to complete checkout before printing
      setActivePaymentMethod('cash');
      setIsPaymentModalOpen(true);
    } else if (transactions.length > 0) {
      // Show latest receipt
      setCurrentReceiptTx(transactions[0]);
      setIsReceiptModalOpen(true);
    }
  };

  return (
    <aside className="w-full xl:w-96 flex-shrink-0 bg-white dark:bg-slate-900 border-l border-sky-100 dark:border-slate-800 flex flex-col h-full xl:h-screen sticky top-0 print:hidden transition-colors shadow-xs">
      {/* Top Header: Cashier profile matching mockup */}
      <div className="p-4 sm:p-5 border-b border-sky-100/80 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-pulse" />
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Bill
          </h2>
        </div>

        {/* Cashier Avatar & Name */}
        <button
          onClick={onOpenLoginModal}
          className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-full hover:bg-sky-50/70 dark:hover:bg-slate-800 transition text-left group"
          title="Klik untuk ganti kasir / admin"
        >
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 group-hover:text-sky-600 transition">
            {currentUser?.name || 'Gitin Arifysa Fadilah'}
          </span>
          <div className="relative">
            <img
              src={
                currentUser?.avatar ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
              }
              alt={currentUser?.name}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-sky-500/60"
            />
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-sky-500 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center">
              <UserCheck className="w-2 h-2 text-white" />
            </div>
          </div>
        </button>
      </div>

      {/* Bill Sub-Header: "Today" pill & cart count */}
      <div className="px-5 py-2.5 bg-slate-50/80 dark:bg-slate-800/40 border-b border-sky-100/80 dark:border-slate-800 flex items-center justify-between text-xs">
        <span className="font-semibold text-slate-500 dark:text-slate-400">
          Pesanan ({cartTotals.itemCount} item)
        </span>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border border-sky-200/60 dark:border-sky-800">
            Today
          </span>
          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="text-[11px] font-medium text-rose-600 hover:text-rose-700 dark:text-rose-400"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Bill Items List (styled strictly following the reference image) */}
      <div className="flex-1 p-5 overflow-y-auto space-y-4">
        {cart.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 dark:text-slate-500">
            <div className="w-14 h-14 rounded-2xl bg-sky-50 dark:bg-slate-800 text-sky-500 flex items-center justify-center mb-3">
              <ShoppingBag className="w-7 h-7 stroke-[1.5]" />
            </div>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Belum ada pesanan
            </p>
            <p className="text-xs mt-1 max-w-[200px]">
              Pilih menu di sebelah kiri untuk menambahkan ke bill
            </p>
          </div>
        ) : (
          cart.map(item => (
            <div
              key={item.cartItemId}
              className="group pb-3.5 border-b border-slate-100 dark:border-slate-800/80 last:border-b-0 space-y-1"
            >
              {/* Item Name & Item Total */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-1.5 font-bold text-sm text-slate-900 dark:text-white">
                  <span className="text-sky-500 font-extrabold">•</span>
                  <span>{item.name}</span>
                </div>
                <span className="text-sm font-bold text-slate-900 dark:text-white flex-shrink-0">
                  {formatRupiah(item.subtotal, false)}
                </span>
              </div>

              {/* Indented Options Breakdown (exact replica of the mockup) */}
              <div className="pl-4 text-xs space-y-0.5 text-slate-500 dark:text-slate-400 font-medium">
                <div className="flex justify-between items-center py-0.5">
                  <span>Amount</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => updateCartQuantity(item.cartItemId, -1)}
                      className="w-5 h-5 rounded flex items-center justify-center bg-slate-100 dark:bg-slate-800 hover:bg-sky-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition"
                      aria-label="Kurangi"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-4 text-center font-bold text-slate-900 dark:text-white">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateCartQuantity(item.cartItemId, 1)}
                      className="w-5 h-5 rounded flex items-center justify-center bg-slate-100 dark:bg-slate-800 hover:bg-sky-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition"
                      aria-label="Tambah"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div className="flex justify-between">
                  <span>Size</span>
                  <span className="text-slate-800 dark:text-slate-200 font-semibold">{item.size}</span>
                </div>

                {item.sugar && (
                  <div className="flex justify-between">
                    <span>Sugar</span>
                    <span className="text-slate-800 dark:text-slate-200 font-semibold">{item.sugar}</span>
                  </div>
                )}

                {item.ice && (
                  <div className="flex justify-between">
                    <span>Ice</span>
                    <span className="text-slate-800 dark:text-slate-200 font-semibold">{item.ice}</span>
                  </div>
                )}

                {item.toppings && item.toppings.length > 0 && (
                  <div className="flex justify-between">
                    <span>Topping</span>
                    <span className="text-sky-600 dark:text-sky-400 font-semibold">
                      {item.toppings.map(t => t.name).join(', ')}
                    </span>
                  </div>
                )}

                <div className="pt-1 flex justify-end">
                  <button
                    onClick={() => removeFromCart(item.cartItemId)}
                    className="opacity-60 group-hover:opacity-100 text-[11px] text-rose-500 hover:text-rose-700 flex items-center gap-1 transition"
                  >
                    <Trash2 className="w-3 h-3" /> Hapus
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Bill Footer & Totals */}
      <div className="p-5 border-t border-sky-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/90 space-y-3">
        {/* Sky Blue Divider */}
        <div className="h-0.5 bg-gradient-to-r from-sky-400 to-blue-500 rounded-full w-full mb-3" />

        {/* Sub Total */}
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold text-slate-600 dark:text-slate-400">Sub Total</span>
          <span className="font-bold text-slate-900 dark:text-white">
            {formatRupiah(cartTotals.subTotal, false)}
          </span>
        </div>

        {/* Taxes */}
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold text-slate-600 dark:text-slate-400">Taxes</span>
          <span className="font-bold text-slate-900 dark:text-white">
            {formatRupiah(cartTotals.tax, false)}
          </span>
        </div>

        {/* Total (Bold prominent text) */}
        <div className="flex items-center justify-between text-base pt-1">
          <span className="font-extrabold text-slate-900 dark:text-white">Total</span>
          <span className="text-xl font-black text-sky-600 dark:text-sky-400">
            {formatRupiah(cartTotals.total, false)}
          </span>
        </div>

        {/* Payment Buttons (Exact structure as seen in the mockup) */}
        <div className="pt-2 space-y-2.5">
          {/* Pay by Cash */}
          <button
            type="button"
            onClick={handleOpenCashPayment}
            disabled={cart.length === 0}
            className="w-full py-2.5 px-4 rounded-xl border-2 border-sky-500/80 bg-sky-50/70 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 font-bold text-sm flex items-center justify-between hover:bg-sky-100/70 dark:hover:bg-sky-900/50 disabled:opacity-40 disabled:pointer-events-none transition shadow-xs"
          >
            <span>Pay by Cash</span>
            <div className="w-8 h-6 rounded border border-sky-400 flex items-center justify-center bg-white dark:bg-slate-900">
              <Banknote className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            </div>
          </button>

          {/* Pay by Card / QRIS */}
          <button
            type="button"
            onClick={handleOpenDigitalPayment}
            disabled={cart.length === 0}
            className="w-full py-2.5 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-sm flex items-center justify-between hover:border-sky-300 hover:text-sky-600 dark:hover:bg-slate-700/60 disabled:opacity-40 disabled:pointer-events-none transition shadow-xs"
          >
            <div className="flex items-center gap-2">
              <span>Pay by Card / QRIS</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400">
              <QrCode className="w-4 h-4" />
              <CreditCard className="w-4 h-4" />
            </div>
          </button>

          {/* Invoice Printing button */}
          <button
            type="button"
            onClick={handleDirectPrintOrPreview}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-sky-500/25 active:scale-98 transition-all"
          >
            <span>Invoice Printing</span>
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
