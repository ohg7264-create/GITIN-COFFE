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
      // Reset amount to 1 after adding
      setAmount(1);
    }, 600);
  };

  const isOutOfStock = product.stock <= 0;

  return (
    <div className="bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden">
      {/* Title with code (e.g. "01. Macchiato Coffee Latte") */}
      <div className="flex items-center justify-between gap-2 mb-3.5">
        <h3 className="font-bold text-base sm:text-lg text-emerald-800 dark:text-emerald-400 tracking-tight">
          {product.code ? `${product.code}. ` : ''}{product.name}
        </h3>
        <div className="flex items-center gap-2">
          {product.stock <= product.minStockAlert && !isOutOfStock && (
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
              Sisa {product.stock}
            </span>
          )}
          {isOutOfStock && (
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> Stok Habis
            </span>
          )}
          <span className="text-xs sm:text-sm font-extrabold text-stone-900 dark:text-stone-100">
            {formatRupiah(unitPrice)}
          </span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 sm:gap-5">
        {/* Left Side: Product Image */}
        <div className="relative w-full lg:w-44 h-36 lg:h-auto flex-shrink-0 rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-800 border border-stone-200/60 dark:border-stone-700">
          <img
            src={product.image}
            alt={product.name}
            className={`w-full h-full object-cover ${isOutOfStock ? 'grayscale opacity-60' : ''}`}
          />
          {product.description && (
            <div className="absolute inset-x-0 bottom-0 p-1.5 bg-gradient-to-t from-black/70 to-transparent text-[10px] text-white/90 line-clamp-1 text-center">
              {product.description}
            </div>
          )}
        </div>

        {/* Right Side: Modifiers matching reference image */}
        <div className="flex-1 space-y-3">
          {/* Row 1: Amount & Sugar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Amount Selector */}
            <div>
              <label className="text-[11px] font-medium text-stone-500 dark:text-stone-400 block mb-1">
                Amount
              </label>
              <div className="inline-flex items-center border border-stone-200 dark:border-stone-700 rounded-full px-2 py-1 bg-stone-50 dark:bg-stone-800/60">
                <button
                  type="button"
                  onClick={() => setAmount(prev => Math.max(1, prev - 1))}
                  disabled={isOutOfStock || amount <= 1}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 disabled:opacity-30 disabled:pointer-events-none transition"
                  aria-label="Kurangi jumlah"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center text-xs font-bold text-stone-800 dark:text-stone-100">
                  {amount}
                </span>
                <button
                  type="button"
                  onClick={() => setAmount(prev => Math.min(product.stock, prev + 1))}
                  disabled={isOutOfStock || amount >= product.stock}
                  className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center hover:bg-emerald-700 disabled:opacity-40 disabled:pointer-events-none shadow-xs transition"
                  aria-label="Tambah jumlah"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Sugar Selector */}
            {product.allowSugar ? (
              <div>
                <label className="text-[11px] font-medium text-stone-500 dark:text-stone-400 block mb-1">
                  Sugar
                </label>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {(['25%', '50%', '75%'] as SugarLevel[]).map(level => {
                    const isSelected = selectedSugar === level;
                    return (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setSelectedSugar(level)}
                        className={`px-2.5 py-1 text-xs font-semibold rounded-full border transition-all ${
                          isSelected
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                            : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-emerald-300'
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Size Selector */}
            <div>
              <label className="text-[11px] font-medium text-stone-500 dark:text-stone-400 block mb-1">
                Size
              </label>
              <div className="flex items-center gap-1.5">
                {(['S', 'M', 'L'] as ProductSize[]).map(size => {
                  const isSelected = selectedSize === size;
                  const priceDiff = product.sizePriceModifier[size];
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-8 h-8 px-2 text-xs font-bold rounded-lg border transition-all ${
                        isSelected
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-emerald-300'
                      }`}
                      title={priceDiff > 0 ? `+${formatRupiah(priceDiff)}` : 'Ukuran Standar'}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Ice Selector */}
            {product.allowIce ? (
              <div>
                <label className="text-[11px] font-medium text-stone-500 dark:text-stone-400 block mb-1">
                  Ice
                </label>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {(['25%', '50%', '75%'] as IceLevel[]).map(level => {
                    const isSelected = selectedIce === level;
                    return (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setSelectedIce(level)}
                        className={`px-2.5 py-1 text-xs font-semibold rounded-full border transition-all ${
                          isSelected
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                            : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-emerald-300'
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

          {/* Row 3: Topping Row with circular colorful icons (as in reference mockup) */}
          {productToppings.length > 0 && (
            <div className="pt-1">
              <label className="text-[11px] font-medium text-stone-500 dark:text-stone-400 block mb-1.5">
                Topping
              </label>
              <div className="flex items-center gap-3 sm:gap-4 overflow-x-auto pb-1 scrollbar-none">
                {productToppings.map(topping => {
                  const selected = isToppingSelected(topping.id);
                  return (
                    <button
                      key={topping.id}
                      type="button"
                      onClick={() => toggleTopping(topping)}
                      className="group flex flex-col items-center gap-1 focus:outline-none flex-shrink-0"
                    >
                      {/* Circular icon container */}
                      <div className="relative">
                        <div
                          className="w-7 h-7 sm:w-8 sm:h-8 rounded-full shadow-sm flex items-center justify-center transition-transform group-hover:scale-110 border border-white/60 dark:border-stone-600"
                          style={{
                            backgroundColor: topping.color,
                            backgroundImage:
                              'radial-gradient(circle at 35% 35%, rgba(255,255,255,0.4), transparent 60%)',
                          }}
                        />
                        {selected && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center ring-2 ring-white dark:ring-stone-900 shadow-xs">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <span
                        className={`text-[10px] text-center max-w-[65px] truncate font-medium leading-tight ${
                          selected
                            ? 'text-emerald-700 dark:text-emerald-400 font-bold'
                            : 'text-stone-600 dark:text-stone-400'
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

          {/* Action Row: Subtotal & Add to Cart button */}
          <div className="pt-2 flex items-center justify-between border-t border-stone-100 dark:border-stone-800">
            <div className="text-xs">
              <span className="text-stone-400 dark:text-stone-500 mr-1.5">Subtotal:</span>
              <span className="font-extrabold text-stone-900 dark:text-stone-100">
                {formatRupiah(totalPrice)}
              </span>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`px-4 sm:px-5 py-2 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all ${
                isAddedFeedback
                  ? 'bg-emerald-700 text-white scale-95'
                  : isOutOfStock
                  ? 'bg-stone-200 dark:bg-stone-800 text-stone-400 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 active:scale-95'
              }`}
            >
              {isAddedFeedback ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  Ditambahkan!
                </>
              ) : (
                <>
                  <span>Add to Cart</span>
                  <PlusCircle className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
