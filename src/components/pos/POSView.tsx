import React from 'react';
import { Search, X } from 'lucide-react';
import { usePOS } from '../../context/POSContext';
import { ProductCard } from './ProductCard';

interface POSViewProps {
  onOpenLoginModal: () => void;
}

export const POSView: React.FC<POSViewProps> = ({ onOpenLoginModal }) => {
  const {
    products,
    categories,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
  } = usePOS();

  const filteredProducts = products.filter(product => {
    // Category filter
    if (selectedCategory !== 'all' && product.categoryId !== selectedCategory) {
      return false;
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = product.name.toLowerCase().includes(q);
      const matchCode = product.code.toLowerCase().includes(q);
      const matchDesc = product.description?.toLowerCase().includes(q);
      if (!matchName && !matchCode && !matchDesc) return false;
    }

    return true;
  });

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-transparent transition-colors relative z-10">
      {/* Unified Sticky Header containing Search Bar and Category Menu Bar - never scrolls away */}
      <div className="sticky top-0 z-20 bg-white/70 dark:bg-slate-900/75 backdrop-blur-md border-b border-sky-200/60 dark:border-slate-800/80 shadow-xs">
        {/* Top Header matching reference image with professional light blue accents */}
        <header className="px-4 sm:px-6 py-2.5 sm:py-3 border-b border-sky-100/50 dark:border-slate-800/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 sm:gap-4">
          {/* Left: "Menu List" Title */}
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Menu List
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-sky-50/80 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 border border-sky-200/60 dark:border-sky-800">
              {filteredProducts.length} Item
            </span>
          </div>

          {/* Center/Right: Search Bar */}
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Cari menu minuman, kopi, makanan..."
                className="w-full pl-10 pr-9 py-2 rounded-full border border-slate-200/80 dark:border-slate-700/80 bg-white/80 dark:bg-slate-800/80 text-xs sm:text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 shadow-xs transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Category Pills Bar (Transparent background, fixed/pinned when scrolling) */}
        <div className="px-4 sm:px-6 py-2 bg-transparent flex items-center gap-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex-shrink-0 ${
              selectedCategory === 'all'
                ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-xs'
                : 'bg-white/40 dark:bg-slate-800/40 backdrop-blur-xs border border-sky-200/60 dark:border-slate-700/60 text-slate-700 dark:text-slate-200 hover:bg-white/70 dark:hover:bg-slate-800/70 hover:border-sky-400'
            }`}
          >
            Semua Menu
          </button>

          {categories.map(cat => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex-shrink-0 ${
                  isSelected
                    ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-xs'
                    : 'bg-white/40 dark:bg-slate-800/40 backdrop-blur-xs border border-sky-200/60 dark:border-slate-700/60 text-slate-700 dark:text-slate-200 hover:bg-white/70 dark:hover:bg-slate-800/70 hover:border-sky-400'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Product Cards List */}
      <main className="p-4 sm:p-6 pb-28 sm:pb-32 lg:pb-12 space-y-5 sm:space-y-6 flex-1">
        {filteredProducts.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-sky-100 dark:border-slate-800 rounded-2xl p-12 text-center text-slate-400 max-w-lg mx-auto my-12 shadow-sm">
            <Search className="w-10 h-10 mx-auto mb-3 stroke-[1.5] text-sky-400" />
            <p className="text-base font-bold text-slate-700 dark:text-slate-200">
              Menu tidak ditemukan
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Tidak ada produk yang cocok dengan pencarian &quot;{searchQuery}&quot;
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs shadow-sm transition"
            >
              Tampilkan Semua Menu
            </button>
          </div>
        ) : (
          filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </main>
    </div>
  );
};
