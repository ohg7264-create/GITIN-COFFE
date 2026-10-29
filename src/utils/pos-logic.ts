import { CartItem, Product, ProductSize, Topping, Transaction } from '../types/pos';

/**
 * Format number to Indonesian Rupiah currency format
 * e.g. 53000 -> "Rp 53.000" or simple "53.000"
 */
export function formatRupiah(amount: number, withPrefix = true): string {
  const formatted = Math.round(amount).toLocaleString('id-ID');
  return withPrefix ? `Rp ${formatted}` : formatted;
}

/**
 * Calculate single item unit price including size modifier and toppings
 */
export function calculateItemUnitPrice(
  product: Product,
  size: ProductSize,
  selectedToppings: Topping[]
): number {
  const base = product.basePrice;
  const sizeDiff = product.sizePriceModifier[size] || 0;
  const toppingsTotal = selectedToppings.reduce((acc, t) => acc + (t.price || 0), 0);
  return base + sizeDiff + toppingsTotal;
}

/**
 * Calculate cart order totals: Subtotal, Tax, and Final Total
 */
export function calculateOrderTotals(
  items: CartItem[],
  taxRate: number,
  discount = 0
): {
  subTotal: number;
  tax: number;
  total: number;
  itemCount: number;
} {
  const subTotal = items.reduce((acc, item) => acc + item.subtotal, 0);
  const taxableAmount = Math.max(0, subTotal - discount);
  const tax = Math.round(taxableAmount * taxRate);
  const total = Math.max(0, subTotal - discount + tax);
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return {
    subTotal,
    tax,
    total,
    itemCount,
  };
}

/**
 * Calculate change (kembalian) for cash transactions
 */
export function calculateChange(total: number, amountPaid: number): number {
  return Math.max(0, amountPaid - total);
}

/**
 * Generate unique, sequence-friendly invoice number (e.g. INV-20261028-0042)
 */
export function generateInvoiceNumber(existingCount = 0): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const seq = String(existingCount + 1).padStart(4, '0');
  return `INV-${year}${month}${day}-${seq}`;
}

/**
 * Filter transactions by given date (YYYY-MM-DD)
 */
export function filterDailyTransactions(
  transactions: Transaction[],
  targetDateString?: string
): Transaction[] {
  const target = targetDateString || new Date().toISOString().slice(0, 10);
  return transactions.filter(t => t.timestamp.startsWith(target));
}

/**
 * Summary calculations for daily reports and real-time dashboard
 */
export interface DailySalesSummary {
  date: string;
  totalTransactions: number;
  totalGrossSales: number;
  totalTax: number;
  totalNetSales: number;
  totalItemsSold: number;
  averageOrderValue: number;
  paymentMethodBreakdown: Record<string, { count: number; total: number }>;
  topProducts: Array<{ productId: string; name: string; quantity: number; totalRevenue: number }>;
  hourlyBreakdown: Record<number, number>;
}

export function calculateDailyReportSummary(
  transactions: Transaction[],
  dateString?: string
): DailySalesSummary {
  const dailyTx = filterDailyTransactions(transactions, dateString);
  const targetDate = dateString || new Date().toISOString().slice(0, 10);

  let totalGross = 0;
  let totalTax = 0;
  let totalItemsSold = 0;

  const paymentBreakdown: Record<string, { count: number; total: number }> = {
    cash: { count: 0, total: 0 },
    qris: { count: 0, total: 0 },
    card: { count: 0, total: 0 },
    gopay: { count: 0, total: 0 },
    ovo: { count: 0, total: 0 },
    dana: { count: 0, total: 0 },
  };

  const productMap = new Map<string, { productId: string; name: string; quantity: number; totalRevenue: number }>();
  const hourlyMap: Record<number, number> = {};

  for (let h = 0; h < 24; h++) {
    hourlyMap[h] = 0;
  }

  for (const tx of dailyTx) {
    if (tx.status === 'refunded') continue;

    totalGross += tx.total;
    totalTax += tx.tax;

    // Payment breakdown
    const method = tx.paymentMethod || 'cash';
    if (!paymentBreakdown[method]) {
      paymentBreakdown[method] = { count: 0, total: 0 };
    }
    paymentBreakdown[method].count += 1;
    paymentBreakdown[method].total += tx.total;

    // Hour breakdown
    const hour = new Date(tx.timestamp).getHours();
    hourlyMap[hour] = (hourlyMap[hour] || 0) + tx.total;

    // Items sold
    for (const item of tx.items) {
      totalItemsSold += item.quantity;
      const existing = productMap.get(item.productId);
      if (existing) {
        existing.quantity += item.quantity;
        existing.totalRevenue += item.subtotal;
      } else {
        productMap.set(item.productId, {
          productId: item.productId,
          name: item.name,
          quantity: item.quantity,
          totalRevenue: item.subtotal,
        });
      }
    }
  }

  const topProducts = Array.from(productMap.values()).sort((a, b) => b.quantity - a.quantity);
  const avgOrder = dailyTx.length > 0 ? Math.round(totalGross / dailyTx.length) : 0;

  return {
    date: targetDate,
    totalTransactions: dailyTx.length,
    totalGrossSales: totalGross,
    totalTax,
    totalNetSales: totalGross - totalTax,
    totalItemsSold,
    averageOrderValue: avgOrder,
    paymentMethodBreakdown: paymentBreakdown,
    topProducts,
    hourlyBreakdown: hourlyMap,
  };
}

/**
 * Check which products have reached or breached their minimum stock threshold
 */
export function checkLowStockAlerts(products: Product[]): Product[] {
  return products.filter(p => p.stock <= p.minStockAlert);
}
