import React, { useState } from 'react';
import {
  FolderTree,
  Package,
  Layers,
  CircleDot,
  Users,
  Plus,
  Edit2,
  Trash2,
  Search,
  X,
  Check,
  AlertCircle,
} from 'lucide-react';
import { usePOS } from '../../context/POSContext';
import { Product, Category, Topping, User, ItemType, ProductSize } from '../../types/pos';
import { formatRupiah } from '../../utils/pos-logic';

export const MasterDataView: React.FC = () => {
  const {
    products,
    categories,
    toppings,
    users,
    addProduct,
    updateProduct,
    deleteProduct,
    addCategory,
    updateCategory,
    deleteCategory,
    addTopping,
    updateTopping,
    deleteTopping,
    addUser,
    updateUser,
    deleteUser,
    currentUser,
  } = usePOS();

  type MasterTab = 'products' | 'categories' | 'toppings' | 'users';
  const [activeTab, setActiveTab] = useState<MasterTab>('products');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [isToppingModalOpen, setIsToppingModalOpen] = useState(false);
  const [editingTopping, setEditingTopping] = useState<Topping | null>(null);

  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Form states for Product
  const [prodCode, setProdCode] = useState('');
  const [prodName, setProdName] = useState('');
  const [prodCatId, setProdCatId] = useState('');
  const [prodType, setProdType] = useState<ItemType>('drink');
  const [prodBasePrice, setProdBasePrice] = useState(30000);
  const [prodImage, setProdImage] = useState('');
  const [prodStock, setProdStock] = useState(20);
  const [prodMinStock, setProdMinStock] = useState(5);
  const [prodDesc, setProdDesc] = useState('');

  // Form states for Category
  const [catName, setCatName] = useState('');
  const [catType, setCatType] = useState<ItemType>('drink');
  const [catImage, setCatImage] = useState('');

  // Form states for Topping
  const [topName, setTopName] = useState('');
  const [topPrice, setTopPrice] = useState(5000);
  const [topColor, setTopColor] = useState('#228B22');

  // Form states for User
  const [userName, setUserName] = useState('');
  const [userUsername, setUserUsername] = useState('');
  const [userPin, setUserPin] = useState('1234');
  const [userRole, setUserRole] = useState<'admin' | 'kasir'>('kasir');

  // Handlers for Product
  const handleOpenProductModal = (prod?: Product) => {
    if (prod) {
      setEditingProduct(prod);
      setProdCode(prod.code);
      setProdName(prod.name);
      setProdCatId(prod.categoryId);
      setProdType(prod.type);
      setProdBasePrice(prod.basePrice);
      setProdImage(prod.image);
      setProdStock(prod.stock);
      setProdMinStock(prod.minStockAlert);
      setProdDesc(prod.description || '');
    } else {
      setEditingProduct(null);
      setProdCode(String(products.length + 1).padStart(2, '0'));
      setProdName('');
      setProdCatId(categories[0]?.id || '');
      setProdType('drink');
      setProdBasePrice(35000);
      setProdImage(
        'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&auto=format&fit=crop&q=80'
      );
      setProdStock(30);
      setProdMinStock(5);
      setProdDesc('');
    }
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName.trim()) return;

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        code: prodCode,
        name: prodName,
        categoryId: prodCatId,
        type: prodType,
        basePrice: prodBasePrice,
        image: prodImage,
        stock: prodStock,
        minStockAlert: prodMinStock,
        description: prodDesc,
      });
    } else {
      addProduct({
        code: prodCode,
        name: prodName,
        categoryId: prodCatId || categories[0]?.id || 'cat-coffee',
        type: prodType,
        basePrice: prodBasePrice,
        image:
          prodImage ||
          'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&auto=format&fit=crop&q=80',
        stock: prodStock,
        minStockAlert: prodMinStock,
        availableSizes: ['S', 'M', 'L'],
        sizePriceModifier: { S: 0, M: 4000, L: 8000 },
        allowSugar: prodType === 'drink',
        allowIce: prodType === 'drink',
        availableToppings: toppings.map(t => t.id),
        isAvailable: true,
        description: prodDesc,
      });
    }
    setIsProductModalOpen(false);
  };

  // Handlers for Category
  const handleOpenCategoryModal = (cat?: Category) => {
    if (cat) {
      setEditingCategory(cat);
      setCatName(cat.name);
      setCatType(cat.type);
      setCatImage(cat.image);
    } else {
      setEditingCategory(null);
      setCatName('');
      setCatType('drink');
      setCatImage(
        'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=300&auto=format&fit=crop&q=80'
      );
    }
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) return;

    if (editingCategory) {
      updateCategory(editingCategory.id, {
        name: catName,
        type: catType,
        image: catImage,
      });
    } else {
      addCategory({
        name: catName,
        slug: catName.toLowerCase().replace(/\s+/g, '-'),
        type: catType,
        image: catImage,
      });
    }
    setIsCategoryModalOpen(false);
  };

  // Handlers for Topping
  const handleOpenToppingModal = (top?: Topping) => {
    if (top) {
      setEditingTopping(top);
      setTopName(top.name);
      setTopPrice(top.price);
      setTopColor(top.color);
    } else {
      setEditingTopping(null);
      setTopName('');
      setTopPrice(5000);
      setTopColor('#FAB005');
    }
    setIsToppingModalOpen(true);
  };

  const handleSaveTopping = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topName.trim()) return;

    if (editingTopping) {
      updateTopping(editingTopping.id, {
        name: topName,
        price: topPrice,
        color: topColor,
      });
    } else {
      addTopping({
        name: topName,
        price: topPrice,
        color: topColor,
      });
    }
    setIsToppingModalOpen(false);
  };

  // Handlers for User
  const handleOpenUserModal = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setUserName(user.name);
      setUserUsername(user.username);
      setUserPin(user.pin);
      setUserRole(user.role);
    } else {
      setEditingUser(null);
      setUserName('');
      setUserUsername('');
      setUserPin('1234');
      setUserRole('kasir');
    }
    setIsUserModalOpen(true);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !userUsername.trim()) return;

    if (editingUser) {
      updateUser(editingUser.id, {
        name: userName,
        username: userUsername,
        pin: userPin,
        role: userRole,
      });
    } else {
      addUser({
        name: userName,
        username: userUsername,
        pin: userPin,
        role: userRole,
        avatar:
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      });
    }
    setIsUserModalOpen(false);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Page Title & Navigation Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-stone-900 dark:text-stone-100 tracking-tight flex items-center gap-2.5">
            <FolderTree className="w-7 h-7 text-emerald-600" />
            <span>Manajemen Master Data</span>
          </h1>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
            Kelola data produk, kategori menu, topping add-on, dan hak akses kasir / admin
          </p>
        </div>

        {/* Tab pills */}
        <div className="flex items-center gap-1.5 bg-stone-100 dark:bg-stone-800 p-1.5 rounded-2xl self-start flex-wrap">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
              activeTab === 'products'
                ? 'bg-white dark:bg-stone-700 text-emerald-700 dark:text-emerald-300 shadow-xs'
                : 'text-stone-600 dark:text-stone-400'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Produk ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
              activeTab === 'categories'
                ? 'bg-white dark:bg-stone-700 text-emerald-700 dark:text-emerald-300 shadow-xs'
                : 'text-stone-600 dark:text-stone-400'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Kategori ({categories.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('toppings')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
              activeTab === 'toppings'
                ? 'bg-white dark:bg-stone-700 text-emerald-700 dark:text-emerald-300 shadow-xs'
                : 'text-stone-600 dark:text-stone-400'
            }`}
          >
            <CircleDot className="w-3.5 h-3.5" />
            <span>Topping ({toppings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
              activeTab === 'users'
                ? 'bg-white dark:bg-stone-700 text-emerald-700 dark:text-emerald-300 shadow-xs'
                : 'text-stone-600 dark:text-stone-400'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Kasir & Admin ({users.length})</span>
          </button>
        </div>
      </div>

      {/* TAB 1: MASTER PRODUK */}
      {activeTab === 'products' && (
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-xs overflow-hidden">
          <div className="p-4 border-b border-stone-100 dark:border-stone-800 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari produk master..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-stone-200 dark:border-stone-700 text-xs font-medium bg-stone-50 dark:bg-stone-800 focus:outline-none focus:border-emerald-500 text-stone-900 dark:text-white"
              />
            </div>

            <button
              onClick={() => handleOpenProductModal()}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Produk Baru</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50/80 dark:bg-stone-800/50 text-stone-500 uppercase font-semibold text-[10px] border-b border-stone-100 dark:border-stone-800">
                <tr>
                  <th className="py-3 px-4">Kode & Produk</th>
                  <th className="py-3 px-4">Kategori</th>
                  <th className="py-3 px-4">Harga Dasar</th>
                  <th className="py-3 px-4 text-center">Stok / Porsi</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800 text-stone-800 dark:text-stone-200">
                {products
                  .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map(p => {
                    const cat = categories.find(c => c.id === p.categoryId);
                    return (
                      <tr key={p.id} className="hover:bg-stone-50/50 dark:hover:bg-stone-800/30">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.image}
                              alt={p.name}
                              className="w-10 h-10 rounded-lg object-cover border border-stone-200 dark:border-stone-700"
                            />
                            <div>
                              <div className="font-bold text-sm text-stone-900 dark:text-stone-100">
                                {p.name}
                              </div>
                              <div className="text-[10px] text-stone-400 font-mono">
                                #{p.code} • {p.type === 'drink' ? 'Minuman' : 'Makanan'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-semibold text-stone-600 dark:text-stone-400">
                          {cat?.name || '-'}
                        </td>
                        <td className="py-3 px-4 font-extrabold text-stone-900 dark:text-stone-100">
                          {formatRupiah(p.basePrice)}
                        </td>
                        <td className="py-3 px-4 text-center font-bold">
                          {p.stock}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenProductModal(p)}
                              className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/60"
                              title="Edit Produk"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Hapus produk "${p.name}"?`)) {
                                  deleteProduct(p.id);
                                }
                              }}
                              className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/60"
                              title="Hapus Produk"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: MASTER KATEGORI */}
      {activeTab === 'categories' && (
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-xs overflow-hidden">
          <div className="p-4 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between">
            <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100">
              Daftar Kategori Menu
            </h3>
            <button
              onClick={() => handleOpenCategoryModal()}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Kategori</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-5">
            {categories.map(cat => (
              <div
                key={cat.id}
                className="relative h-28 rounded-2xl overflow-hidden group border border-stone-200 dark:border-stone-700 shadow-xs"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-stone-900/50 backdrop-blur-[1px]" />
                <div className="relative h-full p-4 flex flex-col justify-between text-white">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/20">
                      {cat.type}
                    </span>
                    <div className="flex items-center gap-1 bg-black/40 rounded-lg p-1 backdrop-blur-xs">
                      <button
                        onClick={() => handleOpenCategoryModal(cat)}
                        className="p-1 text-white hover:text-emerald-400"
                        title="Edit Kategori"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Hapus kategori "${cat.name}"?`)) {
                            deleteCategory(cat.id);
                          }
                        }}
                        className="p-1 text-white hover:text-rose-400"
                        title="Hapus Kategori"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="font-black text-lg">{cat.name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: MASTER TOPPING */}
      {activeTab === 'toppings' && (
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-xs overflow-hidden">
          <div className="p-4 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between">
            <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100">
              Daftar Topping / Add-on
            </h3>
            <button
              onClick={() => handleOpenToppingModal()}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Topping</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 p-5">
            {toppings.map(t => (
              <div
                key={t.id}
                className="p-4 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800/40 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full shadow-xs border border-white dark:border-stone-600"
                    style={{ backgroundColor: t.color }}
                  />
                  <div>
                    <div className="font-bold text-xs text-stone-900 dark:text-stone-100">
                      {t.name}
                    </div>
                    <div className="text-[11px] text-emerald-600 font-semibold">
                      +{formatRupiah(t.price)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenToppingModal(t)}
                    className="p-1 text-stone-400 hover:text-emerald-600"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Hapus topping "${t.name}"?`)) {
                        deleteTopping(t.id);
                      }
                    }}
                    className="p-1 text-stone-400 hover:text-rose-500"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: MASTER USERS */}
      {activeTab === 'users' && (
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-xs overflow-hidden">
          <div className="p-4 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between">
            <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100">
              Hak Akses Kasir & Administrator
            </h3>
            <button
              onClick={() => handleOpenUserModal()}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Pengguna</span>
            </button>
          </div>

          <div className="divide-y divide-stone-100 dark:divide-stone-800">
            {users.map(u => (
              <div
                key={u.id}
                className="p-4 sm:p-5 flex items-center justify-between hover:bg-stone-50/50 dark:hover:bg-stone-800/30"
              >
                <div className="flex items-center gap-3.5">
                  <img
                    src={u.avatar}
                    alt={u.name}
                    className="w-11 h-11 rounded-full object-cover ring-2 ring-emerald-600/30"
                  />
                  <div>
                    <div className="font-bold text-sm text-stone-900 dark:text-stone-100 flex items-center gap-2">
                      <span>{u.name}</span>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          u.role === 'admin'
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                            : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        }`}
                      >
                        {u.role}
                      </span>
                    </div>
                    <div className="text-xs text-stone-400 mt-0.5">
                      Username: <span className="font-mono text-stone-700 dark:text-stone-300">{u.username}</span> • PIN:{' '}
                      <span className="font-mono text-stone-700 dark:text-stone-300">••••</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenUserModal(u)}
                    className="p-2 rounded-xl text-stone-500 hover:text-emerald-600 hover:bg-stone-100 dark:hover:bg-stone-800"
                    title="Edit Pengguna"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  {users.length > 1 && (
                    <button
                      onClick={() => {
                        if (confirm(`Hapus pengguna "${u.name}"?`)) {
                          deleteUser(u.id);
                        }
                      }}
                      className="p-2 rounded-xl text-stone-500 hover:text-rose-600 hover:bg-stone-100 dark:hover:bg-stone-800"
                      title="Hapus Pengguna"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Product Edit / Add Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-stone-900 w-full max-w-lg rounded-2xl p-6 shadow-2xl border border-stone-200 dark:border-stone-800 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b pb-3 border-stone-100 dark:border-stone-800">
              <h3 className="font-extrabold text-base text-stone-900 dark:text-stone-100">
                {editingProduct ? 'Edit Master Produk' : 'Tambah Produk Baru'}
              </h3>
              <button onClick={() => setIsProductModalOpen(false)}>
                <X className="w-5 h-5 text-stone-400" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-3.5">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Kode Produk
                  </label>
                  <input
                    type="text"
                    value={prodCode}
                    onChange={e => setProdCode(e.target.value)}
                    placeholder="01"
                    className="w-full px-3 py-2 rounded-xl border text-xs bg-white dark:bg-stone-800 font-bold"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Nama Menu Produk
                  </label>
                  <input
                    type="text"
                    value={prodName}
                    onChange={e => setProdName(e.target.value)}
                    placeholder="Contoh: Macchiato Coffee Latte"
                    className="w-full px-3 py-2 rounded-xl border text-xs bg-white dark:bg-stone-800 font-semibold"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Kategori
                  </label>
                  <select
                    value={prodCatId}
                    onChange={e => setProdCatId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border text-xs bg-white dark:bg-stone-800 font-semibold"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.type})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Tipe Menu
                  </label>
                  <select
                    value={prodType}
                    onChange={e => setProdType(e.target.value as ItemType)}
                    className="w-full px-3 py-2 rounded-xl border text-xs bg-white dark:bg-stone-800 font-semibold"
                  >
                    <option value="drink">Minuman (Drink)</option>
                    <option value="food">Makanan (Food)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Harga Dasar (Rp)
                  </label>
                  <input
                    type="number"
                    value={prodBasePrice}
                    onChange={e => setProdBasePrice(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl border text-xs bg-white dark:bg-stone-800 font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Stok Awal
                  </label>
                  <input
                    type="number"
                    value={prodStock}
                    onChange={e => setProdStock(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl border text-xs bg-white dark:bg-stone-800 font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Batas Peringatan
                  </label>
                  <input
                    type="number"
                    value={prodMinStock}
                    onChange={e => setProdMinStock(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl border text-xs bg-white dark:bg-stone-800 font-bold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  URL Foto Produk
                </label>
                <input
                  type="url"
                  value={prodImage}
                  onChange={e => setProdImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 rounded-xl border text-xs bg-white dark:bg-stone-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Deskripsi Singkat
                </label>
                <textarea
                  value={prodDesc}
                  onChange={e => setProdDesc(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl border text-xs bg-white dark:bg-stone-800"
                  placeholder="Catatan rasa, komposisi..."
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100 dark:border-stone-800">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 rounded-xl border text-xs font-semibold text-stone-600 dark:text-stone-300"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                >
                  Simpan Produk
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Category Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-stone-900 w-full max-w-sm rounded-2xl p-6 shadow-2xl border border-stone-200 dark:border-stone-800 space-y-4">
            <h3 className="font-extrabold text-base text-stone-900 dark:text-stone-100">
              {editingCategory ? 'Edit Kategori' : 'Tambah Kategori'}
            </h3>
            <form onSubmit={handleSaveCategory} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Nama Kategori
                </label>
                <input
                  type="text"
                  value={catName}
                  onChange={e => setCatName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border text-xs bg-white dark:bg-stone-800 font-bold"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Tipe
                </label>
                <select
                  value={catType}
                  onChange={e => setCatType(e.target.value as ItemType)}
                  className="w-full px-3 py-2 rounded-xl border text-xs bg-white dark:bg-stone-800"
                >
                  <option value="drink">Drink (Minuman)</option>
                  <option value="food">Food (Makanan)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Foto Background
                </label>
                <input
                  type="url"
                  value={catImage}
                  onChange={e => setCatImage(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border text-xs bg-white dark:bg-stone-800"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2 rounded-xl border text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Topping Modal */}
      {isToppingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-stone-900 w-full max-w-sm rounded-2xl p-6 shadow-2xl border border-stone-200 dark:border-stone-800 space-y-4">
            <h3 className="font-extrabold text-base text-stone-900 dark:text-stone-100">
              {editingTopping ? 'Edit Topping' : 'Tambah Topping'}
            </h3>
            <form onSubmit={handleSaveTopping} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Nama Topping
                </label>
                <input
                  type="text"
                  value={topName}
                  onChange={e => setTopName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border text-xs bg-white dark:bg-stone-800 font-bold"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Harga Ekstra (Rp)
                </label>
                <input
                  type="number"
                  value={topPrice}
                  onChange={e => setTopPrice(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl border text-xs bg-white dark:bg-stone-800 font-bold"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Warna Ikon Bulat
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={topColor}
                    onChange={e => setTopColor(e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer border-0 p-0"
                  />
                  <span className="font-mono text-xs">{topColor}</span>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsToppingModalOpen(false)}
                  className="px-4 py-2 rounded-xl border text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User Modal */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-stone-900 w-full max-w-sm rounded-2xl p-6 shadow-2xl border border-stone-200 dark:border-stone-800 space-y-4">
            <h3 className="font-extrabold text-base text-stone-900 dark:text-stone-100">
              {editingUser ? 'Edit Pengguna' : 'Tambah Kasir/Admin'}
            </h3>
            <form onSubmit={handleSaveUser} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={e => setUserName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border text-xs bg-white dark:bg-stone-800 font-bold"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Username Login
                </label>
                <input
                  type="text"
                  value={userUsername}
                  onChange={e => setUserUsername(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border text-xs bg-white dark:bg-stone-800 font-semibold"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  PIN Keamanan (4-6 Angka)
                </label>
                <input
                  type="password"
                  maxLength={6}
                  value={userPin}
                  onChange={e => setUserPin(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border text-xs bg-white dark:bg-stone-800 font-mono font-bold"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Peran (Role)
                </label>
                <select
                  value={userRole}
                  onChange={e => setUserRole(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border text-xs bg-white dark:bg-stone-800 font-semibold"
                >
                  <option value="kasir">Kasir (Hanya POS & Struk)</option>
                  <option value="admin">Administrator (Semua Akses & CRUD)</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsUserModalOpen(false)}
                  className="px-4 py-2 rounded-xl border text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs"
                >
                  Simpan Pengguna
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
