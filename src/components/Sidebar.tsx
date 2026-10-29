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
} from 'lucide-react';
import { usePOS, ActiveView } from '../context/POSContext';
import { checkLowStockAlerts } from '../utils/pos-logic';

export const Sidebar: React.FC = () => {
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

  return (
    <aside className="w-64 flex-shrink-0 bg-white dark:bg-stone-900 border-r border-stone-200/80 dark:border-stone-800 flex flex-col h-screen sticky top-0 overflow-y-auto select-none print:hidden transition-colors">
      {/* Top Logo - Curved green monogram matching mockup */}
      <div className="p-5 flex items-center justify-between border-b border-stone-100 dark:border-stone-800">
        <button
          onClick={() => {
            setActiveView('pos');
            setSelectedCategory('all');
          }}
          className="flex items-center gap-3 text-left group focus:outline-none"
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-700 to-green-500 flex items-center justify-center shadow-md shadow-green-600/20 group-hover:scale-105 transition-transform">
            {/* Custom stylized monogram 'a' shape matching the prompt's reference logo */}
            <svg
              className="w-7 h-7 text-white fill-current"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 7C9.23858 7 7 9.23858 7 12V20C7 22.7614 9.23858 25 12 25C14.7614 25 17 22.7614 17 20V12C17 9.23858 14.7614 7 12 7Z"
                opacity="0.9"
              />
              <path
                d="M19 14C19 11.2386 21.2386 9 24 9C26.7614 9 29 11.2386 29 14V23C29 24.1046 28.1046 25 27 25H21C19.8954 25 19 24.1046 19 23V14Z"
              />
            </svg>
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
              Aksara<span className="text-emerald-600">POS</span>
            </span>
            <p className="text-[11px] font-medium text-stone-500 dark:text-stone-400">Kasir & Stok Pintar</p>
          </div>
        </button>

        {/* Dark mode switch */}
        <button
          onClick={toggleDarkMode}
          aria-label="Toggle Mode Gelap"
          className="p-2 rounded-xl text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
          title={isDarkMode ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap'}
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>

      {/* Main System Nav Links */}
      <div className="px-3 pt-3 pb-2 border-b border-stone-100 dark:border-stone-800 space-y-0.5">
        <p className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500">
          Menu Utama
        </p>
        {navItems.map(item => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                  : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800/80 hover:text-stone-900 dark:hover:text-white'
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

      {/* Categories from the visual reference (shown in POS mode) */}
      <div className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
        {/* Drink Section */}
        <div>
          <div className="flex items-center justify-between px-2 mb-2">
            <h3 className="text-sm font-bold tracking-tight text-stone-800 dark:text-stone-200">Drink</h3>
            <button
              onClick={() => {
                setActiveView('pos');
                setSelectedCategory('all');
              }}
              className="text-[11px] text-emerald-600 hover:text-emerald-700 font-medium"
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
                  onClick={() => {
                    setActiveView('pos');
                    setSelectedCategory(cat.id);
                  }}
                  className={`relative w-full h-15 rounded-xl overflow-hidden group text-left transition-all ${
                    isSelected
                      ? 'ring-2 ring-emerald-500 ring-offset-2 dark:ring-offset-stone-900 scale-[1.02]'
                      : 'hover:opacity-95'
                  }`}
                >
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-[1px] group-hover:bg-stone-900/30 transition-colors" />
                  <div className="relative h-full flex items-center justify-center p-2">
                    <div className="bg-stone-900/75 backdrop-blur-md px-3.5 py-1.5 rounded-full flex items-center gap-2 border border-white/20 shadow-sm">
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
            <h3 className="text-sm font-bold tracking-tight text-stone-800 dark:text-stone-200">Food</h3>
          </div>
          <div className="space-y-2">
            {foodCategories.map(cat => {
              const isSelected = activeView === 'pos' && selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveView('pos');
                    setSelectedCategory(cat.id);
                  }}
                  className={`relative w-full h-15 rounded-xl overflow-hidden group text-left transition-all ${
                    isSelected
                      ? 'ring-2 ring-emerald-500 ring-offset-2 dark:ring-offset-stone-900 scale-[1.02]'
                      : 'hover:opacity-95'
                  }`}
                >
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-[1px] group-hover:bg-stone-900/30 transition-colors" />
                  <div className="relative h-full flex items-center justify-center p-2">
                    <div className="bg-stone-900/75 backdrop-blur-md px-3.5 py-1.5 rounded-full flex items-center gap-2 border border-white/20 shadow-sm">
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
                onClick={() => setActiveView('stock')}
                className="block mt-1 text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
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
