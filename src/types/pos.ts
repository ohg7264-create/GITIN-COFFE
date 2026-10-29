/**
 * Aksara POS - Type Definitions
 */

export type ItemType = 'drink' | 'food';

export interface Category {
  id: string;
  name: string;
  slug: string;
  type: ItemType;
  image: string;
  iconName?: string;
}

export interface Topping {
  id: string;
  name: string;
  price: number;
  color: string;
  image?: string;
}

export type ProductSize = 'S' | 'M' | 'L';
export type SugarLevel = '25%' | '50%' | '75%' | '100%';
export type IceLevel = '0%' | '25%' | '50%' | '75%';

export interface Product {
  id: string;
  code: string;
  name: string;
  categoryId: string;
  type: ItemType;
  basePrice: number;
  image: string;
  stock: number;
  minStockAlert: number;
  availableSizes: ProductSize[];
  sizePriceModifier: {
    S: number;
    M: number;
    L: number;
  };
  allowSugar: boolean;
  allowIce: boolean;
  availableToppings: string[]; // Topping IDs
  isAvailable: boolean;
  description?: string;
}

export interface CartItem {
  cartItemId: string;
  productId: string;
  name: string;
  image: string;
  unitPrice: number;
  quantity: number;
  size: ProductSize;
  sugar: SugarLevel;
  ice: IceLevel;
  toppings: Topping[];
  subtotal: number;
}

export type PaymentMethod = 'cash' | 'qris' | 'card' | 'gopay' | 'ovo' | 'dana';

export interface Transaction {
  id: string;
  invoiceNumber: string;
  timestamp: string; // ISO String
  cashierId: string;
  cashierName: string;
  items: CartItem[];
  subTotal: number;
  tax: number;
  taxRate: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  amountPaid: number;
  change: number;
  status: 'completed' | 'refunded';
  notes?: string;
  referenceNumber?: string;
}

export type UserRole = 'admin' | 'kasir';

export interface User {
  id: string;
  name: string;
  username: string;
  role: UserRole;
  pin: string;
  avatar: string;
  email?: string;
}

export interface StoreSettings {
  storeName: string;
  storeTagline: string;
  address: string;
  phone: string;
  taxRate: number; // e.g. 0.04 (4% like mockup or 0.1 for 10%)
  enableTax: boolean;
  currency: string;
  receiptFooter: string;
  paperSize: '58mm' | '80mm';
  autoBackupDaily: boolean;
  lastBackupDate?: string;
}

export type StockLogType = 'in' | 'out' | 'sale' | 'adjustment';

export interface StockLog {
  id: string;
  timestamp: string;
  productId: string;
  productName: string;
  type: StockLogType;
  amount: number;
  previousStock: number;
  newStock: number;
  reason: string;
  cashierName: string;
}
