import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  CartItem,
  Category,
  PaymentMethod,
  Product,
  StockLog,
  StoreSettings,
  Topping,
  Transaction,
  User,
} from '../types/pos';
import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_SETTINGS,
  INITIAL_STOCK_LOGS,
  INITIAL_TOPPINGS,
  INITIAL_TRANSACTIONS,
  INITIAL_USERS,
} from '../data/initial-data';
import {
  calculateOrderTotals,
  calculateChange,
  generateInvoiceNumber,
} from '../utils/pos-logic';

export type ActiveView = 'pos' | 'stock' | 'reports' | 'analytics' | 'master' | 'settings';

interface POSContextType {
  // Theme
  isDarkMode: boolean;
  toggleDarkMode: () => void;

  // Navigation
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;

  // Filter & Search
  selectedCategory: string;
  setSelectedCategory: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Auth & User
  users: User[];
  currentUser: User | null;
  login: (username: string, pin: string) => boolean;
  logout: () => void;
  switchUser: (user: User) => void;
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;

  // Cart
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  updateCartQuantity: (cartItemId: string, delta: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  cartTotals: {
    subTotal: number;
    tax: number;
    total: number;
    itemCount: number;
  };

  // Products & Stock
  products: Product[];
  categories: Category[];
  toppings: Topping[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  adjustStock: (productId: string, changeAmount: number, type: 'in' | 'out' | 'adjustment', reason: string) => void;
  stockLogs: StockLog[];

  // Master Categories & Toppings CRUD
  addCategory: (cat: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  addTopping: (topping: Omit<Topping, 'id'>) => void;
  updateTopping: (id: string, updates: Partial<Topping>) => void;
  deleteTopping: (id: string) => void;

  // Checkout & Transactions
  transactions: Transaction[];
  currentReceiptTx: Transaction | null;
  setCurrentReceiptTx: (tx: Transaction | null) => void;
  isReceiptModalOpen: boolean;
  setIsReceiptModalOpen: (open: boolean) => void;
  isPaymentModalOpen: boolean;
  setIsPaymentModalOpen: (open: boolean) => void;
  activePaymentMethod: PaymentMethod;
  setActivePaymentMethod: (pm: PaymentMethod) => void;
  processCheckout: (
    paymentMethod: PaymentMethod,
    amountPaid: number,
    referenceNumber?: string,
    notes?: string
  ) => Transaction;

  // Store Settings & Backup
  storeSettings: StoreSettings;
  updateStoreSettings: (newSettings: Partial<StoreSettings>) => void;
  exportBackupJSON: () => void;
  importBackupJSON: (jsonString: string) => { success: boolean; message: string };
  resetToDemoData: () => void;
}

const POSContext = createContext<POSContextType | undefined>(undefined);

const STORAGE_KEYS = {
  THEME: 'aksara_pos_dark_mode',
  PRODUCTS: 'aksara_pos_products',
  CATEGORIES: 'aksara_pos_categories',
  TOPPINGS: 'aksara_pos_toppings',
  USERS: 'aksara_pos_users',
  CURRENT_USER: 'aksara_pos_current_user',
  SETTINGS: 'aksara_pos_settings',
  TRANSACTIONS: 'aksara_pos_transactions',
  STOCK_LOGS: 'aksara_pos_stock_logs',
};

export const POSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.THEME);
      return saved ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, JSON.stringify(isDarkMode));
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch {
      // ignore
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  // Active View
  const [activeView, setActiveView] = useState<ActiveView>('pos');

  // Filter & Search
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Store Settings
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  });

  const updateStoreSettings = (newSettings: Partial<StoreSettings>) => {
    setStoreSettings(prev => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
      return updated;
    });
  };

  // Categories
  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
    } catch {
      return INITIAL_CATEGORIES;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  }, [categories]);

  // Toppings
  const [toppings, setToppings] = useState<Topping[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TOPPINGS);
      return saved ? JSON.parse(saved) : INITIAL_TOPPINGS;
    } catch {
      return INITIAL_TOPPINGS;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TOPPINGS, JSON.stringify(toppings));
  }, [toppings]);

  // Products
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);

  // Users & Auth
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USERS);
      if (saved) {
        const parsed: User[] = JSON.parse(saved);
        return parsed.map(u =>
          u.id === 'user-01' || u.name === 'Kalia Janet'
            ? { ...u, name: 'Gitin Arifysa Fadilah', username: 'gitin', email: 'gitin@aksarapos.id' }
            : u
        );
      }
      return INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (saved) {
        const parsed: User = JSON.parse(saved);
        if (parsed.id === 'user-01' || parsed.name === 'Kalia Janet') {
          return { ...parsed, name: 'Gitin Arifysa Fadilah', username: 'gitin', email: 'gitin@aksarapos.id' };
        }
        return parsed;
      }
      return INITIAL_USERS[0];
    } catch {
      return INITIAL_USERS[0];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  }, [currentUser]);

  const login = (username: string, pin: string): boolean => {
    const found = users.find(
      u => (u.username.toLowerCase() === username.toLowerCase() || u.role === username.toLowerCase()) && u.pin === pin
    );
    if (found) {
      setCurrentUser(found);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const switchUser = (user: User) => {
    setCurrentUser(user);
  };

  const addUser = (user: Omit<User, 'id'>) => {
    const newUser: User = {
      ...user,
      id: `user-${Date.now()}`,
    };
    setUsers(prev => [...prev, newUser]);
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(u => (u.id === id ? { ...u, ...updates } : u)));
    if (currentUser?.id === id) {
      setCurrentUser(prev => (prev ? { ...prev, ...updates } : null));
    }
  };

  const deleteUser = (id: string) => {
    if (users.length <= 1) return;
    setUsers(prev => prev.filter(u => u.id !== id));
    if (currentUser?.id === id) {
      const remaining = users.filter(u => u.id !== id);
      setCurrentUser(remaining[0] || null);
    }
  };

  // Stock logs
  const [stockLogs, setStockLogs] = useState<StockLog[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STOCK_LOGS);
      return saved ? JSON.parse(saved) : INITIAL_STOCK_LOGS;
    } catch {
      return INITIAL_STOCK_LOGS;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STOCK_LOGS, JSON.stringify(stockLogs));
  }, [stockLogs]);

  // Transactions
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
    } catch {
      return INITIAL_TRANSACTIONS;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  }, [transactions]);

  // Cart State
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (item: CartItem) => {
    setCart(prev => {
      // Check if item with exact product, size, sugar, ice, and toppings already exists
      const toppingIds = item.toppings.map(t => t.id).sort().join(',');
      const existingIdx = prev.findIndex(
        ci =>
          ci.productId === item.productId &&
          ci.size === item.size &&
          ci.sugar === item.sugar &&
          ci.ice === item.ice &&
          ci.toppings.map(t => t.id).sort().join(',') === toppingIds
      );

      if (existingIdx >= 0) {
        const next = [...prev];
        const updatedQty = next[existingIdx].quantity + item.quantity;
        next[existingIdx] = {
          ...next[existingIdx],
          quantity: updatedQty,
          subtotal: updatedQty * next[existingIdx].unitPrice,
        };
        return next;
      }
      return [...prev, item];
    });
  };

  const updateCartQuantity = (cartItemId: string, delta: number) => {
    setCart(prev =>
      prev
        .map(item => {
          if (item.cartItemId === cartItemId) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            return {
              ...item,
              quantity: newQty,
              subtotal: newQty * item.unitPrice,
            };
          }
          return item;
        })
        .filter((i): i is CartItem => i !== null)
    );
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(prev => prev.filter(item => item.cartItemId !== cartItemId));
  };

  const clearCart = () => setCart([]);

  const cartTotals = calculateOrderTotals(cart, storeSettings.enableTax ? storeSettings.taxRate : 0);

  // Modal & Payment states
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [currentReceiptTx, setCurrentReceiptTx] = useState<Transaction | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [activePaymentMethod, setActivePaymentMethod] = useState<PaymentMethod>('cash');

  // Checkout process
  const processCheckout = (
    paymentMethod: PaymentMethod,
    amountPaid: number,
    referenceNumber?: string,
    notes?: string
  ): Transaction => {
    const taxRate = storeSettings.enableTax ? storeSettings.taxRate : 0;
    const totals = calculateOrderTotals(cart, taxRate);
    const change = calculateChange(totals.total, amountPaid);
    const invoiceNumber = generateInvoiceNumber(transactions.length);

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      invoiceNumber,
      timestamp: new Date().toISOString(),
      cashierId: currentUser?.id || 'sys-cashier',
      cashierName: currentUser?.name || 'Kasir Standar',
      items: [...cart],
      subTotal: totals.subTotal,
      tax: totals.tax,
      taxRate,
      discount: 0,
      total: totals.total,
      paymentMethod,
      amountPaid: paymentMethod === 'cash' ? amountPaid : totals.total,
      change: paymentMethod === 'cash' ? change : 0,
      status: 'completed',
      notes,
      referenceNumber,
    };

    // Deduct stock for all items
    setProducts(prevProducts => {
      const nextProducts = [...prevProducts];
      const newStockLogs: StockLog[] = [];

      for (const cartItem of cart) {
        const prodIdx = nextProducts.findIndex(p => p.id === cartItem.productId);
        if (prodIdx >= 0) {
          const currentProd = nextProducts[prodIdx];
          const newStock = Math.max(0, currentProd.stock - cartItem.quantity);
          nextProducts[prodIdx] = {
            ...currentProd,
            stock: newStock,
          };

          newStockLogs.push({
            id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            timestamp: new Date().toISOString(),
            productId: currentProd.id,
            productName: currentProd.name,
            type: 'sale',
            amount: cartItem.quantity,
            previousStock: currentProd.stock,
            newStock,
            reason: `Penjualan ${invoiceNumber} (${cartItem.size})`,
            cashierName: currentUser?.name || 'Kasir',
          });
        }
      }

      setStockLogs(prevLogs => [...newStockLogs, ...prevLogs]);
      return nextProducts;
    });

    // Save transaction
    setTransactions(prev => [newTx, ...prev]);

    // Clear cart and prepare receipt
    clearCart();
    setCurrentReceiptTx(newTx);
    setIsPaymentModalOpen(false);
    setIsReceiptModalOpen(true);

    return newTx;
  };

  // Stock Adjustment
  const adjustStock = (
    productId: string,
    changeAmount: number,
    type: 'in' | 'out' | 'adjustment',
    reason: string
  ) => {
    setProducts(prev => {
      const idx = prev.findIndex(p => p.id === productId);
      if (idx === -1) return prev;
      const target = prev[idx];
      let newStock = target.stock;
      if (type === 'in') newStock = target.stock + Math.abs(changeAmount);
      else if (type === 'out') newStock = Math.max(0, target.stock - Math.abs(changeAmount));
      else newStock = Math.max(0, changeAmount);

      const log: StockLog = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString(),
        productId: target.id,
        productName: target.name,
        type,
        amount: Math.abs(newStock - target.stock),
        previousStock: target.stock,
        newStock,
        reason,
        cashierName: currentUser?.name || 'Admin',
      };

      setStockLogs(l => [log, ...l]);

      const updated = [...prev];
      updated[idx] = { ...target, stock: newStock };
      return updated;
    });
  };

  // Master Data CRUD: Products
  const addProduct = (prod: Omit<Product, 'id'>) => {
    const newProd: Product = {
      ...prod,
      id: `prod-${Date.now()}`,
    };
    setProducts(prev => [newProd, ...prev]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => (p.id === id ? { ...p, ...updates } : p)));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  // Master Data CRUD: Categories
  const addCategory = (cat: Omit<Category, 'id'>) => {
    const newCat: Category = {
      ...cat,
      id: `cat-${Date.now()}`,
      slug: cat.name.toLowerCase().replace(/\s+/g, '-'),
    };
    setCategories(prev => [...prev, newCat]);
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    setCategories(prev => prev.map(c => (c.id === id ? { ...c, ...updates } : c)));
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  // Master Data CRUD: Toppings
  const addTopping = (topping: Omit<Topping, 'id'>) => {
    const newTop: Topping = {
      ...topping,
      id: `top-${Date.now()}`,
    };
    setToppings(prev => [...prev, newTop]);
  };

  const updateTopping = (id: string, updates: Partial<Topping>) => {
    setToppings(prev => prev.map(t => (t.id === id ? { ...t, ...updates } : t)));
  };

  const deleteTopping = (id: string) => {
    setToppings(prev => prev.filter(t => t.id !== id));
  };

  // Backup & Restore
  const exportBackupJSON = () => {
    const backupData = {
      appName: 'Aksara POS',
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      storeSettings,
      categories,
      toppings,
      products,
      users,
      transactions,
      stockLogs,
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const dateStr = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `aksara_pos_backup_${dateStr}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importBackupJSON = (jsonString: string): { success: boolean; message: string } => {
    try {
      const data = JSON.parse(jsonString);
      if (!data.products || !data.transactions) {
        return { success: false, message: 'Format data backup tidak valid.' };
      }

      if (data.storeSettings) setStoreSettings(data.storeSettings);
      if (Array.isArray(data.categories)) setCategories(data.categories);
      if (Array.isArray(data.toppings)) setToppings(data.toppings);
      if (Array.isArray(data.products)) setProducts(data.products);
      if (Array.isArray(data.users)) setUsers(data.users);
      if (Array.isArray(data.transactions)) setTransactions(data.transactions);
      if (Array.isArray(data.stockLogs)) setStockLogs(data.stockLogs);

      return { success: true, message: 'Database berhasil dipulihkan dengan sukses.' };
    } catch (err: unknown) {
      return { success: false, message: `Gagal membaca file: ${(err as Error).message}` };
    }
  };

  const resetToDemoData = () => {
    setCategories(INITIAL_CATEGORIES);
    setToppings(INITIAL_TOPPINGS);
    setProducts(INITIAL_PRODUCTS);
    setUsers(INITIAL_USERS);
    setCurrentUser(INITIAL_USERS[0]);
    setStoreSettings(INITIAL_SETTINGS);
    setTransactions(INITIAL_TRANSACTIONS);
    setStockLogs(INITIAL_STOCK_LOGS);
    setCart([]);
  };

  return (
    <POSContext.Provider
      value={{
        isDarkMode,
        toggleDarkMode,
        activeView,
        setActiveView,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        users,
        currentUser,
        login,
        logout,
        switchUser,
        addUser,
        updateUser,
        deleteUser,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartTotals,
        products,
        categories,
        toppings,
        addProduct,
        updateProduct,
        deleteProduct,
        adjustStock,
        stockLogs,
        addCategory,
        updateCategory,
        deleteCategory,
        addTopping,
        updateTopping,
        deleteTopping,
        transactions,
        currentReceiptTx,
        setCurrentReceiptTx,
        isReceiptModalOpen,
        setIsReceiptModalOpen,
        isPaymentModalOpen,
        setIsPaymentModalOpen,
        activePaymentMethod,
        setActivePaymentMethod,
        processCheckout,
        storeSettings,
        updateStoreSettings,
        exportBackupJSON,
        importBackupJSON,
        resetToDemoData,
      }}
    >
      {children}
    </POSContext.Provider>
  );
};

export const usePOS = () => {
  const context = useContext(POSContext);
  if (!context) {
    throw new Error('usePOS must be used within a POSProvider');
  }
  return context;
};
