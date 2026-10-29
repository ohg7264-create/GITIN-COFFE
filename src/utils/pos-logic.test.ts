import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateItemUnitPrice,
  calculateOrderTotals,
  calculateChange,
  formatRupiah,
  generateInvoiceNumber,
  checkLowStockAlerts,
  calculateDailyReportSummary,
} from './pos-logic';
import { Product, CartItem, Topping, Transaction } from '../types/pos';

test('formatRupiah correctly formats Indonesian currency', () => {
  assert.equal(formatRupiah(53000), 'Rp 53.000');
  assert.equal(formatRupiah(102000, false), '102.000');
  assert.equal(formatRupiah(0), 'Rp 0');
});

test('calculateItemUnitPrice adds size difference and topping prices', () => {
  const dummyProduct: Product = {
    id: 'prod-1',
    code: 'DRK01',
    name: 'Macchiato Coffee Latte',
    categoryId: 'cat-coffee',
    type: 'drink',
    basePrice: 45000,
    image: '',
    stock: 20,
    minStockAlert: 5,
    availableSizes: ['S', 'M', 'L'],
    sizePriceModifier: { S: 0, M: 4000, L: 8000 },
    allowSugar: true,
    allowIce: true,
    availableToppings: ['top-1', 'top-2'],
    isAvailable: true,
  };

  const toppings: Topping[] = [
    { id: 'top-1', name: 'Pearl', price: 4000, color: '#333' },
  ];

  // Base 45000 + M (4000) + Pearl (4000) = 53000
  const priceM = calculateItemUnitPrice(dummyProduct, 'M', toppings);
  assert.equal(priceM, 53000);

  // Base 45000 + S (0) + Pearl (4000) = 49000
  const priceS = calculateItemUnitPrice(dummyProduct, 'S', toppings);
  assert.equal(priceS, 49000);
});

test('calculateOrderTotals computes correct subtotal, tax, and total', () => {
  const cartItems: CartItem[] = [
    {
      cartItemId: 'item-1',
      productId: 'prod-1',
      name: 'Macchiato Coffee Latte',
      image: '',
      unitPrice: 53000,
      quantity: 1,
      size: 'M',
      sugar: '25%',
      ice: '25%',
      toppings: [{ id: 'top-1', name: 'Pearl', price: 4000, color: '#000' }],
      subtotal: 53000,
    },
    {
      cartItemId: 'item-2',
      productId: 'prod-2',
      name: 'Hazelnut Coffee Latte',
      image: '',
      unitPrice: 45000,
      quantity: 1,
      size: 'S',
      sugar: '25%',
      ice: '25%',
      toppings: [],
      subtotal: 45000,
    },
  ];

  // Subtotal = 53000 + 45000 = 98000
  // Tax rate = 0.0408163... let's test with tax 4000 (roughly 4.08%)
  const { subTotal, tax, total, itemCount } = calculateOrderTotals(cartItems, 0.040816326);
  assert.equal(subTotal, 98000);
  assert.equal(tax, 4000);
  assert.equal(total, 102000); // 98000 + 4000 = 102000 matching mockup!
  assert.equal(itemCount, 2);
});

test('calculateChange calculates cash change properly', () => {
  assert.equal(calculateChange(102000, 150000), 48000);
  assert.equal(calculateChange(102000, 102000), 0);
  assert.equal(calculateChange(102000, 50000), 0);
});

test('generateInvoiceNumber produces valid format', () => {
  const inv = generateInvoiceNumber(41);
  assert.match(inv, /^INV-\d{8}-0042$/);
});

test('checkLowStockAlerts flags products at or below minStockAlert', () => {
  const products: Product[] = [
    {
      id: 'p1',
      code: '01',
      name: 'Coffee',
      categoryId: 'c1',
      type: 'drink',
      basePrice: 20000,
      image: '',
      stock: 4,
      minStockAlert: 5,
      availableSizes: ['M'],
      sizePriceModifier: { S: 0, M: 0, L: 0 },
      allowSugar: true,
      allowIce: true,
      availableToppings: [],
      isAvailable: true,
    },
    {
      id: 'p2',
      code: '02',
      name: 'Tea',
      categoryId: 'c1',
      type: 'drink',
      basePrice: 15000,
      image: '',
      stock: 12,
      minStockAlert: 5,
      availableSizes: ['M'],
      sizePriceModifier: { S: 0, M: 0, L: 0 },
      allowSugar: true,
      allowIce: true,
      availableToppings: [],
      isAvailable: true,
    },
  ];

  const alerts = checkLowStockAlerts(products);
  assert.equal(alerts.length, 1);
  assert.equal(alerts[0].name, 'Coffee');
});

test('calculateDailyReportSummary aggregates daily sales correctly', () => {
  const today = new Date().toISOString().slice(0, 10);
  const sampleTransactions: Transaction[] = [
    {
      id: 'tx-1',
      invoiceNumber: 'INV-20261028-0001',
      timestamp: `${today}T10:30:00.000Z`,
      cashierId: 'u1',
      cashierName: 'Gitin Arifysa Fadilah',
      items: [
        {
          cartItemId: 'ci-1',
          productId: 'prod-1',
          name: 'Macchiato Coffee Latte',
          image: '',
          unitPrice: 53000,
          quantity: 2,
          size: 'M',
          sugar: '25%',
          ice: '25%',
          toppings: [],
          subtotal: 106000,
        },
      ],
      subTotal: 106000,
      tax: 4000,
      taxRate: 0.04,
      discount: 0,
      total: 110000,
      paymentMethod: 'cash',
      amountPaid: 150000,
      change: 40000,
      status: 'completed',
    },
    {
      id: 'tx-2',
      invoiceNumber: 'INV-20261028-0002',
      timestamp: `${today}T14:15:00.000Z`,
      cashierId: 'u1',
      cashierName: 'Gitin Arifysa Fadilah',
      items: [
        {
          cartItemId: 'ci-2',
          productId: 'prod-2',
          name: 'Hazelnut Coffee Latte',
          image: '',
          unitPrice: 45000,
          quantity: 1,
          size: 'S',
          sugar: '50%',
          ice: '50%',
          toppings: [],
          subtotal: 45000,
        },
      ],
      subTotal: 45000,
      tax: 2000,
      taxRate: 0.04,
      discount: 0,
      total: 47000,
      paymentMethod: 'qris',
      amountPaid: 47000,
      change: 0,
      status: 'completed',
    },
  ];

  const summary = calculateDailyReportSummary(sampleTransactions, today);
  assert.equal(summary.totalTransactions, 2);
  assert.equal(summary.totalGrossSales, 157000);
  assert.equal(summary.totalTax, 6000);
  assert.equal(summary.totalNetSales, 151000);
  assert.equal(summary.paymentMethodBreakdown.cash.total, 110000);
  assert.equal(summary.paymentMethodBreakdown.qris.total, 47000);
  assert.equal(summary.totalItemsSold, 3);
  assert.equal(summary.topProducts[0].name, 'Macchiato Coffee Latte');
  assert.equal(summary.topProducts[0].quantity, 2);
});
