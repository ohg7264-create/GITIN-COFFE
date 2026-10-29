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
  Database,
  FolderTree,
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
    <div className="flex flex-col lg:flex-row h-screen w-screen overflow-hidden bg-stone-100 dark:bg-stone-950 text-stone-900 dark:text-stone-100 font-sans transition-colors">
      {/* 1. Desktop Left Sidebar Navigation (hidden on mobile, fixed on lg+) */}
      <Sidebar />

      {/* 2. Mobile Top Navigation Header (visible only on < lg screens) */}
      <header className="lg:hidden sticky top-0 z-20 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md px-3.5 py-2.5 border-b border-stone-200/80 dark:border-stone-800 flex items-center justify-between print:hidden">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsMobileNavOpen(true)}
            className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-200 hover:bg-stone-200 dark:hover:bg-stone-700 transition"
            aria-label="Buka menu navigasi"
          >
            <Menu className="w-5 h-5" />
          </button>

          <button
            onClick={() => setActiveView('pos')}
            className="flex items-center gap-2 text-left"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-700 to-green-500 flex items-center justify-center shadow-xs">
              <svg className="w-5 h-5 text-white fill-current" viewBox="0 0 32 32" fill="none">
                <path
                  d="M12 7C9.23858 7 7 9.23858 7 12V20C7 22.7614 9.23858 25 12 25C14.7614 25 17 22.7614 17 20V12C17 9.23858 14.7614 7 12 7Z"
                  opacity="0.9"
                />
                <path d="M19 14C19 11.2386 21.2386 9 24 9C26.7614 9 29 11.2386 29 14V23C29 24.1046 28.1046 25 27 25H21C19.8954 25 19 24.1046 19 23V14Z" />
              </svg>
            </div>
            <span className="font-extrabold text-base tracking-tight text-stone-900 dark:text-stone-100">
              Aksara<span className="text-emerald-600">POS</span>
            </span>
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Dark mode switch */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-xl text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
            aria-label="Toggle mode gelap"
            title={isDarkMode ? 'Mode Terang' : 'Mode Gelap'}
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Cashier profile avatar */}
          <button
            onClick={() => setIsLoginModalOpen(true)}
            className="flex items-center gap-1.5 p-1 rounded-full bg-stone-100 dark:bg-stone-800 text-xs font-semibold hover:ring-2 hover:ring-emerald-500 transition"
            title="Ganti Kasir"
          >
            <img
              src={
                currentUser?.avatar ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
              }
              alt={currentUser?.name}
              className="w-7 h-7 rounded-full object-cover ring-1 ring-emerald-500"
            />
          </button>

          {/* Mobile Cart Trigger Button */}
          <button
            onClick={() => setIsMobileBillOpen(true)}
            className="relative p-2 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition"
            aria-label="Buka bill belanja"
          >
            <Receipt className="w-4 h-4" />
            {cartTotals.itemCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-400 text-stone-900 text-[10px] font-black flex items-center justify-center">
                {cartTotals.itemCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* 3. Center Content Area (Scrollable with mobile bottom nav spacing) */}
      <div className="flex-1 flex overflow-hidden relative pb-16 lg:pb-0">
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

        {/* 4. Desktop Right Bill Panel (Fixed right sidebar on desktop, hidden on mobile) */}
        {activeView === 'pos' && (
          <div className="hidden xl:block">
            <BillPanel onOpenLoginModal={() => setIsLoginModalOpen(true)} />
          </div>
        )}
      </div>

      {/* 5. Mobile Bottom Navigation Bar (thumb friendly for smartphone use) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-t border-stone-200 dark:border-stone-800 flex items-center justify-around py-1.5 px-2 print:hidden shadow-lg">
        <button
          onClick={() => setActiveView('pos')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition ${
            activeView === 'pos'
              ? 'text-emerald-600 dark:text-emerald-400 font-bold'
              : 'text-stone-500 dark:text-stone-400 font-medium'
          }`}
        >
          <ShoppingBag className="w-5 h-5" />
          <span className="text-[10px]">Kasir</span>
        </button>

        <button
          onClick={() => setActiveView('stock')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl relative transition ${
            activeView === 'stock'
              ? 'text-emerald-600 dark:text-emerald-400 font-bold'
              : 'text-stone-500 dark:text-stone-400 font-medium'
          }`}
        >
          <div className="relative">
            <Package className="w-5 h-5" />
            {lowStockCount > 0 && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            )}
          </div>
          <span className="text-[10px]">Stok</span>
        </button>

        <button
          onClick={() => setActiveView('reports')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition ${
            activeView === 'reports'
              ? 'text-emerald-600 dark:text-emerald-400 font-bold'
              : 'text-stone-500 dark:text-stone-400 font-medium'
          }`}
        >
          <FileText className="w-5 h-5" />
          <span className="text-[10px]">Laporan</span>
        </button>

        <button
          onClick={() => setActiveView('analytics')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition ${
            activeView === 'analytics'
              ? 'text-emerald-600 dark:text-emerald-400 font-bold'
              : 'text-stone-500 dark:text-stone-400 font-medium'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px]">Analitik</span>
        </button>

        {/* Mobile Bill trigger with total */}
        <button
          onClick={() => setIsMobileBillOpen(true)}
          className="flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-emerald-700 dark:text-emerald-400 relative font-bold"
        >
          <div className="relative">
            <Receipt className="w-5 h-5" />
            {cartTotals.itemCount > 0 && (
              <span className="absolute -top-1.5 -right-2 px-1 rounded-full bg-emerald-600 text-white text-[9px] font-black">
                {cartTotals.itemCount}
              </span>
            )}
          </div>
          <span className="text-[10px]">
            {cartTotals.total > 0 ? formatRupiah(cartTotals.total, false) : 'Bill'}
          </span>
        </button>
      </nav>

      {/* 6. Mobile Sidebar Navigation Drawer (opened via hamburger icon) */}
      {isMobileNavOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex animate-in fade-in duration-150 print:hidden">
          <div className="w-4/5 max-w-xs bg-white dark:bg-stone-900 h-full relative flex flex-col shadow-2xl animate-in slide-in-from-left duration-200">
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

      {/* 7. Mobile Bill Slide-over Drawer */}
      {isMobileBillOpen && (
        <div className="xl:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-150 print:hidden">
          <div
            className="flex-1 h-full"
            onClick={() => setIsMobileBillOpen(false)}
          />
          <div className="w-full max-w-md bg-white dark:bg-stone-900 h-full relative flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
            <div className="absolute top-4 right-4 z-20">
              <button
                onClick={() => setIsMobileBillOpen(false)}
                className="p-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-500 hover:text-stone-800 dark:hover:text-stone-100"
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
