/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { POSProvider, usePOS } from './context/POSContext';
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
import { ShoppingBag, X } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { activeView, cartTotals } = usePOS();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isMobileBillOpen, setIsMobileBillOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-stone-100 dark:bg-stone-950 text-stone-900 dark:text-stone-100 font-sans">
      {/* 1. Left Sidebar Navigation */}
      <Sidebar />

      {/* 2. Center Content Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {activeView === 'pos' && (
          <POSView onOpenLoginModal={() => setIsLoginModalOpen(true)} />
        )}

        {activeView === 'stock' && (
          <div className="flex-1 h-screen overflow-y-auto">
            <StockManagement />
          </div>
        )}

        {activeView === 'reports' && (
          <div className="flex-1 h-screen overflow-y-auto">
            <DailyReport />
          </div>
        )}

        {activeView === 'analytics' && (
          <div className="flex-1 h-screen overflow-y-auto">
            <AnalyticsDashboard />
          </div>
        )}

        {activeView === 'master' && (
          <div className="flex-1 h-screen overflow-y-auto">
            <MasterDataView />
          </div>
        )}

        {activeView === 'settings' && (
          <div className="flex-1 h-screen overflow-y-auto">
            <BackupAndSettings />
          </div>
        )}

        {/* 3. Right Bill Panel (Shown on desktop when in POS view, or toggled on mobile) */}
        {activeView === 'pos' && (
          <div className="hidden xl:block">
            <BillPanel onOpenLoginModal={() => setIsLoginModalOpen(true)} />
          </div>
        )}
      </div>

      {/* Mobile Floating Cart Trigger for POS View */}
      {activeView === 'pos' && cartTotals.itemCount > 0 && (
        <div className="xl:hidden fixed bottom-4 right-4 z-30 print:hidden">
          <button
            onClick={() => setIsMobileBillOpen(true)}
            className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm flex items-center gap-3 shadow-xl shadow-emerald-600/40 animate-bounce"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-amber-400 text-stone-900 text-xs font-black flex items-center justify-center">
                {cartTotals.itemCount}
              </span>
            </div>
            <span>Lihat Bill Pesanan</span>
          </button>
        </div>
      )}

      {/* Mobile Bill Drawer */}
      {isMobileBillOpen && (
        <div className="xl:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-xs flex justify-end print:hidden">
          <div className="w-full max-w-md bg-white dark:bg-stone-900 h-full relative flex flex-col animate-in slide-in-from-right duration-200">
            <button
              onClick={() => setIsMobileBillOpen(false)}
              className="absolute top-4 right-4 z-10 p-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-500"
            >
              <X className="w-5 h-5" />
            </button>
            <BillPanel onOpenLoginModal={() => setIsLoginModalOpen(true)} />
          </div>
        </div>
      )}

      {/* Global Modals */}
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
