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
    <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-sky-100/80 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-all relative overflow-hidden">
      {/* 1. Header: Product Name + Price (Balanced readable size) */}
      <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-sky-100/60 dark:border-slate-800/80">
        <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5 flex-1 min-w-0">
          {product.code ? (
            <span className="text-sky-600 dark:text-sky-400 font-extrabold flex-shrink-0">
              {product.code}.
            </span>
          ) : null}
          <span className="truncate">{product.name}</span>
        </h3>

        <div className="flex items-center gap-2 flex-shrink-0">
          {product.stock <= product.minStockAlert && !isOutOfStock && (
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-lg bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
              Sisa {product.stock}
            </span>
          )}
          {isOutOfStock && (
            <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-lg bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-800 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> Habis
            </span>
          )}
          <span className="text-sm sm:text-base font-extrabold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 px-2.5 py-1 rounded-xl border border-sky-100 dark:border-sky-800">
            {formatRupiah(unitPrice)}
          </span>
        </div>
      </div>

      {/* 2. Middle Row: Image on left + Modifiers Grid on right */}
      <div className="flex flex-col sm:flex-row gap-3.5 sm:gap-4 items-start">
        {/* Left: Product Image */}
        <div className="relative w-full sm:w-32 md:w-36 h-28 sm:h-32 md:h-36 flex-shrink-0 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-inner">
          <img
            src={product.image}
            alt={product.name}
            className={`w-full h-full object-cover ${isOutOfStock ? 'grayscale opacity-60' : ''}`}
            loading="lazy"
          />
          {product.description && (
            <div className="absolute inset-x-0 bottom-0 p-1.5 bg-gradient-to-t from-slate-950/90 via-slate-950/60 to-transparent text-[10px] text-white/95 line-clamp-1 text-center font-medium">
              {product.description}
            </div>
          )}
        </div>

        {/* Right: Modifiers Grid (Amount, Sugar, Size, Ice) */}
        <div className="flex-1 w-full space-y-2.5">
          {/* Row 1: Amount & Sugar */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            {/* Amount */}
            <div>
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1 uppercase tracking-wider">
                Amount
              </label>
              <div className="inline-flex items-center border border-slate-200 dark:border-slate-700 rounded-xl p-0.5 bg-slate-50 dark:bg-slate-800/80 shadow-xs">
                <button
                  type="button"
                  onClick={() => setAmount(prev => Math.max(1, prev - 1))}
                  disabled={isOutOfStock || amount <= 1}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 disabled:opacity-30 disabled:pointer-events-none transition"
                  aria-label="Kurangi jumlah"
                >
                  <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
                <span className="w-7 sm:w-8 text-center text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                  {amount}
                </span>
                <button
                  type="button"
                  onClick={() => setAmount(prev => Math.min(product.stock, prev + 1))}
                  disabled={isOutOfStock || amount >= product.stock}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-tr from-sky-500 to-blue-600 text-white flex items-center justify-center hover:from-sky-600 hover:to-blue-700 active:scale-95 disabled:opacity-40 disabled:pointer-events-none shadow-xs transition"
                  aria-label="Tambah jumlah"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
              </div>
            </div>

            {/* Sugar */}
            {product.allowSugar ? (
              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1 uppercase tracking-wider">
                  Sugar
                </label>
                <div className="flex items-center gap-1">
                  {(['25%', '50%', '75%'] as SugarLevel[]).map(level => {
                    const isSelected = selectedSugar === level;
                    return (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setSelectedSugar(level)}
                        className={`px-2 sm:px-2.5 py-1 text-xs font-semibold rounded-lg border transition active:scale-95 ${
                          isSelected
                            ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white border-transparent shadow-xs'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-sky-300'
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
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            {/* Size */}
            <div>
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1 uppercase tracking-wider">
                Size
              </label>
              <div className="flex items-center gap-1">
                {(['S', 'M', 'L'] as ProductSize[]).map(size => {
                  const isSelected = selectedSize === size;
                  const priceDiff = product.sizePriceModifier[size];
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-7 h-7 sm:min-w-8 sm:h-8 px-2 text-xs font-bold rounded-lg border transition active:scale-95 ${
                        isSelected
                          ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white border-transparent shadow-xs'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-sky-300'
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
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1 uppercase tracking-wider">
                  Ice
                </label>
                <div className="flex items-center gap-1">
                  {(['25%', '50%', '75%'] as IceLevel[]).map(level => {
                    const isSelected = selectedIce === level;
                    return (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setSelectedIce(level)}
                        className={`px-2 sm:px-2.5 py-1 text-xs font-semibold rounded-lg border transition active:scale-95 ${
                          isSelected
                            ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white border-transparent shadow-xs'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-sky-300'
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

      {/* 3. Row 3: Toppings (Full width below image & top modifiers) */}
      {productToppings.length > 0 && (
        <div className="pt-2.5 mt-2 border-t border-slate-100 dark:border-slate-800/60">
          <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1.5 uppercase tracking-wider">
            Topping
          </label>
          <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none">
            {productToppings.map(topping => {
              const selected = isToppingSelected(topping.id);
              return (
                <button
                  key={topping.id}
                  type="button"
                  onClick={() => toggleTopping(topping)}
                  className="group flex flex-col items-center gap-1 focus:outline-none flex-shrink-0"
                >
                  <div className="relative">
                    <div
                      className="w-8 h-8 sm:w-9 sm:h-9 rounded-full shadow-xs flex items-center justify-center transition-transform group-hover:scale-105 border-2 border-white dark:border-slate-700"
                      style={{
                        backgroundColor: topping.color,
                        backgroundImage:
                          'radial-gradient(circle at 35% 35%, rgba(255,255,255,0.5), transparent 60%)',
                      }}
                    />
                    {selected && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-sky-500 text-white flex items-center justify-center ring-1 ring-white dark:ring-slate-900 shadow-xs">
                        <Check className="w-2.5 h-2.5 stroke-[3.5]" />
                      </div>
                    )}
                  </div>
                  <span
                    className={`text-[11px] text-center max-w-[70px] truncate font-medium leading-tight ${
                      selected
                        ? 'text-sky-600 dark:text-sky-400 font-bold'
                        : 'text-slate-600 dark:text-slate-400'
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

      {/* 4. Action Row: Subtotal & Add to Cart button */}
      <div className="pt-3 mt-2 flex items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800/80">
        <div className="flex items-baseline gap-1.5">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Subtotal:
          </span>
          <span className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
            {formatRupiah(totalPrice)}
          </span>
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
            isAddedFeedback
              ? 'bg-sky-600 text-white scale-95 shadow-md shadow-sky-600/30'
              : isOutOfStock
              ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-sky-500 via-sky-600 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white shadow-md shadow-sky-500/25 active:scale-95'
          }`}
        >
          {isAddedFeedback ? (
            <>
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Ditambahkan!</span>
            </>
          ) : (
            <>
              <span>Add to Cart</span>
              <PlusCircle className="w-4 h-4 stroke-[2.5]" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
