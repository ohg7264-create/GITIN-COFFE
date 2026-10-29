import React from 'react';
import { Search, X, SlidersHorizontal, Sparkles } from 'lucide-react';
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
    currentUser,
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
    <div className="flex-1 flex flex-col h-screen overflow-y-auto bg-stone-100/60 dark:bg-stone-950/80 transition-colors">
      {/* Top Header matching reference image */}
      <header className="sticky top-0 z-10 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md px-6 py-4 border-b border-stone-200/80 dark:border-stone-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Left: "Menu List" Title */}
        <div className="flex items-center gap-3">
          <h1 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-stone-100 tracking-tight">
            Menu List
          </h1>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
            {filteredProducts.length} Item
          </span>
        </div>

        {/* Center/Right: Search Bar matching image */}
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search"
              className="w-full pl-10 pr-9 py-2 rounded-full border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs sm:text-sm font-medium text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-xs transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Category Pills Bar (Horizontal scroll for quick switching) */}
      <div className="px-6 py-3 bg-white/60 dark:bg-stone-900/60 border-b border-stone-200/50 dark:border-stone-800 flex items-center gap-2 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex-shrink-0 ${
            selectedCategory === 'all'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:border-emerald-400'
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
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:border-emerald-400'
              }`}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* Main Product Cards List */}
      <main className="p-4 sm:p-6 space-y-4 flex-1">
        {filteredProducts.length === 0 ? (
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-12 text-center text-stone-400 max-w-lg mx-auto my-12">
            <Search className="w-10 h-10 mx-auto mb-3 stroke-[1.5]" />
            <p className="text-base font-bold text-stone-700 dark:text-stone-200">
              Menu tidak ditemukan
            </p>
            <p className="text-xs text-stone-400 mt-1">
              Tidak ada produk yang cocok dengan pencarian &quot;{searchQuery}&quot;
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs"
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
