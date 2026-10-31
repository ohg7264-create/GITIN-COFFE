import React from 'react';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  FileText,
  Database,
  Moon,
  Sun,
  Coffee,
  GlassWater,
  Utensils,
  Soup,
  CakeSlice,
  AlertTriangle,
  FolderTree,
  X,
} from 'lucide-react';
import { usePOS, ActiveView } from '../context/POSContext';
import { checkLowStockAlerts } from '../utils/pos-logic';

interface SidebarProps {
  isMobileDrawer?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileDrawer = false, onCloseMobile }) => {
  const {
    activeView,
    setActiveView,
    categories,
    selectedCategory,
    setSelectedCategory,
    isDarkMode,
    toggleDarkMode,
    products,
  } = usePOS();

  const lowStockItems = checkLowStockAlerts(products);

  const drinkCategories = categories.filter(c => c.type === 'drink');
  const foodCategories = categories.filter(c => c.type === 'food');

  const getCategoryIcon = (slug: string) => {
    switch (slug) {
      case 'coffee':
        return <Coffee className="w-4 h-4 text-white" />;
      case 'cold-brew':
        return <Coffee className="w-4 h-4 text-white" />;
      case 'juice':
        return <GlassWater className="w-4 h-4 text-white" />;
      case 'burger':
        return <Utensils className="w-4 h-4 text-white" />;
      case 'noodle':
        return <Soup className="w-4 h-4 text-white" />;
      case 'cake':
        return <CakeSlice className="w-4 h-4 text-white" />;
      default:
        return <Coffee className="w-4 h-4 text-white" />;
    }
  };

  const navItems: Array<{ id: ActiveView; label: string; icon: React.ReactNode; badge?: number }> = [
    { id: 'pos', label: 'Kasir POS', icon: <ShoppingBag className="w-4 h-4" /> },
    {
      id: 'stock',
      label: 'Stok Barang',
      icon: <Package className="w-4 h-4" />,
      badge: lowStockItems.length > 0 ? lowStockItems.length : undefined,
    },
    { id: 'reports', label: 'Laporan Penjualan', icon: <FileText className="w-4 h-4" /> },
    { id: 'analytics', label: 'Dasbor Analitik', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'master', label: 'Master Data', icon: <FolderTree className="w-4 h-4" /> },
    { id: 'settings', label: 'Backup & Pengaturan', icon: <Database className="w-4 h-4" /> },
  ];

  const handleNavClick = (viewId: ActiveView) => {
    setActiveView(viewId);
    if (isMobileDrawer && onCloseMobile) {
      onCloseMobile();
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    setActiveView('pos');
    setSelectedCategory(categoryId);
    if (isMobileDrawer && onCloseMobile) {
      onCloseMobile();
    }
  };

  return (
    <aside
      className={`${
        isMobileDrawer
          ? 'w-full h-full flex flex-col'
          : 'hidden lg:flex w-64 flex-shrink-0 h-screen sticky top-0 flex-col'
      } bg-white dark:bg-slate-900 border-r border-sky-100 dark:border-slate-800 overflow-y-auto select-none print:hidden transition-colors shadow-xs`}
    >
      {/* Top Logo - Modern Coffee icon with light blue gradient */}
      <div className="p-4 sm:p-5 flex items-center justify-between border-b border-sky-100/80 dark:border-slate-800">
        <button
          onClick={() => {
            setActiveView('pos');
            setSelectedCategory('all');
            if (isMobileDrawer && onCloseMobile) onCloseMobile();
          }}
          className="flex items-center gap-3 text-left group focus:outline-none"
        >
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-sky-500 via-sky-600 to-cyan-400 flex items-center justify-center shadow-md shadow-sky-500/25 group-hover:scale-105 transition-transform flex-shrink-0 text-white">
            <Coffee className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
          </div>
          <div>
            <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
              Gitin<span className="text-sky-500 font-black">Coffe</span>
            </span>
            <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Kasir & Stok Pintar</p>
          </div>
        </button>

        <div className="flex items-center gap-1">
          {/* Dark mode switch */}
          <button
            onClick={toggleDarkMode}
            aria-label="Toggle Mode Gelap"
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title={isDarkMode ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap'}
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {isMobileDrawer && (
            <button
              onClick={onCloseMobile}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Tutup menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Main System Nav Links */}
      <div className="px-3 pt-3 pb-2 border-b border-sky-100/80 dark:border-slate-800 space-y-0.5">
        <p className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Menu Utama
        </p>
        {navItems.map(item => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md shadow-sky-500/25'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-sky-50/70 dark:hover:bg-slate-800 hover:text-sky-700 dark:hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {item.icon}
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-amber-500 text-white animate-pulse">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Categories from the visual reference */}
      <div className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
        {/* Drink Section */}
        <div>
          <div className="flex items-center justify-between px-2 mb-2">
            <h3 className="text-sm font-bold tracking-tight text-slate-800 dark:text-slate-200">Drink</h3>
            <button
              onClick={() => handleCategoryClick('all')}
              className="text-[11px] text-sky-600 hover:text-sky-700 font-semibold"
            >
              Semua
            </button>
          </div>
          <div className="space-y-2">
            {drinkCategories.map(cat => {
              const isSelected = activeView === 'pos' && selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.id)}
                  className={`relative w-full h-14 sm:h-15 rounded-xl overflow-hidden group text-left transition-all ${
                    isSelected
                      ? 'ring-2 ring-sky-500 ring-offset-2 dark:ring-offset-slate-900 scale-[1.02] shadow-sm'
                      : 'hover:opacity-95'
                  }`}
                >
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-slate-950/45 backdrop-blur-[1px] group-hover:bg-slate-950/35 transition-colors" />
                  <div className="relative h-full flex items-center justify-center p-2">
                    <div className="bg-slate-900/80 backdrop-blur-md px-3.5 py-1.5 rounded-full flex items-center gap-2 border border-white/20 shadow-sm">
                      {getCategoryIcon(cat.slug)}
                      <span className="text-xs font-semibold text-white tracking-wide">{cat.name}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Food Section */}
        <div>
          <div className="flex items-center justify-between px-2 mb-2">
            <h3 className="text-sm font-bold tracking-tight text-slate-800 dark:text-slate-200">Food</h3>
          </div>
          <div className="space-y-2">
            {foodCategories.map(cat => {
              const isSelected = activeView === 'pos' && selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.id)}
                  className={`relative w-full h-14 sm:h-15 rounded-xl overflow-hidden group text-left transition-all ${
                    isSelected
                      ? 'ring-2 ring-sky-500 ring-offset-2 dark:ring-offset-slate-900 scale-[1.02] shadow-sm'
                      : 'hover:opacity-95'
                  }`}
                >
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-slate-950/45 backdrop-blur-[1px] group-hover:bg-slate-950/35 transition-colors" />
                  <div className="relative h-full flex items-center justify-center p-2">
                    <div className="bg-slate-900/80 backdrop-blur-md px-3.5 py-1.5 rounded-full flex items-center gap-2 border border-white/20 shadow-sm">
                      {getCategoryIcon(cat.slug)}
                      <span className="text-xs font-semibold text-white tracking-wide">{cat.name}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Stock Alert bottom notice if any items are low on stock */}
      {lowStockItems.length > 0 && (
        <div className="p-3 mx-3 mb-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-800 dark:text-amber-300">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
            <div className="text-[11px] leading-tight">
              <span className="font-bold">{lowStockItems.length} Produk</span> stok menipis!
              <button
                onClick={() => handleNavClick('stock')}
                className="block mt-1 text-sky-600 dark:text-sky-400 font-bold hover:underline"
              >
                Cek Stok Sekarang &rarr;
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
