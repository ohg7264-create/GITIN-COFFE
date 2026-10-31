/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { POSProvider, usePOS, ActiveView } from './context/POSContext';
import { Sidebar } from './components/Sidebar';
import { POSView } from './components/pos/POSView';
import { BillPanel } from './components/pos/BillPanel';
import { StockManagement } from './components/stock/StockManagement';
import { DailyReport } from './components/reports/DailyReport';
import { AnalyticsDashboard } from './components/analytics/AnalyticsDashboard';
import { MasterDataView } from './components/master/MasterDataView';
import { BackupAndSettings } from './components/settings/BackupAndSettings';
import { PaymentModal } from './components/pos/PaymentModal';
import { ReceiptModal } from './components/pos/ReceiptModal';
import { LoginModal } from './components/auth/LoginModal';
import {
  ShoppingBag,
  Package,
  FileText,
  LayoutDashboard,
  Menu,
  X,
  Receipt,
  Sun,
  Moon,
  Coffee,
} from 'lucide-react';
import { checkLowStockAlerts, formatRupiah } from './utils/pos-logic';

const MainLayout: React.FC = () => {
  const {
    activeView,
    setActiveView,
    cartTotals,
    products,
    isDarkMode,
    toggleDarkMode,
    currentUser,
  } = usePOS();

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isMobileBillOpen, setIsMobileBillOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const lowStockCount = checkLowStockAlerts(products).length;

  return (
    <div className="flex flex-col lg:flex-row h-screen w-screen overflow-hidden bg-gradient-to-br from-sky-100 via-sky-50 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors">
      {/* 1. Desktop Left Sidebar Navigation (hidden on mobile, fixed on lg+) */}
      <Sidebar />

      {/* 2. Mobile Top Navigation Header (visible only on < lg screens) */}
      <header className="lg:hidden sticky top-0 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3.5 py-2 landscape:py-1.5 border-b border-sky-100 dark:border-slate-800 flex items-center justify-between print:hidden shadow-xs">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsMobileNavOpen(true)}
            className="p-1.5 sm:p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-sky-50 dark:hover:bg-slate-700 transition"
            aria-label="Buka menu navigasi"
          >
            <Menu className="w-5 h-5" />
          </button>

          <button
            onClick={() => setActiveView('pos')}
            className="flex items-center gap-2 text-left"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center shadow-md shadow-sky-500/20 text-white">
              <Coffee className="w-4 h-4 stroke-[2.5]" />
            </div>
            <span className="font-extrabold text-sm sm:text-base tracking-tight text-slate-900 dark:text-white">
              Gitin<span className="text-sky-500 font-black">Coffe</span>
            </span>
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Dark mode switch */}
          <button
            onClick={toggleDarkMode}
            className="p-1.5 sm:p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="Toggle mode gelap"
            title={isDarkMode ? 'Mode Terang' : 'Mode Gelap'}
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Cashier profile avatar */}
          <button
            onClick={() => setIsLoginModalOpen(true)}
            className="flex items-center gap-1.5 p-0.5 sm:p-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-semibold hover:ring-2 hover:ring-sky-500 transition"
            title="Ganti Kasir"
          >
            <img
              src={
                currentUser?.avatar ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
              }
              alt={currentUser?.name}
              className="w-6 h-6 sm:w-7 sm:h-7 rounded-full object-cover ring-1 ring-sky-500"
            />
          </button>

          {/* Mobile Cart / Bill Trigger Button in Header */}
          <button
            onClick={() => setIsMobileBillOpen(true)}
            className="relative p-1.5 sm:p-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold hover:from-sky-600 hover:to-blue-700 shadow-md shadow-sky-500/25 transition flex items-center gap-1.5"
            aria-label="Buka bill belanja"
          >
            <Receipt className="w-4 h-4" />
            <span className="hidden sm:inline text-xs font-extrabold">Bill</span>
            {cartTotals.itemCount > 0 && (
              <span className="absolute -top-1 -right-1 sm:static w-4 h-4 rounded-full bg-amber-400 text-slate-900 text-[10px] font-black flex items-center justify-center shadow-xs">
                {cartTotals.itemCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* 3. Center Content Area (Scrollable with mobile bottom nav spacing) */}
      <div className="flex-1 flex overflow-hidden relative pb-16 landscape:pb-12 lg:pb-0">
        {activeView === 'pos' && (
          <POSView onOpenLoginModal={() => setIsLoginModalOpen(true)} />
        )}

        {activeView === 'stock' && (
          <div className="flex-1 h-full overflow-y-auto">
            <StockManagement />
          </div>
        )}

        {activeView === 'reports' && (
          <div className="flex-1 h-full overflow-y-auto">
            <DailyReport />
          </div>
        )}

        {activeView === 'analytics' && (
          <div className="flex-1 h-full overflow-y-auto">
            <AnalyticsDashboard />
          </div>
        )}

        {activeView === 'master' && (
          <div className="flex-1 h-full overflow-y-auto">
            <MasterDataView />
          </div>
        )}

        {activeView === 'settings' && (
          <div className="flex-1 h-full overflow-y-auto">
            <BackupAndSettings />
          </div>
        )}

        {/* 4. Desktop Right Bill Panel (Fixed right sidebar on desktop, visible on lg+) */}
        {activeView === 'pos' && (
          <div className="hidden lg:block">
            <BillPanel onOpenLoginModal={() => setIsLoginModalOpen(true)} />
          </div>
        )}

        {/* 4b. Floating Menu Bar Bill (Ensures bill is always accessible in mobile landscape and portrait) */}
        {activeView === 'pos' && (
          <div className="lg:hidden fixed bottom-16 landscape:bottom-12 right-3 z-30 pointer-events-auto">
            <button
              onClick={() => setIsMobileBillOpen(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-sky-500 via-sky-600 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white pl-3 pr-3.5 py-1.5 sm:py-2 rounded-full shadow-lg shadow-sky-500/35 border border-white/30 backdrop-blur-xs active:scale-95 transition"
              aria-label="Buka Menu Bill"
            >
              <div className="relative flex items-center justify-center">
                <Receipt className="w-4 h-4 stroke-[2.5]" />
                {cartTotals.itemCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 px-1 rounded-full bg-amber-400 text-slate-900 text-[9px] font-black leading-none py-0.5 shadow-xs">
                    {cartTotals.itemCount}
                  </span>
                )}
              </div>
              <span className="text-xs font-bold tracking-tight">
                Menu Bill
              </span>
              {cartTotals.total > 0 && (
                <span className="text-[11px] font-extrabold bg-white/20 px-2 py-0.5 rounded-full">
                  {formatRupiah(cartTotals.total, false)}
                </span>
              )}
            </button>
          </div>
        )}
      </div>

      {/* 5. Mobile Bottom Navigation Bar (thumb friendly for smartphone use) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-sky-100 dark:border-slate-800 flex items-center justify-around py-1 sm:py-1.5 px-2 landscape:py-0.5 print:hidden shadow-lg">
        <button
          onClick={() => setActiveView('pos')}
          className={`flex flex-col items-center gap-0.5 sm:gap-1 py-1 px-2.5 rounded-xl transition ${
            activeView === 'pos'
              ? 'text-sky-600 dark:text-sky-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 font-medium'
          }`}
        >
          <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="text-[9px] sm:text-[10px]">Kasir</span>
        </button>

        <button
          onClick={() => setActiveView('stock')}
          className={`flex flex-col items-center gap-0.5 sm:gap-1 py-1 px-2.5 rounded-xl relative transition ${
            activeView === 'stock'
              ? 'text-sky-600 dark:text-sky-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 font-medium'
          }`}
        >
          <div className="relative">
            <Package className="w-4 h-4 sm:w-5 sm:h-5" />
            {lowStockCount > 0 && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            )}
          </div>
          <span className="text-[9px] sm:text-[10px]">Stok</span>
        </button>

        <button
          onClick={() => setActiveView('reports')}
          className={`flex flex-col items-center gap-0.5 sm:gap-1 py-1 px-2.5 rounded-xl transition ${
            activeView === 'reports'
              ? 'text-sky-600 dark:text-sky-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 font-medium'
          }`}
        >
          <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="text-[9px] sm:text-[10px]">Laporan</span>
        </button>

        <button
          onClick={() => setActiveView('analytics')}
          className={`flex flex-col items-center gap-0.5 sm:gap-1 py-1 px-2.5 rounded-xl transition ${
            activeView === 'analytics'
              ? 'text-sky-600 dark:text-sky-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 font-medium'
          }`}
        >
          <LayoutDashboard className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="text-[9px] sm:text-[10px]">Analitik</span>
        </button>

        {/* Mobile Bill menu button with total */}
        <button
          onClick={() => setIsMobileBillOpen(true)}
          className="flex flex-col items-center gap-0.5 sm:gap-1 py-1 px-2.5 rounded-xl text-sky-600 dark:text-sky-400 relative font-bold"
        >
          <div className="relative">
            <Receipt className="w-4 h-4 sm:w-5 sm:h-5" />
            {cartTotals.itemCount > 0 && (
              <span className="absolute -top-1.5 -right-2 px-1 rounded-full bg-sky-500 text-white text-[9px] font-black">
                {cartTotals.itemCount}
              </span>
            )}
          </div>
          <span className="text-[9px] sm:text-[10px]">
            {cartTotals.total > 0 ? formatRupiah(cartTotals.total, false) : 'Bill'}
          </span>
        </button>
      </nav>

      {/* 6. Mobile Sidebar Navigation Drawer (opened via hamburger icon) */}
      {isMobileNavOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex animate-in fade-in duration-150 print:hidden">
          <div className="w-4/5 max-w-xs bg-white dark:bg-slate-900 h-full relative flex flex-col shadow-2xl animate-in slide-in-from-left duration-200">
            <Sidebar
              isMobileDrawer={true}
              onCloseMobile={() => setIsMobileNavOpen(false)}
            />
          </div>
          <div
            className="flex-1 h-full"
            onClick={() => setIsMobileNavOpen(false)}
          />
        </div>
      )}

      {/* 7. Mobile Bill Slide-over Drawer (visible on < lg screens) */}
      {isMobileBillOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-150 print:hidden">
          <div
            className="flex-1 h-full"
            onClick={() => setIsMobileBillOpen(false)}
          />
          <div className="w-full sm:w-96 max-w-full bg-white dark:bg-slate-900 h-full relative flex flex-col shadow-2xl animate-in slide-in-from-right duration-200 overflow-y-auto">
            <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20">
              <button
                onClick={() => setIsMobileBillOpen(false)}
                className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-100 shadow-xs"
                aria-label="Tutup bill"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <BillPanel onOpenLoginModal={() => setIsLoginModalOpen(true)} />
          </div>
        </div>
      )}

      {/* 8. Global Modals */}
      <PaymentModal />
      <ReceiptModal />
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <POSProvider>
      <MainLayout />
    </POSProvider>
  );
}
