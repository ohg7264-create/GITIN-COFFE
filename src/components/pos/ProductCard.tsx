import React, { useState } from 'react';
import { Minus, Plus, Check, PlusCircle, AlertCircle } from 'lucide-react';
import { Product, ProductSize, SugarLevel, IceLevel, Topping, CartItem } from '../../types/pos';
import { usePOS } from '../../context/POSContext';
import { calculateItemUnitPrice, formatRupiah } from '../../utils/pos-logic';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { toppings, addToCart } = usePOS();

  // Local configuration state for this card
  const [amount, setAmount] = useState<number>(1);
  const [selectedSize, setSelectedSize] = useState<ProductSize>('M');
  const [selectedSugar, setSelectedSugar] = useState<SugarLevel>('25%');
  const [selectedIce, setSelectedIce] = useState<IceLevel>('25%');
  const [selectedToppings, setSelectedToppings] = useState<Topping[]>([]);
  const [isAddedFeedback, setIsAddedFeedback] = useState(false);

  // Filter available toppings for this product
  const productToppings = toppings.filter(t =>
    product.availableToppings.includes(t.id)
  );

  const toggleTopping = (topping: Topping) => {
    setSelectedToppings(prev => {
      const exists = prev.some(t => t.id === topping.id);
      if (exists) {
        return prev.filter(t => t.id !== topping.id);
      } else {
        return [...prev, topping];
      }
    });
  };

  const isToppingSelected = (toppingId: string) => {
    return selectedToppings.some(t => t.id === toppingId);
  };

  const unitPrice = calculateItemUnitPrice(product, selectedSize, selectedToppings);
  const totalPrice = unitPrice * amount;

  const handleAddToCart = () => {
    if (product.stock <= 0) return;

    const cartItem: CartItem = {
      cartItemId: `${product.id}-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      productId: product.id,
      name: product.name,
      image: product.image,
      unitPrice,
      quantity: amount,
      size: selectedSize,
      sugar: product.allowSugar ? selectedSugar : '100%',
      ice: product.allowIce ? selectedIce : '0%',
      toppings: selectedToppings,
      subtotal: totalPrice,
    };

    addToCart(cartItem);

    // Provide visual feedback
    setIsAddedFeedback(true);
    setTimeout(() => {
      setIsAddedFeedback(false);
      setAmount(1);
    }, 600);
  };

  const isOutOfStock = product.stock <= 0;

  return (
    <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/90 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-md hover:shadow-xl transition-all relative overflow-hidden">
      {/* 1. Header: Product Name + Price (Besar, Bold, Tegas) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-4 mb-4 border-b border-slate-100 dark:border-slate-800/80">
        <h3 className="font-black text-lg sm:text-xl md:text-2xl text-slate-900 dark:text-white tracking-tight flex items-center gap-2 flex-1 min-w-0">
          {product.code ? (
            <span className="text-sky-600 dark:text-sky-400 font-black flex-shrink-0">
              {product.code}.
            </span>
          ) : null}
          <span className="truncate">{product.name}</span>
        </h3>

        <div className="flex items-center gap-2.5 flex-shrink-0 self-start sm:self-auto">
          {product.stock <= product.minStockAlert && !isOutOfStock && (
            <span className="text-xs sm:text-sm font-bold px-3 py-1 rounded-xl bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
              Sisa {product.stock}
            </span>
          )}
          {isOutOfStock && (
            <span className="text-xs sm:text-sm font-black px-3 py-1 rounded-xl bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-800 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" /> Stok Habis
            </span>
          )}
          <span className="text-base sm:text-lg md:text-xl font-black text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 px-3.5 py-1.5 rounded-2xl border border-sky-100 dark:border-sky-800 shadow-xs">
            {formatRupiah(unitPrice)}
          </span>
        </div>
      </div>

      {/* 2. Middle Row: Image on left + Modifiers on right */}
      <div className="flex flex-col sm:flex-row gap-5 sm:gap-6 items-start">
        {/* Left: Product Image */}
        <div className="relative w-full sm:w-44 md:w-52 lg:w-56 h-40 sm:h-48 md:h-52 lg:h-auto lg:min-h-[220px] flex-shrink-0 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-inner">
          <img
            src={product.image}
            alt={product.name}
            className={`w-full h-full object-cover ${isOutOfStock ? 'grayscale opacity-60' : ''}`}
            loading="lazy"
          />
          {product.description && (
            <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-slate-950/90 via-slate-950/60 to-transparent text-xs text-white/95 line-clamp-2 text-center font-medium">
              {product.description}
            </div>
          )}
        </div>

        {/* Right: Modifiers Grid (Amount, Sugar, Size, Ice) */}
        <div className="flex-1 w-full space-y-4">
          {/* Row 1: Amount & Sugar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
            {/* Amount */}
            <div>
              <label className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 block mb-1.5 uppercase tracking-wide">
                Amount
              </label>
              <div className="inline-flex items-center border-2 border-slate-200 dark:border-slate-700 rounded-xl p-1 bg-slate-50 dark:bg-slate-800/80 shadow-xs">
                <button
                  type="button"
                  onClick={() => setAmount(prev => Math.max(1, prev - 1))}
                  disabled={isOutOfStock || amount <= 1}
                  className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 disabled:opacity-30 disabled:pointer-events-none transition"
                  aria-label="Kurangi jumlah"
                >
                  <Minus className="w-4 h-4 md:w-5 md:h-5 stroke-[2.5]" />
                </button>
                <span className="w-8 sm:w-10 md:w-11 text-center text-base sm:text-lg md:text-xl font-black text-slate-900 dark:text-white">
                  {amount}
                </span>
                <button
                  type="button"
                  onClick={() => setAmount(prev => Math.min(product.stock, prev + 1))}
                  disabled={isOutOfStock || amount >= product.stock}
                  className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg bg-gradient-to-tr from-sky-500 to-blue-600 text-white flex items-center justify-center hover:from-sky-600 hover:to-blue-700 active:scale-95 disabled:opacity-40 disabled:pointer-events-none shadow-md shadow-sky-500/25 transition"
                  aria-label="Tambah jumlah"
                >
                  <Plus className="w-4 h-4 md:w-5 md:h-5 stroke-[2.5]" />
                </button>
              </div>
            </div>

            {/* Sugar */}
            {product.allowSugar ? (
              <div>
                <label className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 block mb-1.5 uppercase tracking-wide">
                  Sugar
                </label>
                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap sm:flex-nowrap">
                  {(['25%', '50%', '75%'] as SugarLevel[]).map(level => {
                    const isSelected = selectedSugar === level;
                    return (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setSelectedSugar(level)}
                        className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm md:text-base font-bold rounded-xl border-2 transition-all active:scale-95 ${
                          isSelected
                            ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white border-transparent shadow-md shadow-sky-500/25'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-sky-300 hover:text-sky-600'
                        }`}
                      >
                        {level}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div />
            )}
          </div>

          {/* Row 2: Size & Ice */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
            {/* Size */}
            <div>
              <label className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 block mb-1.5 uppercase tracking-wide">
                Size
              </label>
              <div className="flex items-center gap-1.5 sm:gap-2">
                {(['S', 'M', 'L'] as ProductSize[]).map(size => {
                  const isSelected = selectedSize === size;
                  const priceDiff = product.sizePriceModifier[size];
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-9 sm:min-w-10 md:min-w-11 h-9 sm:h-10 md:h-11 px-3 text-xs sm:text-sm md:text-base font-black rounded-xl border-2 transition-all active:scale-95 ${
                        isSelected
                          ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white border-transparent shadow-md shadow-sky-500/25'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-sky-300 hover:text-sky-600'
                      }`}
                      title={priceDiff > 0 ? `+${formatRupiah(priceDiff)}` : 'Standar'}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Ice */}
            {product.allowIce ? (
              <div>
                <label className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 block mb-1.5 uppercase tracking-wide">
                  Ice
                </label>
                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap sm:flex-nowrap">
                  {(['25%', '50%', '75%'] as IceLevel[]).map(level => {
                    const isSelected = selectedIce === level;
                    return (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setSelectedIce(level)}
                        className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm md:text-base font-bold rounded-xl border-2 transition-all active:scale-95 ${
                          isSelected
                            ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white border-transparent shadow-md shadow-sky-500/25'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-sky-300 hover:text-sky-600'
                        }`}
                      >
                        {level}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div />
            )}
          </div>
        </div>
      </div>

      {/* 3. Row 3: Toppings (Besar & Jelas) */}
      {productToppings.length > 0 && (
        <div className="pt-3.5 mt-3 border-t border-slate-100 dark:border-slate-800/80">
          <label className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 block mb-2 uppercase tracking-wide">
            Topping
          </label>
          <div className="flex items-center gap-4 sm:gap-5 overflow-x-auto pb-2 scrollbar-none">
            {productToppings.map(topping => {
              const selected = isToppingSelected(topping.id);
              return (
                <button
                  key={topping.id}
                  type="button"
                  onClick={() => toggleTopping(topping)}
                  className="group flex flex-col items-center gap-1.5 focus:outline-none flex-shrink-0"
                >
                  <div className="relative">
                    <div
                      className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full shadow-md flex items-center justify-center transition-transform group-hover:scale-110 border-2 border-white dark:border-slate-700"
                      style={{
                        backgroundColor: topping.color,
                        backgroundImage:
                          'radial-gradient(circle at 35% 35%, rgba(255,255,255,0.5), transparent 60%)',
                      }}
                    />
                    {selected && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-sky-500 text-white flex items-center justify-center ring-2 ring-white dark:ring-slate-900 shadow-md">
                        <Check className="w-3.5 h-3.5 stroke-[3.5]" />
                      </div>
                    )}
                  </div>
                  <span
                    className={`text-xs sm:text-sm text-center max-w-[80px] sm:max-w-[90px] truncate font-bold leading-tight ${
                      selected
                        ? 'text-sky-600 dark:text-sky-400'
                        : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {topping.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Action Row: Subtotal & Add to Cart button (Besar, Mantap, Mudah Ditekan) */}
      <div className="pt-4 mt-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3.5 border-t-2 border-slate-100 dark:border-slate-800/80">
        <div className="flex items-baseline gap-2">
          <span className="text-sm sm:text-base font-bold text-slate-500 dark:text-slate-400">
            Subtotal:
          </span>
          <span className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 dark:text-white">
            {formatRupiah(totalPrice)}
          </span>
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`px-6 sm:px-8 py-3 sm:py-3.5 md:py-4 rounded-2xl font-black text-sm sm:text-base md:text-lg flex items-center justify-center gap-2.5 transition-all ${
            isAddedFeedback
              ? 'bg-sky-600 text-white scale-95 shadow-lg shadow-sky-600/30'
              : isOutOfStock
              ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-sky-500 via-sky-600 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white shadow-lg shadow-sky-500/30 active:scale-95'
          }`}
        >
          {isAddedFeedback ? (
            <>
              <Check className="w-5 h-5 sm:w-6 sm:h-6 stroke-[3.5]" />
              <span>Ditambahkan!</span>
            </>
          ) : (
            <>
              <span>Add to Cart</span>
              <PlusCircle className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
