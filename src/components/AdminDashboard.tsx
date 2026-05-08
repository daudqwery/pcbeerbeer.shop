import { useStore } from '../store';
import { products as initialProducts, categoryIcons } from '../data/products';
import { 
  LayoutDashboard, Package, ShoppingCart, DollarSign, TrendingUp, 
  LogOut, Plus, Edit3, Trash2, Zap, CreditCard
} from 'lucide-react';
import { useState } from 'react';
import { Product } from '../types';
import { v4 as uuidv4 } from 'uuid';
import toast from '../utils/toast';
import PaymentGatewaySettings from './PaymentGatewaySettings';

export default function AdminDashboard() {
  const { 
    admin, logout, setCurrentPage, 
    orders, products: storeProducts,
    addProduct, updateProduct, deleteProduct,
    updateOrderStatus, updatePaymentStatus,
    paymentGateways
  } = useStore();
  
  const enabledGatewaysCount = Object.values(paymentGateways).filter(g => g.enabled).length;
  
  const allProducts = [...initialProducts, ...storeProducts];
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'payment-gateway'>('dashboard');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    image: '',
    category: 'WhatsApp Tools',
    stock: '',
    alcohol: '5',
    volume: 'Lifetime License',
    origin: 'Indonesia',
  });

  const totalRevenue = orders
    .filter(o => o.paymentStatus === 'paid')
    .reduce((sum, o) => sum + o.total, 0);
  
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const totalProducts = allProducts.length;
  const totalOrders = orders.length;

  const inputClass = "w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none";

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      originalPrice: '',
      image: '',
      category: 'WhatsApp Tools',
      stock: '',
      alcohol: '5',
      volume: 'Lifetime License',
      origin: 'Indonesia',
    });
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const newProduct: Product = {
      id: uuidv4(),
      name: formData.name,
      description: formData.description,
      price: Number(formData.price),
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
      image: formData.image || 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=400&fit=crop',
      category: formData.category,
      stock: Number(formData.stock),
      alcohol: Number(formData.alcohol),
      volume: formData.volume,
      origin: formData.origin,
      featured: false,
      createdAt: new Date().toISOString(),
    };
    addProduct(newProduct);
    toast.success('Produk berhasil ditambahkan!');
    setShowAddForm(false);
    resetForm();
  };

  const handleEditProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    const updated: Product = {
      ...editingProduct,
      name: formData.name,
      description: formData.description,
      price: Number(formData.price),
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
      image: formData.image || editingProduct.image,
      category: formData.category,
      stock: Number(formData.stock),
      alcohol: Number(formData.alcohol),
      volume: formData.volume,
      origin: formData.origin,
    };
    updateProduct(updated);
    toast.success('Produk berhasil diperbarui!');
    setEditingProduct(null);
    resetForm();
  };

  const handleDeleteProduct = (id: string) => {
    deleteProduct(id);
    toast.success('Produk berhasil dihapus!');
    setShowDeleteConfirm(null);
  };

  const startEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: String(product.price),
      originalPrice: product.originalPrice ? String(product.originalPrice) : '',
      image: product.image,
      category: product.category,
      stock: String(product.stock),
      alcohol: String(product.alcohol),
      volume: product.volume,
      origin: product.origin,
    });
    setShowAddForm(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    logout();
    setCurrentPage('home');
    toast.info('Anda telah logout');
  };

  if (!admin.isLoggedIn) {
    setCurrentPage('admin-login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-lg flex items-center justify-center shadow-lg">
                <Zap className="w-5 h-5 text-white" fill="white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Admin Dashboard</h1>
                <p className="text-sm text-blue-300">Selamat datang, {admin.username}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentPage('home')}
                className="text-sm text-blue-300 hover:text-white transition hidden sm:block"
              >
                Lihat Toko →
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium transition"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Nav */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 sm:gap-6 overflow-x-auto">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'products', label: 'Produk', icon: Package },
              { id: 'orders', label: 'Pesanan', icon: ShoppingCart },
              { id: 'payment-gateway', label: 'Payment Gateway', icon: CreditCard },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3 sm:px-4 py-4 border-b-2 font-medium text-sm transition whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-700'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
              {[
                { label: 'Total Produk', value: totalProducts, icon: Package, color: 'from-blue-500 to-blue-600' },
                { label: 'Total Pesanan', value: totalOrders, icon: ShoppingCart, color: 'from-green-500 to-green-600' },
                { label: 'Pesanan Pending', value: pendingOrders, icon: TrendingUp, color: 'from-yellow-500 to-orange-500' },
                { label: 'Pendapatan', value: `Rp ${totalRevenue.toLocaleString('id-ID')}`, icon: DollarSign, color: 'from-cyan-500 to-blue-500' },
              ].map((stat, i) => (
                <div key={i} className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                      <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                  </div>
                  <div className="text-lg sm:text-2xl font-bold text-gray-800">{stat.value}</div>
                  <div className="text-xs sm:text-sm text-gray-500 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>

             {/* Payment Gateway Status */}
             <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
               <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                 <div>
                   <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                     <CreditCard className="w-5 h-5 text-blue-600" />
                     Payment Gateway Status
                   </h2>
                   <p className="text-xs text-gray-500 mt-1">{enabledGatewaysCount} dari {Object.keys(paymentGateways).length} gateway aktif</p>
                 </div>
                 <button
                   onClick={() => setActiveTab('payment-gateway')}
                   className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                 >
                   Kelola →
                 </button>
               </div>
               <div className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                 {Object.values(paymentGateways).map((gw) => (
                   <button
                     key={gw.id}
                     onClick={() => setActiveTab('payment-gateway')}
                     className={`p-3 rounded-xl border-2 transition text-left ${
                       gw.enabled
                         ? 'border-green-200 bg-green-50 hover:bg-green-100'
                         : 'border-gray-100 bg-gray-50 hover:bg-gray-100 opacity-60'
                     }`}
                   >
                     <div className="flex items-center gap-2 mb-1">
                       <span className="text-xl">{gw.logo}</span>
                       <span className="font-bold text-gray-800 text-sm line-clamp-1">{gw.name}</span>
                     </div>
                     <div className="flex items-center gap-1.5">
                       <span className={`w-2 h-2 rounded-full ${gw.enabled ? 'bg-green-500' : 'bg-gray-300'}`} />
                       <span className="text-[10px] text-gray-500">{gw.enabled ? 'Aktif' : 'Nonaktif'}</span>
                     </div>
                     <div className={`text-[10px] font-semibold mt-1 ${
                       gw.mode === 'production' ? 'text-red-600' : 'text-orange-600'
                     }`}>
                       {gw.mode === 'production' ? '🔴 Production' : '🟡 Sandbox'}
                     </div>
                   </button>
                 ))}
               </div>
             </div>

             {/* Recent Orders */}
             <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
               <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                 <h2 className="text-lg font-bold text-gray-800">Pesanan Terbaru</h2>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Lihat Semua →
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-6 py-3 font-semibold text-gray-600">Order ID</th>
                      <th className="text-left px-6 py-3 font-semibold text-gray-600">Pelanggan</th>
                      <th className="text-left px-6 py-3 font-semibold text-gray-600">Total</th>
                      <th className="text-left px-6 py-3 font-semibold text-gray-600">Status</th>
                      <th className="text-left px-6 py-3 font-semibold text-gray-600">Pembayaran</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {orders.slice(0, 5).map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-mono text-xs">{order.id}</td>
                        <td className="px-6 py-4">{order.customerName}</td>
                        <td className="px-6 py-4 font-semibold">Rp {order.total.toLocaleString('id-ID')}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                            order.status === 'shipped' ? 'bg-purple-100 text-purple-700' :
                            order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                            order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' :
                            order.paymentStatus === 'failed' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {order.paymentStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {orders.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                          Belum ada pesanan
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div>
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-6">
              <h2 className="text-xl font-bold text-gray-800">Manajemen Produk ({totalProducts})</h2>
              <button
                onClick={() => {
                  resetForm();
                  setShowAddForm(true);
                  setEditingProduct(null);
                }}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition shadow-md shadow-blue-500/30"
              >
                <Plus className="w-4 h-4" />
                Tambah Produk
              </button>
            </div>

            {/* Add/Edit Form */}
            {(showAddForm || editingProduct) && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  {editingProduct ? '✏️ Edit Produk' : '➕ Tambah Produk Baru'}
                </h3>
                <form onSubmit={editingProduct ? handleEditProduct : handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Produk</label>
                    <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Contoh: WhatsApp Bulk Sender Pro"
                      className={inputClass} required />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                    <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="Deskripsi lengkap produk..."
                      className={inputClass} rows={3} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Harga (Rp)</label>
                    <input type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})}
                      placeholder="350000"
                      className={inputClass} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Harga Asli (opsional)</label>
                    <input type="number" value={formData.originalPrice} onChange={(e) => setFormData({...formData, originalPrice: e.target.value})}
                      placeholder="500000"
                      className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                    <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className={inputClass}>
                      <option>WhatsApp Tools</option>
                      <option>Telegram Tools</option>
                      <option>Instagram Tools</option>
                      <option>PC Gaming</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stok</label>
                    <input type="number" value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})}
                      placeholder="100"
                      className={inputClass} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Versi / Rating</label>
                    <input type="number" step="0.1" value={formData.alcohol} onChange={(e) => setFormData({...formData, alcohol: e.target.value})}
                      placeholder="5.0"
                      className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipe / Lisensi</label>
                    <input type="text" value={formData.volume} onChange={(e) => setFormData({...formData, volume: e.target.value})} 
                      placeholder="Lifetime License / Full Set"
                      className={inputClass} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Asal Produk</label>
                    <input type="text" value={formData.origin} onChange={(e) => setFormData({...formData, origin: e.target.value})}
                      placeholder="Indonesia"
                      className={inputClass} required />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">URL Gambar</label>
                    <input type="url" value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})}
                      placeholder="https://..."
                      className={inputClass} />
                  </div>
                  <div className="md:col-span-2 flex gap-3">
                    <button type="submit" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition shadow-md">
                      {editingProduct ? 'Simpan Perubahan' : 'Tambah Produk'}
                    </button>
                    <button type="button" onClick={() => { setShowAddForm(false); setEditingProduct(null); resetForm(); }}
                      className="px-6 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition">
                      Batal
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Product Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-6 py-3 font-semibold text-gray-600">Produk</th>
                      <th className="text-left px-6 py-3 font-semibold text-gray-600">Kategori</th>
                      <th className="text-left px-6 py-3 font-semibold text-gray-600">Harga</th>
                      <th className="text-left px-6 py-3 font-semibold text-gray-600">Stok</th>
                      <th className="text-left px-6 py-3 font-semibold text-gray-600">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {allProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img src={product.image} alt={product.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                            <div className="min-w-0">
                              <div className="font-medium text-gray-800 line-clamp-1">{product.name}</div>
                              <div className="text-xs text-gray-500">{product.volume}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold whitespace-nowrap">
                            {categoryIcons[product.category] || '📦'} {product.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-semibold whitespace-nowrap">Rp {product.price.toLocaleString('id-ID')}</td>
                        <td className="px-6 py-4">
                          <span className={`font-medium ${product.stock <= 5 ? 'text-red-600' : 'text-green-600'}`}>
                            {product.stock}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button onClick={() => startEdit(product)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition">
                              <Edit3 className="w-4 h-4" />
                            </button>
                            {showDeleteConfirm === product.id ? (
                              <div className="flex items-center gap-1">
                                <button onClick={() => handleDeleteProduct(product.id)}
                                  className="px-2 py-1 bg-red-600 text-white text-xs rounded-lg">Hapus</button>
                                <button onClick={() => setShowDeleteConfirm(null)}
                                  className="px-2 py-1 bg-gray-200 text-xs rounded-lg">Batal</button>
                              </div>
                            ) : (
                              <button onClick={() => setShowDeleteConfirm(product.id)}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-6">Manajemen Pesanan ({orders.length})</h2>
            <div className="space-y-4">
              {orders.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
                  <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Belum ada pesanan</p>
                </div>
              ) : (
                orders.map((order) => (
                  <div key={order.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-1 flex-wrap">
                          <span className="font-mono text-sm font-bold text-gray-800">{order.id}</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                            order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {order.paymentStatus === 'paid' ? '✓ Lunas' : '⏳ Pending'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">
                          {order.customerName} • {order.customerPhone} • {new Date(order.createdAt).toLocaleDateString('id-ID')}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-blue-600">Rp {order.total.toLocaleString('id-ID')}</div>
                        <div className="text-xs text-gray-500">{order.paymentMethod}</div>
                      </div>
                    </div>

                    <div className="border-t border-gray-100 pt-4">
                      <div className="text-sm text-gray-600 mb-2">📍 {order.customerAddress}</div>
                      <div className="text-sm text-gray-600 mb-2">✉️ {order.customerEmail}</div>
                      <div className="space-y-2 mb-4">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm">
                            <img src={item.image} alt={item.name} className="w-8 h-8 rounded object-cover" />
                            <span className="text-gray-800 line-clamp-1 flex-1">{item.name}</span>
                            <span className="text-gray-500">x{item.quantity}</span>
                            <span className="font-semibold">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-gray-100 pt-4 flex flex-wrap gap-2">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Status Pesanan</label>
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                          className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-white"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Diproses</option>
                          <option value="shipped">Dikirim</option>
                          <option value="delivered">Terkirim</option>
                          <option value="cancelled">Dibatalkan</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Status Pembayaran</label>
                        <select
                          value={order.paymentStatus}
                          onChange={(e) => updatePaymentStatus(order.id, e.target.value as any)}
                          className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-white"
                        >
                          <option value="pending">Pending</option>
                          <option value="paid">Lunas</option>
                          <option value="failed">Gagal</option>
                        </select>
                       </div>
                     </div>
                   </div>
                 ))
               )}
             </div>
           </div>
         )}

         {/* Payment Gateway Tab */}
         {activeTab === 'payment-gateway' && (
           <PaymentGatewaySettings />
         )}
       </div>
     </div>
   );
 }
